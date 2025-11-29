"use client"

import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatsCard } from "@/components/ui/stats-card"
import { Select } from "@/components/ui/select"

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

const mockMonthlyData = [
  { month: "Jan", applications: 120, approvals: 98, revenue: 245000 },
  { month: "Feb", applications: 150, approvals: 125, revenue: 312500 },
  { month: "Mar", applications: 180, approvals: 160, revenue: 400000 },
  { month: "Apr", applications: 140, approvals: 120, revenue: 300000 },
  { month: "May", applications: 200, approvals: 175, revenue: 437500 },
  { month: "Jun", applications: 220, approvals: 195, revenue: 487500 },
]

const mockPackageDistribution = [
  { name: "Quest Access", members: 2500, percentage: 29.5 },
  { name: "Quest Standard", members: 2000, percentage: 23.6 },
  { name: "Quest Premium", members: 2200, percentage: 26.0 },
  { name: "Quest Premium Plus", members: 1200, percentage: 14.2 },
  { name: "Quest Excellence", members: 556, percentage: 6.7 },
]

const mockTopReasons = [
  { reason: "New Membership", count: 450, percentage: 45 },
  { reason: "Add Dependent", count: 200, percentage: 20 },
  { reason: "Change Package", count: 150, percentage: 15 },
  { reason: "Change Banking", count: 100, percentage: 10 },
  { reason: "Other", count: 100, percentage: 10 },
]

export default function AnalyticsPage() {
  const maxApprovals = Math.max(...mockMonthlyData.map((d) => d.approvals))

  return (
    <DashboardLayout title="Analytics" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-500">
              Insights and metrics for your medical scheme
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
                { value: "1y", label: "Last year" },
              ]}
              className="w-40"
            />
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value="$2.18M"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            description="vs last month"
          />
          <StatsCard
            title="New Members"
            value="1,234"
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            description="vs last month"
          />
          <StatsCard
            title="Applications"
            value="1,890"
            icon={FileText}
            trend={{ value: 15.3, isPositive: true }}
            description="vs last month"
          />
          <StatsCard
            title="Avg. Processing Time"
            value="2.4 days"
            icon={Clock}
            trend={{ value: 18.5, isPositive: true }}
            description="faster than before"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Applications Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {mockMonthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 justify-center items-end h-48">
                      <div
                        className="flex-1 max-w-8 bg-blue-200 rounded-t transition-all hover:bg-blue-300"
                        style={{ height: `${(data.applications / 220) * 100}%` }}
                        title={`Applications: ${data.applications}`}
                      />
                      <div
                        className="flex-1 max-w-8 bg-green-500 rounded-t transition-all hover:bg-green-600"
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
                  <div className="h-3 w-3 rounded bg-blue-200" />
                  <span className="text-sm text-gray-600">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  <span className="text-sm text-gray-600">Approvals</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-4">
                {mockMonthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-48 flex items-end justify-center">
                      <div
                        className="w-full max-w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
                        style={{ height: `${(data.revenue / 500000) * 100}%` }}
                        title={`Revenue: $${(data.revenue / 1000).toFixed(0)}K`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue (6 months)</p>
                  <p className="text-xl font-bold text-gray-900">$2,182,500</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+18.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Package Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Package Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPackageDistribution.map((pkg, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{pkg.name}</span>
                      <span className="font-medium text-gray-900">
                        {pkg.members.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${pkg.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{pkg.percentage}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Types */}
          <Card>
            <CardHeader>
              <CardTitle>Application Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopReasons.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-900">{item.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Growth Alert
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Membership grew by 12% this month, the highest in 6 months.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Processing
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Average processing time improved to 2.4 days from 3.1 days.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Attention
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    89 applications pending review for more than 48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Rate by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {mockMonthlyData.map((data, index) => {
                const rate = Math.round((data.approvals / data.applications) * 100)
                return (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-gray-50"
                  >
                    <p className="text-sm text-gray-500 mb-2">{data.month}</p>
                    <p
                      className={`text-2xl font-bold ${
                        rate >= 85 ? "text-green-600" : rate >= 70 ? "text-yellow-600" : "text-red-600"
                      }`}
                    >
                      {rate}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {data.approvals}/{data.applications}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
