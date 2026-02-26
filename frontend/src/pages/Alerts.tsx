import { useState, useEffect } from 'react'
import { fetchAlerts, acknowledgeAlert, type Alert } from '../services/api'
import { Bell, CheckCheck, AlertTriangle, Zap, Info, Filter } from 'lucide-react'

interface AlertsPageProps { selectedSite: string }

const SEVERITY_CONFIG = {
    critical: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Critical' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Warning' },
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Info' },
}

type Filter = 'all' | 'critical' | 'warning' | 'unackd'

export default function AlertsPage({ selectedSite }: AlertsPageProps) {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [filter, setFilter] = useState<Filter>('all')

    const load = () => fetchAlerts(selectedSite, 100).then(setAlerts)
    useEffect(() => { load() }, [selectedSite])

    const handleAck = (id: number) => {
        acknowledgeAlert(id).then(() => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)))
    }

    const filtered = alerts.filter(a => {
        if (filter === 'critical') return a.severity === 'critical'
        if (filter === 'warning') return a.severity === 'warning'
        if (filter === 'unackd') return !a.acknowledged
        return true
    })

    const counts = {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        unackd: alerts.filter(a => !a.acknowledged).length,
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0e1a] bg-grid p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#00d4ff]" />
                <h2 className="text-lg font-bold text-[#f0f6ff]">Alerts Management</h2>
                <span className="ml-auto text-xs text-[#4a5568]">{selectedSite}</span>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-[#4a5568]" />
                {([['all', 'All', alerts.length], ['critical', 'Critical', counts.critical], ['warning', 'Warning', counts.warning], ['unackd', 'Unacknowledged', counts.unackd]] as const).map(([v, label, count]) => (
                    <button
                        key={v}
                        onClick={() => setFilter(v as Filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filter === v
                                ? 'bg-[#00d4ff15] text-[#00d4ff] border-[#00d4ff30]'
                                : 'text-[#8a9ab5] border-[#1e2d40] hover:text-white hover:border-white/10'
                            }`}
                    >
                        {label} <span className="ml-1 opacity-60">({count})</span>
                    </button>
                ))}
            </div>

            {/* Alert rows */}
            <div className="glass-card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-[#4a5568]">
                        <Bell className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">No alerts match this filter</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#1e2d40]">
                        {filtered.map(alert => {
                            const cfg = SEVERITY_CONFIG[alert.severity]
                            const Icon = cfg.icon
                            return (
                                <div key={alert.id} className={`flex items-start gap-4 p-4 transition-all hover:bg-white/2 ${alert.acknowledged ? 'opacity-40' : ''}`}>
                                    <div className={`mt-0.5 p-1.5 rounded-lg ${cfg.bg}`}>
                                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                                            <span className="text-[10px] text-[#4a5568]">{alert.site_id}</span>
                                            <span className="text-[10px] text-[#4a5568] font-mono ml-auto">
                                                {new Date(alert.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#8a9ab5]">{alert.message}</p>
                                    </div>
                                    {!alert.acknowledged && (
                                        <button
                                            onClick={() => handleAck(alert.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all flex-shrink-0"
                                        >
                                            <CheckCheck className="w-3.5 h-3.5" />
                                            Ack
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
