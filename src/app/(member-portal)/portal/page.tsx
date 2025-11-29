"use client"

import Link from "next/link"
import {
  FileText,
  Heart,
  CreditCard,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Shield,
} from "lucide-react"
import { MemberLayout } from "@/components/member/member-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// Mock member data
const mockMember = {
  name: "John Smith",
  email: "john.smith@email.com",
  membershipNumber: "QV-2024-001234",
  package: "Quest Premium",
  status: "Active",
  validUntil: new Date("2024-12-31"),
  dependents: 2,
  benefits: {
    used: 45000,
    total: 200000,
  },
}

const mockRecentClaims = [
  {
    id: "CLM-001",
    type: "GP Consultation",
    date: new Date("2024-01-10"),
    amount: 850,
    status: "APPROVED",
  },
  {
    id: "CLM-002",
    type: "Prescription",
    date: new Date("2024-01-08"),
    amount: 1250,
    status: "PENDING",
  },
]

const mockNotifications = [
  {
    id: 1,
    title: "Renewal Reminder",
    message: "Your membership expires in 30 days",
    type: "warning",
    date: new Date(),
  },
  {
    id: 2,
    title: "Claim Approved",
    message: "Your claim CLM-001 has been approved",
    type: "success",
    date: new Date("2024-01-10"),
  },
]

export default function MemberPortalPage() {
  const benefitPercentage = (mockMember.benefits.used / mockMember.benefits.total) * 100

  return (
    <MemberLayout member={mockMember}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {mockMember.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-500">
              Here's an overview of your membership
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/apply">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Membership Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-blue-200 text-sm">Membership Number</p>
                  <p className="text-2xl font-bold font-mono">{mockMember.membershipNumber}</p>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-blue-200 text-sm">Member Name</p>
                    <p className="font-semibold">{mockMember.name}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Package</p>
                    <p className="font-semibold">{mockMember.package}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Valid Until</p>
                    <p className="font-semibold">{formatDate(mockMember.validUntil)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className="bg-green-500 text-white self-start">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {mockMember.status}
                </Badge>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dependents</p>
                  <p className="text-2xl font-bold text-gray-900">{mockMember.dependents}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Claims</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Claims This Year</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Days Until Renewal</p>
                  <p className="text-2xl font-bold text-gray-900">30</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Benefits Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Used this year</span>
                <span className="font-medium text-gray-900">
                  ${mockMember.benefits.used.toLocaleString()} / ${mockMember.benefits.total.toLocaleString()}
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${benefitPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{benefitPercentage.toFixed(1)}% used</span>
                <span className="text-green-600 font-medium">
                  ${(mockMember.benefits.total - mockMember.benefits.used).toLocaleString()} remaining
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              {[
                { name: "GP Visits", used: 8, total: 12 },
                { name: "Specialist", used: 2, total: 6 },
                { name: "Hospital Days", used: 0, total: 30 },
                { name: "Dental", used: 1, total: 2 },
              ].map((benefit) => (
                <div key={benefit.name} className="text-center p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">{benefit.name}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {benefit.used}/{benefit.total}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Claims */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Claims</CardTitle>
              <Link href="/portal/claims">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{claim.type}</p>
                        <p className="text-sm text-gray-500">{formatDate(claim.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${claim.amount}</p>
                      <Badge
                        variant={claim.status === "APPROVED" ? "success" : "warning"}
                      >
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/portal/claims/new">
                <Button variant="outline" className="w-full mt-4">
                  <Heart className="h-4 w-4 mr-2" />
                  Submit New Claim
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.type === "warning"
                        ? "bg-yellow-50 border-yellow-200"
                        : notification.type === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.type === "warning" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(notification.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FileText, label: "New Application", href: "/apply", color: "blue" },
                { icon: Heart, label: "Submit Claim", href: "/portal/claims/new", color: "red" },
                { icon: User, label: "Add Dependent", href: "/portal/profile/dependents", color: "green" },
                { icon: Phone, label: "Contact Support", href: "/portal/support", color: "purple" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center cursor-pointer">
                    <div className={`h-12 w-12 rounded-lg bg-${action.color}-50 flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  )
}
