"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Search, Download, Eye, Calendar, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocumentViewDialog } from "./document-view-dialog"

// Mock data for verification history
const mockHistory = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    documentType: "aadhar",
    filename: "aadhar_card.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-14 11:30 AM",
    reason: null,
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    documentType: "10th_marksheet",
    filename: "10th_marksheet.pdf",
    status: "rejected",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-14 10:15 AM",
    reason: "Document unclear",
  },
  {
    id: "3",
    userId: "2",
    userName: "Jane Smith",
    documentType: "aadhar",
    filename: "aadhar_card.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-14 10:10 AM",
    reason: null,
  },
  {
    id: "4",
    userId: "3",
    userName: "Bob Johnson",
    documentType: "photo",
    filename: "photo.jpg",
    status: "rejected",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-13 04:45 PM",
    reason: "Photo does not meet requirements",
  },
  {
    id: "5",
    userId: "3",
    userName: "Bob Johnson",
    documentType: "12th_marksheet",
    filename: "12th_marksheet.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-13 04:40 PM",
    reason: null,
  },
  {
    id: "6",
    userId: "4",
    userName: "Alice Williams",
    documentType: "aadhar",
    filename: "aadhar_card.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-12 12:20 PM",
    reason: null,
  },
  {
    id: "7",
    userId: "4",
    userName: "Alice Williams",
    documentType: "photo",
    filename: "photo.jpg",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-12 12:15 PM",
    reason: null,
  },
  {
    id: "8",
    userId: "4",
    userName: "Alice Williams",
    documentType: "10th_marksheet",
    filename: "10th_marksheet.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-12 12:10 PM",
    reason: null,
  },
  {
    id: "9",
    userId: "4",
    userName: "Alice Williams",
    documentType: "12th_marksheet",
    filename: "12th_marksheet.pdf",
    status: "approved",
    verifiedBy: "Admin User",
    verifiedAt: "2023-05-12 12:05 PM",
    reason: null,
  },
]

export function VerificationHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documentFilter, setDocumentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [history, setHistory] = useState(mockHistory)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    userId: string
    userName: string
    documentType: string
    filename: string
    status: string
  } | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data Refreshed",
        description: "Verification history has been updated.",
        variant: "success",
      })
    }, 1000)
  }

  const handleViewDocument = (
    userId: string,
    userName: string,
    documentType: string,
    filename: string,
    status: string,
  ) => {
    setSelectedDocument({ userId, userName, documentType, filename, status })
    setIsViewDialogOpen(true)
  }

  const exportHistory = () => {
    toast({
      title: "Export Started",
      description: "Verification history is being exported to CSV.",
      variant: "success",
    })
  }

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "aadhar":
        return "Aadhar Card"
      case "photo":
        return "Photo"
      case "10th_marksheet":
        return "10th Marksheet"
      case "12th_marksheet":
        return "12th Marksheet"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Filter history based on search query, document type, status, and date
  const filteredHistory = history.filter((item) => {
    // Filter by search query
    const matchesSearch =
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verifiedBy.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by document type
    const matchesDocumentType = documentFilter === "all" || item.documentType === documentFilter

    // Filter by status
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    // Filter by date (simplified for demo)
    let matchesDate = true
    const itemDate = new Date(item.verifiedAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    if (dateFilter === "today") {
      matchesDate = itemDate.toDateString() === today.toDateString()
    } else if (dateFilter === "yesterday") {
      matchesDate = itemDate.toDateString() === yesterday.toDateString()
    } else if (dateFilter === "last_week") {
      matchesDate = itemDate >= lastWeek
    } else if (dateFilter === "last_month") {
      matchesDate = itemDate >= lastMonth
    }

    return matchesSearch && matchesDocumentType && matchesStatus && matchesDate
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users or admins..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={documentFilter} onValueChange={setDocumentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="aadhar">Aadhar Card</SelectItem>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="10th_marksheet">10th Marksheet</SelectItem>
              <SelectItem value="12th_marksheet">12th Marksheet</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_week">Last 7 Days</SelectItem>
              <SelectItem value="last_month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified By</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.userName}</TableCell>
                <TableCell>{getDocumentTypeName(item.documentType)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.verifiedBy}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{item.verifiedAt}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.reason ? (
                    <span className="text-red-500">{item.reason}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleViewDocument(item.userId, item.userName, item.documentType, item.filename, item.status)
                    }
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredHistory.length} of {history.length} verification records
        </p>
        <Button variant="outline" onClick={exportHistory} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Document View Dialog */}
      <DocumentViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        document={selectedDocument}
        getDocumentTypeName={getDocumentTypeName}
      />
    </div>
  )
}
