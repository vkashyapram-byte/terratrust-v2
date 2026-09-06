import { describe, expect, test } from "bun:test";
import { properties } from "../src/lib/mock-data";
import { analyzeBoundaries, boundaryFromCoordinates, demoBoundaryFeatures } from "../src/lib/gis";

describe("GIS boundary analysis", () => {
  test("accepts a high-overlap boundary", () => {
    const { registeredBoundary, submittedBoundary } = demoBoundaryFeatures(properties[0]);
    const result = analyzeBoundaries(registeredBoundary, submittedBoundary);
    expect(result.boundaryVerified).toBe(true);
    expect(result.overlapPercentage).toBeGreaterThanOrEqual(85);
  });

  test("escalates a disputed boundary", () => {
    const property = properties.find(item => item.status === "disputed") ?? properties[0];
    const { registeredBoundary, submittedBoundary } = demoBoundaryFeatures(property);
    expect(analyzeBoundaries(registeredBoundary, submittedBoundary).boundaryVerified).toBe(false);
  });

  test("returns review for missing geometry", () => {
    const { submittedBoundary } = demoBoundaryFeatures(properties[0]);
    const result = analyzeBoundaries(undefined, submittedBoundary);
    expect(result.boundaryScore).toBe(0);
    expect(result.boundaryVerified).toBe(false);
    expect(result.conflicts[0]?.type).toBe("invalid_geometry");
  });

  test("closes submitted GeoJSON rings", () => {
    const boundary = boundaryFromCoordinates([
      [77.5946, 12.9716],
      [77.5956, 12.9716],
      [77.5956, 12.9726],
    ], "test-property");
    const ring = boundary.geometry.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
  });
});
