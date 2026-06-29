import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Booking from './pages/Booking'
import Contact from './pages/Contact'

// Lazy-load the 3D Tour so Three.js (~400 KB) is excluded from the initial bundle
const Tour = lazy(() => import('./pages/Tour'))

function TourFallback() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', gap: '1.2rem'
    }}>
      <div style={{
        width: 52, height: 52, border: '2px solid rgba(201,169,110,0.2)',
        borderTop: '2px solid #c9a96e', borderRadius: '50%',
        animation: 'spin 0.9s linear infinite'
      }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Loading 3D Experience
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tour" element={
          <Suspense fallback={<TourFallback />}>
            <Tour />
          </Suspense>
        } />
        <Route path="rooms" element={<Rooms />} />
        <Route path="booking" element={<Booking />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
