"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { MemberLayout } from "@/components/member/member-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { formatDate, formatCurrency } from "@/lib/utils"

const mockMember = {
  name: "John Smith",
  email: "john.smith@email.com",
  membershipNumber: "QV-2024-001234",
  package: "Quest Premium",
  status: "Active",
}

const mockClaims = [
  {
    id: "CLM-2024-001",
    type: "GP Consultation",
    provider: "Dr. Sarah Johnson",
    date: new Date("2024-01-15"),
    amount: 850,
    approvedAmount: 850,
    status: "APPROVED",
    submittedAt: new Date("2024-01-15"),
    processedAt: new Date("2024-01-17"),
  },
  {
    id: "CLM-2024-002",
    type: "Prescription",
    provider: "MedPharm Pharmacy",
    date: new Date("2024-01-14"),
    amount: 1250,
    approvedAmount: null,
    status: "PENDING",
    submittedAt: new Date("2024-01-14"),
    processedAt: null,
  },
  {
    id: "CLM-2024-003",
    type: "Specialist Consultation",
    provider: "Dr. Michael Brown - Cardiologist",
    date: new Date("2024-01-10"),
    amount: 2500,
    approvedAmount: 2000,
    status: "PARTIALLY_APPROVED",
    submittedAt: new Date("2024-01-10"),
    processedAt: new Date("2024-01-12"),
  },
  {
    id: "CLM-2024-004",
    type: "Lab Tests",
    provider: "PathCare Laboratory",
    date: new Date("2024-01-08"),
    amount: 3500,
    approvedAmount: 0,
    status: "REJECTED",
    submittedAt: new Date("2024-01-08"),
    processedAt: new Date("2024-01-10"),
    rejectionReason: "Service not covered under current plan",
  },
  {
    id: "CLM-2024-005",
    type: "Dental Checkup",
    provider: "Smile Dental Clinic",
    date: new Date("2024-01-05"),
    amount: 600,
    approvedAmount: 600,
    status: "APPROVED",
    submittedAt: new Date("2024-01-05"),
    processedAt: new Date("2024-01-06"),
  },
]

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedClaim, setSelectedClaim] = useState<typeof mockClaims[0] | null>(null)

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || claim.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "PARTIALLY_APPROVED":
        return <Badge variant="orange">Partial</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "PARTIALLY_APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Calculate stats
  const stats = {
    total: mockClaims.length,
    pending: mockClaims.filter((c) => c.status === "PENDING").length,
    approved: mockClaims.filter((c) => c.status === "APPROVED" || c.status === "PARTIALLY_APPROVED").length,
    rejected: mockClaims.filter((c) => c.status === "REJECTED").length,
    totalAmount: mockClaims.reduce((sum, c) => sum + c.amount, 0),
    approvedAmount: mockClaims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
  }

  return (
    <MemberLayout member={mockMember}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
            <p className="text-gray-500">View and manage your medical claims</p>
          </div>
          <Link href="/portal/claims/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit New Claim
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Heart className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Approved</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.approvedAmount.toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  of ${stats.totalAmount.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="PARTIALLY_APPROVED">Partially Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Claims List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        {getStatusIcon(claim.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{claim.type}</p>
                          {getStatusBadge(claim.status)}
                        </div>
                        <p className="text-sm text-gray-500">{claim.provider}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(claim.date)} • {claim.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${claim.amount.toLocaleString()}</p>
                      {claim.approvedAmount !== null && claim.approvedAmount !== claim.amount && (
                        <p className="text-sm text-green-600">
                          Approved: ${claim.approvedAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredClaims.length === 0 && (
                <div className="p-12 text-center">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No claims found</p>
                  <Link href="/portal/claims/new">
                    <Button className="mt-4">Submit Your First Claim</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredClaims.length} of {mockClaims.length} claims
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Claim Detail Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title={`Claim ${selectedClaim?.id}`}
        size="lg"
      >
        {selectedClaim && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedClaim.type}</h3>
                <p className="text-gray-500">{selectedClaim.provider}</p>
              </div>
              {getStatusBadge(selectedClaim.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Claimed Amount</p>
                <p className="text-xl font-bold">${selectedClaim.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Approved Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ${(selectedClaim.approvedAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Service Date</span>
                <span className="font-medium">{formatDate(selectedClaim.date)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Submitted</span>
                <span className="font-medium">{formatDate(selectedClaim.submittedAt)}</span>
              </div>
              {selectedClaim.processedAt && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Processed</span>
                  <span className="font-medium">{formatDate(selectedClaim.processedAt)}</span>
                </div>
              )}
            </div>

            {selectedClaim.status === "REJECTED" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                <p className="text-sm text-red-700 mt-1">
                  {(selectedClaim as any).rejectionReason || "No reason provided"}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              {selectedClaim.status === "REJECTED" && (
                <Button className="flex-1">Appeal Decision</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </MemberLayout>
  )
}
