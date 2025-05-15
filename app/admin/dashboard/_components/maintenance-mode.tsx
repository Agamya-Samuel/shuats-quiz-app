"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle, Clock, Save, RefreshCw, ShieldAlert, Users, Database, Server } from "lucide-react"

export function MaintenanceMode() {
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    enabled: false,
    scheduledStart: "",
    scheduledEnd: "",
    message:
      "The quiz platform is currently undergoing scheduled maintenance. We'll be back shortly. Thank you for your patience.",
    allowAdminAccess: true,
    redirectUrl: "",
  })

  const [systemStatus, setSystemStatus] = useState({
    database: "healthy", // "healthy", "warning", "error"
    server: "healthy",
    storage: "warning",
    lastBackup: "2023-05-14 03:00 AM",
    activeUsers: 0,
  })

  const updateMaintenanceSetting = (key: string, value: any) => {
    setMaintenanceSettings({
      ...maintenanceSettings,
      [key]: value,
    })
  }

  const toggleMaintenanceMode = () => {
    const newState = !maintenanceSettings.enabled
    updateMaintenanceSetting("enabled", newState)

    toast({
      title: newState ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
      description: newState
        ? "The platform is now in maintenance mode and inaccessible to regular users."
        : "The platform is now accessible to all users.",
      variant: newState ? "destructive" : "success",
    })
  }

  const saveMaintenanceSettings = () => {
    toast({
      title: "Maintenance Settings Saved",
      description: "Your maintenance mode settings have been updated.",
      variant: "success",
    })
  }

  const refreshSystemStatus = () => {
    toast({
      title: "System Status Refreshed",
      description: "System status information has been updated.",
      variant: "success",
    })
  }

  const runDatabaseBackup = () => {
    toast({
      title: "Backup Started",
      description: "A database backup has been initiated. This may take a few minutes.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Temporarily disable access to the quiz platform for maintenance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="maintenance-toggle"
                checked={maintenanceSettings.enabled}
                onCheckedChange={toggleMaintenanceMode}
              />
              <Label htmlFor="maintenance-toggle" className="font-medium">
                {maintenanceSettings.enabled ? "Enabled" : "Disabled"}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {maintenanceSettings.enabled && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Maintenance Mode Active</h4>
                <p className="text-sm text-red-700">
                  The quiz platform is currently in maintenance mode and is inaccessible to regular users. Only
                  administrators can access the platform.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="scheduled-start">Scheduled Start Time</Label>
              <Input
                id="scheduled-start"
                type="datetime-local"
                value={maintenanceSettings.scheduledStart}
                onChange={(e) => updateMaintenanceSetting("scheduledStart", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">When maintenance mode should automatically activate</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-end">Scheduled End Time</Label>
              <Input
                id="scheduled-end"
                type="datetime-local"
                value={maintenanceSettings.scheduledEnd}
                onChange={(e) => updateMaintenanceSetting("scheduledEnd", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">When maintenance mode should automatically deactivate</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              placeholder="Enter the message to display to users during maintenance"
              value={maintenanceSettings.message}
              onChange={(e) => updateMaintenanceSetting("message", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed to users who try to access the platform during maintenance
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-admin">Allow Administrator Access</Label>
                <p className="text-sm text-muted-foreground">
                  Administrators can still access the platform during maintenance
                </p>
              </div>
              <Switch
                id="allow-admin"
                checked={maintenanceSettings.allowAdminAccess}
                onCheckedChange={(checked) => updateMaintenanceSetting("allowAdminAccess", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
              <Input
                id="redirect-url"
                placeholder="https://status.example.com"
                value={maintenanceSettings.redirectUrl}
                onChange={(e) => updateMaintenanceSetting("redirectUrl", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Redirect users to this URL during maintenance (leave empty to show the maintenance message)
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={saveMaintenanceSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Maintenance Settings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>View the current status of system components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">System Components</h3>
            <Button variant="outline" size="sm" onClick={refreshSystemStatus} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Database</h4>
                  <p className="text-sm text-muted-foreground">Last backup: {systemStatus.lastBackup}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    systemStatus.database === "healthy"
                      ? "bg-green-500"
                      : systemStatus.database === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium capitalize">{systemStatus.database}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Application Server</h4>
                  <p className="text-sm text-muted-foreground">Running version 1.2.3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    systemStatus.server === "healthy"
                      ? "bg-green-500"
                      : systemStatus.server === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium capitalize">{systemStatus.server}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Storage</h4>
                  <p className="text-sm text-muted-foreground">75% capacity used</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    systemStatus.storage === "healthy"
                      ? "bg-green-500"
                      : systemStatus.storage === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium capitalize">{systemStatus.storage}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Active Users</h4>
                  <p className="text-sm text-muted-foreground">Currently 0 active users</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Normal</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Maintenance Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={runDatabaseBackup} className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Run Database Backup
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Restart Application Server
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Clear Cache
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Security Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
