// components/EnhancedWorldMap.tsx
'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import DeckGL from '@deck.gl/react'
import { PolygonLayer, ScatterplotLayer } from '@deck.gl/layers'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { Map } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

interface VisitorLocation {
  id: number
  uuid: string
  position: [number, number]
  city: string | null
  region: string | null
  country: string | null
  lastVisit: string
  clientName: string
  visitCount: number
  frequency: number
}

interface EnhancedWorldMapProps {
  days?: number
  clientId?: number
  viewMode?: 'points' | 'heatmap'
  selectedRegion?: string | null
  onClearRegion?: () => void
}

// Define the map style properly
const customMapStyle = {
  version: 8 as const,
  sources: {
    'simple-tiles': {
      type: 'raster' as const,
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster' as const,
      source: 'simple-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
}

const defaultRegions = [
  {
    region: "National Capital Region",
    abbr: "NCR",
    latitude: 14.5736,
    longitude: 121.03297,
    count: 0
  },
  {
    region: "Cordillera Administrative Region",
    abbr: "CAR",
    latitude: 17.35125,
    longitude: 121.17189,
    count: 0
  },
  {
    region: "Ilocos Region",
    abbr: "Region I",
    latitude: 16.08321,
    longitude: 120.61999,
    count: 0
  },
  {
    region: "Cagayan Valley",
    abbr: "Region II",
    latitude: 17.5751,
    longitude: 121.7269,
    count: 0
  },
  {
    region: "Central Luzon",
    abbr: "Region III",
    latitude: 15.48277,
    longitude: 120.71200,
    count: 0
  },
  {
    region: "CALABARZON",
    abbr: "Region IV-A",
    latitude: 14.10078,
    longitude: 121.07937,
    count: 0
  },
  {
    region: "MIMAROPA",
    abbr: "Region IV-B",
    latitude: 9.84321,
    longitude: 118.73648,
    count: 0
  },
  {
    region: "Bicol Region",
    abbr: "Region V",
    latitude: 13.42099,
    longitude: 123.41370,
    count: 0
  },
  {
    region: "Western Visayas",
    abbr: "Region VI",
    latitude: 11.00498,
    longitude: 122.53727,
    count: 0
  },
  {
    region: "Central Visayas",
    abbr: "Region VII",
    latitude: 9.81688,
    longitude: 124.06414,
    count: 0
  },
  {
    region: "Eastern Visayas",
    abbr: "Region VIII",
    latitude: 12.24455,
    longitude: 125.03882,
    count: 0
  },
  {
    region: "Zamboanga Peninsula",
    abbr: "Region IX",
    latitude: 8.15408,
    longitude: 123.25879,
    count: 0
  },
  {
    region: "Northern Mindanao",
    abbr: "Region X",
    latitude: 8.02016,
    longitude: 124.68565,
    count: 0
  },
  {
    region: "Davao Region",
    abbr: "Region XI",
    latitude: 7.30416,
    longitude: 126.08934,
    count: 0
  },
  {
    region: "SOCCSKSARGEN",
    abbr: "Region XII",
    latitude: 6.27066,
    longitude: 124.68565,
    count: 0
  },
  {
    region: "Caraga",
    abbr: "Region XIII",
    latitude: 8.80146,
    longitude: 125.74069,
    count: 0
  },
  {
    region: "Bangsamoro Autonomous Region in Muslim Mindanao",
    abbr: "BARMM",
    latitude: 6.95700,
    longitude: 124.24216,
    count: 0
  }
]

const regionBounds: Record<string, { latDelta: number; lonDelta: number }> = {
  NCR: { latDelta: 0.6, lonDelta: 0.6 },
  CAR: { latDelta: 1.2, lonDelta: 1.2 },
  'Region I': { latDelta: 1, lonDelta: 1.2 },
  'Region II': { latDelta: 1.2, lonDelta: 1.3 },
  'Region III': { latDelta: 1, lonDelta: 1.3 },
  'Region IV-A': { latDelta: 1, lonDelta: 1.3 },
  'Region IV-B': { latDelta: 1.4, lonDelta: 1.4 },
  'Region V': { latDelta: 1.1, lonDelta: 1.3 },
  'Region VI': { latDelta: 1.4, lonDelta: 1.5 },
  'Region VII': { latDelta: 1.2, lonDelta: 1.2 },
  'Region VIII': { latDelta: 1.2, lonDelta: 1.4 },
  'Region IX': { latDelta: 1.3, lonDelta: 1.3 },
  'Region X': { latDelta: 1.1, lonDelta: 1.2 },
  'Region XI': { latDelta: 1, lonDelta: 1.1 },
  'Region XII': { latDelta: 1, lonDelta: 1.1 },
  'Region XIII': { latDelta: 1.1, lonDelta: 1.2 },
  BARMM: { latDelta: 1.2, lonDelta: 1.2 },
}

const buildRegionPolygon = (region: typeof defaultRegions[number]) => {
  const { latDelta, lonDelta } = regionBounds[region.abbr] ?? { latDelta: 1.1, lonDelta: 1.1 }
  const north = region.latitude + latDelta
  const south = region.latitude - latDelta
  const east = region.longitude + lonDelta
  const west = region.longitude - lonDelta

  return [
    [west, south],
    [west, north],
    [east, north],
    [east, south],
    [west, south],
  ]
}

const regionPolygons = defaultRegions.map(region => ({
  ...region,
  polygon: buildRegionPolygon(region),
}))

export default function WorldMap({ 
  days = 30, 
  clientId, 
  viewMode = 'points',
  selectedRegion = null,
  onClearRegion,
}: EnhancedWorldMapProps) {
  const [visitorLocations, setVisitorLocations] = useState<VisitorLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState(viewMode)

  const [viewState, setViewState] = useState({
    longitude: 122.0841,
    latitude: 12.8797,
    zoom: 5,
    pitch: 0,
    bearing: 0
  })

  // Fetch visitor locations with frequency data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://ontap-creatives-website.vercel.app/api/visitor/regions?days=${days}`)
        const data = await response.json()
        
        if (data.visitors) {
          setVisitorLocations(data.visitors)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days, clientId])

  // Helper function to normalize region names for better matching
  const normalizeRegionName = useCallback((name: string): string => {
    if (!name) return '';
    return name.toLowerCase().trim()
      .replace(/\s+/g, ' ')
      .replace(/region\s*[ivx]+/gi, '')
      .replace(/region\s*[ivx]+[^a-z]*/gi, '')
      .replace(/\b(philippines|ph)\b/gi, '')
      .trim();
  }, []);

  // Filter locations by selected region
  const normalizedRegion = useMemo(() => selectedRegion?.toLowerCase() ?? null, [selectedRegion]);

  const filteredLocations = useMemo(() => {
    if (!normalizedRegion) return visitorLocations;
    const normalizedSelected = normalizeRegionName(normalizedRegion);
    return visitorLocations.filter(loc => {
      if (!loc.region) return false;
      const regionName = normalizeRegionName(loc.region);
      return (
        regionName === normalizedSelected ||
        regionName.includes(normalizedSelected) ||
        normalizedSelected.includes(regionName)
      );
    });
  }, [visitorLocations, normalizedRegion]);

  const highlightRegion = useMemo(() => {
    if (!normalizedRegion) return null;
    
    const normalizedSelected = normalizeRegionName(normalizedRegion);
    
    return defaultRegions.find(region => {
      const regionName = normalizeRegionName(region.region);
      const regionAbbr = region.abbr.toLowerCase();
      const selectedLower = normalizedRegion.toLowerCase();
      
      return (
        regionName === normalizedSelected ||
        regionName.includes(normalizedSelected) ||
        normalizedSelected.includes(regionName) ||
        regionAbbr === selectedLower ||
        region.region.toLowerCase() === selectedLower
      );
    }) ?? null;
  }, [normalizedRegion, normalizeRegionName]);

  const highlightPolygon = useMemo(() => {
    if (!highlightRegion) return null
    const region = regionPolygons.find(r => r.region === highlightRegion.region)
    return region?.polygon ?? null
  }, [highlightRegion])

  // Update view when region changes
  useEffect(() => {
    if (highlightRegion) {
      setViewState({
        longitude: highlightRegion.longitude,
        latitude: highlightRegion.latitude,
        zoom: 7,
        pitch: 0,
        bearing: 0
      });
    } else {
      setViewState({
        longitude: 122.0841,
        latitude: 12.8797,
        zoom: 5,
        pitch: 0,
        bearing: 0
      });
    }
  }, [highlightRegion]);

  const maxVisitCount = useMemo(() => {
    if (!visitorLocations.length) return 0;
    return visitorLocations.reduce((max, visitor) => Math.max(max, visitor.visitCount), 0);
  }, [visitorLocations]);

  // Create layers based on selected view
  const layers = useMemo(() => {
    const data = selectedRegion ? filteredLocations : visitorLocations

    switch (selectedView) {
      case 'points':
        return [
          new ScatterplotLayer({
            id: 'visitor-points',
            data: data,
            getPosition: (d: VisitorLocation) => d.position,
            radiusUnits: 'meters',
            getRadius: (d: VisitorLocation) => {
              if (!maxVisitCount) return 400
              const visitRatio = d.visitCount / maxVisitCount
              const frequencyBoost = d.frequency ?? 0
              return 400 + (visitRatio * 1400) + (frequencyBoost * 1000)
            },
            getFillColor: (d: VisitorLocation) => {
              // Color intensity based on frequency
              const intensity = Math.floor(100 + (d.frequency * 155)) // 100-255 based on frequency
              return [59, 130, 246, intensity] // Blue color with variable opacity
            },
            getLineColor: [30, 64, 175, 200], // Dark blue border
            radiusMinPixels: 4,
            radiusMaxPixels: 40,
            lineWidthMinPixels: 1,
            pickable: true,
            autoHighlight: true,
          })
        ].filter(Boolean) as any[]

      case 'heatmap':
        return [
          new HeatmapLayer({
            id: 'visitor-heatmap',
            data: data,
            getPosition: (d: VisitorLocation) => d.position,
            getWeight: (d: VisitorLocation) => d.visitCount, // Use visit count for weight
            radiusPixels: 50,
            intensity: 2,
            threshold: 0.1,
            colorRange: [
              [0, 0, 0, 0],
              [37, 99, 235, 128],   // Blue
              [59, 130, 246, 192],  // Lighter Blue
              [96, 165, 250, 255],  // Light Blue
              [239, 68, 68, 255]    // Red for highest density
            ]
          })
        ].filter(Boolean)

      default:
        return []
    }
  }, [visitorLocations, filteredLocations, selectedView, selectedRegion, highlightPolygon, maxVisitCount])

  const getTooltip = ({ object }: any) => {
    if (!object) return null

    const data = object as VisitorLocation
    return {
      html: `
        <div class="p-3 bg-white border border-gray-300 rounded-lg shadow-xl min-w-56">
          <div class="font-bold text-blue-600 mb-2">Visitor Location</div>
          <div class="space-y-1 text-sm">
            ${data.city ? `<div><span class="font-medium">City:</span> ${data.city}</div>` : ''}
            ${data.region ? `<div><span class="font-medium">Region:</span> ${data.region}</div>` : ''}
            <div><span class="font-medium">Total Visits:</span> ${data.visitCount}</div>
            <div><span class="font-medium">Last Visit:</span> ${new Date(data.lastVisit).toLocaleDateString()}</div>
            <div><span class="font-medium">Activity Level:</span> 
              <span class="inline-block w-16 bg-gray-200 rounded-full h-2 ml-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: ${(data.frequency * 100)}%"></div>
              </span>
              ${(data.frequency * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      `,
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px'
      }
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full rounded-lg border">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading visitor locations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {/* Map */}
      <div className="h-96 lg:h-[500px]">
        <DeckGL
          viewState={viewState}
          onViewStateChange={({ viewState: newViewState }) => {
            // Type-safe way to handle view state changes
            if (newViewState && typeof newViewState === 'object') {
              const viewStateObj = newViewState as {
                longitude?: number;
                latitude?: number;
                zoom?: number;
                pitch?: number;
                bearing?: number;
              };
              
              setViewState(prev => ({
                longitude: viewStateObj.longitude ?? prev.longitude,
                latitude: viewStateObj.latitude ?? prev.latitude,
                zoom: viewStateObj.zoom ?? prev.zoom,
                pitch: viewStateObj.pitch ?? prev.pitch,
                bearing: viewStateObj.bearing ?? prev.bearing,
              }));
            }
          }}
          controller={true}
          layers={layers}
          getTooltip={getTooltip}
        >
          <Map
            mapStyle={customMapStyle}
            attributionControl={false}
          />
        </DeckGL>
      </div>
    </div>
  )
}