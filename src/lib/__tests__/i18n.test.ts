/**
 * Internationalization (i18n) Module Tests
 */

import { describe, it, expect } from "vitest"
import {
  t,
  locales,
  localeNames,
  getTranslations,
  formatDateLocale,
  formatCurrencyLocale,
} from "../i18n"

describe("i18n Module", () => {
  describe("locales configuration", () => {
    it("should have correct locales defined", () => {
      expect(locales).toContain("en")
      expect(locales).toContain("sn")
      expect(locales).toContain("nd")
      expect(locales).toHaveLength(3)
    })

    it("should have locale names for all locales", () => {
      expect(localeNames.en).toBe("English")
      expect(localeNames.sn).toBe("Shona")
      expect(localeNames.nd).toBe("Ndebele")
    })
  })

  describe("t function", () => {
    it("should return English translation by default", () => {
      expect(t("common.welcome")).toBe("Welcome")
      expect(t("common.login")).toBe("Sign In")
    })

    it("should return Shona translations", () => {
      expect(t("common.welcome", "sn")).toBe("Mauya")
      expect(t("common.login", "sn")).toBe("Pinda")
    })

    it("should return Ndebele translations", () => {
      expect(t("common.welcome", "nd")).toBe("Siyakwemukela")
      expect(t("common.login", "nd")).toBe("Ngena")
    })

    it("should fall back to English for missing translations", () => {
      // Assuming some keys might not be translated
      expect(t("nav.dashboard", "sn")).toBe("Dashboard")
    })

    it("should return the key if translation is missing", () => {
      expect(t("nonexistent.key")).toBe("nonexistent.key")
    })
  })

  describe("getTranslations function", () => {
    it("should return all translations for a locale", () => {
      const enTranslations = getTranslations("en")
      expect(enTranslations).toHaveProperty("common.welcome")
      expect(enTranslations).toHaveProperty("nav.dashboard")
    })

    it("should fall back to English for invalid locale", () => {
      const translations = getTranslations("invalid" as any)
      expect(translations).toHaveProperty("common.welcome")
    })
  })

  describe("formatDateLocale function", () => {
    const testDate = new Date("2024-03-15")

    it("should format date for English locale", () => {
      const formatted = formatDateLocale(testDate, "en")
      expect(formatted).toContain("15")
      expect(formatted).toContain("March")
      expect(formatted).toContain("2024")
    })

    it("should format date for Shona locale", () => {
      const formatted = formatDateLocale(testDate, "sn")
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe("string")
    })

    it("should format date for Ndebele locale", () => {
      const formatted = formatDateLocale(testDate, "nd")
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe("string")
    })
  })

  describe("formatCurrencyLocale function", () => {
    it("should format USD currency correctly", () => {
      const formatted = formatCurrencyLocale(150.5, "USD", "en")
      expect(formatted).toContain("150")
      expect(formatted).toContain("50")
    })

    it("should format ZWL currency correctly", () => {
      const formatted = formatCurrencyLocale(1000, "ZWL", "en")
      expect(formatted).toContain("1,000")
    })

    it("should handle zero values", () => {
      const formatted = formatCurrencyLocale(0, "USD", "en")
      expect(formatted).toContain("0")
    })

    it("should handle negative values", () => {
      const formatted = formatCurrencyLocale(-50, "USD", "en")
      expect(formatted).toContain("50")
    })
  })

  describe("translations completeness", () => {
    it("should have common translations in all locales", () => {
      const commonKeys = [
        "common.welcome",
        "common.login",
        "common.logout",
        "common.save",
        "common.cancel",
      ]

      commonKeys.forEach((key) => {
        expect(t(key, "en")).not.toBe(key)
        expect(t(key, "sn")).not.toBe(key)
        expect(t(key, "nd")).not.toBe(key)
      })
    })

    it("should have navigation translations in all locales", () => {
      const navKeys = [
        "nav.dashboard",
        "nav.applications",
        "nav.members",
        "nav.claims",
      ]

      navKeys.forEach((key) => {
        expect(t(key, "en")).not.toBe(key)
        expect(t(key, "sn")).not.toBe(key)
        expect(t(key, "nd")).not.toBe(key)
      })
    })
  })
})
