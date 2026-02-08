import { type NextRequest, NextResponse } from 'next/server'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const radius = Number(searchParams.get('radius') || '500')

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  try {
    const res = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
      { signal: AbortSignal.timeout(10000), next: { revalidate: 300 } }
    )

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    let maxMag = 0
    let count = 0
    const earthquakes: { lat: number; lon: number; magnitude: number; distanceKm: number }[] = []

    for (const feature of data.features) {
      const eqLon = feature.geometry.coordinates[0]
      const eqLat = feature.geometry.coordinates[1]
      const mag = feature.properties.mag
      const dist = haversine(lat, lon, eqLat, eqLon)

      if (dist < radius) {
        maxMag = Math.max(maxMag, mag)
        count++
        earthquakes.push({
          lat: eqLat,
          lon: eqLon,
          magnitude: mag,
          distanceKm: Math.round(dist * 10) / 10,
        })
      }
    }

    return NextResponse.json({ maxMag, count, earthquakes, status: 'LIVE' })
  } catch {
    return NextResponse.json({ maxMag: 0, count: 0, earthquakes: [], status: 'FALLBACK' })
  }
}
