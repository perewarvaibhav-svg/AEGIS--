'use client'

import type { ForecastPoint, RiskScore } from '@/lib/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface ForecastChartsProps {
  forecast: ForecastPoint[]
  risks: RiskScore[]
}

export function ForecastCharts({ forecast, risks }: ForecastChartsProps) {
  const radarData = risks.map((r) => ({
    subject: r.type,
    value: r.score,
    fullMark: 100,
  }))

  return (
    <div className="space-y-6 animate-float-up">
      {/* 72h Thermal & Wind Forecast */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          72-Hour Tactical Forecast - Thermal & Kinetic
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="time" tick={{ fill: '#666', fontSize: 10 }} interval={3} />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 6%)',
                  border: '1px solid hsl(0 0% 15%)',
                  borderRadius: '12px',
                  fontSize: 12,
                  color: '#e5e5e5',
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                fill="url(#tempGrad)"
                strokeWidth={2}
                name="Temperature (\u00B0C)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#38bdf8"
                fill="url(#windGrad)"
                strokeWidth={2}
                name="Wind (m/s)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pressure & Humidity */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Atmospheric Pressure & Humidity
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="pressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="time" tick={{ fill: '#666', fontSize: 10 }} interval={3} />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 6%)',
                  border: '1px solid hsl(0 0% 15%)',
                  borderRadius: '12px',
                  fontSize: 12,
                  color: '#e5e5e5',
                }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#4ade80"
                fill="url(#humGrad)"
                strokeWidth={2}
                name="Humidity (%)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Radar */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Tactical Risk Radar
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(0 0% 15%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666', fontSize: 9 }} />
              <Radar
                name="Risk Level"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
