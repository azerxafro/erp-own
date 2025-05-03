import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Menu,
  X,
  Star,
  StarHalf,
  ChevronRight,
  Minus,
  Plus,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock cart state and functions
const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    ));
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  return { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartItemsCount
  };
};

const Store: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  
  // Get products with filters
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { 
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: searchQuery,
      sortBy
    }],
  });
  
  // Get product categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/product-categories'],
  });
  
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
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
      {/* Store Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold mr-10">
                StoreFront
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-sm font-medium hover:text-primary">
                  Home
                </Link>
                <Link href="/#featured" className="text-sm font-medium hover:text-primary">
                  Featured
                </Link>
                <Link href="/#categories" className="text-sm font-medium hover:text-primary">
                  Categories
                </Link>
                <Link href="/#bestsellers" className="text-sm font-medium hover:text-primary">
                  Best Sellers
                </Link>
                <Link href="/#new" className="text-sm font-medium hover:text-primary">
                  New Arrivals
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemsCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                        {getCartItemsCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                      {getCartItemsCount()} items in your cart
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
                        <p className="text-sm text-gray-500">
                          Looks like you haven't added any products to your cart yet.
                        </p>
                        <SheetClose asChild>
                          <Button className="mt-6">Continue Shopping</Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <>
                        <ScrollArea className="h-[60vh]">
                          <div className="space-y-4 pr-3">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-start gap-4 py-3">
                                <div 
                                  className="h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0"
                                  style={{ 
                                    backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/100'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
                                  <p className="text-sm text-gray-500 mb-1">
                                    {formatCurrency(item.price)} × {item.quantity}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="border-t mt-4 pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Subtotal</span>
                            <span className="text-sm font-medium">{formatCurrency(getCartTotal())}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Shipping</span>
                            <span className="text-sm">Calculated at checkout</span>
                          </div>
                        </div>
                        
                        <SheetFooter className="mt-6">
                          <Button className="w-full" asChild>
                            <Link href="/checkout">
                              Checkout ({formatCurrency(getCartTotal())})
                            </Link>
                          </Button>
                        </SheetFooter>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileFilters(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Filters */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Button 
                    variant={categoryFilter === 'all' ? 'default' : 'ghost'} 
                    className="text-sm w-full justify-start"
                    onClick={() => setCategoryFilter('all')}
                  >
                    All Products
                  </Button>
                </div>
                
                {categoriesLoading ? (
                  [...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))
                ) : (
                  categoriesData?.map((category: any) => (
                    <div key={category.id} className="flex items-center">
                      <Button 
                        variant={categoryFilter === category.id.toString() ? 'default' : 'ghost'} 
                        className="text-sm w-full justify-start"
                        onClick={() => setCategoryFilter(category.id.toString())}
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-4">Price Range</h3>
              <div className="px-2">
                <Slider 
                  defaultValue={priceRange} 
                  min={0} 
                  max={1000} 
                  step={10} 
                  onValueChange={handlePriceRangeChange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-4">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="bestselling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <SheetFooter>
              <Button onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Store Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-[82px] space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button 
                      variant={categoryFilter === 'all' ? 'default' : 'ghost'} 
                      className="text-sm w-full justify-start"
                      onClick={() => setCategoryFilter('all')}
                    >
                      All Products
                    </Button>
                  </div>
                  
                  {categoriesLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))
                  ) : (
                    categoriesData?.map((category: any) => (
                      <div key={category.id} className="flex items-center">
                        <Button 
                          variant={categoryFilter === category.id.toString() ? 'default' : 'ghost'} 
                          className="text-sm w-full justify-start"
                          onClick={() => setCategoryFilter(category.id.toString())}
                        >
                          {category.name}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <div className="px-2">
                  <Slider 
                    defaultValue={priceRange} 
                    min={0} 
                    max={1000} 
                    step={10} 
                    onValueChange={handlePriceRangeChange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="bestselling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowMobileFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productsData?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <Button onClick={() => {
                  setCategoryFilter('all');
                  setPriceRange([0, 1000]);
                  setSearchQuery('');
                }}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData?.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                    <Link href={`/product/${product.id}`}>
                      <a className="block">
                        <div 
                          className="h-48 w-full bg-gray-100 relative"
                          style={{ 
                            backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/300'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {product.stockQuantity <= 0 && (
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-sm font-semibold">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                      </a>
                    </Link>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category?.name || 'Uncategorized'}
                        </Badge>
                      </div>
                      
                      <Link href={`/product/${product.id}`}>
                        <a className="block">
                          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </a>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={product.rating || 4.5} />
                        <span className="text-xs text-gray-500">({product.reviews || 42})</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
                        <Button 
                          size="sm" 
                          disabled={product.stockQuantity <= 0}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">StoreFront</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your one-stop shop for quality products with exceptional service and fast delivery.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">All Products</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Featured</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">New Arrivals</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Best Sellers</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Discounts</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">FAQs</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Shipping Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Returns & Exchanges</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter for the latest products and promotions.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your email" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} StoreFront. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Store;