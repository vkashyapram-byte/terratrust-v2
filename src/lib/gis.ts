import { area, booleanValid, centroid, distance, difference, feature, featureCollection, intersect, point, polygon } from "@turf/turf";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import type { Property } from "./types";

export type BoundaryFeature = Feature<Polygon | MultiPolygon>;

export const GIS_CONFIG = {
  boundaryToleranceMeters: 5,
  minimumOverlapPercentage: 85,
  minimumBoundaryScore: 75,
} as const;

export interface BoundaryConflict {
  type: "overlap" | "displacement" | "area_difference" | "invalid_geometry";
  severity: "low" | "medium" | "high";
  message: string;
}

export interface BoundaryAnalysis {
  boundaryScore: number;
  overlapPercentage: number;
  boundaryVerified: boolean;
  registeredArea?: number;
  submittedArea?: number;
  overlapArea?: number;
  differenceArea?: number;
  centroidDisplacementMeters?: number;
  conflicts: BoundaryConflict[];
}

export function propertyBoundaryFeature(property: Property): BoundaryFeature {
  const coordinates = property.boundary.map(({ lng, lat }) => [lng, lat] as [number, number]);
  if (coordinates.length < 3) {
    return feature({ type: "Polygon", coordinates: [] }, { propertyId: property.id, source: "registered" });
  }
  const first = coordinates[0];
  const ring = coordinates.at(-1)?.[0] === first[0] && coordinates.at(-1)?.[1] === first[1]
    ? coordinates
    : [...coordinates, first];
  return polygon([ring], { propertyId: property.id, source: "registered" });
}

export function demoBoundaryFeatures(property: Property): { registeredBoundary: BoundaryFeature; submittedBoundary: BoundaryFeature } {
  const registeredBoundary = propertyBoundaryFeature(property);
  const coordinates = registeredBoundary.geometry.type === "Polygon" ? (registeredBoundary.geometry.coordinates[0] ?? []) : [];
  const submittedCoordinates = coordinates.map(([lng, lat], index) => {
    if (property.status === "disputed") return [lng + 0.00008, lat + 0.00008] as [number, number];
    const nudge = index % 2 === 0 ? 0.000005 : -0.000004;
    return [lng + nudge, lat + nudge] as [number, number];
  });
  const submittedBoundary = submittedCoordinates.length >= 4
    ? polygon([submittedCoordinates], { propertyId: property.id, source: "submitted" })
    : registeredBoundary;
  return { registeredBoundary, submittedBoundary };
}

export function analyzeBoundaries(
  registeredBoundary: BoundaryFeature | undefined,
  submittedBoundary: BoundaryFeature | undefined,
): BoundaryAnalysis {
  const conflicts: BoundaryConflict[] = [];
  if (!registeredBoundary || !submittedBoundary) {
    conflicts.push({ type: "invalid_geometry", severity: "high", message: "Both registered and submitted boundaries are required." });
    return { boundaryScore: 0, overlapPercentage: 0, boundaryVerified: false, conflicts };
  }
  if (!isValidBoundary(registeredBoundary) || !isValidBoundary(submittedBoundary)) {
    conflicts.push({ type: "invalid_geometry", severity: "high", message: "One or more polygons are invalid or self-intersecting." });
    return { boundaryScore: 0, overlapPercentage: 0, boundaryVerified: false, conflicts };
  }

  const registeredArea = area(registeredBoundary);
  const submittedArea = area(submittedBoundary);
  const overlap = intersect(featureCollection([registeredBoundary, submittedBoundary]));
  const overlapArea = overlap ? area(overlap) : 0;
  const denominator = Math.min(registeredArea, submittedArea);
  const overlapPercentage = denominator > 0 ? (overlapArea / denominator) * 100 : 0;
  const differenceFeature = difference(featureCollection([submittedBoundary, registeredBoundary]));
  const differenceArea = differenceFeature ? area(differenceFeature) : 0;
  const centroidDisplacementMeters = distance(centroid(registeredBoundary), centroid(submittedBoundary), { units: "meters" });
  const areaAgreement = Math.max(0, 100 - (Math.abs(registeredArea - submittedArea) / registeredArea) * 100);
  const displacementScore = Math.max(0, 100 - (centroidDisplacementMeters / GIS_CONFIG.boundaryToleranceMeters) * 100);
  const boundaryScore = Math.round(Math.max(0, Math.min(100, overlapPercentage * 0.55 + areaAgreement * 0.25 + displacementScore * 0.2)));

  if (overlapPercentage < GIS_CONFIG.minimumOverlapPercentage) {
    conflicts.push({ type: "overlap", severity: overlapPercentage < 50 ? "high" : "medium", message: `Only ${overlapPercentage.toFixed(1)}% of the submitted boundary overlaps the registered parcel.` });
  }
  if (centroidDisplacementMeters > GIS_CONFIG.boundaryToleranceMeters) {
    conflicts.push({ type: "displacement", severity: "high", message: `Boundary centroid is displaced by ${centroidDisplacementMeters.toFixed(1)}m.` });
  }
  if (areaAgreement < 90) {
    conflicts.push({ type: "area_difference", severity: areaAgreement < 70 ? "high" : "medium", message: "Submitted and registered parcel areas differ materially." });
  }

  return {
    boundaryScore,
    overlapPercentage: Number(overlapPercentage.toFixed(2)),
    boundaryVerified: conflicts.length === 0 && boundaryScore >= GIS_CONFIG.minimumBoundaryScore,
    registeredArea: Number(registeredArea.toFixed(2)),
    submittedArea: Number(submittedArea.toFixed(2)),
    overlapArea: Number(overlapArea.toFixed(2)),
    differenceArea: Number(differenceArea.toFixed(2)),
    centroidDisplacementMeters: Number(centroidDisplacementMeters.toFixed(2)),
    conflicts,
  };
}

function isValidBoundary(boundary: BoundaryFeature) {
  if (boundary.geometry.type === "Polygon" && boundary.geometry.coordinates[0]?.length >= 4) return booleanValid(boundary);
  if (boundary.geometry.type === "MultiPolygon" && boundary.geometry.coordinates.length > 0) return booleanValid(boundary);
  return false;
}

export function boundaryCoordinates(boundary: BoundaryFeature) {
  if (boundary.geometry.type === "Polygon") return boundary.geometry.coordinates[0];
  return boundary.geometry.coordinates[0]?.[0] ?? [];
}

export function boundaryCenter(boundary: BoundaryFeature) {
  const [lng, lat] = centroid(boundary).geometry.coordinates;
  return { lat, lng };
}

export function boundaryFromCoordinates(coordinates: [number, number][], propertyId: string): BoundaryFeature {
  const first = coordinates[0];
  const ring = coordinates.at(-1)?.[0] === first?.[0] && coordinates.at(-1)?.[1] === first?.[1]
    ? coordinates
    : [...coordinates, first];
  return polygon([ring], { propertyId, source: "submitted" });
}

export function coordinatePoint(lng: number, lat: number) {
  return point([lng, lat]);
}
