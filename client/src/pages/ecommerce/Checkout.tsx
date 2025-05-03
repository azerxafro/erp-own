import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

// This would come from a cart context in a real app
const useCart = () => {
  // For demo purposes, we'll use a hardcoded cart
  const [cart, setCart] = useState<any[]>([
    { 
      id: 1, 
      name: 'Smartphone X', 
      price: 699.99, 
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    { 
      id: 2, 
      name: 'Wireless Earbuds', 
      price: 149.99, 
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ]);
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  return { cart, getCartTotal, clearCart };
};

const Checkout: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/checkout/success/:orderId");
  const { toast } = useToast();
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>("");
  
  // Fetch Razorpay Key ID
  useEffect(() => {
    apiRequest("GET", "/api/razorpay-key")
      .then((res) => res.json())
      .then((data) => {
        setRazorpayKeyId(data.key_id);
      })
      .catch((err) => {
        console.error("Error fetching Razorpay key:", err);
        toast({
          title: "Error",
          description: "Failed to initialize payment system. Please try again later.",
          variant: "destructive",
        });
      });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = () => {
    const requiredFields = [
      "firstName", 
      "lastName", 
      "email", 
      "phone", 
      "address", 
      "city", 
      "state", 
      "postalCode"
    ];
    
    for (const field of requiredFields) {
      if (!billingDetails[field as keyof typeof billingDetails]) {
        toast({
          title: "Missing information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order details to save to database
      const orderDetails = {
        billingDetails,
        orderNotes,
        items: cart,
        total: getCartTotal(),
        status: "pending",
      };
      
      // Create Razorpay order
      const response = await apiRequest("POST", "/api/create-payment", {
        amount: getCartTotal(),
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          customerName: `${billingDetails.firstName} ${billingDetails.lastName}`,
          customerEmail: billingDetails.email,
        },
      });
      
      const orderData = await response.json();
      
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.message || "Failed to create payment order");
      }
      
      // Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ERP Store",
        description: "Purchase from ERP Store",
        order_id: orderData.order.id,
        prefill: {
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },
        notes: {
          address: billingDetails.address,
        },
        theme: {
          color: "#2490EF",
        },
        handler: function (response: any) {
          handlePaymentSuccess(response, orderData.order.id);
        },
      };
      
      // Open Razorpay checkout form
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaymentSuccess = async (
    response: any,
    orderId: string
  ) => {
    try {
      // Verify the payment
      const verifyResponse = await apiRequest("POST", "/api/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        // Payment successful
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully!",
        });
        
        // Here we would save the order to our database with the payment details
        // and then redirect to a success page
        
        // Clear cart
        clearCart();
        
        // Redirect to success page
        setLocation(`/checkout/success/${orderId}`);
      } else {
        throw new Error(verifyData.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Payment Verification Failed",
        description: "There was an issue verifying your payment. Please contact support.",
        variant: "destructive",
      });
    }
  };
  
  // If this is the success page
  if (match) {
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200 shadow-md">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center text-2xl text-green-700">
                Order Successful!
              </CardTitle>
              <CardDescription className="text-center text-green-600">
                Thank you for your purchase. Your order has been placed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600">
                    Your order ID: <span className="font-semibold">{params.orderId}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    We've sent a confirmation email to your email address with all the details.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">What happens next?</h3>
                  <ol className="space-y-2 text-gray-600 text-sm">
                    <li>1. Your order will be processed within 24 hours.</li>
                    <li>2. Once shipped, you'll receive a tracking number by email.</li>
                    <li>3. Estimated delivery time is 3-5 business days.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account/orders">View My Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Store Header - Simple version for checkout */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              StoreFront
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-primary flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Details Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={billingDetails.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={billingDetails.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={billingDetails.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={billingDetails.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={billingDetails.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={billingDetails.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={billingDetails.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>
                  Add any special instructions for your order (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for delivery, etc."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className="h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0"
                        style={{
                          backgroundImage: `url(${item.imageUrl || "https://via.placeholder.com/100"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>{formatCurrency(getCartTotal() * 0.05)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(getCartTotal() * 1.05)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} StoreFront. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;