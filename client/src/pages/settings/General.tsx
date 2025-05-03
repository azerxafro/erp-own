import React from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Building, 
  Mail,
  Phone,
  Globe,
  Map,
  CreditCard,
  Lock,
  FileText,
  Bell
} from "lucide-react";

const General: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'General' }
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col items-start p-0 bg-transparent space-y-1 w-full">
              <TabsTrigger 
                value="general" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <Settings className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="company" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <Building className="mr-2 h-4 w-4" />
                Company Information
              </TabsTrigger>
              <TabsTrigger 
                value="localization" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <Globe className="mr-2 h-4 w-4" />
                Localization
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Subscriptions
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className="w-full justify-start px-3 py-2 font-normal data-[state=active]:font-medium"
              >
                <FileText className="mr-2 h-4 w-4" />
                Legal Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="general" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your system's general configuration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Settings</h3>
                    <Separator />
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Enable dark mode by default</Label>
                          <p className="text-sm text-muted-foreground">
                            When enabled, new users will see the dark theme by default
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Use 24-hour time format</Label>
                          <p className="text-sm text-muted-foreground">
                            Display time in 24-hour format (e.g., 13:00 instead of 1:00 PM)
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Auto-refresh dashboard</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically refresh dashboard data every 5 minutes
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Application Name & Description</h3>
                    <Separator />
                    
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="app_name">Application Name</Label>
                        <Input id="app_name" defaultValue="ERP System" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="app_description">Application Description</Label>
                        <Textarea 
                          id="app_description" 
                          rows={3}
                          defaultValue="Comprehensive ERP system for managing business operations, sales, and customer relationships."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Settings</h3>
                    <Separator />
                    
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                        <Input id="session_timeout" type="number" defaultValue="30" />
                        <p className="text-sm text-muted-foreground">
                          Users will be automatically logged out after this period of inactivity
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Remember user sessions</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow users to stay signed in between browser sessions
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-6">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="company" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Manage your company's information and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input id="company_name" defaultValue="Acme Corporation" />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="company_email">Email</Label>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <Input id="company_email" defaultValue="info@acmecorp.com" />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="company_phone">Phone</Label>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <Input id="company_phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="company_website">Website</Label>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        <Input id="company_website" defaultValue="https://www.acmecorp.com" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="company_address">Address</Label>
                      <div className="flex items-center">
                        <Map className="w-4 h-4 mr-2 text-gray-500 self-start mt-2" />
                        <Textarea id="company_address" defaultValue="123 Business Street
Suite 456
New York, NY 10001
United States" />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-6">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Add content for other tabs as needed */}
            <TabsContent value="localization" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-4">
                    Localization settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-4">
                    Notification settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-4">
                    Billing and subscription settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-4">
                    Security settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="legal" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-4">
                    Legal document settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default General;