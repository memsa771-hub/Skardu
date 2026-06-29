import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAvailableRooms,
  getBookableById,
  calculateNights,
  saveBooking,
  checkAvailability,
  formatPrice,
  HOTEL_INFO,
  type Booking,
  type BookableItem,
} from '../data/hotel'
import styles from './Booking.module.css'

type Step = 'search' | 'select' | 'details' | 'confirmed'

export default function Booking() {
  const location = useLocation()
  const state = location.state as { checkIn?: string; checkOut?: string; guests?: number; roomId?: string } | null

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [step, setStep] = useState<Step>(state?.roomId ? 'select' : 'search')
  const [checkIn, setCheckIn] = useState(state?.checkIn || today)
  const [checkOut, setCheckOut] = useState(state?.checkOut || tomorrow)
  const [guests, setGuests] = useState(state?.guests || 2)
  const [selectedRoomId, setSelectedRoomId] = useState(state?.roomId || '')
  const [viewType, setViewType] = useState<'river' | 'non-river'>('river')
  const [availableRooms, setAvailableRooms] = useState<BookableItem[]>(
    state?.checkIn && state?.checkOut
      ? getAvailableRooms(state.checkIn, state.checkOut, state.guests || 2)
      : []
  )

  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  const selectedItem = getBookableById(selectedRoomId)
  const nights = calculateNights(checkIn, checkOut)

  const nightlyRate = selectedItem
    ? viewType === 'non-river' && selectedItem.priceNonRiver
      ? selectedItem.priceNonRiver
      : selectedItem.priceRiver ?? selectedItem.price
    : 0

  const totalPrice = nightlyRate * nights

  const handleSearch = () => {
    if (checkIn >= checkOut) return
    setAvailableRooms(getAvailableRooms(checkIn, checkOut, guests))
    setStep('select')
  }

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId)
    setViewType('river')
    setStep('details')
  }

  const handleConfirm = () => {
    if (!selectedItem || !guestName || !email || !phone) return
    if (!checkAvailability(selectedItem.id, checkIn, checkOut)) return

    const booking: Booking = {
      id: `NEST-${Date.now().toString(36).toUpperCase()}`,
      roomId: selectedItem.id,
      roomName: selectedItem.name,
      checkIn,
      checkOut,
      guests,
      guestName,
      email,
      phone,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      viewType: selectedItem.priceNonRiver ? viewType : undefined,
    }

    saveBooking(booking)
    setConfirmedBooking(booking)
    setStep('confirmed')
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className={styles.eyebrow}>Reservations</p>
          <h1>Book Your Stay</h1>
          <p className={styles.sub}>A world of comfort, just for you</p>
        </motion.div>

        <div className={styles.steps}>
          {(['search', 'select', 'details', 'confirmed'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`${styles.step} ${step === s ? styles.active : ''} ${
                ['search', 'select', 'details', 'confirmed'].indexOf(step) > i ? styles.done : ''
              }`}
            >
              <span>{i + 1}</span>
              <p>{s === 'search' ? 'Dates' : s === 'select' ? 'Room' : s === 'details' ? 'Details' : 'Done'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 'search' && (
            <motion.div key="search" className={styles.panel} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2>When are you visiting?</h2>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Check In</label>
                  <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Check Out</label>
                  <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className={styles.primaryBtn} onClick={handleSearch}>Check Availability</button>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div key="select" className={styles.panel} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2>
                {availableRooms.length > 0
                  ? `${availableRooms.length} options available`
                  : 'No availability'}
              </h2>
              <p className={styles.dateRange}>
                {checkIn} → {checkOut} · {guests} guest{guests > 1 ? 's' : ''} · {nights} night{nights > 1 ? 's' : ''}
              </p>

              {availableRooms.length === 0 ? (
                <div className={styles.empty}>
                  <p>Try different dates for your mountain escape.</p>
                  <button className={styles.secondaryBtn} onClick={() => setStep('search')}>Change Dates</button>
                </div>
              ) : (
                <div className={styles.roomList}>
                  {availableRooms.map((item) => (
                    <div key={item.id} className={styles.roomItem}>
                      <div className={styles.roomItemImage}>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className={styles.roomItemInfo}>
                        <p className={styles.itemKind}>{item.kind === 'package' ? 'Package' : item.floor === 'first' ? 'First Floor' : 'Ground Floor'}</p>
                        <h3>{item.name}</h3>
                        <p>{item.description.slice(0, 90)}...</p>
                        <div className={styles.roomItemMeta}>
                          <span>Up to {item.maxGuests} guests</span>
                          <span className={styles.roomItemPrice}>
                            {item.priceNonRiver
                              ? `${formatPrice(item.priceRiver!)} / ${formatPrice(item.priceNonRiver)}`
                              : formatPrice(item.price)} total {formatPrice(item.price * nights)}
                          </span>
                        </div>
                      </div>
                      <button className={styles.selectBtn} onClick={() => handleSelectRoom(item.id)}>Select</button>
                    </div>
                  ))}
                </div>
              )}
              <button className={styles.backBtn} onClick={() => setStep('search')}>← Change dates</button>
            </motion.div>
          )}

          {step === 'details' && selectedItem && (
            <motion.div key="details" className={styles.panel} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2>Guest Details</h2>

              <div className={styles.summary}>
                <h3>{selectedItem.name}</h3>
                <p>{checkIn} → {checkOut} · {nights} nights · {guests} guests</p>
                {selectedItem.priceNonRiver && (
                  <div className={styles.viewToggle}>
                    <label>View type</label>
                    <div className={styles.viewOptions}>
                      <button
                        className={viewType === 'river' ? styles.viewActive : ''}
                        onClick={() => setViewType('river')}
                      >
                        River View — {formatPrice(selectedItem.priceRiver!)}
                      </button>
                      <button
                        className={viewType === 'non-river' ? styles.viewActive : ''}
                        onClick={() => setViewType('non-river')}
                      >
                        Non-River — {formatPrice(selectedItem.priceNonRiver!)}
                      </button>
                    </div>
                  </div>
                )}
                <p className={styles.summaryPrice}>{formatPrice(totalPrice)}</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Full Name</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name" />
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div className={styles.field}>
                  <label>Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" />
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.backBtn} onClick={() => setStep('select')}>← Back</button>
                <button className={styles.primaryBtn} onClick={handleConfirm} disabled={!guestName || !email || !phone}>
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirmed' && confirmedBooking && (
            <motion.div key="confirmed" className={styles.panel + ' ' + styles.confirmedPanel} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className={styles.checkmark}>✓</div>
              <h2>Booking Confirmed!</h2>
              <p className={styles.confirmSub}>Thank you, {confirmedBooking.guestName}. We look forward to welcoming you.</p>

              <div className={styles.confirmDetails}>
                <div className={styles.confirmRow}><span>Booking ID</span><strong>{confirmedBooking.id}</strong></div>
                <div className={styles.confirmRow}><span>Room / Package</span><strong>{confirmedBooking.roomName}</strong></div>
                {confirmedBooking.viewType && (
                  <div className={styles.confirmRow}><span>View</span><strong>{confirmedBooking.viewType === 'river' ? 'River View' : 'Non-River View'}</strong></div>
                )}
                <div className={styles.confirmRow}><span>Check In</span><strong>{confirmedBooking.checkIn}</strong></div>
                <div className={styles.confirmRow}><span>Check Out</span><strong>{confirmedBooking.checkOut}</strong></div>
                <div className={styles.confirmRow}><span>Guests</span><strong>{confirmedBooking.guests}</strong></div>
                <div className={styles.confirmRow}><span>Total</span><strong className={styles.confirmPrice}>{formatPrice(confirmedBooking.totalPrice)}</strong></div>
              </div>

              <p className={styles.confirmNote}>
                Our team will contact you at {confirmedBooking.phone}. For queries call {HOTEL_INFO.phone}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
