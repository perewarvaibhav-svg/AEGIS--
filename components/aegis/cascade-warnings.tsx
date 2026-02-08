'use client'

import type { CascadeWarning } from '@/lib/types'
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'

interface CascadeWarningsProps {
  warnings: CascadeWarning[]
}

export function CascadeWarnings({ warnings }: CascadeWarningsProps) {
  if (warnings.length === 0) return null

  const getIcon = (severity: CascadeWarning['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
      case 'high': return <ShieldAlert className="h-4 w-4 text-orange-400 flex-shrink-0" />
      default: return <Info className="h-4 w-4 text-yellow-400 flex-shrink-0" />
    }
  }

  const getBorderClass = (severity: CascadeWarning['severity']) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5'
      case 'high': return 'border-l-orange-500 bg-orange-500/5'
      default: return 'border-l-yellow-500 bg-yellow-500/5'
    }
  }

  return (
    <div className="space-y-3 animate-float-up">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Cascade Chain Analysis
        </h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono">
          {warnings.length}
        </span>
      </div>

      <div className="space-y-2 stagger-children">
        {warnings.map((warning, idx) => (
          <div
            key={`${warning.title}-${idx}`}
            className={`rounded-xl p-3 border-l-2 ${getBorderClass(warning.severity)} transition-all hover:translate-x-1`}
          >
            <div className="flex items-start gap-2">
              {getIcon(warning.severity)}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{warning.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {warning.description}
                </p>
              </div>
              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                warning.severity === 'critical'
                  ? 'bg-red-500/20 text-red-400'
                  : warning.severity === 'high'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {warning.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
