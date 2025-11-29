/**
 * PDF Generation System
 * Generate membership cards, invoices, reports, and application forms
 */

interface MembershipCardData {
  membershipNumber: string
  memberName: string
  packageName: string
  validFrom: Date
  validUntil: Date
  dependents: number
  organizationName: string
  organizationLogo?: string
}

interface InvoiceData {
  invoiceNumber: string
  date: Date
  dueDate: Date
  memberName: string
  membershipNumber: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  organizationName: string
  organizationAddress: string
  bankDetails: {
    bankName: string
    accountNumber: string
    branchCode: string
  }
}

interface ClaimReportData {
  reportDate: Date
  memberName: string
  membershipNumber: string
  periodFrom: Date
  periodTo: Date
  claims: Array<{
    claimNumber: string
    date: Date
    type: string
    provider: string
    amount: number
    status: string
  }>
  summary: {
    totalClaims: number
    totalApproved: number
    totalPending: number
    totalRejected: number
    totalAmount: number
  }
}

/**
 * Generate PDF using HTML template and Puppeteer
 */
async function generatePdfFromHtml(html: string): Promise<Buffer> {
  // In production, use Puppeteer or a PDF service
  // For now, we'll use a simple approach with jsPDF
  try {
    const puppeteer = await import("puppeteer")

    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    })

    await browser.close()

    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error("Failed to generate PDF")
  }
}

/**
 * Generate Membership Card PDF
 */
