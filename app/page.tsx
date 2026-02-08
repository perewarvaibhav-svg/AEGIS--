'use client'

import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import type { WeatherData, SeismicData } from '@/lib/types'
import { DEFAULT_MISSION, generateEmergencyId, type MissionState } from '@/lib/mission-store'
import { computeRisks, generateForecast, checkCascades, calculateCasualtyProjections } from '@/lib/risk-engine'

import { Header } from '@/components/aegis/header'
import { Onboarding } from '@/components/aegis/onboarding'
import { WeatherGrid } from '@/components/aegis/weather-grid'
import { RiskTiles } from '@/components/aegis/risk-tiles'
import { ForecastCharts } from '@/components/aegis/forecast-charts'
import { ThreatMap } from '@/components/aegis/threat-map'
import { CascadeWarnings } from '@/components/aegis/cascade-warnings'
import { CasualtyProjections } from '@/components/aegis/casualty-projections'
import { AiChat } from '@/components/aegis/ai-chat'
import { AnimatedBackground } from '@/components/aegis/animated-background'
import {
  Activity,
  BarChart3,
  MessageSquare,
  Map,
  Layers,
  ChevronRight,
  Shield,
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type TabId = 'overview' | 'forecast' | 'chat' | 'map' | 'cascade'

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'forecast', label: 'Forecast', icon: BarChart3 },
  { id: 'map', label: 'Threat Map', icon: Map },
  { id: 'cascade', label: 'Cascade', icon: Layers },
  { id: 'chat', label: 'Aegis-1', icon: MessageSquare },
]

