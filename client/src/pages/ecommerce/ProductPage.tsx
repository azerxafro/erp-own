import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  StarHalf,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock cart state and functions
const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };
  
  return { cart, addToCart };
};

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);
  
  const { addToCart } = useCart();
  
  // Get product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: [`/api/products/${id}`],
  });
  
  // Get related products
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ['/api/products/related', { productId: id }],
  });
  
  // Dummy product images (would come from API in real implementation)
  const productImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  ];
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Show toast notification or other feedback
    }
  };
  
  // Renders star ratings (1-5)
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen">
      {/* Store Header - Simple version for product page */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold mr-10">
                StoreFront
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>
      
      {/* Main Product Content */}
      <main className="container mx-auto px-4 py-6">
        {productLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div 
                className="h-96 w-full rounded-lg bg-gray-100 overflow-hidden"
                style={{ 
                  backgroundImage: `url(${productImages[selectedImage] || product?.imageUrl || 'https://via.placeholder.com/600'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`h-24 cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                    style={{ 
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product?.category?.name || 'Uncategorized'}
                  </Badge>
                  {product?.stockQuantity > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">{product?.name || 'Product Name'}</h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <StarRating rating={product?.rating || 4.5} />
                    <span className="text-sm text-gray-500">({product?.reviewCount || 42} reviews)</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-gray-500">SKU: {product?.sku || 'P123456'}</span>
                </div>
                
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {formatCurrency(product?.price || 49.99)}
                  </span>
                  {product?.oldPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product?.oldPrice)}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {product?.description || 
                   'This is a high-quality product that offers exceptional performance and durability. Made with premium materials to ensure long-lasting use, this product is designed to meet all your needs while providing exceptional value for your money.'}
                </p>
              </div>
              
              {/* Variants selection */}
              {product?.variants && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Variant
                    </label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(product?.variants || ['Small', 'Medium', 'Large']).map((variant: string) => (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="space-y-4">
                <label className="text-sm font-medium mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center w-32">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product?.stockQuantity || 10}
                    className="h-10 rounded-none text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product?.stockQuantity || 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="flex-1"
                  disabled={product?.stockQuantity <= 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={product?.stockQuantity <= 0}
                  onClick={() => {
                    addToCart(product, quantity);
                    setLocation('/checkout');
                  }}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`flex-1 ${isWishlist ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : ''}`}
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
              
              {/* Shipping and returns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-8 w-8 mb-2 text-gray-500" />
                  <h3 className="font-medium text-sm mb-1">Free Shipping</h3>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="h-8 w-8 mb-2 text-gray-500" />
                  <h3 className="font-medium text-sm mb-1">Easy Returns</h3>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-8 w-8 mb-2 text-gray-500" />
                  <h3 className="font-medium text-sm mb-1">Secure Checkout</h3>
                  <p className="text-xs text-gray-500">SSL encrypted payment</p>
                </div>
              </div>
              
              {/* Social sharing */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <span className="text-sm">Share:</span>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Product Description</h3>
                <p>
                  {product?.description || 
                  `This product represents the pinnacle of design and functionality. Crafted with the utmost attention to detail, it combines innovative technology with elegant aesthetics.
                  
                  Our team of engineers has worked tirelessly to ensure that this product not only meets but exceeds industry standards. The robust construction ensures longevity, while the intuitive interface makes it accessible to users of all experience levels.`}
                </p>
                
                <h4>Features</h4>
                <ul>
                  <li>Premium quality materials for extended durability</li>
                  <li>Ergonomic design for comfortable handling</li>
                  <li>Energy-efficient operation to reduce environmental impact</li>
                  <li>Versatile functionality to meet diverse needs</li>
                  <li>Modern aesthetics that complement any setting</li>
                </ul>
                
                <h4>Benefits</h4>
                <p>
                  Enjoy the convenience and reliability that comes with owning a top-tier product. Whether you're a professional seeking high-performance tools or a casual user looking for dependable equipment, this product is designed to satisfy your requirements and enhance your experience.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Technical Specifications</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Dimensions</td>
                        <td className="px-4 py-2">10.5 x 7.2 x 3.6 inches</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Weight</td>
                        <td className="px-4 py-2">1.2 lbs (544 g)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Materials</td>
                        <td className="px-4 py-2">Premium aluminum, reinforced plastic</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Battery Life</td>
                        <td className="px-4 py-2">Up to 12 hours</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Warranty</td>
                        <td className="px-4 py-2">2-year limited manufacturer's warranty</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-medium">Country of Origin</td>
                        <td className="px-4 py-2">United States</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4>Package Contents</h4>
                <ul>
                  <li>Main product unit</li>
                  <li>User manual</li>
                  <li>Power adapter</li>
                  <li>Quick start guide</li>
                  <li>Warranty card</li>
                </ul>
                
                <p className="text-sm text-gray-500 italic">
                  * Specifications are subject to change without notice.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={4.7} />
                    <span className="text-sm">4.7 out of 5 ({product?.reviewCount || 42} reviews)</span>
                  </div>
                </div>
                
                <Button>Write a Review</Button>
              </div>
              
              <div className="space-y-6">
                {/* Review items would come from API in real implementation */}
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">John Doe</h4>
                      <span className="text-sm text-gray-500">2 months ago</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={5} />
                      <span className="font-medium">Excellent Product!</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      I've been using this for about a month now and it's exceeded all my expectations. 
                      The quality is outstanding and it's incredibly user-friendly. Would definitely recommend 
                      to anyone looking for a reliable solution.
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          
          {relatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dummy related products */}
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden transition-all hover:shadow-md">
                  <Link href={`/product/${i + 10}`}>
                    <a className="block">
                      <div 
                        className="h-40 w-full bg-gray-100"
                        style={{ 
                          backgroundImage: `url(${productImages[i % productImages.length]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </a>
                  </Link>
                  
                  <CardContent className="p-4">
                    <Link href={`/product/${i + 10}`}>
                      <a className="block">
                        <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors truncate">
                          Related Product {i + 1}
                        </h3>
                      </a>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatCurrency(29.99 + i * 10)}</span>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

export default ProductPage;