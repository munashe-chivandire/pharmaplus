"use client"

import { useState } from "react"
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Upload,
  Key,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <DashboardLayout title="Settings" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:w-64 h-fit">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar fallback={mockUser.name} size="xl" />
                      <div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        defaultValue={mockUser.name}
                        placeholder="Enter your name"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        defaultValue={mockUser.email}
                        placeholder="Enter your email"
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                      <Input
                        label="Job Title"
                        placeholder="Enter your job title"
                        defaultValue="Administrator"
                      />
                    </div>

                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      className="h-24"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}

            {activeTab === "organization" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-blue-600" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 200x200px PNG or SVG
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Organization Name"
                        defaultValue={mockUser.organizationName}
                        placeholder="Enter organization name"
                      />
                      <Input
                        label="Website"
                        type="url"
                        placeholder="https://example.com"
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="contact@example.com"
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <Textarea
                      label="Address"
                      placeholder="Enter your organization's address..."
                      className="h-20"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Branding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            defaultValue="#2563eb"
                            className="h-10 w-20 rounded cursor-pointer"
                          />
                          <Input defaultValue="#2563eb" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            defaultValue="#1e40af"
                            className="h-10 w-20 rounded cursor-pointer"
                          />
                          <Input defaultValue="#1e40af" className="flex-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "New Applications",
                        description: "Receive an email when a new application is submitted",
                        enabled: true,
                      },
                      {
                        title: "Application Status Updates",
                        description: "Get notified when application status changes",
                        enabled: true,
                      },
                      {
                        title: "Member Activity",
                        description: "Notifications about member updates and changes",
                        enabled: false,
                      },
                      {
                        title: "Weekly Reports",
                        description: "Receive weekly summary reports via email",
                        enabled: true,
                      },
                      {
                        title: "System Alerts",
                        description: "Important system updates and maintenance notices",
                        enabled: true,
                      },
                    ].map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={notification.enabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                    <Button>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          device: "Chrome on MacOS",
                          location: "Johannesburg, South Africa",
                          current: true,
                        },
                        {
                          device: "Safari on iPhone",
                          location: "Cape Town, South Africa",
                          current: false,
                        },
                      ].map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {session.location}
                              </p>
                            </div>
                          </div>
                          {!session.current && (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", active: true },
                        { id: "dark", label: "Dark", active: false },
                        { id: "system", label: "System", active: false },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            theme.active
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`h-16 rounded mb-3 ${
                              theme.id === "dark"
                                ? "bg-gray-800"
                                : theme.id === "system"
                                ? "bg-gradient-to-r from-white to-gray-800"
                                : "bg-white border border-gray-200"
                            }`}
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {theme.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} isLoading={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
