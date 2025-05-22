"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Search, UserPlus, UserX, UserCheck, Mail, Globe, Shield, AlertTriangle, Upload, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  status: "active" | "banned" | "pending"
  role: "student" | "teacher" | "admin"
  lastActive: string
  ipAddress: string
  location: string
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "active",
      role: "student",
      lastActive: "2023-05-14 10:30 AM",
      ipAddress: "192.168.1.1",
      location: "New York, USA",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "active",
      role: "teacher",
      lastActive: "2023-05-14 09:15 AM",
      ipAddress: "192.168.1.2",
      location: "London, UK",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      status: "banned",
      role: "student",
      lastActive: "2023-05-13 03:45 PM",
      ipAddress: "192.168.1.3",
      location: "Toronto, Canada",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      status: "pending",
      role: "student",
      lastActive: "2023-05-12 11:20 AM",
      ipAddress: "192.168.1.4",
      location: "Sydney, Australia",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      status: "active",
      role: "admin",
      lastActive: "2023-05-14 08:00 AM",
      ipAddress: "192.168.1.5",
      location: "Berlin, Germany",
    },
  ])

  const [ipRestrictions, setIpRestrictions] = useState({
    enableRestrictions: false,
    allowedIPs: "192.168.1.1, 192.168.1.2",
    blockedIPs: "10.0.0.1, 10.0.0.2",
  })

  const [locationRestrictions, setLocationRestrictions] = useState({
    enableRestrictions: false,
    allowedCountries: ["United States", "Canada", "United Kingdom"],
    blockByDefault: false,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const banUser = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          toast({
            title: "User Banned",
            description: `${user.name} has been banned from the platform.`,
            variant: "destructive",
          })
          return { ...user, status: "banned" }
        }
        return user
      }),
    )
  }

  const unbanUser = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          toast({
            title: "User Unbanned",
            description: `${user.name} has been unbanned and can now access the platform.`,
            variant: "success",
          })
          return { ...user, status: "active" }
        }
        return user
      }),
    )
  }

  const approveUser = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          toast({
            title: "User Approved",
            description: `${user.name} has been approved and can now access the platform.`,
            variant: "success",
          })
          return { ...user, status: "active" }
        }
        return user
      }),
    )
  }

  const changeRole = (userId: string, newRole: "student" | "teacher" | "admin") => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          toast({
            title: "Role Updated",
            description: `${user.name}'s role has been updated to ${newRole}.`,
            variant: "success",
          })
          return { ...user, role: newRole }
        }
        return user
      }),
    )
  }

  const saveIPRestrictions = () => {
    toast({
      title: "IP Restrictions Updated",
      description: "IP address restrictions have been updated successfully.",
      variant: "success",
    })
  }

  const saveLocationRestrictions = () => {
    toast({
      title: "Location Restrictions Updated",
      description: "Location-based restrictions have been updated successfully.",
      variant: "success",
    })
  }

  const exportUsers = () => {
    toast({
      title: "Users Exported",
      description: "User data has been exported to CSV successfully.",
      variant: "success",
    })
  }

  const importUsers = () => {
    toast({
      title: "Users Imported",
      description: "User data has been imported successfully.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="restrictions">Access Restrictions</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, edit, and manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : user.role === "teacher"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "success"
                                : user.status === "banned"
                                  ? "destructive"
                                  : "outline"
                            }
                            className={
                              user.status === "active"
                                ? "bg-green-500"
                                : user.status === "banned"
                                  ? "bg-red-500"
                                  : "bg-yellow-500 text-yellow-800"
                            }
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  toast({ title: "View Details", description: `Viewing details for ${user.name}` })
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  toast({ title: "Send Email", description: `Preparing to send email to ${user.name}` })
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => changeRole(user.id, "student")}>
                                Set as Student
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeRole(user.id, "teacher")}>
                                Set as Teacher
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeRole(user.id, "admin")}>
                                Set as Admin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "banned" ? (
                                <DropdownMenuItem onClick={() => unbanUser(user.id)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => banUser(user.id)}>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              )}
                              {user.status === "pending" && (
                                <DropdownMenuItem onClick={() => approveUser(user.id)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Approve User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restrictions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>IP Address Restrictions</CardTitle>
              <CardDescription>Control access to the quiz platform based on IP addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-ip-restrictions"
                    checked={ipRestrictions.enableRestrictions}
                    onCheckedChange={(checked) => setIpRestrictions({ ...ipRestrictions, enableRestrictions: checked })}
                  />
                  <Label htmlFor="enable-ip-restrictions" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable IP address restrictions
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                    <Input
                      id="allowed-ips"
                      placeholder="e.g., 192.168.1.1, 10.0.0.1"
                      value={ipRestrictions.allowedIPs}
                      onChange={(e) => setIpRestrictions({ ...ipRestrictions, allowedIPs: e.target.value })}
                      disabled={!ipRestrictions.enableRestrictions}
                    />
                    <p className="text-sm text-muted-foreground">Comma-separated list of allowed IP addresses</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blocked-ips">Blocked IP Addresses</Label>
                    <Input
                      id="blocked-ips"
                      placeholder="e.g., 192.168.1.2, 10.0.0.2"
                      value={ipRestrictions.blockedIPs}
                      onChange={(e) => setIpRestrictions({ ...ipRestrictions, blockedIPs: e.target.value })}
                      disabled={!ipRestrictions.enableRestrictions}
                    />
                    <p className="text-sm text-muted-foreground">Comma-separated list of blocked IP addresses</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveIPRestrictions} disabled={!ipRestrictions.enableRestrictions}>
                Save IP Restrictions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location-Based Restrictions</CardTitle>
              <CardDescription>Control access to the quiz platform based on geographic location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-location-restrictions"
                    checked={locationRestrictions.enableRestrictions}
                    onCheckedChange={(checked) =>
                      setLocationRestrictions({ ...locationRestrictions, enableRestrictions: checked })
                    }
                  />
                  <Label htmlFor="enable-location-restrictions" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Enable location-based restrictions
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Allowed Countries</Label>
                  <div className="flex flex-wrap gap-2">
                    {locationRestrictions.allowedCountries.map((country) => (
                      <Badge key={country} variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {country}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6">
                      + Add Country
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="block-by-default"
                    checked={locationRestrictions.blockByDefault}
                    onCheckedChange={(checked) =>
                      setLocationRestrictions({ ...locationRestrictions, blockByDefault: checked })
                    }
                    disabled={!locationRestrictions.enableRestrictions}
                  />
                  <Label htmlFor="block-by-default" className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Block all countries by default (whitelist mode)
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveLocationRestrictions} disabled={!locationRestrictions.enableRestrictions}>
                Save Location Restrictions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Users</CardTitle>
              <CardDescription>Import users from CSV or export current user data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Import Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV file with user data to import multiple users at once. The CSV should include columns
                    for name, email, and role.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="file" accept=".csv" />
                    <Button onClick={importUsers} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Export all user data to a CSV file for backup or analysis.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button onClick={exportUsers} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export All Users
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => exportUsers()} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Active Users Only
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
