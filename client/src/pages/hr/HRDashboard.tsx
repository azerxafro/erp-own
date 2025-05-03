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
import { 
  Users, 
  UserPlus, 
  Search, 
  Calendar, 
  Briefcase, 
  Building, 
  CreditCard, 
  FileText, 
  ChevronRight, 
  Filter
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getRandomColor } from "@/lib/utils";
import { 
  PieChart,  
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  XAxis,
  YAxis
} from 'recharts';

const HRDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  const breadcrumbItems = [
    { label: 'ERP', href: '/erp' },
    { label: 'HR' }
  ];

  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ['/api/employees', { search }],
  });

  // Mocked data for charts and stats
  const departmentDistribution = [
    { name: 'Executive', value: 3 },
    { name: 'Sales', value: 8 },
    { name: 'Marketing', value: 5 },
    { name: 'Operations', value: 12 },
    { name: 'Finance', value: 4 },
    { name: 'HR', value: 2 },
    { name: 'IT', value: 6 },
  ];

  const salaryRanges = [
    { name: '$40k-$60k', count: 15 },
    { name: '$60k-$80k', count: 8 },
    { name: '$80k-$100k', count: 7 },
    { name: '$100k+', count: 10 },
  ];

  const employeeStats = {
    totalEmployees: 40,
    newHires: 3,
    turnover: 1,
    openPositions: 5,
    averageTenure: 3.2,
    maleToFemaleRatio: '60:40'
  };

  const upcomingEvents = [
    { title: 'Monthly Team Meeting', date: 'Sep 3, 2023', type: 'meeting' },
    { title: 'Performance Reviews', date: 'Sep 15-30, 2023', type: 'review' },
    { title: 'Company Anniversary', date: 'Sep 22, 2023', type: 'event' },
    { title: 'Training Workshop', date: 'Oct 5, 2023', type: 'training' },
  ];

  const COLORS = ['#2490EF', '#00A09D', '#FF5A5F', '#34D399', '#FFC107'];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Human Resources</h1>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter details for the new employee.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Full Name
                  </Label>
                  <Input id="fullName" className="col-span-3" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" placeholder="john.doe@company.com" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input id="position" className="col-span-3" placeholder="Software Engineer" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hireDate" className="text-right">
                    Hire Date
                  </Label>
                  <Input id="hireDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    Salary
                  </Label>
                  <Input id="salary" type="number" className="col-span-3" placeholder="$0.00" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" className="col-span-3" placeholder="(555) 123-4567" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Employee</Button>
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
                <p className="text-sm text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-bold text-foreground">{employeeStats.totalEmployees}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Hires (30d)</p>
                <h3 className="text-2xl font-bold text-foreground">{employeeStats.newHires}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Positions</p>
                <h3 className="text-2xl font-bold text-foreground">{employeeStats.openPositions}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Tenure (years)</p>
                <h3 className="text-2xl font-bold text-foreground">{employeeStats.averageTenure}</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-md">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>View and manage all employees</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search employees..." 
                  className="pl-8" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
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
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hire Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesData?.map((employee: any, index: number) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={getRandomColor(index)}>
                                {getInitials(employee.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{employee.fullName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                            employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }>
                            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              View All Employees
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                  <Legend layout="vertical" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>Employees by salary range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salaryRanges}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>HR-related activities and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'review' ? 'bg-amber-100 text-amber-600' :
                      event.type === 'event' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {event.type === 'meeting' && <Users className="h-5 w-5" />}
                      {event.type === 'review' && <FileText className="h-5 w-5" />}
                      {event.type === 'event' && <Calendar className="h-5 w-5" />}
                      {event.type === 'training' && <Briefcase className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Calendar className="mr-2 h-4 w-4" />
                  Time Off Requests
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Building className="mr-2 h-4 w-4" />
                  Organizational Chart
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payroll Management
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <div>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Job Postings
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">HR Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Gender Ratio (M:F)</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {employeeStats.maleToFemaleRatio}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Turnover Rate (30d)</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {(employeeStats.turnover / employeeStats.totalEmployees * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Hiring Rate (30d)</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {(employeeStats.newHires / employeeStats.totalEmployees * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Vacancy Rate</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {(employeeStats.openPositions / (employeeStats.totalEmployees + employeeStats.openPositions) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Onboarding Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">David Kim</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Sarah Johnson</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Michael Chen</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Onboarding Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
