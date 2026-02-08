'use client'

import { useEffect, useState } from 'react'
import type { WeatherData } from '@/lib/types'
import {
  Thermometer,
  Gauge,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Sun,
  Sunset,
  Clock,
} from 'lucide-react'

interface WeatherGridProps {
  weather: WeatherData
  city: string
}

const weatherItems = [
  { key: 'temp', label: 'TEMP', unit: '\u00B0C', icon: Thermometer, color: '#f97316' },
  { key: 'pressure', label: 'PRESSURE', unit: 'hPa', icon: Gauge, color: '#a855f7' },
  { key: 'humidity', label: 'HUMIDITY', unit: '%', icon: Droplets, color: '#3b82f6' },
  { key: 'windSpeed', label: 'WIND', unit: 'm/s', icon: Wind, color: '#38bdf8' },
  { key: 'visibility', label: 'VISIBILITY', unit: 'km', icon: Eye, color: '#6ee7b7' },
  { key: 'aqi', label: 'AQI', unit: '', icon: Cloud, color: '#94a3b8' },
  { key: 'uv', label: 'UV INDEX', unit: '', icon: Sun, color: '#fbbf24' },
  { key: 'sunrise', label: 'SUNRISE', unit: '', icon: Sun, color: '#fb923c' },
  { key: 'sunset', label: 'SUNSET', unit: '', icon: Sunset, color: '#c084fc' },
  { key: 'localTime', label: 'LOCAL TIME', unit: '', icon: Clock, color: '#10b981' },
] as const

export function WeatherGrid({ weather, city }: WeatherGridProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const getValue = (key: string) => {
    const val = weather[key as keyof WeatherData]
    if (key === 'visibility' && typeof val === 'number') return (val / 1000).toFixed(1)
    return val
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Weather Telemetry
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
          {weather.status}
        </span>
        <span className="text-xs text-muted-foreground">{city}</span>
      </div>

      <div className="grid grid-cols-5 gap-2 stagger-children">
        {weatherItems.map((item) => {
          const Icon = item.icon
          const val = getValue(item.key)
          return (
            <div
              key={item.key}
              className={`glass rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 hover:border-primary/30 ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Icon className="mx-auto mb-2 h-4 w-4" style={{ color: item.color }} />
              <div className="text-xl font-bold text-foreground tabular-nums">
                {val}
                {item.unit && <span className="text-xs text-muted-foreground ml-0.5">{item.unit}</span>}
              </div>
              <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mt-1">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
