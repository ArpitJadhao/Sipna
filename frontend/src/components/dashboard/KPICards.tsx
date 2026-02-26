import { Droplets, FlaskConical, ShieldCheck, Activity } from 'lucide-react'
import type { Prediction } from '../../services/api'

interface KPICardsProps {
    prediction: Prediction | null
}

function StatusBadge({ status }: { status: string }) {
    const cfg = {
        clear: { label: 'CLEAR', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        moderate: { label: 'MODERATE', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        pollutant: { label: 'POLLUTANT', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    }[status] ?? { label: '—', color: 'text-[#8a9ab5]', bg: 'bg-white/5 border-white/10' }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'pollutant' ? 'pulse-live' : ''}`} />
            {cfg.label}
        </span>
    )
}

interface CardProps {
    icon: React.ReactNode
    label: string
    value: string | React.ReactNode
    sub?: string
    glow?: string
    accentColor?: string
}

function Card({ icon, label, value, sub, glow = '', accentColor = '#00d4ff' }: CardProps) {
    return (
        <div className={`glass-card p-5 ${glow} transition-all duration-300 hover:scale-[1.02] relative overflow-hidden`}>
            {/* BG decoration */}
            <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-8 translate-x-8"
                style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
            />
            <div className="flex items-start justify-between mb-3 relative z-10">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
                >
                    <span style={{ color: accentColor }}>{icon}</span>
                </div>
                <span className="text-[10px] text-[#4a5568] uppercase tracking-widest">{label}</span>
            </div>
            <div className="relative z-10">
                <div className="text-xl font-bold text-[#f0f6ff] leading-tight">{value}</div>
                {sub && <p className="text-xs text-[#8a9ab5] mt-1">{sub}</p>}
            </div>
        </div>
    )
}

export default function KPICards({ prediction }: KPICardsProps) {
    const p = prediction

    const complianceColor = !p ? '#8a9ab5'
        : p.compliance_score >= 80 ? '#10b981'
            : p.compliance_score >= 60 ? '#f59e0b'
                : '#ef4444'

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Card
                icon={<Droplets className="w-4 h-4" />}
                label="Water Status"
                value={p ? <StatusBadge status={p.status} /> : <span className="text-[#4a5568]">—</span>}
                sub={p ? `Confidence: ${p.confidence}%` : 'Awaiting data'}
                glow={p?.status === 'pollutant' ? 'glow-red' : p?.status === 'moderate' ? 'glow-amber' : 'glow-emerald'}
                accentColor={p?.status === 'pollutant' ? '#ef4444' : p?.status === 'moderate' ? '#f59e0b' : '#10b981'}
            />
            <Card
                icon={<Activity className="w-4 h-4" />}
                label="Turbidity"
                value={p ? `${p.turbidity} NTU` : '—'}
                sub={!p ? 'Awaiting' : p.turbidity < 4 ? 'Excellent clarity' : p.turbidity < 25 ? 'Moderate clarity' : 'High turbidity ⚠'}
                glow={p && p.turbidity >= 25 ? 'glow-red' : p && p.turbidity >= 4 ? 'glow-amber' : 'glow-emerald'}
                accentColor="#00d4ff"
            />
            <Card
                icon={<FlaskConical className="w-4 h-4" />}
                label="pH Level"
                value={p ? p.ph.toFixed(2) : '—'}
                sub={!p ? 'Awaiting' : p.ph >= 6.5 && p.ph <= 8.5 ? 'Within safe range' : 'Out of safe range ⚠'}
                glow={p && (p.ph < 6.5 || p.ph > 8.5) ? 'glow-amber' : ''}
                accentColor="#a78bfa"
            />
            <Card
                icon={<ShieldCheck className="w-4 h-4" />}
                label="Compliance"
                value={p ? `${p.compliance_score.toFixed(1)}%` : '—'}
                sub={!p ? 'Awaiting' : p.compliance_score >= 80 ? 'Compliant ✓' : p.compliance_score >= 60 ? 'At Risk' : 'Non-Compliant ✗'}
                glow={p && p.compliance_score < 60 ? 'glow-red' : p && p.compliance_score < 80 ? 'glow-amber' : 'glow-emerald'}
                accentColor={complianceColor}
            />
        </div>
    )
}
