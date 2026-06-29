import { Link } from 'react-router-dom'
import { HOTEL_INFO } from '../data/hotel'
import Logo from './Logo'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{HOTEL_INFO.tagline}</p>
          <p className={styles.values}>
            {HOTEL_INFO.values.join(' • ')}
          </p>
        </div>

        <div className={styles.col}>
          <h4>Explore</h4>
          <Link to="/tour">3D Virtual Tour</Link>
          <Link to="/rooms">Our Rooms</Link>
          <Link to="/booking">Book a Stay</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className={styles.col}>
          <h4>Contact</h4>
          <p>{HOTEL_INFO.location}</p>
          <a href={`tel:${HOTEL_INFO.phone.replace(/\s/g, '')}`}>{HOTEL_INFO.phone}</a>
          <a href={`tel:${HOTEL_INFO.phoneAlt.replace(/\s/g, '')}`}>{HOTEL_INFO.phoneAlt}</a>
          <a href={`mailto:${HOTEL_INFO.email}`}>{HOTEL_INFO.email}</a>
        </div>

        <div className={styles.col}>
          <h4>Reservations</h4>
          <p>Available 24/7 for your mountain escape</p>
          <Link to="/booking" className={styles.cta}>
            Check Availability
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} {HOTEL_INFO.name}</p>
        <p>{HOTEL_INFO.website}</p>
      </div>
    </footer>
  )
}
