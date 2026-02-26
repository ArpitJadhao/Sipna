import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import AlertsPage from './pages/Alerts'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0e1a] bg-grid p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 opacity-20">🚧</div>
        <h2 className="text-lg font-semibold text-[#8a9ab5]">{title}</h2>
        <p className="text-sm text-[#4a5568] mt-1">Coming in next release</p>
      </div>
    </div>
  )
}

export default function App() {
  const [selectedSite, setSelectedSite] = useState('SITE-01')
  const [connected, setConnected] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
          connected={connected}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard selectedSite={selectedSite} onConnect={setConnected} />} />
            <Route path="/analytics" element={<Analytics selectedSite={selectedSite} />} />
            <Route path="/alerts" element={<AlertsPage selectedSite={selectedSite} />} />
            <Route path="/sites" element={<PlaceholderPage title="Sites Management" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
