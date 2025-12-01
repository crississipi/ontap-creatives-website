// app/api/visitor/regions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

// Function to classify region based on coordinates
function classifyRegionByCoordinates(latitude: number, longitude: number): string | null {
  // Define approximate boundaries for each region
  const regionBoundaries = [
    { 
      region: "National Capital Region", 
      bounds: { minLat: 14.4, maxLat: 14.8, minLon: 120.9, maxLon: 121.2 } 
    },
    { 
      region: "Cordillera Administrative Region", 
      bounds: { minLat: 16.0, maxLat: 18.0, minLon: 120.5, maxLon: 121.5 } 
    },
    { 
      region: "Ilocos Region", 
      bounds: { minLat: 15.5, maxLat: 18.5, minLon: 119.5, maxLon: 120.8 } 
    },
    { 
      region: "Cagayan Valley", 
      bounds: { minLat: 16.0, maxLat: 18.5, minLon: 121.0, maxLon: 122.5 } 
    },
    { 
      region: "Central Luzon", 
      bounds: { minLat: 14.5, maxLat: 16.0, minLon: 120.0, maxLon: 121.5 } 
    },
    { 
      region: "CALABARZON", 
      bounds: { minLat: 13.5, maxLat: 14.8, minLon: 120.8, maxLon: 122.0 } 
    },
    { 
      region: "MIMAROPA", 
      bounds: { minLat: 9.0, maxLat: 13.5, minLon: 117.0, maxLon: 122.0 } 
    },
    { 
      region: "Bicol Region", 
      bounds: { minLat: 12.0, maxLat: 14.5, minLon: 122.5, maxLon: 124.5 } 
    },
    { 
      region: "Western Visayas", 
      bounds: { minLat: 9.5, maxLat: 12.0, minLon: 121.5, maxLon: 123.5 } 
    },
    { 
      region: "Central Visayas", 
      bounds: { minLat: 9.0, maxLat: 11.5, minLon: 123.0, maxLon: 124.5 } 
    },
    { 
      region: "Eastern Visayas", 
      bounds: { minLat: 9.5, maxLat: 12.5, minLon: 124.0, maxLon: 126.0 } 
    },
    { 
      region: "Zamboanga Peninsula", 
      bounds: { minLat: 6.5, maxLat: 8.5, minLon: 121.5, maxLon: 123.5 } 
    },
    { 
      region: "Northern Mindanao", 
      bounds: { minLat: 7.5, maxLat: 9.0, minLon: 124.0, maxLon: 125.5 } 
    },
    { 
      region: "Davao Region", 
      bounds: { minLat: 5.5, maxLat: 8.0, minLon: 125.0, maxLon: 126.5 } 
    },
    { 
      region: "SOCCSKSARGEN", 
      bounds: { minLat: 5.5, maxLat: 7.5, minLon: 124.0, maxLon: 125.5 } 
    },
    { 
      region: "Caraga", 
      bounds: { minLat: 8.0, maxLat: 10.0, minLon: 125.0, maxLon: 126.5 } 
    },
    { 
      region: "Bangsamoro Autonomous Region in Muslim Mindanao", 
      bounds: { minLat: 6.0, maxLat: 8.5, minLon: 121.5, maxLon: 124.5 } 
    }
  ]

  for (const region of regionBoundaries) {
    if (latitude >= region.bounds.minLat && 
        latitude <= region.bounds.maxLat && 
        longitude >= region.bounds.minLon && 
        longitude <= region.bounds.maxLon) {
      return region.region
    }
  }
  
  return null
}

