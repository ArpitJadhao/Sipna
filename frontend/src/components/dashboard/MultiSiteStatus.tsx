import type { Prediction } from '../../services/api'
import { Globe } from 'lucide-react'

interface MultiSiteStatusProps {
    sites: Prediction[]
}

const SITE_NAMES: Record<string, string> = {
    'SITE-01': 'Plant Alpha',
    'SITE-02': 'Plant Beta',
    'SITE-03': 'Refinery Gamma',
    'SITE-04': 'Station Delta',
}

const STATUS_CONFIG = {
    clear: { label: 'Clear', color: '#10b981', bg: 'from-emerald-500/10 to-transparent', border: 'border-emerald-500/20' },
    moderate: { label: 'Moderate', color: '#f59e0b', bg: 'from-amber-500/10 to-transparent', border: 'border-amber-500/20' },
    pollutant: { label: 'Pollutant ⚠', color: '#ef4444', bg: 'from-red-500/15 to-transparent', border: 'border-red-500/30' },
}

export default function MultiSiteStatus({ sites }: MultiSiteStatusProps) {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-[#00d4ff]" />
                <h3 className="text-sm font-semibold text-[#f0f6ff]">Multi-Site Status</h3>
                <span className="ml-auto text-[10px] text-[#4a5568]">{sites.length} sites online</span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {sites.map((site, i) => {
                    const cfg = STATUS_CONFIG[site.status] ?? STATUS_CONFIG.clear
                    const name = SITE_NAMES[site.site_id] ?? site.site_id
                    return (
                        <div
                            key={site.site_id ?? i}
                            className={`bg-gradient-to-b ${cfg.bg} border ${cfg.border} rounded-xl p-3 transition-all duration-300 hover:scale-[1.03] hover:brightness-110`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-[#4a5568] font-mono">{site.site_id ?? `SITE-0${i + 1}`}</span>
                                <span className="w-2 h-2 rounded-full pulse-live" style={{ background: cfg.color }} />
                            </div>
                            <p className="text-xs font-semibold text-[#f0f6ff] mb-2">{name}</p>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#4a5568]">Status</span>
                                    <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#4a5568]">Turbidity</span>
                                    <span className="text-[10px] font-mono text-[#00d4ff]">{site.turbidity?.toFixed(1)} NTU</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#4a5568]">Compliance</span>
                                    <span className="text-[10px] font-mono text-[#8a9ab5]">{site.compliance_score?.toFixed(1)}%</span>
                                </div>
                            </div>
                            {/* Mini compliance bar */}
                            <div className="mt-2 h-1 bg-[#1e2d40] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${site.compliance_score ?? 0}%`, background: cfg.color }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
