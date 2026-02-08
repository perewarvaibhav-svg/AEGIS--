// Aegis Sentinel - Client-side mission state management using SWR pattern
import type { WeatherData, SeismicData, FireData, RiskScore, ForecastPoint, CascadeWarning, CasualtyProjection } from './types'

export interface MissionState {
  city: string
  lat: number
  lon: number
  role: string
  locked: boolean
  weather: WeatherData | null
  seismic: SeismicData | null
  fires: FireData | null
  risks: RiskScore[]
  forecast: ForecastPoint[]
  cascades: CascadeWarning[]
  casualties: CasualtyProjection | null
  activePanel: string | null
  emergencyId: string
}

export function generateEmergencyId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'EM-'
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export const DEFAULT_MISSION: MissionState = {
  city: '',
  lat: 0,
  lon: 0,
  role: 'General User',
  locked: false,
  weather: null,
  seismic: null,
  fires: null,
  risks: [],
  forecast: [],
  cascades: [],
  casualties: null,
  activePanel: null,
  emergencyId: '',
}
