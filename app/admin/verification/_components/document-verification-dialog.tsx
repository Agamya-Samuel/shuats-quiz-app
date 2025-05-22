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
import { CheckCircle } from "lucide-react"

interface DocumentVerificationDialogProps {
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
  onApprove: () => void
}

export function DocumentVerificationDialog({
  isOpen,
  onOpenChange,
  document,
  getDocumentTypeName,
  onApprove,
}: DocumentVerificationDialogProps) {
  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Document</DialogTitle>
          <DialogDescription>Are you sure you want to approve this document?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-2">
            <span className="font-medium">Document Type:</span> {getDocumentTypeName(document.documentType)}
          </p>
          <p className="mb-2">
            <span className="font-medium">User:</span> {document.userName}
          </p>
          <p>
            <span className="font-medium">Filename:</span> {document.filename}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approve Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
