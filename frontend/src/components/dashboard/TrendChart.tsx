import { useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Prediction } from '../../services/api'
import { TrendingUp } from 'lucide-react'

interface TrendChartProps {
    history: Prediction[]
}

function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="glass-card border border-[#1e2d40] rounded-xl p-3 text-xs space-y-1 shadow-2xl">
            <p className="text-[#8a9ab5] mb-1">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-4">
                    <span style={{ color: p.color }}>{p.name}</span>
                    <span className="font-mono font-bold text-[#f0f6ff]">{Number(p.value).toFixed(2)}</span>
                </div>
            ))}
        </div>
    )
}

export default function TrendChart({ history }: TrendChartProps) {
    const data = history.slice(-30).map(p => ({
        time: formatTime(p.timestamp),
        turbidity: p.turbidity,
        ph: p.ph,
        compliance: p.compliance_score,
    }))

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00d4ff]" />
                    <h3 className="text-sm font-semibold text-[#f0f6ff]">Pollution Trend</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00d4ff]" /><span className="text-[#8a9ab5]">Turbidity</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#a78bfa]" /><span className="text-[#8a9ab5]">pH</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /><span className="text-[#8a9ab5]">Compliance</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="turb-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#4a5568', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fill: '#4a5568', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={25} stroke="#ef444430" strokeDasharray="4 4" />
                    <Line
                        type="monotone"
                        dataKey="turbidity"
                        name="Turbidity (NTU)"
                        stroke="#00d4ff"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#00d4ff' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="ph"
                        name="pH"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#a78bfa' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="compliance"
                        name="Compliance %"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#10b981' }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-[#4a5568] mt-2 text-right">Last {data.length} readings • Live update every 2s</p>
        </div>
    )
}
