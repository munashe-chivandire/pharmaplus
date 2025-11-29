/**
 * Email Notification System
 * Supports SMTP, SendGrid, and Resend
 */

import { db } from "@/lib/db"

export type EmailProvider = "smtp" | "sendgrid" | "resend"

interface EmailConfig {
  provider: EmailProvider
  from: string
  // SMTP
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  // SendGrid
  sendgridApiKey?: string
  // Resend
  resendApiKey?: string
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

const config: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailProvider) || "smtp",
  from: process.env.EMAIL_FROM || "noreply@pharmplus.co.zw",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
}

/**
 * Send email via SMTP
 */
async function sendSMTP(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    })

    const result = await transporter.sendMail({
      from: config.from,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments,
    })

    return {
      success: true,
      messageId: result.messageId,
    }
  } catch (error) {
    console.error("SMTP email error:", error)
    return {
      success: false,
      error: "Failed to send email via SMTP",
    }
  }
}

/**
 * Send email via SendGrid
 */
async function sendSendGrid(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const sgMail = await import("@sendgrid/mail")
    sgMail.default.setApiKey(config.sendgridApiKey!)

    const msg = {
      to: options.to,
      from: config.from,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    }

    const result = await sgMail.default.send(msg)

    return {
      success: true,
      messageId: result[0].headers["x-message-id"],
    }
  } catch (error) {
    console.error("SendGrid email error:", error)
    return {
      success: false,
      error: "Failed to send email via SendGrid",
    }
  }
}

/**
 * Send email via Resend
 */
async function sendResend(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const { Resend } = await import("resend")
    const resend = new Resend(config.resendApiKey)

    const result = await resend.emails.send({
      from: config.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    })

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    console.error("Resend email error:", error)
    return {
      success: false,
      error: "Failed to send email via Resend",
    }
  }
}

/**
 * Main send email function
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  switch (config.provider) {
    case "sendgrid":
      return sendSendGrid(options)
    case "resend":
      return sendResend(options)
    case "smtp":
    default:
      return sendSMTP(options)
  }
}

/**
 * Email Templates
 */
export const emailTemplates = {
  welcome: (name: string, organizationName: string) => ({
    subject: `Welcome to ${organizationName} - PharmPlus`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to PharmPlus!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Welcome to ${organizationName}! Your account has been successfully created.</p>
              <p>You can now access your member portal to:</p>
              <ul>
                <li>View your membership details</li>
                <li>Submit and track claims</li>
                <li>Download your membership card</li>
                <li>Manage your dependents</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" class="button">Access Member Portal</a>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  applicationSubmitted: (name: string, applicationNumber: string) => ({
    subject: `Application Received - ${applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your application has been successfully submitted and is now being reviewed.</p>
              <div class="info-box">
                <p><strong>Application Number:</strong> ${applicationNumber}</p>
                <p><strong>Status:</strong> Under Review</p>
                <p><strong>Expected Processing Time:</strong> 2-5 business days</p>
              </div>
              <p>We will notify you once your application has been processed.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/applications" class="button">Track Application</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  applicationApproved: (name: string, applicationNumber: string, membershipNumber: string) => ({
    subject: `Application Approved - Welcome! - ${membershipNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Approved!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${name}!</h2>
              <p>Your application has been approved. Welcome to your new medical scheme!</p>
              <div class="success-box">
                <p><strong>Membership Number:</strong> ${membershipNumber}</p>
                <p><strong>Application Number:</strong> ${applicationNumber}</p>
                <p><strong>Status:</strong> Active</p>
              </div>
              <p>You can now access all your member benefits. Log in to download your membership card.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" class="button">Access Member Portal</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  applicationRejected: (name: string, applicationNumber: string, reason: string) => ({
    subject: `Application Update - ${applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We regret to inform you that your application could not be approved at this time.</p>
              <div class="info-box">
                <p><strong>Application Number:</strong> ${applicationNumber}</p>
                <p><strong>Reason:</strong> ${reason}</p>
              </div>
              <p>If you believe this is an error or would like more information, please contact our support team.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" class="button">Contact Support</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  claimSubmitted: (name: string, claimNumber: string, amount: number) => ({
    subject: `Claim Received - ${claimNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Claim Received</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your claim has been successfully submitted.</p>
              <div class="info-box">
                <p><strong>Claim Number:</strong> ${claimNumber}</p>
                <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                <p><strong>Status:</strong> Under Review</p>
              </div>
              <p>We will process your claim within 5-7 business days.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/claims" class="button">Track Claim</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  paymentReceived: (name: string, amount: number, reference: string) => ({
    subject: `Payment Confirmation - ${reference}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Received</h1>
            </div>
            <div class="content">
              <h2>Thank you ${name}!</h2>
              <p>We have received your payment.</p>
              <div class="success-box">
                <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                <p><strong>Reference:</strong> ${reference}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Your receipt has been attached to this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  renewalReminder: (name: string, daysUntilExpiry: number, membershipNumber: string) => ({
    subject: `Membership Renewal Reminder - ${daysUntilExpiry} days left`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning-box { background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Renewal Reminder</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your membership is expiring soon!</p>
              <div class="warning-box">
                <p><strong>Membership Number:</strong> ${membershipNumber}</p>
                <p><strong>Days Until Expiry:</strong> ${daysUntilExpiry}</p>
              </div>
              <p>Renew now to continue enjoying uninterrupted coverage.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/renew" class="button">Renew Now</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PharmPlus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

/**
 * Send notification and log to database
 */
export async function sendNotification(
  userId: string,
  type: string,
  options: SendEmailOptions
): Promise<EmailResult> {
  const result = await sendEmail(options)

  // Log notification to database
  await db.notification.create({
    data: {
      userId,
      title: options.subject,
      message: options.text || "Email notification sent",
      type: result.success ? "INFO" : "ERROR",
      read: false,
    },
  })

  return result
}
