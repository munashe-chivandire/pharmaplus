"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    organizationName?: string | null
  }
}

export function DashboardLayout({ children, title, user }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn("hidden lg:block", isMobileOpen && "block")}>
        <Sidebar
          user={user}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <Header
          title={title}
          onMenuClick={() => setIsMobileOpen(true)}
          user={user}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
