export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''

    // Regex explicitly checks for common mobile devices
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent.toLowerCase())
    const isSmallScreen = window.innerWidth <= 768
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // We consider it a mobile node if ANY of these strongly correlate to a phone
    return isMobileUA || (isSmallScreen && isTouch)
}
