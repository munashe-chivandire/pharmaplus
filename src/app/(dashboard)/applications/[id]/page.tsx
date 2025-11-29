"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Paperclip,
  User,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  UserPlus,
  Edit,
  Printer,
  Download,
  Send,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Modal } from "@/components/ui/modal"
import { formatDate, formatDateTime, getStatusLabel } from "@/lib/utils"

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

// Mock application data
const mockApplication = {
  id: "APP-2024-001",
  applicationNumber: "APP-2024-001",
  status: "UNDER_REVIEW",
  priority: "NORMAL",
  type: "NEW_MEMBERSHIP",
  submittedAt: new Date("2024-01-15T10:30:00"),
  createdAt: new Date("2024-01-14T09:00:00"),

  // Member Details
  member: {
    title: "Mr",
    firstName: "John",
    surname: "Smith",
    dateOfBirth: new Date("1985-06-15"),
    idNumber: "8506155123456",
    email: "john.smith@email.com",
    phoneNumber: "+27 82 123 4567",
    physicalAddress: "123 Main Street, Sandton, Johannesburg, 2196",
    postalAddress: "PO Box 1234, Sandton, 2196",
    ethnicGroup: "African",
    employerName: "Tech Solutions Ltd",
    occupation: "Software Engineer",
  },

  // Package
  package: {
    name: "Quest Premium",
    monthlyPremium: 2500,
  },

  // Banking
  banking: {
    bankName: "First National Bank",
    accountNumber: "****4567",
    branchCode: "250655",
    accountType: "Cheque",
  },

  // Dependents
  dependents: [
    {
      id: "dep-1",
      title: "Mrs",
      firstName: "Jane",
      surname: "Smith",
      relationship: "Spouse",
      dateOfBirth: new Date("1987-03-20"),
      idNumber: "8703200123456",
      type: "ADULT",
    },
    {
      id: "dep-2",
      title: "",
      firstName: "James",
      surname: "Smith",
      relationship: "Child",
      dateOfBirth: new Date("2015-09-10"),
      idNumber: "1509105123456",
      type: "CHILD",
    },
  ],

  // Medical History
  medicalHistory: {
    hasPreExistingConditions: true,
    conditions: [
      {
        name: "Hypertension",
        diagnosedDate: "2020-01",
        currentlyTreating: true,
        medication: "Amlodipine 5mg",
      },
    ],
  },

  // Documents
  documents: [
    { name: "ID Document", status: "verified", uploadedAt: new Date("2024-01-14") },
    { name: "Proof of Address", status: "verified", uploadedAt: new Date("2024-01-14") },
    { name: "Proof of Income", status: "pending", uploadedAt: new Date("2024-01-14") },
  ],

  // Activity/Timeline
  actions: [
    {
      id: "act-1",
      action: "Application submitted",
      user: "John Smith",
      timestamp: new Date("2024-01-15T10:30:00"),
      notes: null,
    },
    {
      id: "act-2",
      action: "Assigned for review",
      user: "System",
      timestamp: new Date("2024-01-15T10:31:00"),
      notes: "Auto-assigned to Sarah Admin",
    },
    {
      id: "act-3",
      action: "Documents verified",
      user: "Sarah Admin",
      timestamp: new Date("2024-01-15T14:00:00"),
      notes: "ID and address documents verified. Awaiting proof of income.",
    },
  ],

  // Assignment
  assignedTo: {
    name: "Sarah Admin",
    email: "sarah@questvitality.com",
  },
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [notes, setNotes] = useState("")

  const handleApprove = () => {
    // API call to approve
    setShowApproveModal(false)
    router.push("/applications")
  }

  const handleReject = () => {
    // API call to reject
    setShowRejectModal(false)
    router.push("/applications")
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

  return (
    <DashboardLayout title="Application Details" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/applications">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {mockApplication.applicationNumber}
                </h1>
                <Badge variant={getStatusBadgeVariant(mockApplication.status)}>
                  {getStatusLabel(mockApplication.status)}
                </Badge>
              </div>
              <p className="text-gray-500">
                Submitted on {formatDateTime(mockApplication.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {mockApplication.status === "UNDER_REVIEW" && (
              <>
                <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="success" onClick={() => setShowApproveModal(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.member.title} {mockApplication.member.firstName}{" "}
                      {mockApplication.member.surname}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">ID Number</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.member.idNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <p className="font-medium text-gray-900">
                      {formatDate(mockApplication.member.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ethnic Group</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.member.ethnicGroup}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">
                        {mockApplication.member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium text-gray-900">
                        {mockApplication.member.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="text-sm text-gray-500">Physical Address</label>
                      <p className="font-medium text-gray-900">
                        {mockApplication.member.physicalAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Employer</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.member.employerName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Occupation</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.member.occupation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  Banking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Bank Name</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.banking.bankName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Number</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.banking.accountNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Branch Code</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.banking.branchCode}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Type</label>
                    <p className="font-medium text-gray-900">
                      {mockApplication.banking.accountType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dependents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-cyan-500" />
                  Dependents ({mockApplication.dependents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplication.dependents.map((dep) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar fallback={dep.firstName} size="md" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {dep.title} {dep.firstName} {dep.surname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dep.relationship} | {formatDate(dep.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={dep.type === "ADULT" ? "default" : "secondary"}>
                        {dep.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockApplication.medicalHistory.hasPreExistingConditions ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium">
                        Pre-existing conditions declared
                      </p>
                    </div>
                    {mockApplication.medicalHistory.conditions.map((condition, i) => (
                      <div key={i} className="p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-500">Condition</label>
                            <p className="font-medium text-gray-900">{condition.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Diagnosed</label>
                            <p className="font-medium text-gray-900">
                              {condition.diagnosedDate}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Medication</label>
                            <p className="font-medium text-gray-900">
                              {condition.medication}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Status</label>
                            <Badge
                              variant={
                                condition.currentlyTreating ? "warning" : "success"
                              }
                            >
                              {condition.currentlyTreating
                                ? "Currently Treating"
                                : "Resolved"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      No pre-existing conditions declared
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Info */}
            <Card>
              <CardHeader>
                <CardTitle>Package Selected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">
                    {mockApplication.package.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    R{mockApplication.package.monthlyPremium.toLocaleString()}
                    <span className="text-sm font-normal text-blue-500">/month</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar
                    fallback={mockApplication.assignedTo.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {mockApplication.assignedTo.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {mockApplication.assignedTo.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockApplication.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {doc.name}
                        </span>
                      </div>
                      <Badge
                        variant={doc.status === "verified" ? "success" : "warning"}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Request Documents
                </Button>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplication.actions.map((action, i) => (
                    <div key={action.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        </div>
                        {i < mockApplication.actions.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          {action.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {action.user} • {formatDateTime(action.timestamp)}
                        </p>
                        {action.notes && (
                          <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                            {action.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Note */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Textarea
                    placeholder="Add a note..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mb-2"
                  />
                  <Button size="sm" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Application"
        description="Are you sure you want to approve this application?"
      >
        <div className="space-y-4">
          <Textarea
            label="Notes (optional)"
            placeholder="Add any notes for approval..."
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Application"
        description="Please provide a reason for rejection."
      >
        <div className="space-y-4">
          <Textarea
            label="Rejection Reason"
            placeholder="Enter the reason for rejection..."
            required
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
