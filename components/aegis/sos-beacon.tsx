'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, Phone, Radio, Copy, CheckCheck, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MissionState } from '@/lib/mission-store'

interface SosBeaconProps {
  mission: MissionState
}

export function SosBeacon({ mission }: SosBeaconProps) {
  const [activated, setActivated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const generateSOSMessage = useCallback(() => {
    const topRisks = mission.risks
      .filter((r) => r.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => `${r.type} (${r.score}%)`)
      .join(', ')

    return `SOS EMERGENCY - AEGIS SENTINEL
ID: ${mission.emergencyId}
Location: ${mission.city}
Coordinates: ${mission.lat.toFixed(6)}, ${mission.lon.toFixed(6)}
Time: ${new Date().toISOString()}
Active Threats: ${topRisks || 'None above threshold'}
Weather: ${mission.weather?.temp ?? 'N/A'}°C, Wind: ${mission.weather?.windSpeed ?? 'N/A'}m/s
Seismic Activity: ${mission.seismic?.count ?? 0} events, Max: ${mission.seismic?.maxMag ?? 0}
Profile: ${mission.role}
---
This is an automated emergency beacon from Aegis Sentinel Disaster Mission Control.`
  }, [mission])

  const handleActivate = () => {
    let count = 5
    const timer = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(timer)
        setActivated(true)
      }
    }, 1000)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateSOSMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = generateSOSMessage()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!activated) {
    return (
      <div className="space-y-4 animate-float-up">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold tracking-widest uppercase text-red-400">
            SOS Emergency Beacon
          </h3>
        </div>

        <div className="glass rounded-2xl p-6 border-red-500/20 border space-y-4">
          <div className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center relative">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-pulse-ring" />
            </div>
            <p className="text-sm text-foreground font-semibold">Emergency Broadcast Terminal</p>
            <p className="text-xs text-muted-foreground">
              Activating this beacon generates an emergency message with your mission data.
              Share with local authorities or emergency services.
            </p>
          </div>

          {countdown < 5 && countdown > 0 ? (
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 tabular-nums">{countdown}</div>
              <p className="text-xs text-muted-foreground mt-1">Activating beacon...</p>
            </div>
          ) : (
            <Button
              onClick={handleActivate}
              variant="destructive"
              className="w-full h-12 text-sm font-bold tracking-wider"
            >
              <Radio className="h-4 w-4 mr-2" />
              ACTIVATE SOS BEACON
            </Button>
          )}

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="font-mono">{mission.lat.toFixed(4)}, {mission.lon.toFixed(4)}</span>
            <Clock className="h-3 w-3 ml-auto" />
            <span className="font-mono">{mission.emergencyId}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-float-up">
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 text-red-400 animate-pulse" />
        <h3 className="text-sm font-semibold tracking-widest uppercase text-red-400">
          BEACON ACTIVE
        </h3>
      </div>

      <div className="glass rounded-2xl p-5 border-red-500/30 border space-y-4">
        <pre className="text-[11px] font-mono text-foreground/80 whitespace-pre-wrap bg-secondary/30 rounded-xl p-4 max-h-64 overflow-y-auto leading-relaxed">
          {generateSOSMessage()}
        </pre>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 h-10 text-xs font-semibold bg-transparent"
          >
            {copied ? <CheckCheck className="h-3.5 w-3.5 mr-2 text-primary" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
            {copied ? 'COPIED' : 'COPY MESSAGE'}
          </Button>
          <Button
            onClick={() => {
              const msg = encodeURIComponent(generateSOSMessage())
              window.open(`https://wa.me/?text=${msg}`, '_blank')
            }}
            variant="outline"
            className="flex-1 h-10 text-xs font-semibold bg-transparent"
          >
            <Phone className="h-3.5 w-3.5 mr-2" />
            SHARE VIA WHATSAPP
          </Button>
        </div>
      </div>
    </div>
  )
}
