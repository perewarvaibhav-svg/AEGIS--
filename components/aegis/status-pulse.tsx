'use client'

export function StatusPulse({ status = 'online' }: { status?: 'online' | 'offline' | 'syncing' }) {
  const colors = {
    online: 'bg-emerald-500',
    offline: 'bg-red-500',
    syncing: 'bg-amber-500',
  }

  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors[status]}`}
      />
      <span className={`relative inline-flex h-3 w-3 rounded-full ${colors[status]}`} />
    </span>
  )
}
