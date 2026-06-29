import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isTour = location.pathname === '/tour'

  return (
    <>
      {!isTour && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isTour && <Footer />}
    </>
  )
}
