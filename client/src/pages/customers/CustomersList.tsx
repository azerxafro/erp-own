import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DialogClose
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  UserPlus, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Edit, 
  Trash2,
  ShoppingBag,
  CreditCard
} from "lucide-react";
import { formatDate, getInitials, getRandomColor } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CustomersList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newCustomer, setNewCustomer] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { label: 'CRM', href: '/crm' },
    { label: 'Customers' }
  ];

  // Get all customers
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['/api/customers', { search, limit: pageSize, offset: (currentPage - 1) * pageSize }],
  });

  // Create new customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: any) => {
      const response = await apiRequest('POST', '/api/customers', customerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: "Customer created",
        description: "The customer has been created successfully.",
      });
      // Reset form
      setNewCustomer({
        email: "",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create customer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomerMutation.mutate(newCustomer);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [id]: value }));
  };

  // Calculate total customers and pages for pagination
  const totalCustomers = customersData?.length || 0;
  const totalPages = Math.ceil(totalCustomers / pageSize);

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Customer Management</h1>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                      Full Name
                    </Label>
                    <Input 
                      id="fullName" 
                      value={newCustomer.fullName}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newCustomer.email}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="john.doe@example.com" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input 
                      id="phone" 
                      value={newCustomer.phone}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="(555) 123-4567" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input 
                      id="address" 
                      value={newCustomer.address}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="123 Main St" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      City
                    </Label>
                    <Input 
                      id="city" 
                      value={newCustomer.city}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="New York" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">
                      State
                    </Label>
                    <Input 
                      id="state" 
                      value={newCustomer.state}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="NY" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Country
                    </Label>
                    <Input 
                      id="country" 
                      value={newCustomer.country}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="USA" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="postalCode" className="text-right">
                      Postal Code
                    </Label>
                    <Input 
                      id="postalCode" 
                      value={newCustomer.postalCode}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="10001" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={createCustomerMutation.isPending}>
                    {createCustomerMutation.isPending ? "Creating..." : "Add Customer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-bold text-foreground">{totalCustomers}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Customers</p>
                <h3 className="text-2xl font-bold text-foreground">874</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New This Month</p>
                <h3 className="text-2xl font-bold text-foreground">38</h3>
              </div>
              <div className="p-3 bg-accent/10 rounded-md">
                <UserPlus className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>
                    Manage your customer database
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Search customers..." 
                      className="pl-8 w-full" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="hasOrders">Has Orders</SelectItem>
                      <SelectItem value="noOrders">No Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customersData?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No customers found. Try adjusting your filters or adding a new customer.
                            </TableCell>
                          </TableRow>
                        ) : (
                          customersData?.map((customer: any, index: number) => (
                            <TableRow key={customer.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback className={getRandomColor(index)}>
                                      {getInitials(customer.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{customer.fullName}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{customer.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {customer.phone ? (
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{customer.phone}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Not provided</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {customer.city || customer.country ? (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>
                                      {[customer.city, customer.country].filter(Boolean).join(", ")}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Not provided</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                  {customer.orders?.length || 0}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(customer.createdAt)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span className="sr-only">Orders</span>
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
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalCustomers)}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * pageSize, totalCustomers)}</span> of{" "}
                      <span className="font-medium">{totalCustomers}</span> customers
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent>
              <div className="pt-6 text-center">
                <p className="text-muted-foreground">Filter applied: Active customers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardContent>
              <div className="pt-6 text-center">
                <p className="text-muted-foreground">Filter applied: Inactive customers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Key metrics and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Average Order Value</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">$86.42</Badge>
              </div>
              <div className="flex justify-between">
                <span>Repeat Purchase Rate</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">36%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Customer Lifetime Value</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">$427.65</Badge>
              </div>
              <div className="flex justify-between">
                <span>Acquisition Cost</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">$28.50</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common customer management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Import Customers
              </Button>
              <Button variant="outline" className="justify-start">
                <Envelope className="mr-2 h-4 w-4" />
                Email Campaign
              </Button>
              <Button variant="outline" className="justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Create Order
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import missing icon components to avoid TypeScript errors
const Users = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
};

const Envelope = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
};

const Download = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
};

export default CustomersList;
