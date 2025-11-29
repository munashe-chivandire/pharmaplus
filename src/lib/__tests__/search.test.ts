/**
 * Search Module Tests
 */

import { describe, it, expect, vi } from "vitest"
import { search } from "../search"

describe("Search Module", () => {
  describe("search function", () => {
    it("should return results for a valid query", async () => {
      const result = await search({
        query: "Tendai",
        entities: ["member"],
      })

      expect(result).toHaveProperty("results")
      expect(result).toHaveProperty("total")
      expect(result).toHaveProperty("facets")
      expect(result).toHaveProperty("took")
      expect(result.results.length).toBeGreaterThan(0)
    })

    it("should return empty results for non-matching query", async () => {
      const result = await search({
        query: "NonExistentPerson12345",
        entities: ["member"],
      })

      expect(result.results).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it("should filter by entity type", async () => {
      const result = await search({
        query: "",
        entities: ["member"],
      })

      result.results.forEach((r) => {
        expect(r.entity).toBe("member")
      })
    })

    it("should filter by status", async () => {
      const result = await search({
        query: "",
        entities: ["member"],
        filters: {
          status: ["ACTIVE"],
        },
      })

      result.results.forEach((r) => {
        expect(r.data.status).toBe("ACTIVE")
      })
    })

    it("should paginate results", async () => {
      const result = await search({
        query: "",
        page: 1,
        limit: 1,
      })

      expect(result.page).toBe(1)
      expect(result.limit).toBe(1)
    })

    it("should include facets in response", async () => {
      const result = await search({
        query: "",
      })

      expect(result.facets).toHaveProperty("entities")
      expect(result.facets).toHaveProperty("statuses")
      expect(Array.isArray(result.facets.entities)).toBe(true)
    })

    it("should include suggestions for partial queries", async () => {
      const result = await search({
        query: "Ten",
      })

      expect(result.suggestions).toBeDefined()
      expect(Array.isArray(result.suggestions)).toBe(true)
    })

    it("should track execution time", async () => {
      const result = await search({
        query: "test",
      })

      expect(typeof result.took).toBe("number")
      expect(result.took).toBeGreaterThanOrEqual(0)
    })
  })
})
