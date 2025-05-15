"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"

interface DocumentViewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  document: {
    userId: string
    userName: string
    documentType: string
    filename: string
    status: string
  } | null
  getDocumentTypeName: (type: string) => string
}

export function DocumentViewDialog({ isOpen, onOpenChange, document, getDocumentTypeName }: DocumentViewDialogProps) {
  if (!document) return null

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

  const getDocumentPreview = () => {
    // In a real application, this would show the actual document
    // For this example, we'll just show a placeholder
    const isImage =
      document.filename.toLowerCase().endsWith(".jpg") ||
      document.filename.toLowerCase().endsWith(".png") ||
      document.filename.toLowerCase().endsWith(".jpeg")

    if (isImage) {
      return (
        <div className="w-full h-96 bg-muted rounded-md flex items-center justify-center">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt={`${document.userName}'s ${getDocumentTypeName(document.documentType)}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )
    } else {
      return (
        <div className="w-full h-96 bg-muted rounded-md flex flex-col items-center justify-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">PDF Document Preview</p>
          <p className="text-sm text-muted-foreground mt-2">{document.filename}</p>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{getDocumentTypeName(document.documentType)}</span>
            {getStatusBadge(document.status)}
          </DialogTitle>
          <DialogDescription>
            Submitted by {document.userName} • {document.filename}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">{getDocumentPreview()}</div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Document
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
