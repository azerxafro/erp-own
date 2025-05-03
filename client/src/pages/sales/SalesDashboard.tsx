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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  Download, 
  Calendar, 
  ChevronRight,
  Target,
  MapPin,
  ShoppingBag,
  UserPlus
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getRandomColor } from "@/lib/utils";

const SalesDashboard: React.FC = () => {
  const [period, setPeriod] = useState("7days");
  
  const breadcrumbItems = [
    { label: 'ERP', href: '/erp' },
    { label: 'Sales' }
  ];

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders', { limit: 5 }],
  });

  // Sales stats
  const salesStats = {
    totalRevenue: 86589.32,
    ordersCount: 1248,
    averageOrderValue: 69.38,
    conversionRate: 3.2
  };

  // Monthly sales data
  const salesData = [
    { name: 'Jan', revenue: 65000, orders: 950 },
    { name: 'Feb', revenue: 72000, orders: 1050 },
    { name: 'Mar', revenue: 81000, orders: 1250 },
    { name: 'Apr', revenue: 75000, orders: 1100 },
    { name: 'May', revenue: 88000, orders: 1300 },
    { name: 'Jun', revenue: 92000, orders: 1400 },
    { name: 'Jul', revenue: 98000, orders: 1450 },
    { name: 'Aug', revenue: 105000, orders: 1500 },
  ];

  // Sales by channel
  const channelData = [
    { name: 'Website', value: 65 },
    { name: 'Marketplace', value: 20 },
    { name: 'In-Store', value: 10 },
    { name: 'Phone Orders', value: 5 },
  ];

  // Top-selling items
  const topItems = [
    { id: 1, name: "Wireless Headphones", sku: "WH-1001", revenue: 12500, units: 96, trend: "up" },
    { id: 2, name: "Smartphone", sku: "SP-2002", revenue: 18750, units: 25, trend: "up" },
    { id: 3, name: "Laptop", sku: "LP-3003", revenue: 32500, units: 25, trend: "down" },
    { id: 4, name: "T-Shirt", sku: "TS-4001", revenue: 2350, units: 118, trend: "up" },
    { id: 5, name: "Coffee Beans", sku: "CB-7001", revenue: 1875, units: 125, trend: "up" },
  ];

  // Sales team
  const salesTeam = [
    { id: 1, name: "Jane Smith", position: "Sales Manager", deals: 28, value: 78250, quota: 95 },
    { id: 2, name: "Marcus Johnson", position: "Account Executive", deals: 22, value: 56400, quota: 80 },
    { id: 3, name: "Sarah Williams", position: "Sales Representative", deals: 15, value: 37500, quota: 65 },
    { id: 4, name: "David Chen", position: "Sales Representative", deals: 19, value: 45200, quota: 75 },
  ];

  const COLORS = ['#2490EF', '#00A09D', '#FF5A5F', '#34D399'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{payload[0].name}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Sales Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Select Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create New Sales Order</DialogTitle>
                <DialogDescription>
                  Enter details for the new sales order.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Jessica Smith</SelectItem>
                      <SelectItem value="2">Marcus Johnson</SelectItem>
                      <SelectItem value="3">Rachel Chen</SelectItem>
                      <SelectItem value="4">Thomas Wright</SelectItem>
                      <SelectItem value="5">Olivia Martinez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="products" className="text-right">
                    Products
                  </Label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Add products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Wireless Headphones - $129.99</SelectItem>
                        <SelectItem value="2">Smartphone - $799.99</SelectItem>
                        <SelectItem value="3">Laptop - $1299.99</SelectItem>
                        <SelectItem value="4">T-Shirt - $19.99</SelectItem>
                        <SelectItem value="5">Coffee Beans - $14.99</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 text-sm text-muted-foreground">
                      No products selected. Click to add products.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Payment
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" className="col-span-3" placeholder="Order notes" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(salesStats.totalRevenue)}</h3>
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
                <h3 className="text-2xl font-bold text-foreground">{salesStats.ordersCount}</h3>
              </div>
              <div className="p-3 bg-secondary/10 rounded-md">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(salesStats.averageOrderValue)}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-md">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-foreground">{salesStats.conversionRate}%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Revenue and order count over time</CardDescription>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px] mt-2 sm:mt-0">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value / 1000}k`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                      return [value, 'Orders'];
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    name="Revenue"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2} 
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Channel</CardTitle>
            <CardDescription>Distribution across sales channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              {channelData.map((channel, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{channel.name}</span>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top-Selling Products</CardTitle>
            <CardDescription>Best performing items by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{formatCurrency(item.revenue)}</TableCell>
                      <TableCell>{item.units}</TableCell>
                      <TableCell>
                        {item.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
            <Button variant="outline" size="sm">
              View All Products
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Team Performance</CardTitle>
            <CardDescription>Individual achievement vs. targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {salesTeam.map((member, index) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className={getRandomColor(index)}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-medium">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(member.value)}</p>
                      <p className="text-xs text-muted-foreground">{member.deals} deals</p>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-primary">
                        {member.quota}% of quota
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        Target: {formatCurrency(100000)}
                      </span>
                    </div>
                    <Progress 
                      value={member.quota} 
                      className="h-2" 
                      indicatorClassName={
                        member.quota >= 90 ? "bg-green-500" :
                        member.quota >= 60 ? "bg-primary" :
                        "bg-yellow-500"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Complete Team Performance
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {ordersData?.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-500">{order.customer?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Orders
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Targets</CardTitle>
            <CardDescription>Progress towards monthly goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Monthly Revenue</span>
                  <span className="text-sm font-medium">78% of target</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Current: {formatCurrency(86589)}</span>
                  <span>Target: {formatCurrency(110000)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">New Customers</span>
                  <span className="text-sm font-medium">62% of target</span>
                </div>
                <Progress value={62} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Current: 38</span>
                  <span>Target: 60</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Order Value</span>
                  <span className="text-sm font-medium">92% of target</span>
                </div>
                <Progress value={92} className="h-2" indicatorClassName="bg-green-500" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Current: {formatCurrency(69.38)}</span>
                  <span>Target: {formatCurrency(75)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm font-medium">85% of target</span>
                </div>
                <Progress value={85} className="h-2" indicatorClassName="bg-green-500" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Current: 3.2%</span>
                  <span>Target: 3.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm">
              <span className="font-medium">22 days</span> remaining in current period
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>New Order</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <UserPlus className="h-6 w-6 mb-2" />
                <span>Add Customer</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Target className="h-6 w-6 mb-2" />
                <span>Set Target</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Reports</span>
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Regional Sales Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">North America</span>
                      <span className="text-xs">45%</span>
                    </div>
                    <Progress value={45} className="h-1" />
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-secondary" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Europe</span>
                      <span className="text-xs">30%</span>
                    </div>
                    <Progress value={30} className="h-1" indicatorClassName="bg-secondary" />
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Asia</span>
                      <span className="text-xs">20%</span>
                    </div>
                    <Progress value={20} className="h-1" indicatorClassName="bg-accent" />
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Other Regions</span>
                      <span className="text-xs">5%</span>
                    </div>
                    <Progress value={5} className="h-1" indicatorClassName="bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;
