"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { formatDate, statusColors, getStatusLabel, priorityColors } from "@/lib/utils"

// Mock data
const mockApplications = [
  {
    id: "APP-2024-001",
    applicant: { name: "John Smith", email: "john.smith@email.com" },
    type: "NEW_MEMBERSHIP",
    status: "SUBMITTED",
    priority: "NORMAL",
    package: "Quest Premium",
    submittedAt: new Date("2024-01-15"),
    assignedTo: "Sarah Admin",
  },
  {
    id: "APP-2024-002",
    applicant: { name: "Sarah Johnson", email: "sarah.j@email.com" },
    type: "ADD_DEPENDENT",
    status: "UNDER_REVIEW",
    priority: "HIGH",
    package: "Quest Excellence",
    submittedAt: new Date("2024-01-14"),
    assignedTo: "Mike Reviewer",
  },
  {
    id: "APP-2024-003",
    applicant: { name: "Michael Brown", email: "m.brown@email.com" },
    type: "CHANGE_PACKAGE",
    status: "PENDING_DOCUMENTS",
    priority: "NORMAL",
    package: "Quest Standard",
    submittedAt: new Date("2024-01-13"),
    assignedTo: null,
  },
  {
    id: "APP-2024-004",
    applicant: { name: "Emily Davis", email: "emily.d@email.com" },
    type: "NEW_MEMBERSHIP",
    status: "APPROVED",
    priority: "NORMAL",
    package: "Quest Access",
    submittedAt: new Date("2024-01-12"),
    assignedTo: "Sarah Admin",
  },
  {
    id: "APP-2024-005",
    applicant: { name: "David Wilson", email: "d.wilson@email.com" },
    type: "CHANGE_BANKING",
    status: "REJECTED",
    priority: "LOW",
    package: "Quest Premium Plus",
    submittedAt: new Date("2024-01-11"),
    assignedTo: "Mike Reviewer",
  },
  {
    id: "APP-2024-006",
    applicant: { name: "Lisa Anderson", email: "lisa.a@email.com" },
    type: "NEW_MEMBERSHIP",
    status: "SUBMITTED",
    priority: "URGENT",
    package: "Quest Premium",
    submittedAt: new Date("2024-01-10"),
    assignedTo: null,
  },
  {
    id: "APP-2024-007",
    applicant: { name: "Robert Taylor", email: "r.taylor@email.com" },
    type: "REMOVE_DEPENDENT",
    status: "UNDER_REVIEW",
    priority: "NORMAL",
    package: "Quest Excellence",
    submittedAt: new Date("2024-01-09"),
    assignedTo: "Sarah Admin",
  },
  {
    id: "APP-2024-008",
    applicant: { name: "Jennifer Martinez", email: "j.martinez@email.com" },
    type: "CANCELLATION",
    status: "PENDING_DOCUMENTS",
    priority: "HIGH",
    package: "Quest Standard",
    submittedAt: new Date("2024-01-08"),
    assignedTo: "Mike Reviewer",
  },
]

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "PENDING_DOCUMENTS", label: "Pending Documents" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
]

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "NEW_MEMBERSHIP", label: "New Membership" },
  { value: "ADD_DEPENDENT", label: "Add Dependent" },
  { value: "REMOVE_DEPENDENT", label: "Remove Dependent" },
  { value: "CHANGE_PACKAGE", label: "Change Package" },
  { value: "CHANGE_BANKING", label: "Change Banking" },
  { value: "CANCELLATION", label: "Cancellation" },
]

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || app.status === statusFilter
    const matchesType = !typeFilter || app.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([])
    } else {
      setSelectedApplications(filteredApplications.map((app) => app.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "destructive"
      case "UNDER_REVIEW":
        return "warning"
      case "PENDING_DOCUMENTS":
        return "orange"
      default:
        return "default"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive"
      case "HIGH":
        return "warning"
      case "LOW":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <DashboardLayout title="Applications" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            <p className="text-gray-500">Manage membership applications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/applications/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: mockApplications.length, color: "blue" },
            {
              label: "Pending Review",
              value: mockApplications.filter(
                (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW"
              ).length,
              color: "yellow",
            },
            {
              label: "Approved",
              value: mockApplications.filter((a) => a.status === "APPROVED").length,
              color: "green",
            },
            {
              label: "Rejected",
              value: mockApplications.filter((a) => a.status === "REJECTED").length,
              color: "red",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-40"
                />
                <Select
                  options={typeOptions}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-48"
                />
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {selectedApplications.length > 0 && (
              <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  {selectedApplications.length} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    Assign
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedApplications.length === filteredApplications.length &&
                      filteredApplications.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {app.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{app.applicant.name}</p>
                      <p className="text-sm text-gray-500">{app.applicant.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {getStatusLabel(app.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{app.package}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(app.priority)}>
                      {app.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(app.submittedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/applications/${app.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {filteredApplications.length} of {mockApplications.length}{" "}
              applications
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