// Helper function to normalize region names
const normalizeRegionName = (name: string): string => {
  if (!name) return ''
  return name.toLowerCase().trim()
    .replace(/\s+/g, ' ')
    .replace(/region\s*[ivx]+/gi, '')
    .replace(/region\s*[ivx]+[^a-z]*/gi, '')
    .replace(/\b(philippines|ph)\b/gi, '')
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all active visitors with their sessions
    const visitors = await prisma.visitor.findMany({
      where: {
        lastVisit: {
          gte: startDate
        },
        isActive: true
      },
      include: {
        sessions: {
          where: {
            dateVisited: {
              gte: startDate
            }
          },
          orderBy: {
            dateVisited: 'desc'
          }
        },
        client: {
          select: {
            clientName: true
          }
        }
      }
    })

    // Process visitors to classify regions and count visits
    const visitorLocations: any[] = []
    const regionCounts: Record<string, number> = {}

    // Initialize region counts
    defaultRegions.forEach(region => {
      regionCounts[region.region] = 0
    })

    visitors.forEach(visitor => {
      let region = visitor.region
      
      // If no region in database, try to classify by coordinates
      if (!region && visitor.latitude && visitor.longitude) {
        region = classifyRegionByCoordinates(visitor.latitude, visitor.longitude)
      }
      
      // If still no region, use city or country to guess
      if (!region) {
        if (visitor.city) {
          // Simple city to region mapping for major cities
          const cityRegionMap: Record<string, string> = {
            'manila': 'National Capital Region',
            'quezon city': 'National Capital Region',
            'makati': 'National Capital Region',
            'taguig': 'National Capital Region',
            'pasig': 'National Capital Region',
            'mandaluyong': 'National Capital Region',
            'pasay': 'National Capital Region',
            'paranaque': 'National Capital Region',
            'las pinas': 'National Capital Region',
            'muntinlupa': 'National Capital Region',
            'marikina': 'National Capital Region',
            'caloocan': 'National Capital Region',
            'valenzuela': 'National Capital Region',
            'malabon': 'National Capital Region',
            'navotas': 'National Capital Region',
            'san juan': 'National Capital Region',
            'baguio': 'Cordillera Administrative Region',
            'dagupan': 'Ilocos Region',
            'san fernando': 'Ilocos Region',
            'tuguegarao': 'Cagayan Valley',
            'cabanatuan': 'Central Luzon',
            'angeles': 'Central Luzon',
            'batangas': 'CALABARZON',
            'lucena': 'CALABARZON',
            'antipolo': 'CALABARZON',
            'cavite': 'CALABARZON',
            'laguna': 'CALABARZON',
            'puerto princesa': 'MIMAROPA',
            'legazpi': 'Bicol Region',
            'naga': 'Bicol Region',
            'iloilo': 'Western Visayas',
            'bacolod': 'Western Visayas',
            'roxas': 'Western Visayas',
            'cebu': 'Central Visayas',
            'mandaue': 'Central Visayas',
            'lapu-lapu': 'Central Visayas',
            'tacloban': 'Eastern Visayas',
            'ormoc': 'Eastern Visayas',
            'zamboanga': 'Zamboanga Peninsula',
            'dipolog': 'Zamboanga Peninsula',
            'cagayan de oro': 'Northern Mindanao',
            'iligan': 'Northern Mindanao',
            'davao': 'Davao Region',
            'tagum': 'Davao Region',
            'general santos': 'SOCCSKSARGEN',
            'koronadal': 'SOCCSKSARGEN',
            'butuan': 'Caraga',
            'surigao': 'Caraga',
            'cotabato': 'Bangsamoro Autonomous Region in Muslim Mindanao',
            'marawi': 'Bangsamoro Autonomous Region in Muslim Mindanao'
          }
          
          const cityKey = visitor.city.toLowerCase()
          region = cityRegionMap[cityKey] || null
        }
      }

      // If we found a region, count it and create location data
      if (region) {
        // Find the matching default region
        const normalizedRegion = normalizeRegionName(region)
        const matchedDefaultRegion = defaultRegions.find(defRegion => {
          const defNormalized = normalizeRegionName(defRegion.region)
          return defNormalized.includes(normalizedRegion) || normalizedRegion.includes(defNormalized)
        })

        const finalRegion = matchedDefaultRegion ? matchedDefaultRegion.region : region
        
        // Count this visitor in the region
        regionCounts[finalRegion] = (regionCounts[finalRegion] || 0) + 1

        // Only add to map if we have coordinates
        if (visitor.latitude && visitor.longitude) {
          visitorLocations.push({
            id: visitor.visitorID,
            uuid: visitor.visitorUUID,
            position: [visitor.longitude, visitor.latitude] as [number, number],
            city: visitor.city,
            region: finalRegion,
            country: visitor.country,
            lastVisit: visitor.lastVisit.toISOString(),
            clientName: visitor.client?.clientName || 'Anonymous',
            visitCount: visitor.sessions.length,
            frequency: Math.min(visitor.sessions.length / 10, 1) // Normalize frequency 0-1
          })
        }
      }
    })

    // Update default regions with actual counts
    const updatedRegions = defaultRegions.map(region => ({
      ...region,
      count: regionCounts[region.region] || 0
    }))

    return NextResponse.json({
      regions: updatedRegions,
      visitors: visitorLocations,
      totalVisitors: visitors.length,
      totalLocations: visitorLocations.length
    })
  } catch (error) {
    console.error('Error fetching region data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch region data',
        regions: defaultRegions,
        visitors: [],
        totalVisitors: 0,
        totalLocations: 0
      },
      { status: 500 }
    )
  }
}