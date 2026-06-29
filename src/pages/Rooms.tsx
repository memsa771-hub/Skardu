import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ROOMS,
  PACKAGES,
  HOTEL_INFO,
  formatPrice,
  type Room,
  type Package,
} from '../data/hotel'
import styles from './Rooms.module.css'

type Tab = 'rooms' | 'packages'

function RoomCard({ room, index }: { room: Room; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardImg}>
        <img src={room.image} alt={room.name} loading="lazy" />
        <div className={styles.cardImgOverlay} />
        <div className={styles.cardImgMeta}>
          <span className={styles.floorBadge}>{room.floor === 'first' ? 'First Floor' : 'Ground Floor'}</span>
          <span className={styles.guestBadge}>Up to {room.maxGuests} guests</span>
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div className={styles.hoverLayer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Link to="/tour" className={styles.viewIn3D}>View in 3D &rarr;</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.bedLabel}>{room.bedConfig}</span>
          <span className={styles.cardPrice}>
            {room.priceRiver ? formatPrice(room.priceRiver) : formatPrice(room.price)}
            <small>/night</small>
          </span>
        </div>
        <h3>{room.name}</h3>
        <div className={styles.goldAccent} />
        <p className={styles.cardDesc}>{room.description}</p>

        {room.priceNonRiver && (
          <div className={styles.priceOptions}>
            <div className={styles.priceOpt}>
              <span>River View</span>
              <strong>{formatPrice(room.priceRiver!)}</strong>
            </div>
            <div className={styles.priceOptDiv} />
            <div className={styles.priceOpt}>
              <span>Non-River</span>
              <strong>{formatPrice(room.priceNonRiver)}</strong>
            </div>
          </div>
        )}

        <div className={styles.amenityTags}>
          {room.amenities.map(a => <span key={a} className={styles.tag}>{a}</span>)}
        </div>

        <div className={styles.cardActions}>
          <Link to="/tour" className={styles.tourBtn}>3D Tour</Link>
          <Link to="/booking" state={{ roomId: room.id }} className={styles.bookBtn}>Book Now</Link>
        </div>
      </div>
    </motion.article>
  )
}

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const isPremium = pkg.tier === 'premium'
  const tierLabel: Record<string, string> = {
    'river-view': 'Riverside',
    standard: 'Family Collection',
    executive: 'Executive',
    premium: 'Grand Collection',
  }
  return (
    <motion.article
      className={`${styles.pkgCard}${isPremium ? ' ' + styles.pkgPremium : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      {isPremium && <div className={styles.premiumRibbon}>Most Exclusive</div>}
      <div className={styles.pkgImg}>
        <img src={pkg.image} alt={pkg.name} loading="lazy" />
        <div className={styles.pkgImgOverlay} />
        <div className={styles.pkgPriceTag}>
          <span className={styles.pkgAmount}>{formatPrice(pkg.price)}</span>
          <span className={styles.pkgPer}>/night</span>
        </div>
      </div>
      <div className={styles.pkgBody}>
        <p className={styles.pkgTier}>{tierLabel[pkg.tier] ?? pkg.tier}</p>
        <h3>{pkg.name}</h3>
        <div className={styles.goldAccent} />
        <p className={styles.pkgDesc}>{pkg.description}</p>
        <p className={styles.pkgGuests}>Up to {pkg.maxGuests} guests</p>
        <div className={styles.inclusions}>
          {pkg.inclusions.map(item => (
            <div key={item} className={styles.inclusion}>
              <span className={styles.check}>&#10003;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <Link to="/booking" state={{ roomId: pkg.id }} className={styles.pkgBookBtn}>
          Reserve This Package &rarr;
        </Link>
      </div>
    </motion.article>
  )
}

export default function Rooms() {
  const [tab, setTab] = useState<Tab>('rooms')

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <img
          className={styles.heroBg}
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80"
          alt="Nestopia rooms"
        />
        <div className={styles.heroOverlay} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className={styles.eyebrow}>Accommodation</p>
          <h1>Rooms &amp; Packages</h1>
          <div className={styles.goldLine} />
          <p className={styles.sub}>{HOTEL_INFO.accommodationNote}</p>
        </motion.div>
      </section>

      {/* TAB BAR */}
      <div className={styles.tabBar}>
        <button className={`${styles.tab}${tab === 'rooms' ? ' ' + styles.tabActive : ''}`} onClick={() => setTab('rooms')}>
          <span>11 Signature Rooms</span>
        </button>
        <button className={`${styles.tab}${tab === 'packages' ? ' ' + styles.tabActive : ''}`} onClick={() => setTab('packages')}>
          <span>4 Curated Packages</span>
        </button>
      </div>

      {/* ROOMS */}
      <AnimatePresence mode="wait">
        {tab === 'rooms' && (
          <motion.section key="rooms" className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.sectionInner}>
              <div className={styles.floorBlock}>
                <div className={styles.floorLabel}>
                  <span className={styles.floorNum}>01</span>
                  <div>
                    <h2>Ground Floor</h2>
                    <p>6 rooms with direct garden access and classic elegance</p>
                  </div>
                </div>
                <div className={styles.grid}>
                  {ROOMS.filter(r => r.floor === 'ground').map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
                </div>
              </div>
              <div className={styles.floorBlock}>
                <div className={styles.floorLabel}>
                  <span className={styles.floorNum}>02</span>
                  <div>
                    <h2>First Floor</h2>
                    <p>5 elevated rooms with panoramic mountain and river views</p>
                  </div>
                </div>
                <div className={styles.grid}>
                  {ROOMS.filter(r => r.floor === 'first').map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {tab === 'packages' && (
          <motion.section key="packages" className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.sectionInner}>
              <div className={styles.pkgIntro}>
                <p className={styles.eyebrow}>Curated Stays</p>
                <h2>Signature Packages</h2>
                <div className={styles.goldLine} />
                <p>Every package includes hand-selected inclusions designed for an unforgettable Karakoram experience.</p>
              </div>
              <div className={styles.pkgGrid}>
                {PACKAGES.map((p, i) => <PackageCard key={p.id} pkg={p} index={i} />)}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className={styles.cta}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className={styles.eyebrow}>Ready to Experience Nestopia?</p>
          <h2>Begin Your Karakoram Journey</h2>
          <div className={styles.ctaActions}>
            <Link to="/booking" className={styles.ctaBook}>Reserve Your Room &rarr;</Link>
            <Link to="/tour" className={styles.ctaTour}>Explore in 3D</Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}