import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  CalendarDays,
  Eye,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

// Line chart component
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Overview: React.FC = () => {
  const [timeRange, setTimeRange] = useState("7days");
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/erp' }
  ];
  
  // Get dashboard statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats', { timeRange }],
  });
  
  // Get recent orders
  const { data: recentOrdersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/recent'],
  });
  
  // Get sales data for chart
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['/api/dashboard/sales', { timeRange }],
  });
  
  // Get inventory status
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/dashboard/inventory'],
  });
  
  // Get top selling products
  const { data: topProductsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/dashboard/top-products', { timeRange }],
  });

  // Get top customers
  const { data: topCustomersData, isLoading: customersLoading } = useQuery({
    queryKey: ['/api/dashboard/top-customers', { timeRange }],
  });
  
  // Mock data for sales chart
  const mockSalesData = [
    { date: "Jan 1", revenue: 1200, orders: 12 },
    { date: "Jan 2", revenue: 1800, orders: 18 },
    { date: "Jan 3", revenue: 1600, orders: 16 },
    { date: "Jan 4", revenue: 2200, orders: 22 },
    { date: "Jan 5", revenue: 1900, orders: 19 },
    { date: "Jan 6", revenue: 2400, orders: 24 },
    { date: "Jan 7", revenue: 2800, orders: 28 },
  ];
  
  // Mock data for product categories pie chart
  const mockCategoryData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home & Kitchen", value: 20 },
    { name: "Books", value: 10 },
    { name: "Others", value: 10 },
  ];
  
  // Mock data for top products bar chart
  const mockTopProductsData = [
    { name: "Smartphone X", sales: 124 },
    { name: "Wireless Earbuds", sales: 85 },
    { name: "Smart Watch", sales: 64 },
    { name: "Bluetooth Speaker", sales: 42 },
    { name: "Laptop Pro", sales: 38 },
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <CalendarDays className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-32" /> : 
                    formatCurrency(statsData?.revenue || 52489.32)
                  }
                </h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    statsData?.orders || 842
                  }
                </h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% from last period
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-md">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Customers</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    statsData?.customers || 324
                  }
                </h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.3% from last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {statsLoading ? 
                    <Skeleton className="h-8 w-24" /> : 
                    formatCurrency(statsData?.avgOrderValue || 62.35)
                  }
                </h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.8% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Revenue and order trends for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 w-full px-2">
              {salesLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData || mockSalesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: 12 }} 
                      width={80}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 12 }} 
                      width={30}
                    />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value}`, 'Revenue'];
                      return [value, 'Orders'];
                    }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Distribution of sales by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {productsLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData?.categories || mockCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {(statsData?.categories || mockCategoryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products by units sold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {productsLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProductsData || mockTopProductsData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 40,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }} 
                      width={100}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="sales" 
                      fill="#8884d8" 
                      label={{ position: 'right', fontSize: 12 }}
                      radius={[0, 4, 4, 0]}
                    >
                      {(topProductsData || mockTopProductsData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders & Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentOrdersData || [
                    { id: 1, orderNumber: 'ORD-001', customer: 'John Smith', createdAt: '2023-04-01T10:30:00', total: 124.95, status: 'completed' },
                    { id: 2, orderNumber: 'ORD-002', customer: 'Sarah Johnson', createdAt: '2023-04-01T11:45:00', total: 89.99, status: 'processing' },
                    { id: 3, orderNumber: 'ORD-003', customer: 'Michael Brown', createdAt: '2023-04-01T14:20:00', total: 245.50, status: 'pending' },
                    { id: 4, orderNumber: 'ORD-004', customer: 'Emma Wilson', createdAt: '2023-04-01T16:05:00', total: 56.25, status: 'shipped' },
                    { id: 5, orderNumber: 'ORD-005', customer: 'David Miller', createdAt: '2023-04-01T17:30:00', total: 178.75, status: 'cancelled' }
                  ]).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(order.status).bgColor} ${getStatusColor(order.status).textColor}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>
              Products that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(inventoryData || [
                  { id: 1, name: 'Smartphone X', stockQuantity: 3, threshold: 5 },
                  { id: 2, name: 'Wireless Earbuds', stockQuantity: 0, threshold: 10 },
                  { id: 3, name: 'Laptop Pro', stockQuantity: 2, threshold: 5 },
                  { id: 4, name: 'Smart Watch', stockQuantity: 4, threshold: 8 },
                  { id: 5, name: 'Bluetooth Speaker', stockQuantity: 1, threshold: 5 }
                ]).map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <div className="flex items-center mt-1">
                        <Package className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {product.stockQuantity === 0 ? (
                            <span className="text-red-500 font-medium">Out of stock</span>
                          ) : (
                            <span className={product.stockQuantity < product.threshold ? 'text-amber-500 font-medium' : ''}>
                              {product.stockQuantity} in stock
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Restock</Button>
                  </div>
                ))}
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    View All Products
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Top Customers & Activity Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Customers with highest lifetime value
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(topCustomersData || [
                  { id: 1, name: 'John Smith', email: 'john@example.com', totalSpent: 4850.75, orderCount: 24 },
                  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', totalSpent: 3642.50, orderCount: 18 },
                  { id: 3, name: 'Michael Brown', email: 'michael@example.com', totalSpent: 2980.25, orderCount: 15 },
                  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', totalSpent: 2455.80, orderCount: 12 },
                  { id: 5, name: 'David Miller', email: 'david@example.com', totalSpent: 1875.40, orderCount: 9 }
                ]).map((customer) => (
                  <div 
                    key={customer.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{customer.name}</h4>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-sm">{formatCurrency(customer.totalSpent)}</span>
                      <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {[
                    { id: 1, type: 'order', message: 'New order #ORD-005 received from David Miller', time: '35 minutes ago' },
                    { id: 2, type: 'inventory', message: 'Wireless Earbuds stock level is now at 0 units', time: '2 hours ago' },
                    { id: 3, type: 'customer', message: 'New customer account created: Emma Wilson', time: '3 hours ago' },
                    { id: 4, type: 'order', message: 'Order #ORD-002 status changed to Processing', time: '4 hours ago' },
                    { id: 5, type: 'inventory', message: 'Laptop Pro stock level is below threshold (2 units left)', time: '5 hours ago' },
                    { id: 6, type: 'order', message: 'Order #ORD-001 status changed to Completed', time: '6 hours ago' }
                  ].map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className={`
                        p-2 rounded-full flex-shrink-0
                        ${activity.type === 'order' ? 'bg-blue-100' : ''}
                        ${activity.type === 'inventory' ? 'bg-amber-100' : ''}
                        ${activity.type === 'customer' ? 'bg-green-100' : ''}
                      `}>
                        {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'inventory' && <Package className="h-4 w-4 text-amber-600" />}
                        {activity.type === 'customer' && <Users className="h-4 w-4 text-green-600" />}
                      </div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="orders">
                <div className="space-y-4">
                  {[
                    { id: 1, type: 'order', message: 'New order #ORD-005 received from David Miller', time: '35 minutes ago' },
                    { id: 4, type: 'order', message: 'Order #ORD-002 status changed to Processing', time: '4 hours ago' },
                    { id: 6, type: 'order', message: 'Order #ORD-001 status changed to Completed', time: '6 hours ago' }
                  ].map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="inventory">
                <div className="space-y-4">
                  {[
                    { id: 2, type: 'inventory', message: 'Wireless Earbuds stock level is now at 0 units', time: '2 hours ago' },
                    { id: 5, type: 'inventory', message: 'Laptop Pro stock level is below threshold (2 units left)', time: '5 hours ago' }
                  ].map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="p-2 rounded-full bg-amber-100 flex-shrink-0">
                        <Package className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="customers">
                <div className="space-y-4">
                  {[
                    { id: 3, type: 'customer', message: 'New customer account created: Emma Wilson', time: '3 hours ago' }
                  ].map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="p-2 rounded-full bg-green-100 flex-shrink-0">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;