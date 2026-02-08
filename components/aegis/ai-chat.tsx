'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ChevronDown,
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
  Radio,
} from 'lucide-react'
import type { MissionState } from '@/lib/mission-store'

interface AiChatProps {
  mission: MissionState
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const MODULE_CHIPS = [
  {
    id: 'risk',
    icon: Search,
    label: 'Analyze Risk',
    prompt:
      'Perform a deep risk analysis of all active disaster vectors for my current location. Include probability drift, compounding factors, and severity timeline. Rate each threat and explain the science behind why each risk exists.',
  },
  {
    id: 'forecast',
    icon: TrendingUp,
    label: 'Forecast',
    prompt:
      'Generate a detailed 72-hour disaster forecast and 7-day strategic outlook for my location. Include weather pattern shifts, seismic trend analysis, and any predicted escalation windows.',
  },
  {
    id: 'protocol',
    icon: Shield,
    label: 'Safety Protocols',
    prompt:
      'Generate comprehensive safety protocols tailored to my role and active threats. Include immediate actions, preparation checklists, communication plans, and evacuation triggers. Prioritize the most critical steps.',
  },
  {
    id: 'threat',
    icon: BarChart3,
    label: 'Threat Assessment',
    prompt:
      'Provide a complete threat assessment of the dominant hazards in my area. Explain each threat in plain language, its cascade potential, historical precedent, and what makes this situation unique.',
  },
  {
    id: 'emergency',
    icon: Building2,
    label: 'Emergency Locator',
    prompt:
      'List the types of nearest emergency resources I should locate: medical facilities, shelters, relief centers, and rescue staging areas. Provide guidance on how to reach them safely given active hazards.',
  },
  {
    id: 'sos',
    icon: Radio,
    label: 'SOS Guidance',
    prompt:
      'I need emergency assistance. Generate a complete SOS briefing including: my situation summary based on active threats, priority actions for survival, how to signal for help, and emergency contact procedures. Include my mission data in a format ready to share with rescue services.',
  },
  {
    id: 'report',
    icon: FileText,
    label: 'Situation Report',
    prompt:
      'Generate a professional disaster situation report (SITREP) for my location. Include current conditions, threat levels, recommended response actions, resource needs, and an executive summary suitable for sharing with authorities.',
  },
  {
    id: 'kit',
    icon: Backpack,
    label: 'Survival Kit',
    prompt:
      'Create a dynamic survival kit checklist adapted to my specific coordinates, active threats, and weather conditions. Prioritize items by urgency and explain why each is critical for this situation.',
  },
  {
    id: 'guides',
    icon: BookOpen,
    label: 'Safety Guides',
    prompt:
      'Provide survival best-practices for the specific disaster types threatening my area. Include step-by-step instructions, common mistakes to avoid, and expert tips for each hazard type.',
  },
  {
    id: 'query',
    icon: Brain,
    label: 'Disaster Query',
    prompt:
      'I want to understand more about the disaster risks in my area. Explain the underlying science, historical patterns, and what experts recommend. Help me understand what could happen and how to stay safe.',
  },
  {
    id: 'evacuate',
    icon: Route,
    label: 'Escape Route',
    prompt:
      'Help me plan safe evacuation routes from my location. Consider active hazard zones, terrain, likely traffic conditions, and alternate paths. Include rally points and shelter-in-place criteria if evacuation is not possible.',
  },
  {
    id: 'map',
    icon: Map,
    label: 'Map Intel',
    prompt:
      'Provide a detailed geographic and environmental analysis of the hazard zones around my coordinates. Describe terrain vulnerabilities, flood plains, fault lines, fire corridors, and which areas are safest.',
  },
  {
    id: 'cascade',
    icon: AlertTriangle,
    label: 'Cascade Analysis',
    prompt:
      'Analyze potential disaster cascade chains for my location. How could one hazard trigger another? What is the domino-effect risk? Provide a timeline of how things could escalate and what early warning signs to watch for.',
  },
] as const

export function AiChat({ mission }: AiChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const contextString = mission.weather
    ? `City: ${mission.city} | Lat: ${mission.lat}, Lon: ${mission.lon} | Role: ${mission.role}
Weather: ${mission.weather.temp}°C, ${mission.weather.humidity}% humidity, ${mission.weather.windSpeed}m/s wind, ${mission.weather.pressure}hPa
Seismic: ${mission.seismic?.maxMag ?? 0} max magnitude, ${mission.seismic?.count ?? 0} events nearby
Fires: ${mission.fires?.count ?? 0} active fire detections
Top Risks: ${mission.risks.slice(0, 5).map((r) => `${r.type}: ${r.score}%`).join(', ')}
Cascades: ${mission.cascades.map((c) => `${c.title} (severity ${c.severity})`).join('; ') || 'None'}
Emergency ID: ${mission.emergencyId}`
    : undefined

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, autoScroll])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 80)
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setAutoScroll(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          context: contextString,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (messageText.trim()) {
      sendMessage(messageText)
      if (!text) setInput('')
    }
  }

  const handleChip = (prompt: string) => {
    handleSend(prompt)
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Aegis-1 Intelligence</p>
          <p className="text-[10px] text-muted-foreground font-mono truncate">
            {isLoading ? 'Processing...' : 'All modules available -- select a feature or type a query'}
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-primary/60 animate-pulse" />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {messages.length === 0 && (
          <div className="space-y-5 animate-float-up">
            <div className="flex flex-col items-center text-center py-4 space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary/60" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Select a module below or type any question about disaster risks, evacuation, safety protocols, or emergency procedures for{' '}
                <span className="text-primary font-medium">{mission.city || 'your location'}</span>.
              </p>
            </div>

            {/* Module chips grid */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase px-1">
                Intelligence Modules
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 stagger-children">
                {MODULE_CHIPS.map((chip) => {
                  const Icon = chip.icon
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleChip(chip.prompt)}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200 glass hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-[11px] font-medium text-foreground/80 group-hover:text-primary transition-colors truncate">
                        {chip.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-float-up`}
            >
              {!isUser && (
                <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'glass-emerald rounded-bl-md'
                  }`}
              >
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
              {isUser && (
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="glass-emerald rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {!autoScroll && (
        <button
          type="button"
          onClick={() => {
            setAutoScroll(true)
            scrollRef.current?.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }}
          className="mx-auto -mt-8 mb-2 z-10 relative h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-primary" />
        </button>
      )}

      {/* Quick-re-access chips after conversation started */}
      {messages.length > 0 && !isLoading && (
        <div className="px-3 pb-1 overflow-x-auto flex gap-1.5 no-scrollbar">
          {MODULE_CHIPS.slice(0, 6).map((chip) => {
            const Icon = chip.icon
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChip(chip.prompt)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/10 transition-all flex-shrink-0"
              >
                <Icon className="h-3 w-3" />
                {chip.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask Aegis-1 anything -- risk, forecast, protocols, SOS..."
            className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
