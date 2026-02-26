import { useState, useEffect } from 'react'
import { fetchHistory, type Prediction } from '../services/api'
import TrendChart from '../components/dashboard/TrendChart'
import DistributionChart from '../components/dashboard/DistributionChart'
import { BarChart3, RefreshCw } from 'lucide-react'

interface AnalyticsProps { selectedSite: string }

export default function Analytics({ selectedSite }: AnalyticsProps) {
    const [history, setHistory] = useState<Prediction[]>([])
    const [loading, setLoading] = useState(false)

    const load = async () => {
        setLoading(true)
        const data = await fetchHistory(selectedSite, 200)
        setHistory(data)
        setLoading(false)
    }

    useEffect(() => { load() }, [selectedSite])

    const avg = (field: keyof Prediction) =>
        history.length ? (history.reduce((s, p) => s + (Number(p[field])), 0) / history.length).toFixed(2) : '—'

    const statRows = [
        { label: 'Avg Turbidity', value: `${avg('turbidity')} NTU`, color: '#00d4ff' },
        { label: 'Avg pH', value: avg('ph'), color: '#a78bfa' },
        { label: 'Avg Compliance', value: `${avg('compliance_score')}%`, color: '#10b981' },
        { label: 'Total Readings', value: history.length, color: '#f59e0b' },
    ]

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0e1a] bg-grid p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-[#f0f6ff] flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
                        Analytics
                    </h2>
                    <p className="text-sm text-[#4a5568] mt-0.5">{selectedSite} • Historical analysis</p>
                </div>
                <button
                    onClick={load}
                    className="flex items-center gap-2 px-4 py-2 glass-card round-lg text-sm text-[#8a9ab5] hover:text-[#00d4ff] transition-all border border-[#1e2d40] hover:border-[#00d4ff33] rounded-lg"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {statRows.map(s => (
                    <div key={s.label} className="glass-card p-4">
                        <p className="text-[10px] text-[#4a5568] uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TrendChart history={history} />
                </div>
                <DistributionChart history={history} />
            </div>
        </div>
    )
}
