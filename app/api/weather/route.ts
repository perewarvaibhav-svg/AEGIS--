import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY

  // Return demo data if no API key
  if (!apiKey || apiKey.includes('your_')) {
    return NextResponse.json({
      temp: 26.5,
      pressure: 1010,
      humidity: 68,
      windSpeed: 12.0,
      windDeg: 180,
      visibility: 8000,
      aqi: 42,
      uv: 4.5,
      sunrise: '06:30',
      sunset: '18:45',
      localTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      description: 'Partly Cloudy',
      status: 'DEMO' as const,
    })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const d = await res.json()
    const offsetSeconds = d.timezone || 0
    const formatTime = (ts: number) => {
      const date = new Date((ts + offsetSeconds) * 1000)
      return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`
    }

    const nowUtc = Math.floor(Date.now() / 1000)

    return NextResponse.json({
      temp: d.main.temp,
      pressure: d.main.pressure,
      humidity: d.main.humidity,
      windSpeed: d.wind.speed,
      windDeg: d.wind?.deg || 0,
      visibility: d.visibility || 10000,
      aqi: 50,
      uv: 5,
      sunrise: formatTime(d.sys.sunrise),
      sunset: formatTime(d.sys.sunset),
      localTime: formatTime(nowUtc),
      description: d.weather[0].description.replace(/\b\w/g, (c: string) => c.toUpperCase()),
      status: 'LIVE' as const,
    })
  } catch {
    return NextResponse.json({
      temp: 28.5,
      pressure: 1012,
      humidity: 75,
      windSpeed: 15.0,
      windDeg: 240,
      visibility: 10000,
      aqi: 45,
      uv: 6.5,
      sunrise: '06:15',
      sunset: '18:45',
      localTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      description: 'Partly Cloudy',
      status: 'FALLBACK' as const,
    })
  }
}
