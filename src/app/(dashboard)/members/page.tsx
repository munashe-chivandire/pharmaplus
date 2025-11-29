"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Download,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

const mockMembers = [
  {
    id: "MEM-2024-001",
    membershipNumber: "QV-2024-001234",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+27 82 123 4567",
    package: "Quest Premium",
    status: "ACTIVE",
    dependents: 2,
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "MEM-2024-002",
    membershipNumber: "QV-2024-001235",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+27 83 234 5678",
    package: "Quest Excellence",
    status: "ACTIVE",
    dependents: 3,
    joinedAt: new Date("2024-01-10"),
  },
  {
    id: "MEM-2024-003",
    membershipNumber: "QV-2024-001236",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+27 84 345 6789",
    package: "Quest Standard",
    status: "PENDING",
    dependents: 1,
    joinedAt: new Date("2024-01-08"),
  },
  {
    id: "MEM-2024-004",
    membershipNumber: "QV-2024-001237",
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+27 85 456 7890",
    package: "Quest Access",
    status: "ACTIVE",
    dependents: 0,
    joinedAt: new Date("2024-01-05"),
  },
  {
    id: "MEM-2024-005",
    membershipNumber: "QV-2024-001238",
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "+27 86 567 8901",
    package: "Quest Premium Plus",
    status: "SUSPENDED",
    dependents: 2,
    joinedAt: new Date("2023-12-20"),
  },
  {
    id: "MEM-2024-006",
    membershipNumber: "QV-2024-001239",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+27 87 678 9012",
    package: "Quest Premium",
    status: "ACTIVE",
    dependents: 1,
    joinedAt: new Date("2023-12-15"),
  },
]

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || member.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "PENDING":
        return "warning"
      case "SUSPENDED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout title="Members" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Members</h2>
            <p className="text-gray-500">Manage your medical scheme members</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/members/new">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: 8456, icon: Users, color: "blue" },
            { label: "Active", value: 7890, icon: Users, color: "green" },
            { label: "Pending", value: 234, icon: Users, color: "yellow" },
            { label: "Suspended", value: 332, icon: Users, color: "red" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members by name, email, or membership number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Membership #</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Dependents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar fallback={member.name} size="md" />
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{member.membershipNumber}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.package}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">{member.dependents}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(member.joinedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/members/${member.id}`}>
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
              Showing {filteredMembers.length} of {mockMembers.length} members
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
