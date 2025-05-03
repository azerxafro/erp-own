import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Search,
  Plus,
  Filter,
  RefreshCw,
  FileBarChart,
  Download,
  AlertTriangle,
  BarChart2,
  PieChart,
  Calendar,
  ShoppingCart,
  Truck,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Progress component for stock levels
const StockLevelIndicator = ({ 
  current, 
  max, 
  showText = true 
}: { 
  current: number; 
  max: number; 
  showText?: boolean; 
}) => {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  let bgColor = "bg-green-500";
  
  if (percentage <= 25) {
    bgColor = "bg-red-500";
  } else if (percentage <= 50) {
    bgColor = "bg-orange-500";
  } else if (percentage <= 75) {
    bgColor = "bg-yellow-500";
  }
  
  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs mt-1">
          <span>{current} units</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

const InventoryDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/erp' },
    { label: 'Inventory', href: '/erp/inventory' }
  ];
  
  // Get inventory products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/inventory/products', { 
      searchQuery, 
      category: categoryFilter,
      stockStatus: stockStatusFilter,
      sortBy,
      page: currentPage,
      limit: itemsPerPage
    }],
  });
  
  // Get product categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/product-categories'],
  });
  
  // Get inventory statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/inventory/stats'],
  });
  
  // Get low stock products
  const { data: lowStockData, isLoading: lowStockLoading } = useQuery({
    queryKey: ['/api/inventory/low-stock'],
  });
  
  // Get recent inventory transactions
  const { data: recentTransactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/inventory/transactions/recent'],
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query params will be updated automatically via the useQuery dependencies
  };

  // Handle pagination
  const handleNextPage = () => {
    if (productsData?.totalPages && currentPage < productsData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-foreground">Inventory Management</h1>
          
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    statsData?.totalProducts || 256
                  }
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Across {statsData?.categoryCount || 12} categories
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Stock Value</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-24" /> : 
                    formatCurrency(statsData?.totalValue || 128456.75)
                  }
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {statsData?.unitCount || 4325} units in stock
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    statsData?.lowStockCount || 28
                  }
                </h3>
                <p className="text-xs text-red-500 mt-1">
                  Needs attention soon
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-md">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    statsData?.pendingOrders || 42
                  }
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {statsData?.pendingUnits || 156} units to fulfill
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-md">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Dashboard Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Inventory List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>
                  Manage your product inventory
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <FileBarChart className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search products..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="flex flex-1 gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesLoading ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      (categoriesData || []).map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                    <SelectItem value="stock_asc">Stock: Low to High</SelectItem>
                    <SelectItem value="stock_desc">Stock: High to Low</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products Table */}
            {productsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(productsData?.items || []).map((product: any) => {
                      const stockStatus = 
                        product.stockQuantity === 0 ? "out_of_stock" :
                        product.stockQuantity <= product.lowStockThreshold ? "low_stock" : "in_stock";
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div 
                                className="h-10 w-10 rounded-md bg-gray-100"
                                style={{
                                  backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                              <span className="truncate max-w-[180px]">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                          <TableCell>
                            <div className="w-24">
                              <StockLevelIndicator 
                                current={product.stockQuantity} 
                                max={product.stockTarget || 100}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${stockStatus === "out_of_stock" ? "bg-red-50 text-red-700 border-red-200" : ""} 
                                ${stockStatus === "low_stock" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                                ${stockStatus === "in_stock" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              `}
                            >
                              {stockStatus === "out_of_stock" && "Out of Stock"}
                              {stockStatus === "low_stock" && "Low Stock"}
                              {stockStatus === "in_stock" && "In Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {(productsData?.items || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No products found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {productsData?.items?.length || 0} of {productsData?.totalItems || 0} items
              </p>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!productsData?.totalPages || currentPage >= productsData.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Low Stock Items & Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>
              Products that need restocking soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(lowStockData || []).map((product: any) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-md bg-gray-100"
                        style={{
                          backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <div className="flex items-center mt-1">
                          <Badge 
                            variant="outline" 
                            className={
                              product.stockQuantity === 0 
                                ? "bg-red-50 text-red-700 border-red-200 text-xs" 
                                : "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                            }
                          >
                            {product.stockQuantity === 0 ? "Out of Stock" : `${product.stockQuantity} left`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Restock</Button>
                  </div>
                ))}
                
                {(lowStockData || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    All products are well stocked!
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button className="w-full" variant="outline">
              View All Stock Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inventory Transactions</CardTitle>
          <CardDescription>
            Latest inventory movements and adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentTransactionsData || []).map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell className="font-medium">{transaction.product?.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${transaction.type === "stock_in" ? "bg-green-50 text-green-700 border-green-200" : ""} 
                            ${transaction.type === "stock_out" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                            ${transaction.type === "adjustment" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                            ${transaction.type === "return" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                          `}
                        >
                          {transaction.type === "stock_in" && "Stock In"}
                          {transaction.type === "stock_out" && "Stock Out"}
                          {transaction.type === "adjustment" && "Adjustment"}
                          {transaction.type === "return" && "Return"}
                        </Badge>
                      </TableCell>
                      <TableCell className={transaction.quantity < 0 ? "text-red-600" : "text-green-600"}>
                        {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                      </TableCell>
                      <TableCell>{transaction.reference || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                  
                  {(recentTransactionsData || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No recent transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="flex items-center justify-center w-full">
            <Button variant="outline">
              View All Transactions
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InventoryDashboard;