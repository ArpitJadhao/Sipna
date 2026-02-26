export interface Prediction {
    id?: number
    timestamp: string
    status: 'clear' | 'moderate' | 'pollutant'
    confidence: number
    turbidity: number
    ph: number
    compliance_score: number
    site_id: string
}

export interface Alert {
    id: number
    timestamp: string
    severity: 'info' | 'warning' | 'critical'
    message: string
    site_id: string
    acknowledged: boolean
}

// Dynamically resolve backend host — works both on desktop (localhost)
// and on mobile accessing via LAN IP (e.g. 192.168.x.x)
const BACKEND_HOST = window.location.hostname
const BASE_URL = `http://${BACKEND_HOST}:8000`
const WS_URL = `ws://${BACKEND_HOST}:8000/ws`

// ─── REST API ────────────────────────────────────────────────────────────────

export async function fetchLatestPrediction(siteId = 'SITE-01'): Promise<Prediction | null> {
    try {
        const res = await fetch(`${BASE_URL}/api/predictions/latest?site_id=${siteId}`)
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export async function fetchHistory(siteId = 'SITE-01', limit = 50): Promise<Prediction[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/predictions/history?site_id=${siteId}&limit=${limit}`)
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export async function fetchSitesSummary(): Promise<Prediction[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/predictions/sites/summary`)
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export async function fetchAlerts(siteId = 'SITE-01', limit = 50): Promise<Alert[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/alerts/?site_id=${siteId}&limit=${limit}`)
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export async function acknowledgeAlert(alertId: number): Promise<void> {
    await fetch(`${BASE_URL}/api/alerts/${alertId}/acknowledge`, { method: 'PATCH' })
}

// ─── WebSocket ───────────────────────────────────────────────────────────────

export function createWebSocket(
    onPrediction: (pred: Prediction) => void,
    onError?: () => void
): WebSocket {
    const ws = new WebSocket(WS_URL)

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data)
            if (msg.type === 'prediction') {
                onPrediction(msg.data as Prediction)
            }
        } catch { /* ignore malformed */ }
    }

    ws.onerror = () => onError?.()

    // Ping every 5s to keep alive
    const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping')
    }, 5000)

    ws.onclose = () => clearInterval(ping)

    return ws
}
