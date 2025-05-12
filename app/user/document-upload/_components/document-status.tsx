import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DocumentStatusProps {
  documentStatus: {
    aadhar: { uploaded: boolean; verified: boolean; rejected: boolean; rejectionReason: string }
    marksheet11: { uploaded: boolean; verified: boolean; rejected: boolean; rejectionReason: string }
    marksheet12: { uploaded: boolean; verified: boolean; rejected: boolean; rejectionReason: string }
    photo: { uploaded: boolean; verified: boolean; rejected: boolean; rejectionReason: string }
  }
}

export function DocumentStatus({ documentStatus }: DocumentStatusProps) {
  const getStatusBadge = (status: { uploaded: boolean; verified: boolean; rejected: boolean }) => {
    if (status.verified) {
      return <Badge className="bg-green-500">Verified</Badge>
    }

    if (status.rejected) {
      return <Badge className="bg-red-500">Rejected</Badge>
    }

    if (status.uploaded) {
      return <Badge className="bg-amber-500">Pending</Badge>
    }

    return (
      <Badge variant="outline" className="bg-muted/20">
        Not Uploaded
      </Badge>
    )
  }

  const getStatusIcon = (status: { uploaded: boolean; verified: boolean; rejected: boolean }) => {
    if (status.verified) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    if (status.rejected) {
      return <AlertCircle className="h-5 w-5 text-red-500" />
    }

    if (status.uploaded) {
      return <Clock className="h-5 w-5 text-amber-500" />
    }

    return <FileText className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-teal-600" />
          <CardTitle>Document Verification Status</CardTitle>
        </div>
        <CardDescription>Track the status of your document verification process</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <DocumentStatusItem
            title="Aadhar Card"
            status={documentStatus.aadhar}
            icon={getStatusIcon(documentStatus.aadhar)}
            badge={getStatusBadge(documentStatus.aadhar)}
          />

          <Separator />

          <DocumentStatusItem
            title="11th Grade Marksheet"
            status={documentStatus.marksheet11}
            icon={getStatusIcon(documentStatus.marksheet11)}
            badge={getStatusBadge(documentStatus.marksheet11)}
          />

          <Separator />

          <DocumentStatusItem
            title="12th Grade Marksheet"
            status={documentStatus.marksheet12}
            icon={getStatusIcon(documentStatus.marksheet12)}
            badge={getStatusBadge(documentStatus.marksheet12)}
          />

          <Separator />

          <DocumentStatusItem
            title="Recent Photograph"
            status={documentStatus.photo}
            icon={getStatusIcon(documentStatus.photo)}
            badge={getStatusBadge(documentStatus.photo)}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Verification Process</h3>
              <p className="text-sm text-blue-700 mt-1">
                Our verification team reviews all documents within 1-3 business days. You will be notified via email
                once the verification is complete or if any additional information is required.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-blue-700">Pending: Under Review</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-blue-700">Verified: Approved</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-blue-700">Rejected: Action Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DocumentStatusItemProps {
  title: string
  status: { uploaded: boolean; verified: boolean; rejected: boolean; rejectionReason: string }
  icon: React.ReactNode
  badge: React.ReactNode
}

function DocumentStatusItem({ title, status, icon, badge }: DocumentStatusItemProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          {status.uploaded && !status.verified && !status.rejected && (
            <p className="text-sm text-amber-600 mt-1">Your document is being reviewed by our verification team</p>
          )}

          {status.rejected && (
            <p className="text-sm text-red-600 mt-1">
              {status.rejectionReason || "Your document was rejected. Please upload a new one."}
            </p>
          )}

          {status.verified && (
            <p className="text-sm text-green-600 mt-1">Your document has been successfully verified</p>
          )}

          {!status.uploaded && (
            <p className="text-sm text-muted-foreground mt-1">Please upload this document for verification</p>
          )}
        </div>
      </div>
      <div>{badge}</div>
    </div>
  )
}
