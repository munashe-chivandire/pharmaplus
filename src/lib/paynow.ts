/**
 * Paynow Zimbabwe Payment Integration
 * Documentation: https://developers.paynow.co.zw/
 */

interface PaynowConfig {
  integrationId: string
  integrationKey: string
  resultUrl: string
  returnUrl: string
}

interface PaymentRequest {
  reference: string
  email: string
  amount: number
  additionalInfo?: string
  method?: "ecocash" | "onemoney" | "innbucks" | "visa" | "mastercard"
  phone?: string
}

interface PaynowResponse {
  success: boolean
  hasRedirect: boolean
  redirectUrl?: string
  pollUrl?: string
  error?: string
  instructions?: string
}

interface PaymentStatus {
  paid: boolean
  status: string
  amount: number
  reference: string
  paynowReference?: string
}

const PAYNOW_BASE_URL = "https://www.paynow.co.zw/interface"

export class PaynowClient {
  private config: PaynowConfig

  constructor(config: PaynowConfig) {
    this.config = config
  }

  /**
   * Generate hash for Paynow request
   */
  private generateHash(values: string[]): string {
    const crypto = require("crypto")
    const concat = values.join("") + this.config.integrationKey
    return crypto.createHash("sha512").update(concat).digest("hex").toUpperCase()
  }

  /**
   * Parse Paynow response
   */
  private parseResponse(response: string): Record<string, string> {
    const result: Record<string, string> = {}
    response.split("&").forEach((pair) => {
      const [key, value] = pair.split("=")
      if (key && value) {
        result[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    })
    return result
  }

  /**
   * Create a standard web payment
   */
  async createPayment(payment: PaymentRequest): Promise<PaynowResponse> {
    try {
      const values = [
        this.config.resultUrl,
        this.config.returnUrl,
        payment.reference,
        payment.amount.toFixed(2),
        payment.email,
        payment.additionalInfo || "",
        "Message", // authemail field
        "Active", // status
      ]

      const hash = this.generateHash([
        this.config.integrationId,
        ...values,
      ])

      const formData = new URLSearchParams({
        id: this.config.integrationId,
        reference: payment.reference,
        amount: payment.amount.toFixed(2),
        additionalinfo: payment.additionalInfo || "",
        returnurl: this.config.returnUrl,
        resulturl: this.config.resultUrl,
        authemail: payment.email,
        status: "Message",
        hash,
      })

      const response = await fetch(`${PAYNOW_BASE_URL}/initiatetransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const text = await response.text()
      const data = this.parseResponse(text)

      if (data.status === "Ok") {
        return {
          success: true,
          hasRedirect: true,
          redirectUrl: data.browserurl,
          pollUrl: data.pollurl,
        }
      } else {
        return {
          success: false,
          hasRedirect: false,
          error: data.error || "Payment initialization failed",
        }
      }
    } catch (error) {
      console.error("Paynow payment error:", error)
      return {
        success: false,
        hasRedirect: false,
        error: "Failed to connect to Paynow",
      }
    }
  }

  /**
   * Create a mobile money payment (EcoCash, OneMoney)
   */
  async createMobilePayment(
    payment: PaymentRequest & { phone: string; method: "ecocash" | "onemoney" }
  ): Promise<PaynowResponse> {
    try {
      const values = [
        this.config.resultUrl,
        this.config.returnUrl,
        payment.reference,
        payment.amount.toFixed(2),
        payment.email,
        payment.additionalInfo || "",
        "Message",
        "Active",
        payment.phone,
        payment.method,
      ]

      const hash = this.generateHash([
        this.config.integrationId,
        ...values,
      ])

      const formData = new URLSearchParams({
        id: this.config.integrationId,
        reference: payment.reference,
        amount: payment.amount.toFixed(2),
        additionalinfo: payment.additionalInfo || "",
        returnurl: this.config.returnUrl,
        resulturl: this.config.resultUrl,
        authemail: payment.email,
        phone: payment.phone,
        method: payment.method,
        status: "Message",
        hash,
      })

      const response = await fetch(`${PAYNOW_BASE_URL}/remotetransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const text = await response.text()
      const data = this.parseResponse(text)

      if (data.status === "Ok") {
        return {
          success: true,
          hasRedirect: false,
          pollUrl: data.pollurl,
          instructions: data.instructions || `Please check your ${payment.method} phone for payment prompt`,
        }
      } else {
        return {
          success: false,
          hasRedirect: false,
          error: data.error || "Mobile payment initialization failed",
        }
      }
    } catch (error) {
      console.error("Paynow mobile payment error:", error)
      return {
        success: false,
        hasRedirect: false,
        error: "Failed to connect to Paynow",
      }
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(pollUrl: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(pollUrl)
      const text = await response.text()
      const data = this.parseResponse(text)

      return {
        paid: data.status === "Paid",
        status: data.status || "Unknown",
        amount: parseFloat(data.amount || "0"),
        reference: data.reference || "",
        paynowReference: data.paynowreference,
      }
    } catch (error) {
      console.error("Paynow status check error:", error)
      return {
        paid: false,
        status: "Error",
        amount: 0,
        reference: "",
      }
    }
  }
}

// Export singleton instance
export const paynow = new PaynowClient({
  integrationId: process.env.PAYNOW_INTEGRATION_ID || "",
  integrationKey: process.env.PAYNOW_INTEGRATION_KEY || "",
  resultUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paynow`,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?payment=success`,
})

// Helper function to format ZWL currency
export function formatZWL(amount: number): string {
  return new Intl.NumberFormat("en-ZW", {
    style: "currency",
    currency: "ZWL",
    minimumFractionDigits: 2,
  }).format(amount)
}

// Helper function to convert USD to ZWL (you'd typically get this from an API)
export function convertUSDtoZWL(usdAmount: number, rate: number = 25): number {
  return usdAmount * rate
}
