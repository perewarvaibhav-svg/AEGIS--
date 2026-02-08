'use client'

import { useEffect, useState } from 'react'
import type { CasualtyProjection } from '@/lib/types'
import { ShieldCheck, ShieldOff, TrendingDown, Users } from 'lucide-react'

interface CasualtyProjectionsProps {
  data: CasualtyProjection
}

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const steps = 40
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

export function CasualtyProjections({ data }: CasualtyProjectionsProps) {
  return (
    <div className="space-y-4 animate-float-up">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
        Impact Projection Model
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldOff className="h-4 w-4 text-red-400" />
            <span className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">Without Precautions</span>
          </div>
          <div className="text-3xl font-bold text-red-400 tabular-nums">
            <AnimatedNumber value={data.withoutPrecautions} />
          </div>
          <p className="text-[10px] text-muted-foreground">Estimated casualties</p>
        </div>

        <div className="glass-emerald rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">With Precautions</span>
          </div>
          <div className="text-3xl font-bold text-primary tabular-nums">
            <AnimatedNumber value={data.withPrecautions} />
          </div>
          <p className="text-[10px] text-muted-foreground">Estimated casualties</p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Drop Rate</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 tabular-nums">
            <AnimatedNumber value={data.dropPercentage} />
            <span className="text-sm">%</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Reduction with protocol</p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Affected Pop.</span>
          </div>
          <div className="text-3xl font-bold text-blue-400 tabular-nums">
            <AnimatedNumber value={data.affectedPop} />
          </div>
          <p className="text-[10px] text-muted-foreground">In impact radius</p>
        </div>
      </div>

      <div className="glass-emerald rounded-xl p-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">
          Dominant threat: <span className="text-primary font-semibold">{data.dominantRisk}</span>. Following Aegis protocols
          can reduce projected casualties by <span className="text-emerald-400 font-bold">{data.dropPercentage}%</span>.
        </p>
      </div>
    </div>
  )
}
