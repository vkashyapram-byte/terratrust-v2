import { useEffect, useState, type ReactNode } from "react";
import {
  GeoJSON,
  MapContainer,
  CircleMarker,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import {
  boundaryCoordinates,
  boundaryFromCoordinates,
  type BoundaryAnalysis,
  type BoundaryFeature,
} from "@/lib/gis";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Crosshair, Maximize2, Minimize2, RotateCcw, Save, Trash2 } from "lucide-react";

export interface PropertyMapProps {
  propertyId: string;
  registeredBoundary?: Feature<Polygon | MultiPolygon>;
  submittedBoundary?: Feature<Polygon | MultiPolygon>;
  latitude?: number;
  longitude?: number;
  editable?: boolean;
  showAnalysis?: boolean;
  analysis?: BoundaryAnalysis;
  onBoundaryChange?: (boundary: BoundaryFeature) => void;
  onSaveBoundary?: (boundary: BoundaryFeature) => void;
  className?: string;
  children?: ReactNode;
}

type Position = [number, number];

export function PropertyMap({
  propertyId,
  registeredBoundary,
  submittedBoundary,
  latitude = 6.4413,
  longitude = 3.4709,
  editable = false,
  showAnalysis = true,
  analysis,
  onBoundaryChange,
  onSaveBoundary,
  className,
  children,
}: PropertyMapProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const initialPoints = submittedBoundary
    ? boundaryCoordinates(submittedBoundary).map(([lng, lat]) => [lat, lng] as Position)
    : [];
  const [draftPoints, setDraftPoints] = useState<Position[]>(initialPoints);
  const draftBoundary =
    draftPoints.length >= 3
      ? boundaryFromCoordinates(
          draftPoints.map(([lat, lng]) => [lng, lat]),
          propertyId,
        )
      : undefined;
  const center: [number, number] = [latitude, longitude];
  const displayedSubmitted = editable ? draftBoundary : submittedBoundary;
  const boundsFeature = displayedSubmitted ?? registeredBoundary;

  useEffect(() => {
    if (!submittedBoundary) return;
    setDraftPoints(
      boundaryCoordinates(submittedBoundary).map(([lng, lat]) => [lat, lng] as Position),
    );
  }, [submittedBoundary]);

  const mapClass = cn(
    "relative overflow-hidden rounded-2xl border border-border bg-[#e8f0ed]",
    fullscreen ? "fixed inset-4 z-50" : "min-h-[420px]",
    className,
  );

  const updateDraft = (points: Position[]) => {
    setDraftPoints(points);
    if (points.length >= 3)
      onBoundaryChange?.(
        boundaryFromCoordinates(
          points.map(([lat, lng]) => [lng, lat]),
          propertyId,
        ),
      );
  };

  return (
    <div className={mapClass}>
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom
        className="h-full min-h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundary feature={boundsFeature} fallback={center} />
        <CircleMarker
          center={center}
          radius={7}
          pathOptions={{ color: "#087f78", fillColor: "#087f78", fillOpacity: 1, weight: 3 }}
        >
          <div>{propertyId}</div>
        </CircleMarker>
        {registeredBoundary && (
          <GeoJSON
            data={registeredBoundary}
            style={{
              color: "#15803d",
              weight: 3,
              fillColor: "#22c55e",
              fillOpacity: 0.12,
              dashArray: "6 4",
            }}
          />
        )}
        {displayedSubmitted && (
          <GeoJSON
            data={displayedSubmitted}
            style={{
              color: analysis?.boundaryVerified ? "#087f78" : "#dc2626",
              weight: 3,
              fillColor: analysis?.boundaryVerified ? "#14b8a6" : "#ef4444",
              fillOpacity: 0.18,
            }}
          />
        )}
        {editable && <DrawBoundary points={draftPoints} onChange={updateDraft} />}
      </MapContainer>

      <div className="absolute left-3 top-3 z-[1000] flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          onClick={() => setFullscreen((value) => !value)}
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          title="Fit boundary"
          onClick={() => window.dispatchEvent(new CustomEvent("terratrust-fit-boundary"))}
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      <div className="glass-strong absolute bottom-3 left-3 z-[1000] flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 text-[11px]">
        <LegendDot color="#15803d" label="Registered" />
        <LegendDot color="#087f78" label="Submitted" />
        <LegendDot color="#dc2626" label="Conflict" />
      </div>

      {editable && (
        <div className="glass-strong absolute bottom-3 right-3 z-[1000] flex gap-2 rounded-lg p-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => updateDraft([])}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => updateDraft(initialPoints)}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          {draftBoundary && (
            <Button type="button" size="sm" onClick={() => onSaveBoundary?.(draftBoundary)}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          )}
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="glass-strong absolute right-3 top-3 z-[1000] max-w-[220px] rounded-lg p-3 text-xs">
          <p className="font-semibold text-foreground">Boundary analysis</p>
          <p className="mt-1 text-muted-foreground">
            Score <strong className="text-foreground">{analysis.boundaryScore}/100</strong> ·
            overlap <strong className="text-foreground">{analysis.overlapPercentage}%</strong>
          </p>
          <p
            className={cn(
              "mt-1 font-medium",
              analysis.boundaryVerified ? "text-success" : "text-destructive",
            )}
          >
            {analysis.boundaryVerified ? "Verified within tolerance" : "Review required"}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}

function FitBoundary({
  feature,
  fallback,
}: {
  feature?: BoundaryFeature;
  fallback: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    const fit = () => {
      if (feature) {
        const bounds = L.geoJSON(feature).getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [32, 32] });
      } else map.setView(fallback, 17);
    };
    fit();
    window.addEventListener("terratrust-fit-boundary", fit);
    return () => window.removeEventListener("terratrust-fit-boundary", fit);
  }, [feature, fallback, map]);
  return null;
}

function DrawBoundary({
  points,
  onChange,
}: {
  points: Position[];
  onChange: (points: Position[]) => void;
}) {
  useMapEvents({
    click(event) {
      onChange([...points, [event.latlng.lat, event.latlng.lng]]);
    },
  });
  return (
    <>
      {points.map((position, index) => (
        <Marker
          key={`${position[0]}-${position[1]}-${index}`}
          position={position}
          draggable
          icon={L.divIcon({
            className: "gis-vertex-handle",
            html: "<span></span>",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target as L.Marker;
              const next = [...points];
              const moved = marker.getLatLng();
              next[index] = [moved.lat, moved.lng];
              onChange(next);
            },
          }}
        />
      ))}
    </>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
