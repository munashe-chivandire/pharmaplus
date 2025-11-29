"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Heart,
  User,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Download,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MemberLayoutProps {
  children: React.ReactNode
  member?: {
    name?: string
    email?: string
    membershipNumber?: string
    package?: string
    status?: string
  }
}

const navigation = [
  { name: "Dashboard", href: "/portal", icon: Home },
  { name: "My Applications", href: "/portal/applications", icon: FileText },
  { name: "Claims", href: "/portal/claims", icon: Heart },
  { name: "Benefits", href: "/portal/benefits", icon: CreditCard },
  { name: "Profile", href: "/portal/profile", icon: User },
]

export function MemberLayout({ children, member }: MemberLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/portal" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">PharmPlus</span>
                <span className="hidden sm:inline text-xs text-gray-500 ml-2">Member Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  2
                </span>
              </Button>

              {/* Help */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </Button>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <Avatar fallback={member?.name || "M"} size="sm" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{member?.name || "Member"}</p>
                  <p className="text-xs text-gray-500">{member?.membershipNumber || "Loading..."}</p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {/* Member Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <Avatar fallback={member?.name || "M"} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{member?.name || "Member"}</p>
                  <p className="text-sm text-gray-500">{member?.membershipNumber}</p>
                </div>
                <Badge variant="success" className="ml-auto">{member?.status || "Active"}</Badge>
              </div>

              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Download App Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 text-center sm:hidden">
        <div className="flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          <span className="text-sm">Download our mobile app for a better experience</span>
        </div>
      </div>
    </div>
  )
}
