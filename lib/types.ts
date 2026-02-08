// Aegis Sentinel - Core Type Definitions

export const DISASTER_TYPES = [
  'Flood', 'Heatwave', 'Cyclone', 'Drought', 'Landslide',
  'Wildfire', 'Avalanche', 'Seismic', 'Tsunami', 'Volcano'
] as const

export type DisasterType = typeof DISASTER_TYPES[number]

export interface RiskScore {
  type: DisasterType
  score: number
  trend: number // positive = increasing, negative = decreasing
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  color: string
}

export interface WeatherData {
  temp: number
  pressure: number
  humidity: number
  windSpeed: number
  windDeg: number
  visibility: number
  aqi: number
  uv: number
  sunrise: string
  sunset: string
  localTime: string
  description: string
  status: 'LIVE' | 'DEMO' | 'FALLBACK'
}

export interface SeismicData {
  maxMag: number
  count: number
  earthquakes: {
    lat: number
    lon: number
    magnitude: number
    distanceKm: number
  }[]
  status: 'LIVE' | 'FALLBACK'
}

export interface FireData {
  count: number
  points: { lat: number; lon: number }[]
  status: 'LIVE' | 'DEMO' | 'FALLBACK'
}

export interface MissionContext {
  city: string
  lat: number
  lon: number
  weather: WeatherData
  seismic: SeismicData
  fires: FireData
  risks: RiskScore[]
  role: string
  timestamp: string
}

export interface ForecastPoint {
  time: string
  temp: number
  humidity: number
  pressure: number
  windSpeed: number
}

export interface CascadeWarning {
  severity: 'critical' | 'high' | 'medium'
  title: string
  description: string
}

export interface CasualtyProjection {
  withoutPrecautions: number
  withPrecautions: number
  dropPercentage: number
  dominantRisk: string
  affectedPop: number
}

export const RISK_THRESHOLDS = {
  CRITICAL: 75,
  HIGH: 65,
  MEDIUM: 40,
  LOW: 15,
} as const

export const RISK_COLORS: Record<DisasterType, string> = {
  Flood: '#3b82f6',
  Heatwave: '#f97316',
  Cyclone: '#6366f1',
  Drought: '#eab308',
  Landslide: '#92400e',
  Wildfire: '#ef4444',
  Avalanche: '#60a5fa',
  Seismic: '#991b1b',
  Tsunami: '#0ea5e9',
  Volcano: '#dc2626',
}

export const SEISMIC_ZONES: [number, number, number, number][] = [
  [35, 45, 135, 145],
  [-10, 10, -85, -70],
  [30, 40, -125, -115],
]

export const ROLE_OPTIONS = [
  'General User',
  'Farmer/Agricultural Worker',
  'Transportation/Driver',
  'Student',
  'Emergency Responder',
  'Healthcare Worker',
  'Construction Worker',
  'Elderly Person',
  'Parent with Children',
  'Business Owner',
] as const
