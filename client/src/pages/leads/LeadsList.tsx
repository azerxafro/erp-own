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
  Building,
  Briefcase
} from "lucide-react";
import { formatDate, getInitials, getRandomColor } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LeadsList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [newLead, setNewLead] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "",
    notes: ""
  });
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { label: 'CRM', href: '/crm' },
    { label: 'Leads' }
  ];

  // Get all leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads', { search, status: statusFilter !== 'all' ? statusFilter : undefined, limit: pageSize, offset: (currentPage - 1) * pageSize }],
  });

  // Create new lead mutation
  const createLeadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await apiRequest('POST', '/api/leads', leadData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead created",
        description: "The lead has been created successfully.",
      });
      // Reset form
      setNewLead({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
        source: "",
        notes: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create lead: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate(newLead);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewLead(prev => ({ ...prev, [id]: value }));
  };

  // Handle select change
  const handleSelectChange = (id: string, value: string) => {
    setNewLead(prev => ({ ...prev, [id]: value }));
  };

  // Calculate total leads and pages for pagination
  const totalLeads = leadsData?.length || 0;
  const totalPages = Math.ceil(totalLeads / pageSize);

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

  // Lead status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "unqualified", label: "Unqualified" },
    { value: "nurturing", label: "Nurturing" },
    { value: "converted", label: "Converted" }
  ];

  // Source options
  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "referral", label: "Referral" },
    { value: "social_media", label: "Social Media" },
    { value: "email", label: "Email Campaign" },
    { value: "event", label: "Event" },
    { value: "cold_call", label: "Cold Call" },
    { value: "other", label: "Other" }
  ];

  // Function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "contacted":
        return "bg-orange-100 text-orange-600";
      case "qualified":
        return "bg-green-100 text-green-600";
      case "unqualified":
        return "bg-red-100 text-red-600";
      case "nurturing":
        return "bg-purple-100 text-purple-600";
      case "converted":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Lead Management</h1>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new lead.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                      Full Name
                    </Label>
                    <Input 
                      id="fullName" 
                      value={newLead.fullName}
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
                      value={newLead.email}
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
                      value={newLead.phone}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="(555) 123-4567" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Input 
                      id="company" 
                      value={newLead.company}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Acme Inc." 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newLead.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.filter(option => option.value !== "all").map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">
                      Source
                    </Label>
                    <Select
                      value={newLead.source}
                      onValueChange={(value) => handleSelectChange("source", value)}
                    >
                      <SelectTrigger id="source" className="col-span-3">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input 
                      id="notes" 
                      value={newLead.notes}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Additional information..." 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={createLeadMutation.isPending}>
                    {createLeadMutation.isPending ? "Creating..." : "Add Lead"}
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
                <p className="text-sm text-gray-500">Total Leads</p>
                <h3 className="text-2xl font-bold text-foreground">{totalLeads}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New This Week</p>
                <h3 className="text-2xl font-bold text-foreground">24</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-foreground">12.3%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Leads</CardTitle>
                  <CardDescription>
                    Manage your lead database
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Search leads..." 
                      className="pl-8 w-full" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
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
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leadsData?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No leads found. Try adjusting your filters or adding a new lead.
                            </TableCell>
                          </TableRow>
                        ) : (
                          leadsData?.map((lead: any, index: number) => (
                            <TableRow key={lead.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback className={getRandomColor(index)}>
                                      {getInitials(lead.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{lead.fullName}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{lead.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {lead.company ? (
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{lead.company}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Not provided</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={getStatusVariant(lead.status)}
                                >
                                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {lead.source ? (
                                  lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace('_', ' ')
                                ) : (
                                  <span className="text-gray-400">Unknown</span>
                                )}
                              </TableCell>
                              <TableCell>{formatDate(lead.createdAt)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
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
                      Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalLeads)}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * pageSize, totalLeads)}</span> of{" "}
                      <span className="font-medium">{totalLeads}</span> leads
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

        {/* Similar content for other tabs, simplified for now */}
        <TabsContent value="new" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-4">
                Filtered view for new leads would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacted" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-4">
                Filtered view for contacted leads would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qualified" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-4">
                Filtered view for qualified leads would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsList;