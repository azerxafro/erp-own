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
  Factory, 
  Package,
  PlusCircle, 
  Calendar, 
  Clock, 
  Clipboard, 
  ListChecks, 
  Activity,
  BarChart,
  ChevronRight,
  Filter
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

const ManufacturingDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const breadcrumbItems = [
    { label: 'ERP', href: '/erp' },
    { label: 'Manufacturing' }
  ];

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/manufacturing/orders', { search, status: statusFilter !== 'all' ? statusFilter : undefined }],
  });

  // Manufacturing stats
  const manufacturingStats = {
    totalOrders: 25,
    inProgress: 10,
    completed: 12,
    planned: 3,
    efficiency: 87
  };

  // Production schedule - next 7 days
  const productionSchedule = [
    { id: 1, productName: "Wireless Headphones", orderNumber: "MO-1003", quantity: 100, startDate: "2023-09-05" },
    { id: 2, productName: "Office Notebooks", orderNumber: "MO-1004", quantity: 200, startDate: "2023-09-10" },
    { id: 3, productName: "T-Shirts", orderNumber: "MO-1005", quantity: 150, startDate: "2023-09-07" },
    { id: 4, productName: "Smartphone Cases", orderNumber: "MO-1006", quantity: 300, startDate: "2023-09-12" },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Manufacturing Operations</h1>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Production Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create Manufacturing Order</DialogTitle>
                <DialogDescription>
                  Schedule a new production run.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Wireless Headphones</SelectItem>
                      <SelectItem value="2">Smartphone</SelectItem>
                      <SelectItem value="3">Laptop</SelectItem>
                      <SelectItem value="4">T-Shirt</SelectItem>
                      <SelectItem value="7">Sofa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input id="quantity" type="number" className="col-span-3" placeholder="Enter quantity" min="1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input id="startDate" type="date" className="col-span-3" />
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
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" className="col-span-3" placeholder="Additional details" />
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
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold text-foreground">{manufacturingStats.totalOrders}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <Factory className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-foreground">{manufacturingStats.inProgress}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-md">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-foreground">{manufacturingStats.completed}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <ListChecks className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Efficiency</p>
                <h3 className="text-2xl font-bold text-foreground">{manufacturingStats.efficiency}%</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Manufacturing Orders</CardTitle>
                <CardDescription>View and manage production orders</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
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
                      <TableHead>Order Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData?.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.product?.name || 'Unknown Product'}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.startDate)}</TableCell>
                        <TableCell>
                          {order.status === 'completed' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">100%</Badge>
                          ) : order.status === 'in_progress' ? (
                            <Progress value={60} className="h-2 w-24" indicatorClassName="bg-yellow-500" />
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">Not Started</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              View All Orders
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Production Schedule</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionSchedule.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h4 className="font-medium">{item.productName}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clipboard className="h-3.5 w-3.5 mr-1" />
                      {item.orderNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Package className="h-3.5 w-3.5 mr-1" />
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 mb-1">
                      {formatDate(item.startDate)}
                    </Badge>
                    <div>
                      <Button variant="ghost" size="sm">Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Full Schedule
              <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resource Allocation</CardTitle>
            <CardDescription>Current manufacturing capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Assembly Line A</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" indicatorClassName="bg-red-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Assembly Line B</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" indicatorClassName="bg-yellow-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Assembly Line C</span>
                  <span className="text-sm font-medium">43%</span>
                </div>
                <Progress value={43} className="h-2" indicatorClassName="bg-green-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Packaging</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" indicatorClassName="bg-yellow-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Quality Control</span>
                  <span className="text-sm font-medium">55%</span>
                </div>
                <Progress value={55} className="h-2" indicatorClassName="bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Status</CardTitle>
            <CardDescription>Raw materials for production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Electronic Components</h4>
                  <p className="text-xs text-gray-500">For Audio Devices</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Plastic Casings</h4>
                  <p className="text-xs text-gray-500">For Headphones</p>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Fabric</h4>
                  <p className="text-xs text-gray-500">For Apparel</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Display Screens</h4>
                  <p className="text-xs text-gray-500">For Smartphones</p>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800">Out of Stock</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Packaging Materials</h4>
                  <p className="text-xs text-gray-500">For All Products</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Inventory Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <ListChecks className="mr-2 h-4 w-4" />
                  Quality Control Reports
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Calendar className="mr-2 h-4 w-4" />
                  Production Calendar
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Package className="mr-2 h-4 w-4" />
                  Reorder Raw Materials
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <BarChart className="mr-2 h-4 w-4" />
                  Efficiency Reports
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Factory className="mr-2 h-4 w-4" />
                  Equipment Maintenance
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturingDashboard;