export default function MissionControlPage() {
  const [mission, setMission] = useState<MissionState>(DEFAULT_MISSION)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [bootSequence, setBootSequence] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)
  const [bootMessages, setBootMessages] = useState<string[]>([])

  const { data: weatherData } = useSWR<WeatherData>(
    mission.locked ? `/api/weather?lat=${mission.lat}&lon=${mission.lon}` : null,
    fetcher,
    { refreshInterval: 120000, revalidateOnFocus: false }
  )

  const { data: seismicData } = useSWR<SeismicData>(
    mission.locked ? `/api/seismic?lat=${mission.lat}&lon=${mission.lon}` : null,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  )

  useEffect(() => {
    if (!mission.locked || !weatherData || !seismicData) return

    const fires = { count: Math.floor(Math.random() * 5), points: [], status: 'DEMO' as const }
    const risks = computeRisks(weatherData, seismicData, fires, mission.lat, mission.lon)
    const forecast = generateForecast(weatherData)
    const cascades = checkCascades(risks, weatherData, seismicData)
    const casualties = calculateCasualtyProjections(risks, mission.lat, mission.lon)

    setMission((prev) => ({
      ...prev,
      weather: weatherData,
      seismic: seismicData,
      fires,
      risks,
      forecast,
      cascades,
      casualties,
    }))
  }, [weatherData, seismicData, mission.locked, mission.lat, mission.lon])

  const handleLock = useCallback((data: { city: string; lat: number; lon: number; role: string }) => {
    setBootSequence(true)
    setBootProgress(0)
    setBootMessages([])

    const messages = [
      'Initializing Aegis Sentinel v4.0...',
      'Establishing satellite uplink...',
      'Syncing weather telemetry array...',
      'Calibrating seismic sensors...',
      'Loading ML risk prediction models...',
      'Scanning fire detection satellites...',
      'Building cascade threat chains...',
      'Generating tactical forecast models...',
      'Computing casualty projections...',
      'Aegis-1 AI advisor online.',
      'Mission control ready.',
    ]

    let idx = 0
    const timer = setInterval(() => {
      if (idx < messages.length) {
        setBootMessages((prev) => [...prev, messages[idx]])
        setBootProgress(((idx + 1) / messages.length) * 100)
        idx++
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setMission({
            ...DEFAULT_MISSION,
            ...data,
            locked: true,
            emergencyId: generateEmergencyId(),
          })
          setBootSequence(false)
        }, 400)
      }
    }, 280)
  }, [])

  const handleReset = useCallback(() => {
    setMission(DEFAULT_MISSION)
    setActiveTab('overview')
  }, [])

  // Back navigation handler
  const handleBack = useCallback(() => {
    const currentIndex = TABS.findIndex(tab => tab.id === activeTab)
    if (currentIndex > 0) {
      // Navigate to previous tab
      setActiveTab(TABS[currentIndex - 1].id)
    } else if (activeTab === 'overview') {
      // From overview, go back to onboarding
      handleReset()
    }
  }, [activeTab, handleReset])

  // Boot sequence screen
  if (bootSequence) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <AnimatedBackground />
        <div className="max-w-lg w-full space-y-6 animate-float-up relative z-10">
          <div className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center animate-pulse-glow">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-lg font-bold tracking-[0.3em] text-primary uppercase">Aegis Sentinel</h1>
            <p className="text-xs text-muted-foreground font-mono">MISSION CONTROL INITIALIZATION</p>
          </div>

          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

          <div className="glass rounded-xl p-4 max-h-60 overflow-y-auto space-y-1">
            {bootMessages.map((msg, idx) => (
              <div
                key={`boot-${idx}`}
                className="flex items-center gap-2 text-xs font-mono animate-slide-in-left"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                <span className={idx === bootMessages.length - 1 ? 'text-primary' : 'text-muted-foreground'}>
                  {msg}
                </span>
              </div>
            ))}
            {bootProgress < 100 && (
              <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-typing-cursor ml-5" />
            )}
          </div>

          <p className="text-center text-[10px] text-muted-foreground font-mono">
            {Math.round(bootProgress)}% COMPLETE
          </p>
        </div>
      </div>
    )
  }

  // Onboarding screen
  if (!mission.locked) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <AnimatedBackground />
        <Header city="" lat={0} lon={0} role="" emergencyId="" locked={false} onReset={handleReset} />
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <Onboarding onLock={handleLock} />
        </main>
      </div>
    )
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background Video - For all tabs */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          city={mission.city}
          lat={mission.lat}
          lon={mission.lon}
          role={mission.role}
          emergencyId={mission.emergencyId}
          locked={mission.locked}
          onReset={handleReset}
          onBack={handleBack}
        />

        {/* Tab navigation */}
        <nav className="sticky top-[49px] z-40 glass border-b border-border/20 overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-1.5 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === 'chat' && (
                  <span className="text-[8px] px-1 py-0 rounded bg-primary/20 text-primary font-mono ml-0.5">
                    ALL MODULES
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 space-y-4 relative z-10">
        {!mission.weather ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4 animate-float-up">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground font-mono">Syncing satellite telemetry...</p>
              <div className="h-1 w-48 mx-auto rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-float-up">
                <WeatherGrid weather={mission.weather} city={mission.city} />
                <RiskTiles risks={mission.risks} />
                <CascadeWarnings warnings={mission.cascades} />
              </div>
            )}

            {/* FORECAST TAB */}
            {activeTab === 'forecast' && (
              <ForecastCharts forecast={mission.forecast} risks={mission.risks} />
            )}

            {/* MAP TAB */}
            {activeTab === 'map' && (
              <div className="animate-float-up">
                <ThreatMap
                  lat={mission.lat}
                  lon={mission.lon}
                  risks={mission.risks}
                  seismic={mission.seismic}
                  fires={mission.fires}
                />
              </div>
            )}

            {/* CASCADE TAB */}
            {activeTab === 'cascade' && (
              <div className="space-y-4 animate-float-up">
                <CascadeWarnings warnings={mission.cascades} />
                {mission.casualties && <CasualtyProjections data={mission.casualties} />}
              </div>
            )}

            {/* AEGIS-1 TAB (All modules, protocols, SOS live here) */}
            {activeTab === 'chat' && (
              <div className="h-[calc(100vh-140px)]">
                <AiChat mission={mission} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/20 py-2 px-4">
        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span>AEGIS SENTINEL v4.0 | ML-DRIVEN DISASTER INTELLIGENCE</span>
          <span>
            {mission.weather?.status === 'LIVE' ? 'LIVE DATA' : 'DEMO DATA'} |{' '}
            {mission.seismic?.status === 'LIVE' ? 'USGS LIVE' : 'USGS CACHE'}
          </span>
        </div>
      </footer>
      </div>
    </div>
  )
}
