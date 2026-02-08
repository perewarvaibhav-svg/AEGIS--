'use client'

import { useEffect, useState } from 'react'
import type { RiskScore } from '@/lib/types'
import { RISK_THRESHOLDS } from '@/lib/types'

interface RiskTilesProps {
  risks: RiskScore[]
  onSelectRisk?: (risk: RiskScore) => void
}

export function RiskTiles({ risks, onSelectRisk }: RiskTilesProps) {
  const [mounted, setMounted] = useState(false)
  const [animatedScores, setAnimatedScores] = useState<number[]>(risks.map(() => 0))

  useEffect(() => {
    setMounted(true)
    // Animate scores counting up
    const duration = 1200
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      // Easing: cubic ease-out
      const eased = 1 - (1 - progress) ** 3
      setAnimatedScores(risks.map((r) => Math.round(r.score * eased)))
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [risks])

  const getSeverityClass = (score: number) => {
    if (score >= RISK_THRESHOLDS.CRITICAL) return 'risk-critical'
    if (score >= RISK_THRESHOLDS.HIGH) return 'risk-high'
    if (score >= RISK_THRESHOLDS.MEDIUM) return 'risk-medium'
    return 'risk-low'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return { symbol: '\u25B2', color: 'text-red-400' }
    if (trend < -5) return { symbol: '\u25BC', color: 'text-emerald-400' }
    return { symbol: '\u25CF', color: 'text-muted-foreground' }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
        Satellite Risk Scan
      </h3>

      <div className="grid grid-cols-5 gap-2 stagger-children">
        {risks.map((risk, idx) => {
          const trend = getTrendIcon(risk.trend)
          return (
            <button
              key={risk.type}
              type="button"
              onClick={() => onSelectRisk?.(risk)}
              className={`glass rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 cursor-pointer ${getSeverityClass(risk.score)} ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                borderColor: `${risk.color}40`,
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              <div className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-2">
                {risk.type}
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums animate-count-up">
                {animatedScores[idx]}
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <div className={`text-[10px] font-mono mt-1 ${trend.color}`}>
                {trend.symbol} {Math.abs(risk.trend)}%
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
