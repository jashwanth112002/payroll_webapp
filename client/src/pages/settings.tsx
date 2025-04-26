import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Lock,
  Info,
  Mail,
  CreditCard,
  Globe,
  Shield,
  User,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const handleSaveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="payroll" className="data-[state=active]:bg-primary-50">
            <CreditCard className="h-4 w-4 mr-2" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary-50">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary-50">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-primary-50">
            <Globe className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Payroll Settings Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Payroll Settings</CardTitle>
              <CardDescription>
                Configure how payslips are generated and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      placeholder="20"
                      className="max-w-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="health-insurance">Default Health Insurance Rate (%)</Label>
                    <Input
                      id="health-insurance"
                      type="number"
                      placeholder="5"
                      className="max-w-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="retirement">Default Retirement Contribution (%)</Label>
                    <Input
                      id="retirement"
                      type="number"
                      placeholder="8"
                      className="max-w-sm mt-1"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-calculate">Auto-calculate deductions</Label>
                      <div className="text-sm text-gray-500">
                        Automatically calculate tax and other deductions
                      </div>
                    </div>
                    <Switch id="auto-calculate" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="approval-required">Require approval for payslips</Label>
                      <div className="text-sm text-gray-500">
                        Require manager approval before finalizing payslips
                      </div>
                    </div>
                    <Switch id="approval-required" />
                  </div>

                  <Button type="submit" className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <div className="text-sm text-gray-500">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notify me about</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="payslip-notifications">New Payslips</Label>
                        <div className="text-sm text-gray-500">
                          When a new payslip is generated
                        </div>
                      </div>
                      <Switch id="payslip-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="meeting-notifications">Meeting Updates</Label>
                        <div className="text-sm text-gray-500">
                          When meetings are scheduled, updated, or canceled
                        </div>
                      </div>
                      <Switch id="meeting-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="employee-notifications">Employee Updates</Label>
                        <div className="text-sm text-gray-500">
                          When new employees are added or existing ones updated
                        </div>
                      </div>
                      <Switch id="employee-notifications" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="max-w-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="max-w-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="max-w-sm"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-factor authentication</Label>
                      <div className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  
                  <Button type="submit" className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      defaultValue="PayMeet Inc."
                      className="max-w-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <select
                      id="date-format"
                      className="w-full max-w-sm flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      defaultValue="MM/DD/YYYY"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full max-w-sm flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      defaultValue="USD"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <div className="text-sm text-gray-500">
                        Switch between light and dark themes
                      </div>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                  
                  <Button type="submit" className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}