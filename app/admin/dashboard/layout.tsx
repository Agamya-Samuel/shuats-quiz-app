import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quiz Admin Control Panel",
  description: "Comprehensive admin control panel for managing quizzes",
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
}
