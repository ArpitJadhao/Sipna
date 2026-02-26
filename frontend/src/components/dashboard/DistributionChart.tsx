import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Prediction } from '../../services/api'
import { PieChart as PieIcon } from 'lucide-react'

interface DistributionChartProps {
    history: Prediction[]
}

const COLORS = { clear: '#10b981', moderate: '#f59e0b', pollutant: '#ef4444' }

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const item = payload[0]
    return (
        <div className="glass-card border border-[#1e2d40] rounded-xl p-3 text-xs shadow-2xl">
            <p style={{ color: item.payload.fill }} className="font-bold uppercase">{item.name}</p>
            <p className="text-[#f0f6ff] font-mono mt-0.5">{item.value} readings ({item.payload.percent?.toFixed(1)}%)</p>
        </div>
    )
}

export default function DistributionChart({ history }: DistributionChartProps) {
    const counts = history.reduce(
        (acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc },
        {} as Record<string, number>
    )

    const total = history.length || 1
    const data = [
        { name: 'Clear', value: counts.clear ?? 0, fill: COLORS.clear, percent: ((counts.clear ?? 0) / total) * 100 },
        { name: 'Moderate', value: counts.moderate ?? 0, fill: COLORS.moderate, percent: ((counts.moderate ?? 0) / total) * 100 },
        { name: 'Pollutant', value: counts.pollutant ?? 0, fill: COLORS.pollutant, percent: ((counts.pollutant ?? 0) / total) * 100 },
    ]

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <PieIcon className="w-4 h-4 text-[#00d4ff]" />
                <h3 className="text-sm font-semibold text-[#f0f6ff]">Status Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            {/* Custom legend */}
            <div className="flex justify-around mt-2">
                {data.map(d => (
                    <div key={d.name} className="text-center">
                        <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: d.fill }} />
                        <p className="text-[10px] text-[#8a9ab5] uppercase">{d.name}</p>
                        <p className="text-sm font-bold font-mono" style={{ color: d.fill }}>{d.percent.toFixed(1)}%</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
