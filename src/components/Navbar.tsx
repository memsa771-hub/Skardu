import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tour', label: '3D Tour' },
  { to: '/rooms', label: 'Rooms & Packages' },
  { to: '/booking', label: 'Book Now' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const darkNav = isHome && !scrolled

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${darkNav ? styles.onHero : ''}`}
    >
      <div className={styles.inner}>
        <Logo />

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/booking" className={styles.bookBtn}>
          Book Your Stay
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={styles.mobileLink}>
                {link.label}
              </Link>
            ))}
            <Link to="/booking" className={styles.mobileBookBtn}>
              Book Your Stay
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
