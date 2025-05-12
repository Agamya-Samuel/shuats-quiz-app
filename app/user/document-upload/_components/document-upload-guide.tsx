import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileCheck, FileWarning } from "lucide-react"

export function DocumentUploadGuide() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-teal-600" />
          <CardTitle>Document Upload Guidelines</CardTitle>
        </div>
        <CardDescription>Please follow these guidelines for successful verification</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-teal-700 font-medium">
                <FileCheck className="h-5 w-5" />
                <h3>File Format</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload documents in JPG, JPEG, PNG, or PDF format. Photos should be in JPG or PNG format only.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-teal-700 font-medium">
                <FileCheck className="h-5 w-5" />
                <h3>File Size</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each document should be less than 5MB. Photos should be less than 2MB.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-teal-700 font-medium">
                <FileCheck className="h-5 w-5" />
                <h3>Image Quality</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure all text is clearly visible. Documents should be well-lit and properly aligned.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Important Note</h3>
              <p className="text-sm text-amber-700 mt-1">
                All documents will be reviewed by our verification team. This process may take 1-3 business days. You
                will be notified once the verification is complete or if any additional information is required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <FileWarning className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Document Requirements</h3>
              <ul className="text-sm text-red-700 mt-1 space-y-1 list-disc pl-4">
                <li>Aadhar Card: Upload both front and back sides in a single file</li>
                <li>11th & 12th Marksheets: Must include your name, roll number, and all subjects with grades</li>
                <li>Photograph: Recent passport-sized photo with white background (3.5cm × 4.5cm)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
