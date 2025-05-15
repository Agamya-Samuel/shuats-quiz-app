"use client"

import { Input } from "@/components/ui/input"

import { Switch } from "@/components/ui/switch"

import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { BarChart, Download, RefreshCw, Users, Clock, FileText, CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for charts
const quizActivityData = [
  { name: "Mon", active: 40, completed: 24 },
  { name: "Tue", active: 30, completed: 28 },
  { name: "Wed", active: 20, completed: 18 },
  { name: "Thu", active: 27, completed: 25 },
  { name: "Fri", active: 18, completed: 15 },
  { name: "Sat", active: 23, completed: 19 },
  { name: "Sun", active: 34, completed: 30 },
]

const scoreDistributionData = [
  { name: "0-20%", value: 5 },
  { name: "21-40%", value: 10 },
  { name: "41-60%", value: 15 },
  { name: "61-80%", value: 25 },
  { name: "81-100%", value: 20 },
]

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8"]

const timeSpentData = [
  { name: "Q1", avgTime: 45 },
  { name: "Q2", avgTime: 30 },
  { name: "Q3", avgTime: 60 },
  { name: "Q4", avgTime: 40 },
  { name: "Q5", avgTime: 55 },
  { name: "Q6", avgTime: 25 },
  { name: "Q7", avgTime: 35 },
  { name: "Q8", avgTime: 50 },
]

// Mock data for live monitoring
const liveUsers = [
  { id: "1", name: "John Doe", progress: 7, score: 85, timeSpent: "12:30" },
  { id: "2", name: "Jane Smith", progress: 10, score: 92, timeSpent: "15:45" },
  { id: "3", name: "Bob Johnson", progress: 4, score: 60, timeSpent: "08:20" },
  { id: "4", name: "Alice Williams", progress: 9, score: 78, timeSpent: "14:10" },
  { id: "5", name: "Charlie Brown", progress: 2, score: 40, timeSpent: "05:15" },
]

// Mock data for submissions
const submissions = [
  {
    id: "1",
    user: "John Doe",
    quiz: "Mathematics Quiz",
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeSpent: "25:30",
    submittedAt: "2023-05-14 10:30 AM",
  },
  {
    id: "2",
    user: "Jane Smith",
    quiz: "Science Quiz",
    score: 92,
    totalQuestions: 15,
    correctAnswers: 14,
    timeSpent: "32:15",
    submittedAt: "2023-05-14 11:45 AM",
  },
  {
    id: "3",
    user: "Bob Johnson",
    quiz: "History Quiz",
    score: 60,
    totalQuestions: 20,
    correctAnswers: 12,
    timeSpent: "40:20",
    submittedAt: "2023-05-14 09:20 AM",
  },
  {
    id: "4",
    user: "Alice Williams",
    quiz: "Geography Quiz",
    score: 78,
    totalQuestions: 10,
    correctAnswers: 8,
    timeSpent: "22:10",
    submittedAt: "2023-05-14 02:10 PM",
  },
  {
    id: "5",
    user: "Charlie Brown",
    quiz: "Literature Quiz",
    score: 40,
    totalQuestions: 15,
    correctAnswers: 6,
    timeSpent: "28:45",
    submittedAt: "2023-05-14 03:45 PM",
  },
]

export function Analytics() {
  const [selectedQuiz, setSelectedQuiz] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated.",
        variant: "success",
      })
    }, 1000)
  }

  const exportData = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting data in ${format.toUpperCase()} format.`,
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live">Live Monitoring</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="export">Export Results</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quizzes</SelectItem>
                <SelectItem value="math">Mathematics Quiz</SelectItem>
                <SelectItem value="science">Science Quiz</SelectItem>
                <SelectItem value="history">History Quiz</SelectItem>
                <SelectItem value="geography">Geography Quiz</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <h3 className="text-3xl font-bold mt-2">42</h3>
                    <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
                    <h3 className="text-3xl font-bold mt-2">24:18</h3>
                    <p className="text-xs text-red-600 mt-1">↓ 5% from last week</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                    <h3 className="text-3xl font-bold mt-2">76%</h3>
                    <p className="text-xs text-green-600 mt-1">↑ 8% from last week</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BarChart className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <h3 className="text-3xl font-bold mt-2">89%</h3>
                    <p className="text-xs text-green-600 mt-1">↑ 3% from last week</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Activity</CardTitle>
                <CardDescription>Number of active and completed quizzes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={quizActivityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="active" fill="#8884d8" name="Active" />
                      <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Distribution of quiz scores across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={scoreDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time Spent per Question</CardTitle>
              <CardDescription>Average time spent on each question across all quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={timeSpentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Avg. Time (seconds)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Quiz Monitor</CardTitle>
              <CardDescription>Real-time monitoring of users currently taking quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Current Score</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${(user.progress / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{user.progress}/10</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.score}%</TableCell>
                        <TableCell>{user.timeSpent}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">5 users currently active</p>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Leaderboard</CardTitle>
              <CardDescription>Real-time ranking of users based on current scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveUsers
                  .sort((a, b) => b.score - a.score)
                  .map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Question {user.progress}/10 • {user.timeSpent} elapsed
                        </p>
                      </div>
                      <div className="text-2xl font-bold">{user.score}%</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Submissions</CardTitle>
              <CardDescription>Detailed view of all quiz submissions with scores and time taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Correct/Total</TableHead>
                      <TableHead>Time Taken</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.user}</TableCell>
                        <TableCell>{submission.quiz}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              submission.score >= 80
                                ? "bg-green-500"
                                : submission.score >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {submission.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {submission.correctAnswers}/{submission.totalQuestions}
                        </TableCell>
                        <TableCell>{submission.timeSpent}</TableCell>
                        <TableCell>{submission.submittedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "View Details",
                                description: `Viewing details for ${submission.user}'s submission`,
                              })
                            }
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Showing 5 of 24 submissions</p>
              <Button variant="outline" size="sm">
                View All Submissions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
              <CardDescription>Analysis of correct and incorrect answers for each question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((questionNum) => (
                  <div key={questionNum} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Question {questionNum}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 100)}% of users answered correctly
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{Math.floor(Math.random() * 50)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Quiz Results</CardTitle>
              <CardDescription>Download quiz results in various formats for analysis or record-keeping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      PDF Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Export detailed quiz results with charts and analytics in PDF format.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => exportData("pdf")} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Excel Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Export raw data in Excel format for custom analysis and reporting.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => exportData("excel")} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      CSV Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Export data in CSV format for compatibility with various systems.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => exportData("csv")} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Export Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-user-details" />
                    <Label htmlFor="include-user-details">Include user details</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-question-details" defaultChecked />
                    <Label htmlFor="include-question-details">Include question details</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-analytics" defaultChecked />
                    <Label htmlFor="include-analytics">Include analytics and charts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-timestamps" />
                    <Label htmlFor="include-timestamps">Include timestamps</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Set up automated reports to be generated and sent on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="enable-scheduled-reports" />
                  <Label htmlFor="enable-scheduled-reports">Enable scheduled reports</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-frequency">Report Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="report-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-format">Report Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="report-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-recipients">Email Recipients</Label>
                  <Input id="report-recipients" placeholder="Enter email addresses separated by commas" />
                </div>

                <Button className="w-full">Save Report Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
