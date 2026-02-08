'use client'

import { useState } from 'react'
import type { RiskScore, SeismicData, FireData } from '@/lib/types'
import { RISK_THRESHOLDS } from '@/lib/types'
import { Maximize2, Minimize2, Satellite } from 'lucide-react'

interface ThreatMapProps {
  lat: number
  lon: number
  risks: RiskScore[]
  seismic: SeismicData | null
  fires: FireData | null
}

export function ThreatMap({ lat, lon, risks, seismic, fires }: ThreatMapProps) {
  const [expanded, setExpanded] = useState(false)

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lon}&z=10&t=k&output=embed`

  const topRisks = [...risks]
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score > RISK_THRESHOLDS.LOW)
    .slice(0, 4)

  return (
    <div
      className={`glass rounded-2xl overflow-hidden relative transition-all duration-500 ${expanded ? 'col-span-2 row-span-2' : ''}`}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-2">
          <Satellite className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-mono text-primary/80 tracking-wider">
            SATELLITE VIEW
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="h-7 w-7 rounded-md bg-background/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Google Maps embed */}
      <iframe
        title="Satellite threat map"
        src={mapSrc}
        className="w-full border-0 grayscale-[30%] contrast-[1.1]"
        style={{ height: expanded ? 520 : 360 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      {/* Bottom overlay with telemetry */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-3 pb-3 pt-8">
        <div className="flex items-end justify-between gap-4">
          {/* Coordinates */}
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-primary/60 tracking-wider">COORDINATES</p>
            <p className="text-[11px] font-mono text-foreground/80">
              {lat.toFixed(4)}N, {lon.toFixed(4)}E
            </p>
          </div>

          {/* Threat badges */}
          {topRisks.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1.5">
              {topRisks.map((risk) => (
                <span
                  key={risk.type}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider"
                  style={{
                    background: `${risk.color}18`,
                    color: risk.color,
                    border: `1px solid ${risk.color}40`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: risk.color }}
                  />
                  {risk.type.toUpperCase()} {risk.score}%
                </span>
              ))}
            </div>
          )}

          {/* Counts */}
          <div className="flex gap-3 text-[10px] font-mono text-muted-foreground flex-shrink-0">
            <span>EQ: {seismic?.count ?? 0}</span>
            <span>FIRES: {fires?.count ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
