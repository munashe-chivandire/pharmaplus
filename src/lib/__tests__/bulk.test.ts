/**
 * Bulk Import/Export Module Tests
 */

import { describe, it, expect } from "vitest"
import {
  importMembers,
  exportMembers,
  getImportTemplate,
} from "../bulk"

describe("Bulk Import/Export Module", () => {
  describe("importMembers function", () => {
    it("should import valid CSV data", async () => {
      const validCSV = `firstName,surname,email,phone,idNumber,dateOfBirth,address
Tendai,Moyo,tendai@test.com,+263771234567,63-123456-A-78,1985-06-15,123 Test Street`

      const result = await importMembers(validCSV)

      expect(result.totalRows).toBe(1)
      expect(result.imported).toBe(1)
      expect(result.failed).toBe(0)
      expect(result.errors).toHaveLength(0)
    })

    it("should report errors for missing required fields", async () => {
      const invalidCSV = `firstName,surname,email,phone,idNumber,dateOfBirth
,Moyo,tendai@test.com,+263771234567,63-123456-A-78,1985-06-15`

      const result = await importMembers(invalidCSV)

      expect(result.failed).toBe(1)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0].field).toBe("firstName")
    })

    it("should validate email format", async () => {
      const invalidEmailCSV = `firstName,surname,email,phone,idNumber,dateOfBirth
Tendai,Moyo,invalid-email,+263771234567,63-123456-A-78,1985-06-15`

      const result = await importMembers(invalidEmailCSV)

      expect(result.failed).toBe(1)
      expect(result.errors.some((e) => e.field === "email")).toBe(true)
    })

    it("should validate date of birth", async () => {
      const futureDateCSV = `firstName,surname,email,phone,idNumber,dateOfBirth
Tendai,Moyo,tendai@test.com,+263771234567,63-123456-A-78,2099-01-01`

      const result = await importMembers(futureDateCSV)

      expect(result.failed).toBe(1)
      expect(result.errors.some((e) => e.field === "dateOfBirth")).toBe(true)
    })

    it("should add warnings for phone format issues", async () => {
      const csvWithPhoneWarning = `firstName,surname,email,phone,idNumber,dateOfBirth
Tendai,Moyo,tendai@test.com,0771234567,63-123456-A-78,1985-06-15`

      const result = await importMembers(csvWithPhoneWarning)

      expect(result.warnings.some((w) => w.field === "phone")).toBe(true)
    })

    it("should handle empty CSV", async () => {
      const emptyCSV = `firstName,surname,email,phone,idNumber,dateOfBirth`

      const result = await importMembers(emptyCSV)

      expect(result.totalRows).toBe(0)
      expect(result.imported).toBe(0)
    })
  })

  describe("exportMembers function", () => {
    it("should export members as CSV", async () => {
      const csv = await exportMembers({ format: "csv" })

      expect(csv).toContain("membershipNumber")
      expect(csv).toContain("firstName")
      expect(csv).toContain("surname")
      expect(csv).toContain("email")
    })

    it("should include all data rows", async () => {
      const csv = await exportMembers({ format: "csv" })
      const lines = csv.trim().split("\n")

      // Header + data rows
      expect(lines.length).toBeGreaterThan(1)
    })

    it("should filter by columns when specified", async () => {
      const csv = await exportMembers({
        format: "csv",
        columns: ["membershipNumber", "firstName", "surname"],
      })

      expect(csv).toContain("membershipNumber")
      expect(csv).toContain("firstName")
      expect(csv).toContain("surname")
      // These should not be in the output
      expect(csv.split("\n")[0]).not.toContain("phone")
    })
  })

  describe("getImportTemplate function", () => {
    it("should return member import template", () => {
      const template = getImportTemplate("members")

      expect(template).toContain("firstName")
      expect(template).toContain("surname")
      expect(template).toContain("email")
      expect(template).toContain("phone")
      expect(template).toContain("idNumber")
      expect(template).toContain("dateOfBirth")
    })

    it("should return claims import template", () => {
      const template = getImportTemplate("claims")

      expect(template).toContain("membershipNumber")
      expect(template).toContain("type")
      expect(template).toContain("provider")
      expect(template).toContain("amount")
    })

    it("should return transactions import template", () => {
      const template = getImportTemplate("transactions")

      expect(template).toContain("membershipNumber")
      expect(template).toContain("type")
      expect(template).toContain("method")
      expect(template).toContain("amount")
    })

    it("should end with newline for proper CSV format", () => {
      const template = getImportTemplate("members")
      expect(template.endsWith("\n")).toBe(true)
    })
  })

  describe("CSV parsing", () => {
    it("should handle quoted fields with commas", async () => {
      const csvWithCommas = `firstName,surname,email,phone,idNumber,dateOfBirth,address
"Tendai, Jr.",Moyo,tendai@test.com,+263771234567,63-123456-A-78,1985-06-15,"123, Test Street, Harare"`

      const result = await importMembers(csvWithCommas)

      // Should parse without errors
      expect(result.errors.filter((e) => e.field === "firstName")).toHaveLength(0)
    })

    it("should handle escaped quotes in fields", async () => {
      const csvWithQuotes = `firstName,surname,email,phone,idNumber,dateOfBirth,address
"Tendai ""TK""",Moyo,tendai@test.com,+263771234567,63-123456-A-78,1985-06-15,123 Street`

      const result = await importMembers(csvWithQuotes)

      expect(result.imported).toBe(1)
    })
  })
})
