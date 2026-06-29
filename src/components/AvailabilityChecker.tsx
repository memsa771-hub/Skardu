import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAvailableRooms } from '../data/hotel'
import styles from './AvailabilityChecker.module.css'

export default function AvailabilityChecker() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState(2)
  const [result, setResult] = useState<{ count: number; searched: boolean }>({
    count: 0,
    searched: false,
  })

  const handleCheck = () => {
    if (checkIn >= checkOut) return
    const available = getAvailableRooms(checkIn, checkOut, guests)
    setResult({ count: available.length, searched: true })
  }

  const handleBook = () => {
    navigate('/booking', { state: { checkIn, checkOut, guests } })
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <h3 className={styles.title}>Check Availability</h3>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label>Check In</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Check Out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Guests</label>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <button className={styles.checkBtn} onClick={handleCheck}>
        Search Rooms
      </button>

      {result.searched && (
        <motion.div
          className={styles.result}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {result.count > 0 ? (
            <>
              <p className={styles.available}>
                <span className={styles.count}>{result.count}</span> room types available
              </p>
              <button className={styles.bookBtn} onClick={handleBook}>
                Book Now →
              </button>
            </>
          ) : (
            <p className={styles.unavailable}>
              No rooms available for selected dates. Try different dates.
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
