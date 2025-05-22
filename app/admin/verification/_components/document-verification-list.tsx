"use client"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Search, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentViewDialog } from "./document-view-dialog"
import { DocumentVerificationDialog } from "./document-verification-dialog"
import { DocumentRejectionDialog } from "./document-rejection-dialog"

// Mock data for document verification
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    submittedAt: "2023-05-14 10:30 AM",
    documents: [
      { type: "aadhar", status: "pending", filename: "aadhar_card.pdf" },
      { type: "photo", status: "pending", filename: "photo.jpg" },
      { type: "10th_marksheet", status: "pending", filename: "10th_marksheet.pdf" },
      { type: "12th_marksheet", status: "pending", filename: "12th_marksheet.pdf" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    submittedAt: "2023-05-14 09:15 AM",
    documents: [
      { type: "aadhar", status: "approved", filename: "aadhar_card.pdf" },
      { type: "photo", status: "pending", filename: "photo.jpg" },
      { type: "10th_marksheet", status: "rejected", filename: "10th_marksheet.pdf", reason: "Document unclear" },
      { type: "12th_marksheet", status: "pending", filename: "12th_marksheet.pdf" },
    ],
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    submittedAt: "2023-05-13 03:45 PM",
    documents: [
      { type: "aadhar", status: "pending", filename: "aadhar_card.pdf" },
      { type: "photo", status: "rejected", filename: "photo.jpg", reason: "Photo does not meet requirements" },
      { type: "10th_marksheet", status: "pending", filename: "10th_marksheet.pdf" },
      { type: "12th_marksheet", status: "approved", filename: "12th_marksheet.pdf" },
    ],
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    submittedAt: "2023-05-12 11:20 AM",
    documents: [
      { type: "aadhar", status: "approved", filename: "aadhar_card.pdf" },
      { type: "photo", status: "approved", filename: "photo.jpg" },
      { type: "10th_marksheet", status: "approved", filename: "10th_marksheet.pdf" },
      { type: "12th_marksheet", status: "approved", filename: "12th_marksheet.pdf" },
    ],
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    submittedAt: "2023-05-14 08:00 AM",
    documents: [
      { type: "aadhar", status: "pending", filename: "aadhar_card.pdf" },
      { type: "photo", status: "pending", filename: "photo.jpg" },
      { type: "10th_marksheet", status: "pending", filename: "10th_marksheet.pdf" },
      { type: "12th_marksheet", status: "pending", filename: "12th_marksheet.pdf" },
    ],
  },
]

