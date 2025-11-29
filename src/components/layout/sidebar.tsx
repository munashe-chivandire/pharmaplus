"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Settings,
  BarChart3,
  CreditCard,
  Bell,
  LogOut,
  ChevronLeft,
  Package,
  UserCircle,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

interface SidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    organizationName?: string | null
  }
  isCollapsed?: boolean
  onToggle?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Members",
    href: "/members",
    icon: Users,
  },
  {
    name: "Packages",
    href: "/packages",
    icon: Package,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
]

const secondaryNavigation = [
  {
    name: "Organization",
    href: "/organization",
    icon: Building2,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ user, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">PharmPlus</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors",
            isCollapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft
            className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-gray-200">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "flex-col"
          )}
        >
          <Avatar
            src={user?.image}
            fallback={user?.name || user?.email || "U"}
            size="md"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.organizationName || user?.email}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <Link
              href="/api/auth/signout"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
