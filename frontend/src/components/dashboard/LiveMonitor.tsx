import type { Prediction } from '../../services/api'
import { Cpu, Eye } from 'lucide-react'

interface LiveMonitorProps {
    prediction: Prediction | null
    connected: boolean
}

const STATUS_CONFIG = {
    clear: {
        label: 'CLEAR',
        color: '#10b981',
        bg: 'from-emerald-500/10 to-emerald-500/5',
        border: 'border-emerald-500/30',
        scanColor: 'rgba(16, 185, 129, 0.3)',
    },
    moderate: {
        label: 'MODERATE',
        color: '#f59e0b',
        bg: 'from-amber-500/10 to-amber-500/5',
        border: 'border-amber-500/30',
        scanColor: 'rgba(245, 158, 11, 0.3)',
    },
    pollutant: {
        label: 'POLLUTANT DETECTED',
        color: '#ef4444',
        bg: 'from-red-500/15 to-red-500/5',
        border: 'border-red-500/40',
        scanColor: 'rgba(239, 68, 68, 0.4)',
    },
}

export default function LiveMonitor({ prediction, connected }: LiveMonitorProps) {
    const p = prediction
    const cfg = STATUS_CONFIG[p?.status ?? 'clear']

    return (
        <div className="glass-card overflow-hidden relative">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d40]">
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#00d4ff]" />
                    <span className="text-sm font-semibold text-[#f0f6ff]">Live Camera Feed</span>
                </div>
                <div className="flex items-center gap-3">
                    {connected && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold tracking-widest">
                            <span className="w-2 h-2 bg-red-400 rounded-full pulse-live" />
                            REC
                        </span>
                    )}
                    <span className="text-xs text-[#4a5568] font-mono">CAM-01 / 30fps</span>
                </div>
            </div>

            {/* Video area */}
            <div className={`relative w-full bg-gradient-to-br ${cfg.bg} scanline`} style={{ aspectRatio: '16/7' }}>
                {/* Grid background */}
                <div className="absolute inset-0 bg-grid opacity-40" />

                {/* Water simulation visual */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: `radial-gradient(ellipse at 50% 80%, ${cfg.color}40 0%, transparent 70%)`,
                        }}
                    />
                    {/* Simulated water ripples */}
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="absolute rounded-full border opacity-10"
                            style={{
                                borderColor: cfg.color,
                                width: `${i * 25}%`,
                                height: `${i * 18}%`,
                                bottom: '15%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                animation: `pulse-live ${1 + i * 0.5}s ease-in-out infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* Corner brackets (industrial camera UI) */}
                {[['top-3 left-3 border-t-2 border-l-2', ''], ['top-3 right-3 border-t-2 border-r-2', ''], ['bottom-3 left-3 border-b-2 border-l-2', ''], ['bottom-3 right-3 border-b-2 border-r-2', '']].map(([cls], idx) => (
                    <div key={idx} className={`absolute w-5 h-5 ${cls} ${p?.status === 'pollutant' ? 'border-red-500/60' : 'border-[#00d4ff60]'}`} />
                ))}

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full border-2 border-dashed ${p?.status === 'pollutant' ? 'border-red-400/50' : 'border-[#00d4ff50]'}`}
                            style={{ animation: 'spin 8s linear infinite' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                        </div>
                    </div>
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 z-10 space-y-2">
                    {/* Status pill */}
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold backdrop-blur-sm bg-black/40 ${cfg.border}`}
                        style={{ color: cfg.color }}
                    >
                        <span className="w-2 h-2 rounded-full pulse-live" style={{ background: cfg.color }} />
                        {cfg.label}
                    </div>
                    {p && (
                        <div className="text-xs text-white/60 font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                            CONF: {p.confidence}%
                        </div>
                    )}
                </div>

                {/* Right overlay: sensor readouts */}
                <div className="absolute top-4 right-4 z-10 space-y-1.5">
                    {[
                        { label: 'TURBIDITY', value: p ? `${p.turbidity} NTU` : '—' },
                        { label: 'pH', value: p ? p.ph.toFixed(2) : '—' },
                        { label: 'COMPLIANCE', value: p ? `${p.compliance_score.toFixed(1)}%` : '—' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between gap-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-mono">
                            <span className="text-[#4a5568]">{label}</span>
                            <span className="text-[#00d4ff] font-bold">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Bottom: AI badge */}
                <div className="absolute bottom-4 left-4 z-10">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-[#1e2d40] px-3 py-1.5 rounded-lg">
                        <Cpu className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span className="text-xs text-[#a78bfa] font-medium">AI Vision Engine v2.1</span>
                    </div>
                </div>

                {!connected && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                        <div className="text-center">
                            <div className="text-[#4a5568] text-4xl mb-2">⚡</div>
                            <p className="text-[#8a9ab5] text-sm">Connecting to server...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
