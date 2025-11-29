"use client"

import { useState } from "react"
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Download,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Receipt,
  Zap,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { formatDate, formatCurrency } from "@/lib/utils"

const mockUser = {
  name: "Admin User",
  email: "admin@pharmplus.com",
  organizationName: "Quest Vitality",
  role: "ADMIN",
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    priceUSD: 99,
    priceZWL: 2500,
    description: "Perfect for small medical schemes",
    features: [
      "Up to 500 members",
      "Application management",
      "Member portal",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    priceUSD: 299,
    priceZWL: 7500,
    description: "For growing organizations",
    features: [
      "Up to 5,000 members",
      "Everything in Starter",
      "Advanced workflows",
      "Custom branding",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceUSD: 599,
    priceZWL: 15000,
    description: "For large organizations",
    features: [
      "Unlimited members",
      "Everything in Professional",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "On-premise option",
    ],
    popular: false,
  },
]

const paymentMethods = [
  {
    id: "ecocash",
    name: "EcoCash",
    icon: Smartphone,
    description: "Pay with EcoCash mobile money",
    color: "green",
  },
  {
    id: "onemoney",
    name: "OneMoney",
    icon: Smartphone,
    description: "Pay with OneMoney mobile money",
    color: "red",
  },
  {
    id: "innbucks",
    name: "InnBucks",
    icon: Smartphone,
    description: "Pay with InnBucks wallet",
    color: "blue",
  },
  {
    id: "visa",
    name: "Visa",
    icon: CreditCard,
    description: "Pay with Visa debit/credit card",
    color: "blue",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    icon: CreditCard,
    description: "Pay with Mastercard debit/credit card",
    color: "orange",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building2,
    description: "Pay via direct bank transfer",
    color: "gray",
  },
]

const mockInvoices = [
  {
    id: "INV-2024-001",
    date: new Date("2024-01-15"),
    amount: 299,
    currency: "USD",
    status: "PAID",
    method: "EcoCash",
  },
  {
    id: "INV-2023-012",
    date: new Date("2023-12-15"),
    amount: 299,
    currency: "USD",
    status: "PAID",
    method: "Visa",
  },
  {
    id: "INV-2023-011",
    date: new Date("2023-11-15"),
    amount: 299,
    currency: "USD",
    status: "PAID",
    method: "Bank Transfer",
  },
]

export default function BillingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [currency, setCurrency] = useState<"USD" | "ZWL">("USD")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const currentPlan = plans[1] // Professional plan

  const handleUpgrade = (plan: typeof plans[0]) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing with Paynow
    setTimeout(() => {
      setIsProcessing(false)
      setShowPaymentModal(false)
      // Show success message
    }, 2000)
  }

  return (
    <DashboardLayout title="Billing" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
            <p className="text-gray-500">Manage your subscription and payment methods</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrency(currency === "USD" ? "ZWL" : "USD")}>
              {currency === "USD" ? "Show ZWL" : "Show USD"}
            </Button>
          </div>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentPlan.name} Plan
                    </h3>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-gray-500">
                    {currency === "USD"
                      ? `$${currentPlan.priceUSD}/month`
                      : `ZWL ${currentPlan.priceZWL.toLocaleString()}/month`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Next billing date</p>
                  <p className="font-medium text-gray-900">February 15, 2024</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Members</span>
                    <span className="font-medium text-gray-900">2,456 / 5,000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "49%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Applications</span>
                    <span className="font-medium text-gray-900">890 / Unlimited</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Storage</span>
                    <span className="font-medium text-gray-900">4.2 GB / 10 GB</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button variant="outline" size="sm">
              Add Method
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">EcoCash</p>
                    <p className="text-sm text-gray-500">+263 77 123 4567</p>
                  </div>
                </div>
                <Badge variant="default">Default</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Visa •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Set Default</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-2 border-blue-500 shadow-lg" : ""
                } ${plan.id === currentPlan.id ? "bg-blue-50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {currency === "USD" ? `$${plan.priceUSD}` : `ZWL ${plan.priceZWL.toLocaleString()}`}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    variant={plan.id === currentPlan.id ? "outline" : "default"}
                    onClick={() => plan.id !== currentPlan.id && handleUpgrade(plan)}
                    disabled={plan.id === currentPlan.id}
                  >
                    {plan.id === currentPlan.id ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Billing History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(invoice.date)} • {invoice.method}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${invoice.amount} {invoice.currency}
                      </p>
                      <Badge variant="success" className="mt-1">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Payment"
        description={`Upgrade to ${selectedPlan?.name} plan`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{selectedPlan?.name} Plan</p>
                <p className="text-sm text-gray-500">Monthly subscription</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {currency === "USD"
                    ? `$${selectedPlan?.priceUSD}`
                    : `ZWL ${selectedPlan?.priceZWL?.toLocaleString()}`
                  }
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex gap-2">
            <Button
              variant={currency === "USD" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency("USD")}
            >
              USD
            </Button>
            <Button
              variant={currency === "ZWL" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency("ZWL")}
            >
              ZWL
            </Button>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg bg-${method.color}-100 flex items-center justify-center`}>
                    <method.icon className={`h-5 w-5 text-${method.color}-600`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number for Mobile Money */}
          {["ecocash", "onemoney", "innbucks"].includes(selectedPaymentMethod) && (
            <Input
              label="Mobile Number"
              placeholder="e.g., 0771234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          )}

          {/* Card Details for Visa/Mastercard */}
          {["visa", "mastercard"].includes(selectedPaymentMethod) && (
            <div className="space-y-4">
              <Input label="Card Number" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVV" placeholder="123" />
              </div>
              <Input label="Cardholder Name" placeholder="Name on card" />
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {selectedPaymentMethod === "bank" && (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Bank:</span> <span className="font-medium">CBZ Bank</span></p>
                <p><span className="text-gray-500">Account Name:</span> <span className="font-medium">PharmPlus Ltd</span></p>
                <p><span className="text-gray-500">Account Number:</span> <span className="font-medium">12345678901234</span></p>
                <p><span className="text-gray-500">Branch:</span> <span className="font-medium">Harare</span></p>
                <p><span className="text-gray-500">Reference:</span> <span className="font-medium">{mockUser.organizationName}</span></p>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Please use your organization name as the payment reference.
                Your subscription will be activated within 24 hours of payment confirmation.
              </p>
            </div>
          )}

          {/* Paynow Info */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Powered by Paynow Zimbabwe</p>
              <p>Your payment is processed securely through Paynow payment gateway.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              isLoading={isProcessing}
              disabled={!selectedPaymentMethod}
            >
              {selectedPaymentMethod === "bank"
                ? "I've Made the Transfer"
                : `Pay ${currency === "USD" ? `$${selectedPlan?.priceUSD}` : `ZWL ${selectedPlan?.priceZWL?.toLocaleString()}`}`
              }
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
