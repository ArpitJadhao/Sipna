import { useState, useEffect } from 'react'
import { Droplets, Wifi, WifiOff, ChevronDown } from 'lucide-react'

const SITES = ['SITE-01', 'SITE-02', 'SITE-03', 'SITE-04']

interface NavbarProps {
    selectedSite: string
    onSiteChange: (site: string) => void
    connected: boolean
}

export default function Navbar({ selectedSite, onSiteChange, connected }: NavbarProps) {
    const [time, setTime] = useState(new Date())
    const [siteOpen, setSiteOpen] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (d: Date) =>
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

    const formatDate = (d: Date) =>
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <nav className="glass sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b border-[#1e2d40]">
            {/* Logo */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-cyan">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full pulse-live border-2 border-[#0a0e1a]" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold gradient-text-cyan tracking-wide">AquaGuardian AI</h1>
                        <p className="text-[10px] text-[#4a5568] tracking-widest uppercase">Industrial Monitor</p>
                    </div>
                </div>

                {/* Role Badge */}
                <div className="hidden lg:flex items-center bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-2.5 py-1 rounded text-[10px] font-mono text-[#00d4ff] tracking-wider ml-2">
                    MONITORING STATION
                </div>
            </div>

            {/* Center: Site Selector */}
            <div className="relative">
                <button
                    onClick={() => setSiteOpen(!siteOpen)}
                    className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-[#8a9ab5] hover:text-[#00d4ff] transition-all duration-200 hover:border-[#00d4ff33]"
                >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-live" />
                    <span className="font-medium">{selectedSite}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${siteOpen ? 'rotate-180' : ''}`} />
                </button>
                {siteOpen && (
                    <div className="absolute top-full mt-2 left-0 glass-card rounded-xl overflow-hidden min-w-[140px] z-50 shadow-2xl border border-[#1e2d40]">
                        {SITES.map(site => (
                            <button
                                key={site}
                                onClick={() => { onSiteChange(site); setSiteOpen(false) }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${site === selectedSite
                                    ? 'text-[#00d4ff] bg-[#00d4ff10]'
                                    : 'text-[#8a9ab5] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {site}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Clock + Status */}
            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-mono text-[#f0f6ff] tabular-nums">{formatTime(time)}</p>
                    <p className="text-[10px] text-[#4a5568]">{formatDate(time)}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${connected
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {connected
                        ? <><Wifi className="w-3.5 h-3.5" /><span>LIVE</span><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-live" /></>
                        : <><WifiOff className="w-3.5 h-3.5" /><span>OFFLINE</span></>
                    }
                </div>
            </div>
        </nav>
    )
}
