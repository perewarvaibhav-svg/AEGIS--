'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_OPTIONS } from '@/lib/types'
import { MapPin, Shield, Navigation, Lock, ChevronDown } from 'lucide-react'

interface OnboardingProps {
  onLock: (data: { city: string; lat: number; lon: number; role: string }) => void
}

export function Onboarding({ onLock }: OnboardingProps) {
  const [city, setCity] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [role, setRole] = useState('General User')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState<'privacy' | 'location'>('privacy')

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setErrors(['Geolocation is not supported by this browser.'])
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLat = +pos.coords.latitude.toFixed(6)
        const newLon = +pos.coords.longitude.toFixed(6)
        setLat(String(newLat))
        setLon(String(newLon))

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLon}`
          )
          if (res.ok) {
            const data = await res.json()
            const name =
              data.address?.city || data.address?.town || data.address?.village || data.address?.county || ''
            const state = data.address?.state || data.address?.country || ''
            setCity(name ? `${name}, ${state}` : `Location ${newLat}, ${newLon}`)
          }
        } catch {
          setCity(`Location ${newLat}, ${newLon}`)
        }
        setGpsLoading(false)
      },
      () => {
        setErrors(['GPS access denied. Please enter coordinates manually.'])
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = () => {
    const newErrors: string[] = []
    if (!city.trim()) newErrors.push('City name is required')
    const parsedLat = Number.parseFloat(lat)
    const parsedLon = Number.parseFloat(lon)
    if (Number.isNaN(parsedLat) || Math.abs(parsedLat) > 90) newErrors.push('Valid latitude required (-90 to 90)')
    if (Number.isNaN(parsedLon) || Math.abs(parsedLon) > 180) newErrors.push('Valid longitude required (-180 to 180)')
    if (parsedLat === 0 && parsedLon === 0) newErrors.push('Please provide valid coordinates')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onLock({ city: city.trim(), lat: parsedLat, lon: parsedLon, role })
  }

  if (step === 'privacy') {
    return (
      <div className="animate-float-up max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data Privacy Protocol</h2>
              <p className="text-xs text-muted-foreground">Aegis Sentinel requires your consent</p>
            </div>
          </div>

          <div className="glass-emerald rounded-xl p-5 space-y-3 text-sm text-foreground/80">
            <p className="font-semibold text-foreground">Data Collection & Usage</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Location Coordinates</strong>: Processed client-side for satellite sync. Not stored on servers.</li>
              <li><strong className="text-foreground">Authority Profile</strong>: Used to tailor tactical advice to your role.</li>
              <li><strong className="text-foreground">Mission Logs</strong>: Stored in your browser session only.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2">Security Assurances</p>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>No data is stored on external cloud servers</li>
              <li>No persistent tracking outside active sessions</li>
              <li>Full data purge capability at any time</li>
            </ul>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              I accept the tactical data processing protocols
            </span>
          </label>

          <Button
            onClick={() => setStep('location')}
            disabled={!privacyAccepted}
            className="w-full h-12 text-sm font-semibold tracking-wide"
          >
            ACCEPT & INITIALIZE
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-float-up max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Telemetry Calibration</h2>
            <p className="text-xs text-muted-foreground">Define your location to enable satellite intelligence</p>
          </div>
        </div>

        {/* GPS Sync */}
        <button
          type="button"
          onClick={handleGPS}
          disabled={gpsLoading}
          className="w-full glass-emerald rounded-xl p-4 flex items-center gap-4 transition-all hover:border-primary/40 cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`h-5 w-5 text-primary ${gpsLoading ? 'animate-spin' : ''}`} />
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-foreground">
              {gpsLoading ? 'Acquiring GPS Signal...' : 'Use GPS for Device Location'}
            </p>
            <p className="text-xs text-muted-foreground">Automatic coordinate detection</p>
          </div>
        </button>

        {/* Manual inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">City Name</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city name"
              className="bg-secondary/50 border-border/50 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Latitude</Label>
            <Input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 28.6139"
              step="any"
              className="bg-secondary/50 border-border/50 h-11 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Longitude</Label>
            <Input
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="e.g. 77.2090"
              step="any"
              className="bg-secondary/50 border-border/50 h-11 font-mono"
            />
          </div>
        </div>

        {/* Role selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Authority Profile</Label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 rounded-lg bg-secondary/50 border border-border/50 px-3 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((err) => (
              <p key={err} className="text-xs text-red-400">
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Common locations helper */}
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            Need help finding coordinates?
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {[
              { name: 'New Delhi', lat: 28.6139, lon: 77.209 },
              { name: 'New York', lat: 40.7128, lon: -74.006 },
              { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
              { name: 'London', lat: 51.5074, lon: -0.1278 },
              { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
              { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
            ].map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => {
                  setCity(loc.name)
                  setLat(String(loc.lat))
                  setLon(String(loc.lon))
                }}
                className="text-left p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="text-foreground font-medium">{loc.name}</span>
                <br />
                <span className="font-mono text-[10px]">
                  {loc.lat}, {loc.lon}
                </span>
              </button>
            ))}
          </div>
        </details>

        <Button
          onClick={handleSubmit}
          className="w-full h-12 text-sm font-semibold tracking-wide gap-2"
        >
          <Lock className="h-4 w-4" />
          LOCK LOCATION & PROCEED
        </Button>
      </div>
    </div>
  )
}
