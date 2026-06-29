import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${className}`} aria-label="Nestopia Hotel & Resorts">
      <img
        src={variant === 'icon' ? '/favicon.png' : '/logo.png'}
        alt="Nestopia Hotels & Resorts"
        className={variant === 'icon' ? styles.icon : styles.full}
      />
    </Link>
  )
}
