"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Mail, Send, Calendar, Clock, Users, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Notifications() {
  const [emailSettings, setEmailSettings] = useState({
    enableEmails: true,
    quizStartReminder: true,
    quizEndReminder: true,
    resultNotification: true,
    adminUpdates: false,
    customSender: "Quiz Admin <quiz@example.com>",
    smtpConfigured: true,
  })

  const [announcementSettings, setAnnouncementSettings] = useState({
    title: "",
    message: "",
    targetAudience: "all",
    priority: "normal",
    showUntil: "",
  })

  const updateEmailSetting = (key: string, value: boolean | string) => {
    setEmailSettings({
      ...emailSettings,
      [key]: value,
    })
  }

  const updateAnnouncementSetting = (key: string, value: string) => {
    setAnnouncementSettings({
      ...announcementSettings,
      [key]: value,
    })
  }

  const sendAnnouncement = () => {
    if (!announcementSettings.title || !announcementSettings.message) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and message for your announcement.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Announcement Sent",
      description: `Your announcement "${announcementSettings.title}" has been sent to ${
        announcementSettings.targetAudience === "all"
          ? "all users"
          : announcementSettings.targetAudience === "active"
            ? "currently active users"
            : "selected user groups"
      }.`,
      variant: "success",
    })

    // Reset form
    setAnnouncementSettings({
      ...announcementSettings,
      title: "",
      message: "",
    })
  }

  const saveEmailSettings = () => {
    toast({
      title: "Email Settings Saved",
      description: "Your email notification settings have been updated.",
      variant: "success",
    })
  }

  const testEmailConnection = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to verify your SMTP configuration.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="announcements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="email">Email Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>Create and send announcements to quiz participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="announcement-title">Announcement Title</Label>
                <Input
                  id="announcement-title"
                  placeholder="Enter announcement title"
                  value={announcementSettings.title}
                  onChange={(e) => updateAnnouncementSetting("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="announcement-message">Message</Label>
                <Textarea
                  id="announcement-message"
                  placeholder="Enter your announcement message"
                  rows={4}
                  value={announcementSettings.message}
                  onChange={(e) => updateAnnouncementSetting("message", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select
                    value={announcementSettings.targetAudience}
                    onValueChange={(value) => updateAnnouncementSetting("targetAudience", value)}
                  >
                    <SelectTrigger id="target-audience">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Currently Active Users</SelectItem>
                      <SelectItem value="groups">Selected User Groups</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={announcementSettings.priority}
                    onValueChange={(value) => updateAnnouncementSetting("priority", value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="show-until">Show Until</Label>
                <Input
                  id="show-until"
                  type="datetime-local"
                  value={announcementSettings.showUntil}
                  onChange={(e) => updateAnnouncementSetting("showUntil", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to show indefinitely until manually dismissed
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Preview</Button>
              <Button onClick={sendAnnouncement} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Announcement
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>View and manage recently sent announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium">System Maintenance</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        The quiz platform will be unavailable for maintenance on Saturday from 2-4 AM.
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: May 12, 2023
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          To: All Users
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: May 21, 2023
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">New Physics Quiz Available</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        A new physics quiz has been added to the platform. Check it out now!
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: May 10, 2023
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          To: All Users
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: Never
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium">Quiz Results Published</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        The results for the Mathematics Quiz are now available. Check your scores!
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: May 8, 2023
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          To: Selected Groups
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: May 15, 2023
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Announcements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>Configure when and how email notifications are sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-emails"
                  checked={emailSettings.enableEmails}
                  onCheckedChange={(checked) => updateEmailSetting("enableEmails", checked)}
                />
                <Label htmlFor="enable-emails" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Enable email notifications
                </Label>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="quiz-start"
                      checked={emailSettings.quizStartReminder}
                      onCheckedChange={(checked) => updateEmailSetting("quizStartReminder", checked)}
                      disabled={!emailSettings.enableEmails}
                    />
                    <Label htmlFor="quiz-start">Quiz start reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="quiz-end"
                      checked={emailSettings.quizEndReminder}
                      onCheckedChange={(checked) => updateEmailSetting("quizEndReminder", checked)}
                      disabled={!emailSettings.enableEmails}
                    />
                    <Label htmlFor="quiz-end">Quiz end reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="result-notification"
                      checked={emailSettings.resultNotification}
                      onCheckedChange={(checked) => updateEmailSetting("resultNotification", checked)}
                      disabled={!emailSettings.enableEmails}
                    />
                    <Label htmlFor="result-notification">Result notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="admin-updates"
                      checked={emailSettings.adminUpdates}
                      onCheckedChange={(checked) => updateEmailSetting("adminUpdates", checked)}
                      disabled={!emailSettings.enableEmails}
                    />
                    <Label htmlFor="admin-updates">Admin updates and reports</Label>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Name and Email</Label>
                  <Input
                    id="sender-email"
                    placeholder="Quiz Admin <quiz@example.com>"
                    value={emailSettings.customSender}
                    onChange={(e) => updateEmailSetting("customSender", e.target.value)}
                    disabled={!emailSettings.enableEmails}
                  />
                </div>

                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {emailSettings.smtpConfigured ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <h4 className="font-medium">SMTP Configuration</h4>
                        <p className="text-sm text-muted-foreground">
                          {emailSettings.smtpConfigured
                            ? "SMTP server is configured and working properly"
                            : "SMTP server is not configured"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testEmailConnection}
                      disabled={!emailSettings.smtpConfigured || !emailSettings.enableEmails}
                    >
                      Test Connection
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveEmailSettings} disabled={!emailSettings.enableEmails}>
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize the email templates sent to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Quiz Reminder</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">Sent before a scheduled quiz starts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Quiz Results</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">Sent when quiz results are published</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">New Announcement</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">Sent when a new announcement is published</p>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-sm text-muted-foreground">Click on a template to edit its content and design</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
