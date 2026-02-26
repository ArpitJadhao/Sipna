import { useEffect, useRef, useState } from 'react'
import type { Alert } from '../../services/api'
import { Bell, CheckCheck, AlertTriangle, Info, Zap } from 'lucide-react'

interface AlertsPanelProps {
    alerts: Alert[]
    onAcknowledge: (id: number) => void
}

const SEVERITY_CONFIG = {
    critical: {
        icon: Zap,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        dot: 'bg-red-400',
        label: 'CRITICAL',
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400',
        label: 'WARNING',
    },
    info: {
        icon: Info,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20',
        dot: 'bg-blue-400',
        label: 'INFO',
    },
}

function AlertItem({ alert, onAck, isNew }: { alert: Alert; onAck: (id: number) => void; isNew: boolean }) {
    const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info
    const Icon = cfg.icon
    const time = new Date(alert.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })

    return (
        <div className={`${isNew ? 'alert-slide-in' : ''} border rounded-lg p-3 transition-all duration-200 hover:brightness-110 ${cfg.bg} ${alert.acknowledged ? 'opacity-40' : ''}`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                    <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold tracking-widest ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-[10px] text-[#4a5568] font-mono">{time}</span>
                        </div>
                        <p className="text-xs text-[#8a9ab5] leading-relaxed break-words">{alert.message}</p>
                    </div>
                </div>
                {!alert.acknowledged && (
                    <button
                        onClick={() => onAck(alert.id)}
                        className="flex-shrink-0 text-[#4a5568] hover:text-emerald-400 transition-colors"
                        title="Acknowledge"
                    >
                        <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const prevLen = useRef(0)
    const [newIds, setNewIds] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (alerts.length > prevLen.current) {
            const added = alerts.slice(0, alerts.length - prevLen.current).map(a => a.id)
            setNewIds(new Set(added))
            setTimeout(() => setNewIds(new Set()), 800)
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        prevLen.current = alerts.length
    }, [alerts])

    const critical = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length

    return (
        <div className="glass-card flex flex-col h-full" style={{ minHeight: '400px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d40] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#00d4ff]" />
                    <h3 className="text-sm font-semibold text-[#f0f6ff]">Alert Log</h3>
                    {critical > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full pulse-live">
                            {critical}
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-[#4a5568]">{alerts.length} total</span>
            </div>

            {/* Alerts list */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2"
                style={{ maxHeight: '480px' }}
            >
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-[#4a5568]">
                        <Bell className="w-6 h-6 mb-2 opacity-30" />
                        <p className="text-xs">No alerts yet</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <AlertItem
                            key={alert.id}
                            alert={alert}
                            onAck={onAcknowledge}
                            isNew={newIds.has(alert.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
