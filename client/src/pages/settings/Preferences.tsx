import React from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle,
  Clock,
  MoonStar,
  SunMedium,
  Monitor,
  Languages,
  Bell,
  Calendar
} from "lucide-react";

const Preferences: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'Preferences' }
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">User Preferences</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Preferences</CardTitle>
            <CardDescription>
              Customize your interface appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full h-24 border-2 border-primary flex flex-col justify-center items-center"
                    >
                      <SunMedium className="h-8 w-8 mb-2" />
                      <span>Light</span>
                    </Button>
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full h-24 flex flex-col justify-center items-center bg-gray-950 text-white"
                    >
                      <MoonStar className="h-8 w-8 mb-2" />
                      <span>Dark</span>
                    </Button>
                    <span className="h-5"></span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full h-24 flex flex-col justify-center items-center"
                      style={{ background: 'linear-gradient(to right, white 50%, #1a1a1a 50%)' }}
                    >
                      <Monitor className="h-8 w-8 mb-2" style={{ color: 'black', mixBlendMode: 'difference' }} />
                      <span style={{ color: 'black', mixBlendMode: 'difference' }}>System</span>
                    </Button>
                    <span className="h-5"></span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Reduced animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Use reduced motion when possible
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
            <CardDescription>
              Configure language, date and time formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language</h3>
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="language">Display Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full">
                    <Languages className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Date & Time</h3>
              <Separator />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="date_format">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time_format">Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger id="time_format">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (13:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2 pt-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="america_new_york">
                  <SelectTrigger id="timezone">
                    <Globe className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_new_york">Eastern Time (ET) - New York</SelectItem>
                    <SelectItem value="america_chicago">Central Time (CT) - Chicago</SelectItem>
                    <SelectItem value="america_denver">Mountain Time (MT) - Denver</SelectItem>
                    <SelectItem value="america_los_angeles">Pacific Time (PT) - Los Angeles</SelectItem>
                    <SelectItem value="europe_london">Greenwich Mean Time (GMT) - London</SelectItem>
                    <SelectItem value="europe_paris">Central European Time (CET) - Paris</SelectItem>
                    <SelectItem value="asia_tokyo">Japan Standard Time (JST) - Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <Separator />
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when orders are updated
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory levels are low
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Customer Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new customer messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system updates and maintenance
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">In-App Notifications</h3>
              <Separator />
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications within the application
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Sound alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound when receiving notifications
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};

// Helper component for the Globe icon
const Globe = ({ className }: { className?: string }) => {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export default Preferences;