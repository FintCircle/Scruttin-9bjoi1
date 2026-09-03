import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// GeoJSON feature type
interface GeoFeature {
  type: string;
  properties: { name: string; [key: string]: unknown };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface CountryMapProps {
  countryName: string;
  className?: string;
}

// Simple equirectangular projection
function projectPoint(lon: number, lat: number, bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }, width: number, height: number, padding: number) {
  const x = padding + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - 2 * padding);
  const y = padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - 2 * padding);
  return { x, y };
}

function getBounds(coords: number[][]) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lon, lat] of coords) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return { minLon, maxLon, minLat, maxLat };
}

function flattenCoords(geometry: GeoFeature['geometry']): number[][] {
  const all: number[][] = [];
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates as number[][][]) {
      all.push(...ring);
    }
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates as number[][][][]) {
      for (const ring of polygon) {
        all.push(...ring);
      }
    }
  }
  return all;
}

function buildPaths(geometry: GeoFeature['geometry'], bounds: ReturnType<typeof getBounds>, w: number, h: number, padding: number): string[] {
  const paths: string[] = [];
  const rings: number[][][] = [];

  if (geometry.type === 'Polygon') {
    rings.push(...(geometry.coordinates as number[][][]));
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates as number[][][][]) {
      rings.push(...polygon);
    }
  }

  for (const ring of rings) {
    if (ring.length < 3) continue;
    const points = ring.map(([lon, lat]) => projectPoint(lon, lat, bounds, w, h, padding));
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
    paths.push(d);
  }
  return paths;
}

export default function CountryMap({ countryName, className }: CountryMapProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const svgW = 200;
  const svgH = 140;
  const padding = 8;

  useEffect(() => {
    setLoading(true);
    setError(false);
    setPaths([]);

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(r => r.json())
      .then(data => {
        const feature: GeoFeature | undefined = data.features.find(
          (f: GeoFeature) =>
            f.properties.name?.toLowerCase() === countryName.toLowerCase() ||
            f.properties.ADMIN?.toLowerCase() === countryName.toLowerCase()
        );

        if (!feature) {
          setError(true);
          setLoading(false);
          return;
        }

        const allCoords = flattenCoords(feature.geometry);
        if (allCoords.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        const bounds = getBounds(allCoords);
        const builtPaths = buildPaths(feature.geometry, bounds, svgW, svgH, padding);
        setPaths(builtPaths);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [countryName]);

  if (error) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-2">
        <MapPin size={12} className="text-[hsl(24,95%,53%)]" />
        <span className="text-xs font-semibold text-slate-600">Located in {countryName}</span>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ height: svgH + 16 }}>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-3 h-3 border-2 border-slate-200 border-t-orange-400 rounded-full animate-spin" />
            <span className="text-xs">Loading map…</span>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            width={svgW}
            height={svgH}
            className="overflow-visible"
          >
            <defs>
              <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="hsl(24,95%,53%)" floodOpacity="0.25" />
              </filter>
            </defs>
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="hsl(24,95%,53%)"
                fillOpacity={0.15}
                stroke="hsl(24,95%,53%)"
                strokeWidth={1.2}
                strokeLinejoin="round"
                filter="url(#map-shadow)"
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
