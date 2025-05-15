"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Clock,
  Settings,
  Users,
  BarChart,
  Bell,
  Palette,
  AlertTriangle,
  FileCheck,
} from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          className={cn("justify-start", pathname === item.href ? "bg-primary text-primary-foreground" : "")}
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}

export function getDefaultNavItems() {
  return [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Quiz Control",
      href: "/admin/dashboard?tab=control",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Quiz Settings",
      href: "/admin/dashboard?tab=settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/dashboard?tab=users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/dashboard?tab=analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/dashboard?tab=notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Theme",
      href: "/admin/dashboard?tab=theme",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      title: "Maintenance",
      href: "/admin/dashboard?tab=maintenance",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: "Document Verification",
      href: "/admin/verification",
      icon: <FileCheck className="h-5 w-5" />,
    },
  ]
}
