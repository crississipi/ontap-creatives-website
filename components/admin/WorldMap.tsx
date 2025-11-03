// components/VisitorLocationsMap.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { Map, StyleSpecification } from 'react-map-gl/maplibre'
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
}

interface CityData {
  city: string
  region: string
  country: string
  latitude: number
  longitude: number
  visitorCount: number
}

interface VisitorLocationsMapProps {
  days?: number
  clientId?: number
  viewMode?: 'points' | 'heatmap' | 'cities'
}

export default function WorldMap({ 
  days = 30, 
  clientId, 
  viewMode = 'points' 
}: VisitorLocationsMapProps) {
  const [visitorLocations, setVisitorLocations] = useState<VisitorLocation[]>([])
  const [cityData, setCityData] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState(viewMode)

  const [initialViewState] = useState({
    longitude: 120.9842,
    latitude: 14.5995,
    zoom: 3,
    pitch: 0,
    bearing: 0
  })

  // Fetch visitor locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('days', days.toString())
        if (clientId) params.append('clientId', clientId.toString())

        const [locationsRes, citiesRes] = await Promise.all([
          fetch(`/api/visitor/locations?${params}`),
          fetch(`/api/visitor/cities?${params}`)
        ])

        if (locationsRes.ok && citiesRes.ok) {
          const locationsData = await locationsRes.json()
          const citiesData = await citiesRes.json()
          
          setVisitorLocations(locationsData.locations)
          setCityData(citiesData.cities)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days, clientId])

  // Create layers based on selected view
  const layers = useMemo(() => {
    const commonLayerProps = {
      pickable: true,
      autoHighlight: true,
    }

    switch (selectedView) {
      case 'points':
        return [
          new ScatterplotLayer({
            ...commonLayerProps,
            id: 'visitor-points',
            data: visitorLocations,
            getPosition: (d: VisitorLocation) => d.position,
            getRadius: 1000,
            getFillColor: [255, 140, 0, 180],
            getLineColor: [0, 0, 0],
            radiusMinPixels: 2,
            radiusMaxPixels: 8,
            lineWidthMinPixels: 1
          })
        ]

      case 'heatmap':
        return [
          new HeatmapLayer({
            id: 'visitor-heatmap',
            data: visitorLocations,
            getPosition: (d: VisitorLocation) => d.position,
            getWeight: 1,
            radiusPixels: 30,
            intensity: 1,
            threshold: 0.1
          })
        ]

      case 'cities':
        const cityFeatures = cityData.map(city => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [city.longitude, city.latitude]
          },
          properties: {
            city: city.city,
            region: city.region,
            country: city.country,
            visitorCount: city.visitorCount
          }
        }))

        return [
          new GeoJsonLayer({
            ...commonLayerProps,
            id: 'city-visitors',
            data: {
              type: 'FeatureCollection',
              features: cityFeatures
            },
            filled: true,
            pointRadiusMinPixels: 4,
            pointRadiusScale: 100,
            getPointRadius: (f: any) => Math.sqrt(f.properties.visitorCount) * 2,
            getFillColor: (f: any) => {
              const count = f.properties.visitorCount
              const intensity = Math.min(count / 100 * 255, 255)
              return [intensity, 100, 200, 200]
            },
            getLineColor: [0, 0, 0, 255]
          })
        ]

      default:
        return []
    }
  }, [visitorLocations, cityData, selectedView])

  const getTooltip = ({ object }: any) => {
    if (!object) return null

    if (selectedView === 'points' && object.properties) {
      const data = object.properties as VisitorLocation
      return {
        html: `
          <div class="p-2 bg-white border border-gray-300 rounded shadow-lg">
            <strong>Visitor</strong><br/>
            City: ${data.city || 'Unknown'}<br/>
            Region: ${data.region || 'Unknown'}<br/>
            Country: ${data.country || 'Unknown'}<br/>
            Last Visit: ${new Date(data.lastVisit).toLocaleDateString()}<br/>
            Client: ${data.clientName}
          </div>
        `,
        style: {
          backgroundColor: 'transparent',
          border: 'none'
        }
      }
    }

    if (selectedView === 'cities' && object.properties) {
      const { city, region, country, visitorCount } = object.properties
      return {
        html: `
          <div class="p-2 bg-white border border-gray-300 rounded shadow-lg">
            <strong>${city}</strong><br/>
            Region: ${region}<br/>
            Country: ${country}<br/>
            Visitors: ${visitorCount}
          </div>
        `,
        style: {
          backgroundColor: 'transparent',
          border: 'none'
        }
      }
    }

    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading visitor locations...</div>
      </div>
    )
  }

  // Use a style that doesn't require attribution
  const customMapStyle: StyleSpecification = {
    version: 8,
    sources: {
      'simple-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'simple-tiles',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }

  return (
    <div className="w-full h-full">

      {/* Map */}
      <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden border">
        <DeckGL
          initialViewState={initialViewState}
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

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4">
          <h3 className="font-semibold text-gray-700">Total Visitors</h3>
          <p className="text-2xl font-bold text-blue-600">{visitorLocations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">Cities</h3>
          <p className="text-2xl font-bold text-green-600">{cityData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">View Mode</h3>
          <p className="text-lg font-medium text-purple-600 capitalize">{selectedView}</p>
        </div>
      </div>
    </div>
  )
}