export function DocumentVerificationList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documentFilter, setDocumentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [users, setUsers] = useState(mockUsers)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    userId: string
    userName: string
    documentType: string
    filename: string
    status: string
  } | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data Refreshed",
        description: "Document verification list has been updated.",
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

  const handleApproveDocument = (
    userId: string,
    userName: string,
    documentType: string,
    filename: string,
    status: string,
  ) => {
    setSelectedDocument({ userId, userName, documentType, filename, status })
    setIsApproveDialogOpen(true)
  }

  const handleRejectDocument = (
    userId: string,
    userName: string,
    documentType: string,
    filename: string,
    status: string,
  ) => {
    setSelectedDocument({ userId, userName, documentType, filename, status })
    setIsRejectDialogOpen(true)
  }

  const approveDocument = () => {
    if (!selectedDocument) return

    setUsers(
      users.map((user) => {
        if (user.id === selectedDocument.userId) {
          return {
            ...user,
            documents: user.documents.map((doc) => {
              if (doc.type === selectedDocument.documentType) {
                return { ...doc, status: "approved" }
              }
              return doc
            }),
          }
        }
        return user
      }),
    )

    toast({
      title: "Document Approved",
      description: `${getDocumentTypeName(selectedDocument.documentType)} for ${selectedDocument.userName} has been approved.`,
      variant: "success",
    })

    setIsApproveDialogOpen(false)
  }

  const rejectDocument = (reason: string) => {
    if (!selectedDocument) return

    setUsers(
      users.map((user) => {
        if (user.id === selectedDocument.userId) {
          return {
            ...user,
            documents: user.documents.map((doc) => {
              if (doc.type === selectedDocument.documentType) {
                return { ...doc, status: "rejected", reason }
              }
              return doc
            }),
          }
        }
        return user
      }),
    )

    toast({
      title: "Document Rejected",
      description: `${getDocumentTypeName(selectedDocument.documentType)} for ${selectedDocument.userName} has been rejected.`,
      variant: "destructive",
    })

    setIsRejectDialogOpen(false)
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

  // Filter users based on search query, document type, and status
  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by document status
    const hasDocumentWithStatus = user.documents.some((doc) => {
      // Filter by document type
      const matchesDocumentType = documentFilter === "all" || doc.type === documentFilter
      // Filter by status
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter

      return matchesDocumentType && matchesStatus
    })

    return matchesSearch && (statusFilter === "all" || hasDocumentWithStatus)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-medium">No documents found</p>
              <p className="text-sm text-muted-foreground mt-1">Try changing your filters or search query</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <div className="bg-muted p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">Submitted: {user.submittedAt}</div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {user.documents
                        .filter((doc) => documentFilter === "all" || doc.type === documentFilter)
                        .filter((doc) => statusFilter === "all" || doc.status === statusFilter)
                        .map((doc) => (
                          <div
                            key={doc.type}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{getDocumentTypeName(doc.type)}</h4>
                                {getStatusBadge(doc.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Filename: {doc.filename}</p>
                              {doc.reason && (
                                <p className="text-sm text-red-500 mt-1">Reason for rejection: {doc.reason}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewDocument(user.id, user.name, doc.type, doc.filename, doc.status)
                                }
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              {doc.status !== "approved" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproveDocument(user.id, user.name, doc.type, doc.filename, doc.status)
                                  }
                                  className="flex items-center gap-1 text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </Button>
                              )}
                              {doc.status !== "rejected" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRejectDocument(user.id, user.name, doc.type, doc.filename, doc.status)
                                  }
                                  className="flex items-center gap-1 text-red-600"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.flatMap((user) =>
              user.documents
                .filter((doc) => documentFilter === "all" || doc.type === documentFilter)
                .filter((doc) => statusFilter === "all" || doc.status === statusFilter)
                .map((doc) => (
                  <Card key={`${user.id}-${doc.type}`} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{getDocumentTypeName(doc.type)}</CardTitle>
                          <CardDescription>{user.name}</CardDescription>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-32 bg-muted rounded-md flex items-center justify-center mb-4">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <div>Email: {user.email}</div>
                        <div>Filename: {doc.filename}</div>
                        <div>Submitted: {user.submittedAt}</div>
                        {doc.reason && <div className="text-red-500 mt-1">Reason: {doc.reason}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(user.id, user.name, doc.type, doc.filename, doc.status)}
                          className="flex-1 flex items-center justify-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        {doc.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleApproveDocument(user.id, user.name, doc.type, doc.filename, doc.status)
                            }
                            className="flex-1 flex items-center justify-center gap-1 text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        {doc.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectDocument(user.id, user.name, doc.type, doc.filename, doc.status)}
                            className="flex-1 flex items-center justify-center gap-1 text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )),
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document View Dialog */}
      <DocumentViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        document={selectedDocument}
        getDocumentTypeName={getDocumentTypeName}
      />

      {/* Document Approval Dialog */}
      <DocumentVerificationDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        document={selectedDocument}
        getDocumentTypeName={getDocumentTypeName}
        onApprove={approveDocument}
      />

      {/* Document Rejection Dialog */}
      <DocumentRejectionDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        document={selectedDocument}
        getDocumentTypeName={getDocumentTypeName}
        onReject={rejectDocument}
      />
    </div>
  )
}