export async function generateMembershipCard(data: MembershipCardData): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; }
          .card {
            width: 85.6mm;
            height: 53.98mm;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%);
            border-radius: 10px;
            padding: 15px;
            color: white;
            position: relative;
            overflow: hidden;
          }
          .card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .logo {
            font-size: 18px;
            font-weight: bold;
          }
          .org-name {
            font-size: 10px;
            opacity: 0.9;
          }
          .member-number {
            font-size: 14px;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          .member-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .package {
            font-size: 11px;
            opacity: 0.9;
            margin-bottom: 10px;
          }
          .validity {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          .validity-item span {
            display: block;
            opacity: 0.7;
            font-size: 8px;
          }
          .chip {
            position: absolute;
            bottom: 15px;
            right: 15px;
            width: 35px;
            height: 25px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div>
              <div class="logo">PharmPlus</div>
              <div class="org-name">${data.organizationName}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px;">MEDICAL AID</div>
              <div style="font-size: 8px; opacity: 0.8;">MEMBER CARD</div>
            </div>
          </div>
          <div class="member-number">${data.membershipNumber}</div>
          <div class="member-name">${data.memberName}</div>
          <div class="package">${data.packageName} • ${data.dependents} Dependents</div>
          <div class="validity">
            <div class="validity-item">
              <span>VALID FROM</span>
              ${data.validFrom.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </div>
            <div class="validity-item">
              <span>VALID UNTIL</span>
              ${data.validUntil.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div class="chip"></div>
        </div>
      </body>
    </html>
  `

  return generatePdfFromHtml(html)
}

/**
 * Generate Invoice PDF
 */
export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; font-size: 12px; color: #333; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .invoice-title { font-size: 28px; color: #6b7280; text-align: right; }
          .invoice-number { font-size: 14px; color: #6b7280; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-box { width: 45%; }
          .info-box h3 { font-size: 12px; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; }
          .info-box p { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .amount { text-align: right; }
          .totals { width: 300px; margin-left: auto; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-size: 16px; font-weight: bold; border-top: 2px solid #333; padding-top: 12px; }
          .bank-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; }
          .bank-details h3 { margin-bottom: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PharmPlus</div>
            <p>${data.organizationName}</p>
            <p>${data.organizationAddress}</p>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">${data.invoiceNumber}</div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Bill To</h3>
            <p><strong>${data.memberName}</strong></p>
            <p>Member #: ${data.membershipNumber}</p>
          </div>
          <div class="info-box" style="text-align: right;">
            <h3>Invoice Details</h3>
            <p>Date: ${data.date.toLocaleDateString()}</p>
            <p>Due Date: ${data.dueDate.toLocaleDateString()}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th class="amount">Unit Price</th>
              <th class="amount">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td class="amount">$${item.unitPrice.toFixed(2)}</td>
                <td class="amount">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>$${data.subtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Tax</span>
            <span>$${data.tax.toFixed(2)}</span>
          </div>
          <div class="totals-row total">
            <span>Total Due</span>
            <span>$${data.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="bank-details">
          <h3>Bank Details</h3>
          <p>Bank: ${data.bankDetails.bankName}</p>
          <p>Account Number: ${data.bankDetails.accountNumber}</p>
          <p>Branch Code: ${data.bankDetails.branchCode}</p>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For queries, contact support@pharmplus.co.zw</p>
        </div>
      </body>
    </html>
  `

  return generatePdfFromHtml(html)
}

/**
 * Generate Claims Report PDF
 */
export async function generateClaimsReport(data: ClaimReportData): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; font-size: 11px; color: #333; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .report-title { font-size: 18px; margin-top: 10px; }
          .member-info { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; }
          .summary { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .summary-box { text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px; width: 18%; }
          .summary-box .value { font-size: 20px; font-weight: bold; color: #2563eb; }
          .summary-box .label { font-size: 10px; color: #6b7280; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #2563eb; color: white; padding: 10px; text-align: left; font-size: 10px; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-approved { color: #059669; font-weight: bold; }
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-rejected { color: #dc2626; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 9px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PharmPlus</div>
          <div class="report-title">Claims Report</div>
          <p>Generated on ${data.reportDate.toLocaleDateString()}</p>
        </div>

        <div class="member-info">
          <div>
            <strong>Member:</strong> ${data.memberName}<br>
            <strong>Membership #:</strong> ${data.membershipNumber}
          </div>
          <div>
            <strong>Period:</strong> ${data.periodFrom.toLocaleDateString()} - ${data.periodTo.toLocaleDateString()}
          </div>
        </div>

        <div class="summary">
          <div class="summary-box">
            <div class="value">${data.summary.totalClaims}</div>
            <div class="label">Total Claims</div>
          </div>
          <div class="summary-box">
            <div class="value" style="color: #059669;">${data.summary.totalApproved}</div>
            <div class="label">Approved</div>
          </div>
          <div class="summary-box">
            <div class="value" style="color: #f59e0b;">${data.summary.totalPending}</div>
            <div class="label">Pending</div>
          </div>
          <div class="summary-box">
            <div class="value" style="color: #dc2626;">${data.summary.totalRejected}</div>
            <div class="label">Rejected</div>
          </div>
          <div class="summary-box">
            <div class="value">$${data.summary.totalAmount.toLocaleString()}</div>
            <div class="label">Total Amount</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Provider</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.claims.map(claim => `
              <tr>
                <td>${claim.claimNumber}</td>
                <td>${claim.date.toLocaleDateString()}</td>
                <td>${claim.type}</td>
                <td>${claim.provider}</td>
                <td>$${claim.amount.toFixed(2)}</td>
                <td class="status-${claim.status.toLowerCase()}">${claim.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a system-generated report. For queries, contact support@pharmplus.co.zw</p>
        </div>
      </body>
    </html>
  `

  return generatePdfFromHtml(html)
}

/**
 * Generate Application Form PDF
 */
export async function generateApplicationForm(applicationData: any): Promise<Buffer> {
  // Implementation similar to above
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { background: #2563eb; color: white; padding: 8px; font-weight: bold; }
          .field { display: inline-block; width: 48%; margin: 5px 0; }
          .field-label { font-size: 9px; color: #666; }
          .field-value { border-bottom: 1px solid #333; padding: 3px 0; min-height: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Membership Application Form</h1>
          <p>Application #: ${applicationData.applicationNumber || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="field">
            <div class="field-label">Full Name</div>
            <div class="field-value">${applicationData.firstName || ''} ${applicationData.surname || ''}</div>
          </div>
          <div class="field">
            <div class="field-label">ID Number</div>
            <div class="field-value">${applicationData.idNumber || ''}</div>
          </div>
        </div>

        <!-- Add more sections as needed -->
      </body>
    </html>
  `

  return generatePdfFromHtml(html)
}
