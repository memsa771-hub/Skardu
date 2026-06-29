import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HOTEL_INFO } from '../data/hotel'
import styles from './Contact.module.css'

const CONTACT_CARDS = [
  {
    icon: '&#128205;',
    label: 'Location',
    lines: [HOTEL_INFO.location, 'Skardu, Gilgit-Baltistan', 'Pakistan'],
  },
  {
    icon: '&#128222;',
    label: 'Phone',
    lines: [HOTEL_INFO.phone, HOTEL_INFO.phoneAlt],
    links: [
      { href: 'tel:' + HOTEL_INFO.phone.replace(/\s/g, ''), text: HOTEL_INFO.phone },
      { href: 'tel:' + HOTEL_INFO.phoneAlt.replace(/\s/g, ''), text: HOTEL_INFO.phoneAlt },
    ],
  },
  {
    icon: '&#9993;',
    label: 'Email',
    links: [{ href: 'mailto:' + HOTEL_INFO.email, text: HOTEL_INFO.email }],
  },
  {
    icon: '&#127760;',
    label: 'Website',
    links: [{ href: 'https://' + HOTEL_INFO.website, text: HOTEL_INFO.website }],
  },
]

const SOCIAL = [
  { label: 'Instagram', handle: HOTEL_INFO.social.instagram, icon: '&#128247;' },
  { label: 'TikTok', handle: HOTEL_INFO.social.tiktok, icon: '&#127908;' },
  { label: 'Facebook', handle: HOTEL_INFO.social.facebook, icon: '&#128065;' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const field = (id: string, label: string, type = 'text', multi = false) => (
    <div className={`${styles.field}${focused === id ? ' ' + styles.fieldFocused : ''}`}>
      <label htmlFor={id}>{label}</label>
      {multi ? (
        <textarea
          id={id}
          value={(form as Record<string, string>)[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          rows={5}
          required
        />
      ) : (
        <input
          id={id}
          type={type}
          value={(form as Record<string, string>)[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          required={id !== 'phone'}
        />
      )}
      <div className={styles.fieldLine} />
    </div>
  )

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <img
          className={styles.heroBg}
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Skardu landscape"
        />
        <div className={styles.heroOverlay} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className={styles.eyebrow}>Nestopia Hotel &mdash; Skardu</p>
          <h1>Get in Touch</h1>
          <div className={styles.goldLine} />
          <p className={styles.sub}>We are here to make your stay extraordinary. Reach out to our team anytime.</p>
        </motion.div>
      </section>

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>

        {/* LEFT: Info */}
        <div className={styles.infoCol}>
          <div className={styles.infoHeader}>
            <p className={styles.eyebrowDark}>Contact Details</p>
            <h2>Reach Us Directly</h2>
            <div className={styles.goldLine} />
          </div>

          <div className={styles.cards}>
            {CONTACT_CARDS.map((c, i) => (
              <motion.div key={c.label} className={styles.infoCard} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className={styles.cardIcon} dangerouslySetInnerHTML={{ __html: c.icon }} />
                <div>
                  <p className={styles.cardLabel}>{c.label}</p>
                  {c.lines?.map(l => <p key={l} className={styles.cardLine}>{l}</p>)}
                  {c.links?.map(l => <a key={l.href} href={l.href} className={styles.cardLink}>{l.text}</a>)}
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.socialBlock}>
            <p className={styles.socialLabel}>Follow Our Journey</p>
            <div className={styles.socialList}>
              {SOCIAL.map(s => (
                <div key={s.label} className={styles.socialItem}>
                  <span dangerouslySetInnerHTML={{ __html: s.icon }} />
                  <div>
                    <span className={styles.socialPlatform}>{s.label}</span>
                    <span className={styles.socialHandle}>{s.handle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapWrap}>
            <iframe
              title="Nestopia Hotel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.5!2d75.634!3d35.297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDE3JzUwLjAiTiA3NcKwMzgnMDIuNCJF!5e0!3m2!1sen!2s!4v1"
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className={styles.formCol}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" className={styles.success} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <div className={styles.successIcon}>&#10003;</div>
                <h3>Message Received</h3>
                <p>Thank you for contacting Nestopia. Our team will respond within 24 hours.</p>
                <button className={styles.resetBtn} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className={styles.form} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.formHeader}>
                  <p className={styles.eyebrowDark}>Send a Message</p>
                  <h2>We Would Love to Hear From You</h2>
                  <div className={styles.goldLine} />
                </div>
                <div className={styles.fieldRow}>
                  {field('name', 'Full Name')}
                  {field('email', 'Email Address', 'email')}
                </div>
                <div className={styles.fieldRow}>
                  {field('phone', 'Phone (optional)', 'tel')}
                  {field('subject', 'Subject')}
                </div>
                {field('message', 'Your Message', 'text', true)}
                <button type="submit" className={styles.submitBtn}>
                  Send Message &rarr;
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}