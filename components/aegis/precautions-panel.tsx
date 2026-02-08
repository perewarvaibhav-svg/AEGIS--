'use client'

import { Shield, CheckCircle2 } from 'lucide-react'

interface PrecautionsPanelProps {
  precautions: string[]
  role: string
}

export function PrecautionsPanel({ precautions, role }: PrecautionsPanelProps) {
  return (
    <div className="space-y-4 animate-float-up">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Safety Protocols
        </h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
          {role}
        </span>
      </div>

      <div className="space-y-2 stagger-children">
        {precautions.map((precaution, idx) => (
          <div
            key={`precaution-${idx}`}
            className="glass rounded-xl p-3 flex items-start gap-3 transition-all hover:translate-x-1"
          >
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/80 leading-relaxed">{precaution}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
