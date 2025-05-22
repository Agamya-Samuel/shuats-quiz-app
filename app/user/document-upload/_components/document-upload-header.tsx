import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileCheck, Upload, AlertTriangle } from "lucide-react"

interface DocumentUploadHeaderProps {
  progress: number
}

export function DocumentUploadHeader({ progress }: DocumentUploadHeaderProps) {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white">
          <FileCheck className="h-12 w-12" />
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground mt-2">
            Upload your documents for verification. All documents must be verified before you can proceed.
          </p>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Step 1</h3>
              <p className="text-sm text-blue-700">Upload Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800">Step 2</h3>
              <p className="text-sm text-amber-700">Verification in Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Step 3</h3>
              <p className="text-sm text-green-700">Verification Complete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
