import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AvailabilityChecker from '../components/AvailabilityChecker'
import { HOTEL_INFO, ATTRACTIONS, GALLERY, TESTIMONIALS, AMENITIES, ROOMS, formatPrice } from '../data/hotel'
import styles from './Home.module.css'

const SKARDU_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-range-covered-in-snow-4158-large.mp4'

const FEATURED_ROOMS = ROOMS.filter(r => ['gf-master', 'ff-master-master', 'gf-master-master'].includes(r.id))

export default function Home() {
  const [galleryActive, setGalleryActive] = useState(0)
  const [galleryAuto, setGalleryAuto] = useState(true)

  useEffect(() => {
    if (!galleryAuto) return
    const timer = setInterval(() => setGalleryActive(a => (a + 1) % GALLERY.length), 4000)
    return () => clearInterval(timer)
  }, [galleryAuto])

  const handleThumbClick = (i: number) => { setGalleryActive(i); setGalleryAuto(false) }

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <video className={styles.heroVideo} autoPlay muted loop playsInline>
          <source src={SKARDU_VIDEO} type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />
        <div className={styles.heroParticles} />

        <div className={styles.heroContent}>
          <motion.div className={styles.heroText} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <motion.p className={styles.heroEyebrow} initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.5, delay: 0.3 }}>
              {HOTEL_INFO.tagline}
            </motion.p>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Nestled in the</span>
              <span className={styles.heroTitleMain}>Karakoram</span>
            </h1>
            <div className={styles.heroGoldLine} />
            <p className={styles.heroSub}>Luxury &bull; Serenity &bull; Authenticity</p>
            <motion.div className={styles.heroActions} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Link to="/rooms" className={styles.primaryBtn}>
                <span>Explore Rooms</span>
                <span className={styles.btnArrow}>&rarr;</span>
              </Link>
              <Link to="/tour" className={styles.secondaryBtn}>3D Virtual Tour</Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            <AvailabilityChecker />
          </motion.div>
        </div>

        <motion.div className={styles.scrollHint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <span>Scroll to explore</span>
          <div className={styles.scrollLine} />
        </motion.div>

        <div className={styles.heroLocation}>
          <span>&#127979;</span>
          <span>Airport Road, Hoto, Skardu, Gilgit-Baltistan</span>
        </div>
      </section>

      {/* STATS BAR */}
      <section className={styles.statsBar}>
        {[
          { num: '11', label: 'Signature Rooms' },
          { num: '4', label: 'Curated Packages' },
          { num: '2', label: 'Hotel Floors' },
          { num: '24/7', label: 'Concierge' },
          { num: '10+', label: 'Skardu Attractions' },
        ].map((s, i) => (
          <motion.div key={i} className={styles.statItem} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* FEATURED ROOMS */}
      <section className={styles.featuredRooms}>
        <div className={styles.featuredInner}>
          <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrow}>Curated Accommodations</p>
            <h2>Rooms Named After Skardu&rsquo;s Legends</h2>
          </motion.div>
          <div className={styles.featuredGrid}>
            {FEATURED_ROOMS.map((room, i) => (
              <motion.div key={room.id} className={styles.featuredCard} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className={styles.featuredCardImg}>
                  <img src={room.image} alt={room.name} />
                  <div className={styles.featuredImgOverlay} />
                  <span className={styles.featuredFloor}>{room.floor === 'first' ? 'First Floor' : 'Ground Floor'}</span>
                </div>
                <div className={styles.featuredCardBody}>
                  <p className={styles.featuredConfig}>{room.bedConfig}</p>
                  <h3>{room.name}</h3>
                  <p className={styles.featuredDesc}>{room.description.slice(0, 90)}&hellip;</p>
                  <div className={styles.featuredFooter}>
                    <span className={styles.featuredPrice}>{formatPrice(room.price)}<small>/night</small></span>
                    <Link to="/rooms" className={styles.featuredBtn}>View Room</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className={styles.featuredAction}>
            <Link to="/rooms" className={styles.viewAllBtn}>View All 11 Rooms &amp; Packages &rarr;</Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className={styles.gallery}>
        <div className={styles.galleryInner}>
          <motion.div className={styles.galleryHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrow}>Discover Skardu</p>
            <h2>Legendary Landscapes at Your Doorstep</h2>
            <p className={styles.galleryLead}>The Karakoram&rsquo;s most extraordinary destinations &mdash; all within reach of Nestopia on Airport Road.</p>
          </motion.div>

          <div className={styles.galleryLayout}>
            <div className={styles.galleryMain}>
              <AnimatePresence mode="wait">
                <motion.div key={galleryActive} className={styles.galleryFeatured} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                  <img src={GALLERY[galleryActive].src} alt={GALLERY[galleryActive].caption} />
                  <div className={styles.galleryCaption}>
                    <div className={styles.galleryCaptionInner}>
                      <span className={styles.galleryCaptionTag}>{GALLERY[galleryActive].category}</span>
                      <span className={styles.galleryCaptionText}>{GALLERY[galleryActive].caption}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className={styles.galleryDots}>
                {GALLERY.map((_, i) => (
                  <button key={i} className={`${styles.dot}${i === galleryActive ? ' ' + styles.dotActive : ''}`} onClick={() => handleThumbClick(i)} />
                ))}
              </div>
            </div>
            <div className={styles.gallerySide}>
              {GALLERY.slice(0, 4).map((photo, i) => (
                <button key={i} className={`${styles.gallerySideThumb}${i === galleryActive ? ' ' + styles.thumbActive : ''}`} onClick={() => handleThumbClick(i)}>
                  <img src={photo.src} alt={photo.caption} />
                  <div className={styles.thumbOverlay} />
                  <span>{photo.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>
          <motion.div className={styles.aboutImg} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85" alt="Nestopia luxury interior" />
            <div className={styles.aboutImgBadge}>
              <span>Est.</span>
              <strong>Skardu</strong>
              <span>Pakistan</span>
            </div>
          </motion.div>
          <motion.div className={styles.aboutText} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className={styles.sectionEyebrow}>Our Story</p>
            <h2>Where the Karakoram Meets Elegance</h2>
            <div className={styles.goldDivider} />
            <p className={styles.aboutLead}>{HOTEL_INFO.description}</p>
            <p className={styles.aboutSub}>{HOTEL_INFO.accommodationNote}</p>
            <Link to="/rooms" className={styles.aboutCta}>Explore Our Rooms &rarr;</Link>
          </motion.div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className={styles.amenities}>
        <div className={styles.amenitiesInner}>
          <motion.div className={styles.amenitiesHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrow}>Facilities &amp; Services</p>
            <h2>Every Comfort, Perfectly Delivered</h2>
          </motion.div>
          <div className={styles.amenitiesGrid}>
            {AMENITIES.map((a, i) => (
              <motion.div key={a.title} className={styles.amenityCard} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <span className={styles.amenityIcon}>{a.icon}</span>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D TOUR CTA */}
      <section className={styles.tourCta}>
        <div className={styles.tourCtaBg}>
          <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80" alt="Hotel room" />
          <div className={styles.tourCtaOverlay} />
        </div>
        <div className={styles.tourCtaContent}>
          <motion.div className={styles.tourCtaLeft} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrowLight}>Virtual Experience</p>
            <h2>Explore Both Floors in Immersive 3D</h2>
            <p>Walk through our lobby, corridors, and every room &mdash; see the Karakoram views through each window &mdash; before you arrive.</p>
            <Link to="/tour" className={styles.tourBtn}>
              <span>Start 3D Tour</span>
              <span className={styles.tourBtnIcon}>&rarr;</span>
            </Link>
          </motion.div>
          <div className={styles.tourFeatures}>
            {[
              { num: '01', title: 'Ground & First Floor', desc: 'Full walkthrough of both hotel floors' },
              { num: '02', title: '11 Unique Rooms', desc: 'Enter and explore every room in 3D' },
              { num: '03', title: 'Mountain Views', desc: 'See real Karakoram panoramas through windows' },
            ].map((item, i) => (
              <motion.div key={item.num} className={styles.featureCard} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <span className={styles.featureNum}>{item.num}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsInner}>
          <motion.div className={styles.testimonialsHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrow}>Guest Voices</p>
            <h2>What Our Guests Say</h2>
          </motion.div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} className={styles.testimonialCard} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={styles.starsRow}>
                  {Array.from({ length: t.rating }, (_, k) => <span key={k} className={styles.star}>&#9733;</span>)}
                </div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <span className={styles.testimonialName}>{t.name}</span>
                    <span className={styles.testimonialMeta}>{t.location} &bull; {t.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATTRACTIONS */}
      <section className={styles.attractions}>
        <div className={styles.attractionsInner}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className={styles.sectionEyebrow}>Nearby Wonders</p>
            <h2>Explore Skardu &mdash; Attractions from Nestopia</h2>
            <p className={styles.attractionsLead}>Our prime location on Airport Road puts Skardu&rsquo;s most spectacular natural wonders at your fingertips.</p>
          </motion.div>
          <div className={styles.attractionsTable}>
            <div className={styles.attractionHeader}>
              <span>Destination</span>
              <span>Distance</span>
              <span>Travel Time</span>
            </div>
            {ATTRACTIONS.map((a, i) => (
              <motion.div key={a.name} className={styles.attractionRow} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <span className={styles.attractionName}>{a.name}</span>
                <span>{a.distance}</span>
                <span>{a.travelTime}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.location}>
        <div className={styles.locationInner}>
          <p className={styles.sectionEyebrow}>Reach Us</p>
          <h2>Contact &amp; Reservations</h2>
          <p className={styles.locationAddr}>{HOTEL_INFO.location} &mdash; {HOTEL_INFO.region}</p>
          <div className={styles.locationDetails}>
            <a href={"tel:" + HOTEL_INFO.phone.replace(/\s/g, '')}>&#128222; {HOTEL_INFO.phone}</a>
            <a href={"tel:" + HOTEL_INFO.phoneAlt.replace(/\s/g, '')}>&#128222; {HOTEL_INFO.phoneAlt}</a>
            <a href={"mailto:" + HOTEL_INFO.email}>&#9993; {HOTEL_INFO.email}</a>
            <a href={"https://" + HOTEL_INFO.website} target="_blank" rel="noopener noreferrer">&#127760; {HOTEL_INFO.website}</a>
          </div>
          <div className={styles.social}>
            <span>Instagram {HOTEL_INFO.social.instagram}</span>
            <span>TikTok {HOTEL_INFO.social.tiktok}</span>
            <span>Facebook {HOTEL_INFO.social.facebook}</span>
          </div>
          <div className={styles.mapEmbed}>
            <iframe title="Nestopia Hotel Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.5!2d75.634!3d35.297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDE3JzUwLjAiTiA3NcKwMzgnMDIuNCJF!5e0!3m2!1sen!2s!4v1" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

    </div>
  )
}
