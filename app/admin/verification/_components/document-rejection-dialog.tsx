"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { XCircle } from "lucide-react"

interface DocumentRejectionDialogProps {
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
  onReject: (reason: string) => void
}

export function DocumentRejectionDialog({
  isOpen,
  onOpenChange,
  document,
  getDocumentTypeName,
  onReject,
}: DocumentRejectionDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [error, setError] = useState("")

  if (!document) return null

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection")
      return
    }

    onReject(rejectionReason)
    setRejectionReason("")
    setError("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setRejectionReason("")
          setError("")
        }
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Document</DialogTitle>
          <DialogDescription>Please provide a reason for rejecting this document.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-2">
            <span className="font-medium">Document Type:</span> {getDocumentTypeName(document.documentType)}
          </p>
          <p className="mb-2">
            <span className="font-medium">User:</span> {document.userName}
          </p>
          <p className="mb-4">
            <span className="font-medium">Filename:</span> {document.filename}
          </p>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason for Rejection</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please explain why this document is being rejected..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReject} variant="destructive" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Reject Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
