'use client'

import {
  Map,
  Search,
  TrendingUp,
  Shield,
  BarChart3,
  Building2,
  FileText,
  Backpack,
  BookOpen,
  AlertTriangle,
  Brain,
  Route,
} from 'lucide-react'

const modules = [
  { id: 'map', icon: Map, title: 'Show Map', desc: 'Interactive hazard zones, safety perimeters, and evacuation routes.' },
  { id: 'risk', icon: Search, title: 'Analyze Risk', desc: 'Deep-scan of 10+ disaster vectors with probability drift analysis.' },
  { id: 'forecast', icon: TrendingUp, title: 'Show Forecast', desc: 'High-fidelity 72-hour pulse models and 7-day strategic outlooks.' },
  { id: 'protocol', icon: Shield, title: 'Safety Protocols', desc: 'Role-tailored tactical advice and action checklists.' },
  { id: 'threat', icon: BarChart3, title: 'Threat Assessment', desc: 'AI-driven analysis of dominant threats in plain language.' },
  { id: 'emergency', icon: Building2, title: 'Emergency Locator', desc: 'Nearest medical facilities, shelters, and relief centers.' },
  { id: 'report', icon: FileText, title: 'Community Reports', desc: 'Report local hazards or view shared intelligence mesh.' },
  { id: 'kit', icon: Backpack, title: 'Survival Kit', desc: 'Dynamic supply checklists adapted to your coordinates.' },
  { id: 'guides', icon: BookOpen, title: 'Safety Guides', desc: 'Integrated library of survival best-practices.' },
  { id: 'sos', icon: AlertTriangle, title: 'SOS Beacon', desc: 'Emergency broadcast terminal for rescue coordination.' },
  { id: 'query', icon: Brain, title: 'Disaster Query', desc: 'Ask complex questions about any disaster or safety procedure.' },
  { id: 'evacuate', icon: Route, title: 'Escape Route', desc: 'Calculate safe evacuation paths avoiding hazard zones.' },
] as const

interface DirectiveModulesProps {
  onSelect: (directive: string) => void
}

export function DirectiveModules({ onSelect }: DirectiveModulesProps) {
  return (
    <div className="space-y-4 animate-float-up">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Intelligence Modules
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Select a module or type a command in the chat to activate.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {modules.map((mod, idx) => {
          const Icon = mod.icon
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelect(mod.id)}
              className="glass rounded-xl p-3 flex items-start gap-3 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 group cursor-pointer"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary truncate">{mod.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {mod.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-primary/80 italic">
        Type any of these commands in the chat below to activate the specific module.
      </p>
    </div>
  )
}
