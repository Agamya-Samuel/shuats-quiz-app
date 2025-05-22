"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Clock, Settings, Users, BarChart, Bell, Palette, AlertTriangle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuizSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard?tab=overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/admin/dashboard" || pathname.includes("?tab=overview"),
    },
    {
      href: "/admin/dashboard?tab=control",
      label: "Quiz Control",
      icon: <Clock className="h-5 w-5" />,
      active: pathname.includes("?tab=control"),
    },
    {
      href: "/admin/dashboard?tab=settings",
      label: "Quiz Settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname.includes("?tab=settings"),
    },
    {
      href: "/admin/dashboard?tab=users",
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
      active: pathname.includes("?tab=users"),
    },
    {
      href: "/admin/dashboard?tab=analytics",
      label: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      active: pathname.includes("?tab=analytics"),
    },
    {
      href: "/admin/dashboard?tab=notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      active: pathname.includes("?tab=notifications"),
    },
    {
      href: "/admin/dashboard?tab=theme",
      label: "Theme",
      icon: <Palette className="h-5 w-5" />,
      active: pathname.includes("?tab=theme"),
    },
    {
      href: "/admin/dashboard?tab=maintenance",
      label: "Maintenance",
      icon: <AlertTriangle className="h-5 w-5" />,
      active: pathname.includes("?tab=maintenance"),
    },
  ]

  return (
    <div className="flex flex-col h-full space-y-2 py-4">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          className={cn("justify-start", route.active ? "bg-primary text-primary-foreground" : "")}
          asChild
        >
          <Link href={route.href}>
            {route.icon}
            <span className="ml-2">{route.label}</span>
          </Link>
        </Button>
      ))}
      <div className="mt-auto pt-6">
        <Button variant="outline" className="justify-start w-full" asChild>
          <Link href="/admin/login">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  )
}
