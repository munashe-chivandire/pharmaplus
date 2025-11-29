"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/ui/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDate, statusColors, getStatusLabel } from "@/lib/utils"

// Mock data
const mockStats = {
  totalApplications: 1234,
  pendingReview: 89,
  approvedThisMonth: 156,
  activeMembers: 8456,
}

const mockRecentApplications = [
  {
    id: "APP-2024-A1B2",
    applicant: "John Smith",
    email: "john.smith@email.com",
    type: "NEW_MEMBERSHIP",
    status: "SUBMITTED",
    submittedAt: new Date("2024-01-15"),
    package: "Quest Premium",
  },
  {
    id: "APP-2024-C3D4",
    applicant: "Sarah Johnson",
    email: "sarah.j@email.com",
    type: "ADD_DEPENDENT",
    status: "UNDER_REVIEW",
    submittedAt: new Date("2024-01-14"),
    package: "Quest Excellence",
  },
  {
    id: "APP-2024-E5F6",
    applicant: "Michael Brown",
    email: "m.brown@email.com",
    type: "CHANGE_PACKAGE",
    status: "PENDING_DOCUMENTS",
    submittedAt: new Date("2024-01-13"),
    package: "Quest Standard",
  },
  {
    id: "APP-2024-G7H8",
    applicant: "Emily Davis",
    email: "emily.d@email.com",
    type: "NEW_MEMBERSHIP",
    status: "APPROVED",
    submittedAt: new Date("2024-01-12"),
    package: "Quest Access",
  },
  {
    id: "APP-2024-I9J0",
    applicant: "David Wilson",
    email: "d.wilson@email.com",
    type: "CHANGE_BANKING",
    status: "REJECTED",
    submittedAt: new Date("2024-01-11"),
    package: "Quest Premium Plus",
  },
]

const mockChartData = [
  { month: "Jan", applications: 120, approvals: 98 },
  { month: "Feb", applications: 150, approvals: 125 },
  { month: "Mar", applications: 180, approvals: 160 },
  { month: "Apr", applications: 140, approvals: 120 },
  { month: "May", applications: 200, approvals: 175 },
  { month: "Jun", applications: 220, approvals: 195 },
]

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" user={mockUser}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {mockUser.name?.split(" ")[0]}
            </h2>
            <p className="text-gray-500">
              Here&apos;s what&apos;s happening with your medical scheme today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Link href="/applications/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={mockStats.totalApplications.toLocaleString()}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            description="vs last month"
          />
          <StatsCard
            title="Pending Review"
            value={mockStats.pendingReview}
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
            description="needs attention"
          />
          <StatsCard
            title="Approved This Month"
            value={mockStats.approvedThisMonth}
            icon={CheckCircle2}
            trend={{ value: 8, isPositive: true }}
            description="vs last month"
          />
          <StatsCard
            title="Active Members"
            value={mockStats.activeMembers.toLocaleString()}
            icon={Users}
            trend={{ value: 3, isPositive: true }}
            description="total members"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Link href="/applications">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {app.applicant.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant}</p>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-gray-500">{app.package}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(app.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          app.status === "APPROVED"
                            ? "success"
                            : app.status === "REJECTED"
                            ? "destructive"
                            : app.status === "UNDER_REVIEW"
                            ? "warning"
                            : "default"
                        }
                      >
                        {getStatusLabel(app.status)}
                      </Badge>
                      <Link href={`/applications/${app.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Application Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Submitted", count: 45, color: "bg-blue-500", percentage: 35 },
                    { label: "Under Review", count: 32, color: "bg-yellow-500", percentage: 25 },
                    { label: "Approved", count: 38, color: "bg-green-500", percentage: 30 },
                    { label: "Rejected", count: 13, color: "bg-red-500", percentage: 10 },
                  ].map((status) => (
                    <div key={status.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{status.label}</span>
                        <span className="font-medium text-gray-900">{status.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${status.color} rounded-full transition-all`}
                          style={{ width: `${status.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/applications?status=SUBMITTED" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-3 text-blue-500" />
                      Review pending applications
                      <Badge className="ml-auto" variant="default">
                        {mockStats.pendingReview}
                      </Badge>
                    </Button>
                  </Link>
                  <Link href="/members/new" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-3 text-green-500" />
                      Add new member
                    </Button>
                  </Link>
                  <Link href="/analytics" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-3 text-purple-500" />
                      View analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Review 5 new applications", priority: "high" },
                    { task: "Process document uploads", priority: "medium" },
                    { task: "Send renewal reminders", priority: "low" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.priority === "high"
                            ? "bg-red-500"
                            : item.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm text-gray-700">{item.task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Trends Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4 pt-4">
              {mockChartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 justify-center items-end h-48">
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: `${(data.applications / 220) * 100}%` }}
                      title={`Applications: ${data.applications}`}
                    />
                    <div
                      className="w-4 bg-green-500 rounded-t"
                      style={{ height: `${(data.approvals / 220) * 100}%` }}
                      title={`Approvals: ${data.approvals}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-500" />
                <span className="text-sm text-gray-600">Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span className="text-sm text-gray-600">Approvals</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
