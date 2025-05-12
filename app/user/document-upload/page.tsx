"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { useCookies } from "@/contexts/cookie-context"
import { redirect } from "next/navigation"
import { useRouter, useSearchParams } from "next/navigation"
import QuizLoading from "@/app/user/quiz/_components/quiz-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "./_components/file-upload"
import { DocumentStatus } from "./_components/document-status"
import { DocumentUploadHeader } from "./_components/document-upload-header"
import { DocumentUploadGuide } from "./_components/document-upload-guide"
import { FileText, Upload } from "lucide-react"

// Mock function to get document status - replace with actual API call
const getDocumentStatus = async (userId: number) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return {
    success: true,
    documents: {
      aadhar: { uploaded: false, verified: false, rejected: false, rejectionReason: "" },
      marksheet11: { uploaded: false, verified: false, rejected: false, rejectionReason: "" },
      marksheet12: { uploaded: false, verified: false, rejected: false, rejectionReason: "" },
      photo: { uploaded: false, verified: false, rejected: false, rejectionReason: "" },
    },
  }
}

export default function DocumentUploadPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [documentStatus, setDocumentStatus] = useState<any>(null)
  const defaultTab = "upload"
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user: currentUser } = useCookies()

  // Get active tab directly from URL params or use default
  const activeTab = searchParams.get('tab') || defaultTab

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    // Update URL without refreshing the page
    router.push(`/user/document-upload?tab=${tab}`, { scroll: false })
  }

  // Redirect if not a user
  useEffect(() => {
    if (currentUser?.role !== "user") {
      toast({
        title: "You are not authorized to access this page",
        description: "Please log in as a user",
        variant: "destructive",
      })
      redirect("/login")
    }
  }, [currentUser])

  // Fetch document status
  useEffect(() => {
    const fetchDocumentStatus = async () => {
      if (currentUser?.userId) {
        try {
          const response = await getDocumentStatus(Number(currentUser.userId))

          if (response.success) {
            setDocumentStatus(response.documents)
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch document status",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error fetching document status:", error)
          toast({
            title: "Error",
            description: "Failed to fetch document status",
            variant: "destructive",
          })
        }
      }
      setIsLoading(false)
    }

    fetchDocumentStatus()
  }, [currentUser])

  // Calculate verification progress
  const calculateProgress = () => {
    if (!documentStatus) return 0

    const documents = Object.values(documentStatus)
    const totalDocuments = documents.length
    const verifiedDocuments = documents.filter((doc: any) => doc.verified).length

    return Math.round((verifiedDocuments / totalDocuments) * 100)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl" style={{ minHeight: "calc(100vh - 150px)" }}>
        <QuizLoading message="Loading document status..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentUploadHeader progress={calculateProgress()} />

      <Separator className="my-6" />

      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Documents</span>
            <span className="sm:hidden">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Verification Status</span>
            <span className="sm:hidden">Status</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <DocumentUploadGuide />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FileUpload
              documentType="aadhar"
              title="Aadhar Card"
              description="Upload a clear scan or photo of your Aadhar card (front and back)"
              acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
              maxFileSizeMB={5}
              status={documentStatus?.aadhar}
              onUploadSuccess={(status) => {
                setDocumentStatus({
                  ...documentStatus,
                  aadhar: { ...documentStatus.aadhar, ...status },
                })
              }}
            />

            <FileUpload
              documentType="marksheet11"
              title="11th Grade Marksheet"
              description="Upload a clear scan or photo of your 11th grade marksheet"
              acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
              maxFileSizeMB={5}
              status={documentStatus?.marksheet11}
              onUploadSuccess={(status) => {
                setDocumentStatus({
                  ...documentStatus,
                  marksheet11: { ...documentStatus.marksheet11, ...status },
                })
              }}
            />

            <FileUpload
              documentType="marksheet12"
              title="12th Grade Marksheet"
              description="Upload a clear scan or photo of your 12th grade marksheet"
              acceptedFileTypes=".jpg, .jpeg, .png, .pdf"
              maxFileSizeMB={5}
              status={documentStatus?.marksheet12}
              onUploadSuccess={(status) => {
                setDocumentStatus({
                  ...documentStatus,
                  marksheet12: { ...documentStatus.marksheet12, ...status },
                })
              }}
            />

            <FileUpload
              documentType="photo"
              title="Recent Photograph"
              description="Upload a recent passport-sized photograph with white background"
              acceptedFileTypes=".jpg, .jpeg, .png"
              maxFileSizeMB={2}
              status={documentStatus?.photo}
              onUploadSuccess={(status) => {
                setDocumentStatus({
                  ...documentStatus,
                  photo: { ...documentStatus.photo, ...status },
                })
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="status">
          <DocumentStatus documentStatus={documentStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
