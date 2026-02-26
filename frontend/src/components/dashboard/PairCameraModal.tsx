import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, X, Camera, CheckCircle2, RotateCw } from 'lucide-react'
import { fetchPairingSession } from '../../services/api'

interface PairCameraModalProps {
    isOpen: boolean
    onClose: () => void
    wsConnected: boolean
}

export default function PairCameraModal({ isOpen, onClose, wsConnected }: PairCameraModalProps) {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [publicUrl, setPublicUrl] = useState(window.location.origin)

    const generateSession = async () => {
        setLoading(true)
        setError(false)
        const newSession = await fetchPairingSession()
        if (newSession) {
            setSessionId(newSession)
        } else {
            setError(true)
        }
        setLoading(false)
    }

    // Auto-generate a session when the modal opens
    useEffect(() => {
        if (isOpen && !sessionId) {
            generateSession()
        }
    }, [isOpen])

    if (!isOpen) return null

    // The URL the mobile device needs to hit
    const pairUrl = sessionId ? `${publicUrl.replace(/\/$/, '')}/pair?session=${sessionId}` : ''

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#0a0e1a] border border-[#1e2d40] rounded-2xl shadow-2xl shadow-[#00d4ff]/10 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[#8a9ab5] hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="px-6 py-5 border-b border-[#1e2d40] bg-[#060a12]/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00d4ff]/10 rounded-lg">
                            <QrCode className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#f0f6ff]">Pair Camera Node</h2>
                            <p className="text-xs text-[#8a9ab5]">Scan via Mobile Device</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                    {!wsConnected ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                <X className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-[#8a9ab5]">Cannot pair. Dashboard WebSocket is disconnected from the backend.</p>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <RotateCw className="w-8 h-8 text-[#00d4ff] animate-spin" />
                            <p className="text-sm font-medium text-[#8a9ab5]">Generating Secure Session...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center space-y-4">
                            <p className="text-red-400">Failed to communicate with backend.</p>
                            <button
                                onClick={generateSession}
                                className="px-4 py-2 bg-[#1e2d40] hover:bg-[#2d3f56] text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : sessionId ? (
                        <div className="flex flex-col items-center w-full">
                            {/* The QR Code */}
                            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 relative group">
                                <QRCodeSVG
                                    value={pairUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                />
                                {/* Scanning animation line */}
                                <div className="absolute inset-x-4 top-4 h-0.5 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff] animate-scan opacity-0 group-hover:opacity-100 mix-blend-difference pointer-events-none" />
                            </div>

                            <p className="text-sm text-[#8a9ab5] text-center mb-1">
                                Point your camera at this code to
                            </p>
                            <p className="text-sm font-semibold text-white text-center flex items-center gap-1.5 justify-center mt-2">
                                <span className="w-2 h-2 rounded-full pulse-live bg-emerald-500" />
                                Auto-Connect Edge Node
                            </p>

                            <div className="w-full mt-5">
                                <label className="block text-[10px] text-[#8a9ab5] uppercase tracking-wider mb-1.5 px-1 font-semibold">
                                    Override Public URL (Ngrok)
                                </label>
                                <input
                                    type="text"
                                    value={publicUrl}
                                    onChange={(e) => setPublicUrl(e.target.value)}
                                    className="w-full bg-black/50 border border-[#1e2d40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all placeholder:text-[#4a5568]"
                                    placeholder="https://random-id.ngrok-free.app"
                                />
                                <p className="text-[10px] text-[#4a5568] mt-1.5 px-1">
                                    Only needed if dashboard is open on localhost.
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer instructions */}
                <div className="px-6 py-4 bg-[#060a12]/80 border-t border-[#1e2d40] text-xs text-[#4a5568] flex items-center justify-between">
                    <span>Session expires in 5:00</span>
                    <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Requires Mobile</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
