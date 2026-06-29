import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Hotel3DScene, { TourZone } from '../components/3d/Hotel3DScene'
import { ROOMS, formatPrice } from '../data/hotel'
import styles from './Tour.module.css'

export default function Tour() {
  const [zone, setZone] = useState<TourZone>('ground')
  const [floor, setFloor] = useState<'ground' | 'first'>('ground')
  const [showControls, setShowControls] = useState(true)

  const handleEnterRoom = (roomId: string) => setZone(roomId)
  const handleExitRoom = () => {
    const exitFloor = zone.startsWith('ff-') ? 'first' : 'ground'
    setFloor(exitFloor)
    setZone(exitFloor)
  }
  const handleFloorChange = (newFloor: 'ground' | 'first') => {
    setFloor(newFloor)
    setZone(newFloor)
  }

  const isInRoom = zone !== 'ground' && zone !== 'first'
  const currentRoom = isInRoom ? ROOMS.find((r) => r.id === zone) : null

  const groundRooms = ROOMS.filter((r) => r.floor === 'ground')
  const firstRooms = ROOMS.filter((r) => r.floor === 'first')
  const displayFloor = isInRoom ? (zone.startsWith('ff-') ? 'first' : 'ground') : floor

  const zoneName = zone === 'ground'
    ? 'Ground Floor — Lobby & Corridor'
    : zone === 'first'
    ? 'First Floor — Premium Suites'
    : currentRoom?.name ?? 'Nestopia Hotel'

  return (
    <div className={styles.page}>
      <div className={styles.canvasWrap}>
        <Hotel3DScene
          zone={zone}
          floor={floor}
          onEnterRoom={handleEnterRoom}
          onExitRoom={handleExitRoom}
          onFloorChange={handleFloorChange}
        />

        <div className={styles.overlay}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <Link to="/" className={styles.backLink}>← Back to Home</Link>
            <div className={styles.zoneLabel}>{zoneName}</div>
            <Link to="/booking" className={styles.bookLink}>Book Now</Link>
          </div>

          {/* Controls welcome card */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className={styles.controlsHint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.hintCard}>
                  <div className={styles.hintGold}>NESTOPIA</div>
                  <h3>Virtual 3D Tour</h3>
                  <p>Explore both floors of Nestopia Hotel in immersive 3D</p>
                  <ul>
                    <li><span>🖱️</span> Drag to rotate the view</li>
                    <li><span>🔍</span> Scroll or pinch to zoom</li>
                    <li><span>🚪</span> Click glowing doors to enter rooms</li>
                    <li><span>🏨</span> Use sidebar to navigate floors & rooms</li>
                    <li><span>↑</span> Click staircase to reach First Floor</li>
                  </ul>
                  <button className={styles.dismissBtn} onClick={() => setShowControls(false)}>
                    Begin Tour
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floor + Room sidebar */}
          {!showControls && (
            <motion.div
              className={styles.roomSidebar}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Floor tabs */}
              <div className={styles.floorTabs}>
                <button
                  className={`${styles.floorTab} ${displayFloor === 'ground' ? styles.floorActive : ''}`}
                  onClick={() => handleFloorChange('ground')}
                >
                  Ground
                </button>
                <button
                  className={`${styles.floorTab} ${displayFloor === 'first' ? styles.floorActive : ''}`}
                  onClick={() => handleFloorChange('first')}
                >
                  First Floor
                </button>
              </div>

              <p className={styles.sidebarTitle}>
                {displayFloor === 'ground' ? 'Ground Floor Rooms' : 'First Floor Suites'}
              </p>

              {/* Corridor button */}
              <button
                className={`${styles.roomBtn} ${zone === displayFloor ? styles.active : ''}`}
                onClick={() => { setFloor(displayFloor); setZone(displayFloor) }}
              >
                <span className={styles.roomDot} style={{ background: '#c9a96e' }} />
                <span>{displayFloor === 'ground' ? 'Lobby & Corridor' : 'Floor Corridor'}</span>
              </button>

              {(displayFloor === 'ground' ? groundRooms : firstRooms).map((room) => (
                <button
                  key={room.id}
                  className={`${styles.roomBtn} ${zone === room.id ? styles.active : ''}`}
                  onClick={() => setZone(room.id)}
                >
                  <span className={styles.roomDot} style={{ background: room.color }} />
                  <span className={styles.roomName}>{room.name}</span>
                  <span className={styles.roomPrice}>{formatPrice(room.price)}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Room info panel */}
          <AnimatePresence>
            {currentRoom && !showControls && (
              <motion.div
                className={styles.roomInfo}
                key={currentRoom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <p className={styles.roomInfoFloor}>
                  {currentRoom.floor === 'first' ? 'First Floor' : 'Ground Floor'}
                </p>
                <h4>{currentRoom.name}</h4>
                <p className={styles.roomInfoConfig}>{currentRoom.bedConfig}</p>
                <p className={styles.roomInfoDesc}>{currentRoom.description.slice(0, 120)}…</p>
                <div className={styles.amenities}>
                  {currentRoom.amenities.slice(0, 4).map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
                <div className={styles.roomInfoFooter}>
                  <div className={styles.roomInfoPrice}>
                    {formatPrice(currentRoom.price)}<span>/night</span>
                  </div>
                  <Link to="/booking" state={{ roomId: currentRoom.id }} className={styles.bookRoomBtn}>
                    Book Room
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
