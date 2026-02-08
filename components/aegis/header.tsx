'use client'

import { useEffect, useState } from 'react'
import { StatusPulse } from './status-pulse'
import {
  Shield,
  MapPin,
  Clock,
  Hash,
  RotateCcw,
  Settings,
  ArrowLeft,
} from 'lucide-react'

interface HeaderProps {
  city: string
  lat: number
  lon: number
  role: string
  emergencyId: string
  locked: boolean
  onReset: () => void
  onBack?: () => void
  showBack?: boolean
}

export function Header({ city, lat, lon, role, emergencyId, locked, onReset, onBack, showBack = true }: HeaderProps) {
  const [time, setTime] = useState('')
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
      setUptime((prev) => prev + 1)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/30">
      <div className="flex items-center gap-4 px-4 py-2.5">
        {/* Back Button */}
        {showBack && locked && (
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors group"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center animate-pulse-glow">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Aegis Sentinel</p>
            <p className="text-[9px] text-muted-foreground font-mono tracking-wider">
              DISASTER MISSION CONTROL v4.0
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-border/30 hidden sm:block" />

        {/* Status */}
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <StatusPulse status={locked ? 'online' : 'offline'} />
          <span className="text-[10px] font-mono text-muted-foreground">
            {locked ? 'MISSION ACTIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Location */}
        {locked && (
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground animate-slide-in-left">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-foreground font-medium truncate max-w-[120px]">{city}</span>
            </div>
            <span className="hidden lg:inline">{lat.toFixed(4)}, {lon.toFixed(4)}</span>
            <div className="flex items-center gap-1 hidden lg:flex">
              <Settings className="h-3 w-3" />
              <span>{role}</span>
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4 text-[10px] font-mono">
          {locked && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="text-primary">{emergencyId}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="tabular-nums">{time}</span>
          </div>
          {locked && (
            <span className="text-muted-foreground/60 hidden sm:inline">UP {formatUptime(uptime)}</span>
          )}
          {locked && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-muted-foreground hover:text-red-400 transition-colors"
              title="Reset Mission"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
