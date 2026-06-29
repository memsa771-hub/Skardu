export interface Room {
  id: string
  name: string
  bedConfig: string
  floor: 'ground' | 'first'
  description: string
  price: number
  priceRiver?: number
  priceNonRiver?: number
  maxGuests: number
  inventory: number
  amenities: string[]
  image: string
  color: string
}

export interface GalleryPhoto {
  src: string
  caption: string
  category: 'landscape' | 'lake' | 'culture' | 'adventure' | 'hotel'
}

export interface Testimonial {
  name: string
  location: string
  rating: number
  text: string
  date: string
}

export interface Package {
  id: string
  name: string
  tier: 'river-view' | 'standard' | 'executive' | 'premium'
  description: string
  inclusions: string[]
  price: number
  maxGuests: number
  image: string
}

export interface Attraction {
  name: string
  distance: string
  travelTime: string
}

export interface Booking {
  id: string
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  email: string
  phone: string
  totalPrice: number
  status: 'confirmed' | 'pending'
  createdAt: string
  viewType?: 'river' | 'non-river'
}

export const HOTEL_INFO = {
  name: 'Nestopia Hotels & Resorts',
  shortName: 'Nestopia Hotel Skardu',
  location: 'Airport Road, Hoto, Skardu',
  region: 'Gilgit-Baltistan, Pakistan',
  phone: '+92 313 3333255',
  phoneAlt: '058 15552672',
  email: 'reservations@nestopiahotels.com',
  website: 'www.nestopiahotels.com',
  tagline: 'Where the Karakoram Meets Elegance',
  subtitle: 'Your Sanctuary in the Roof of the World',
  values: ['Luxury', 'Serenity', 'Authenticity'],
  description:
    'Nestled against the dramatic backdrop of Skardu\'s majestic Karakoram peaks, Nestopia Hotel stands as the region\'s premier destination for discerning travellers. We blend contemporary elegance with the warmth of Balti hospitality — offering meticulously appointed rooms, a scenic riverside setting, and seamless access to Northern Pakistan\'s most breathtaking landscapes.',
  accommodationNote:
    'Every room is thoughtfully designed to deliver an unforgettable experience in the heart of the Karakoram. Air-conditioned interiors, premium bedding, ambient LED lighting, and private ensuite bathrooms await every guest.',
  social: {
    instagram: '@nestopiahotel',
    tiktok: '@nestopiahotel',
    facebook: 'Nestopia Hotel',
  },
  highlights: [
    {
      title: 'Prime Location',
      text: 'Situated on Airport Road, Hoto — your gateway to Skardu\'s iconic attractions, minutes from the airport.',
    },
    {
      title: 'Signature Rooms',
      text: 'Eleven curated room types — each named after Skardu\'s legendary landscapes — with river and mountain views.',
    },
    {
      title: 'Fine Dining',
      text: 'Savour authentic Balti cuisine, regional specialties, and international fare crafted by expert chefs.',
    },
    {
      title: 'Concierge & Tours',
      text: 'Expert in-house guides for K2 base camp treks, Deosai plains drives, and Shangrila lake excursions.',
    },
    {
      title: 'Riverside Serenity',
      text: 'Select rooms overlook the glacial Indus river — fall asleep to the sound of ancient mountain waters.',
    },
    {
      title: 'Modern Comfort',
      text: 'High-speed Wi-Fi, generator backup, air conditioning, and 24/7 concierge service at every turn.',
    },
  ],
}

export const AMENITIES = [
  { icon: '❄️', title: 'Climate Control', desc: 'Central air-conditioning in all rooms' },
  { icon: '🛁', title: 'Ensuite Bathrooms', desc: 'Private marble bathrooms with hot water' },
  { icon: '🍽️', title: 'Fine Dining', desc: 'Authentic Balti & continental cuisine' },
  { icon: '🏔️', title: 'Mountain Views', desc: 'Panoramic Karakoram vistas from your window' },
  { icon: '🚗', title: 'Airport Transfer', desc: 'Complimentary pickup from Skardu Airport' },
  { icon: '📡', title: 'High-Speed WiFi', desc: 'Fibre connectivity throughout the property' },
  { icon: '🏋️', title: 'Fitness Centre', desc: 'Well-equipped gym open 6am – 10pm' },
  { icon: '🧺', title: 'Laundry Service', desc: 'Same-day laundry & dry cleaning available' },
  { icon: '🔒', title: '24/7 Security', desc: 'Round-the-clock security & CCTV' },
  { icon: '⚡', title: 'Generator Backup', desc: 'Uninterrupted power supply guaranteed' },
  { icon: '🗺️', title: 'Tour Desk', desc: 'In-house excursion planning & guided tours' },
  { icon: '☕', title: 'Room Service', desc: 'In-room dining available 6am – midnight' },
]

export const GALLERY: GalleryPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
    caption: 'Upper Kachura Lake — Skardu',
    category: 'lake',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85',
    caption: 'Karakoram Mountain Trails',
    category: 'adventure',
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85',
    caption: 'Starlit Peaks of Northern Pakistan',
    category: 'landscape',
  },
  {
    src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=85',
    caption: 'Milky Way over the Roof of the World',
    category: 'landscape',
  },
  {
    src: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1400&q=85',
    caption: 'Deosai Plains — World\'s Second Highest Plateau',
    category: 'adventure',
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=85',
    caption: 'Shigar Valley & Ancient Silk Road',
    category: 'culture',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=85',
    caption: 'The Glacial Indus River Valley',
    category: 'landscape',
  },
  {
    src: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&q=85',
    caption: 'Sarfaranga Cold Desert — Skardu',
    category: 'landscape',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Arjun Kapoor',
    location: 'Lahore',
    rating: 5,
    text: 'Nestopia is genuinely exceptional. The river view room was breathtaking — waking up to the Indus with the Karakorams behind it is something I will never forget. The staff went above and beyond.',
    date: 'May 2026',
  },
  {
    name: 'Sarah Mitchell',
    location: 'London, UK',
    rating: 5,
    text: 'We stayed in the Deosai Panorama suite on the first floor. The views are incredible, the room was immaculate, and the breakfast was the best in Skardu. This hotel has no equal in the region.',
    date: 'April 2026',
  },
  {
    name: 'Zainab Hussain',
    location: 'Karachi',
    rating: 5,
    text: 'From the Airport transfer to the guided K2 base camp trek, everything was flawlessly organised. The Concordia Suite for our family was spacious and the amenities rivalled any luxury hotel.',
    date: 'June 2026',
  },
  {
    name: 'Michael Chen',
    location: 'Singapore',
    rating: 5,
    text: 'The Grand Nestopia package was worth every rupee. Private lounge, VIP concierge, the most stunning mountain vista I\'ve seen from a hotel window anywhere in the world.',
    date: 'March 2026',
  },
]

/** High-quality hotel room photos (Unsplash) */
const ROOM_PHOTOS = {
  master:    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85',
  family:    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=85',
  suite:     'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=85',
  twin:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85',
  triple:    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=85',
  premium:   'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=85',
  riverView: 'https://images.unsplash.com/photo-1571896349849-8c642243080a?w=800&q=85',
  lounge:    'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800&q=85',
  executive: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=85',
  grand:     'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=85',
  sanctuary: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=85',
  panorama:  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=85',
}

export const ROOMS: Room[] = [
  {
    id: 'gf-master',
    name: 'Karakoram Retreat',
    bedConfig: 'Master',
    floor: 'ground',
    description: 'Named after the great Karakoram range, this sanctuary features a king-sized master bed, river-view window, ambient LED lighting, and a marble ensuite — your private retreat at the roof of the world.',
    price: 13700,
    priceRiver: 13700,
    priceNonRiver: 11700,
    maxGuests: 2,
    inventory: 7,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', 'Premium Bedding', 'River View Option'],
    image: ROOM_PHOTOS.master,
    color: '#6b5344',
  },
  {
    id: 'gf-master-1-single',
    name: 'Indus Sanctuary',
    bedConfig: 'Master + 1 Single',
    floor: 'ground',
    description: 'Inspired by the ancient Indus River, this refined room pairs a plush master bed with a single — ideal for a couple with one companion, offering all the elegance of the Karakoram spirit.',
    price: 14700,
    priceRiver: 14700,
    priceNonRiver: 12700,
    maxGuests: 3,
    inventory: 3,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', 'Premium Bedding', 'River View Option'],
    image: ROOM_PHOTOS.family,
    color: '#5c4a3a',
  },
  {
    id: 'gf-master-master',
    name: 'Baltistan Grand',
    bedConfig: 'Master + Master',
    floor: 'ground',
    description: 'A grand room worthy of the ancient Kingdom of Baltistan — two master beds, a shared sitting alcove, and the full suite of luxury amenities for guests who refuse to compromise.',
    price: 17700,
    priceRiver: 17700,
    maxGuests: 4,
    inventory: 1,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', 'Twin Master Beds', 'Sitting Alcove'],
    image: ROOM_PHOTOS.suite,
    color: '#4a5568',
  },
  {
    id: 'gf-master-2-single',
    name: 'Concordia Suite',
    bedConfig: 'Master + 2 Single',
    floor: 'ground',
    description: 'Named after the iconic Concordia plateau — confluence of the world\'s greatest peaks — this generously proportioned suite accommodates families with one master and two single beds, flowing into an open living space.',
    price: 17700,
    priceRiver: 17700,
    priceNonRiver: 15700,
    maxGuests: 4,
    inventory: 3,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', 'Family Layout', 'River View Option'],
    image: ROOM_PHOTOS.triple,
    color: '#3d4f5c',
  },
  {
    id: 'gf-3-single',
    name: 'K2 Explorer',
    bedConfig: '3 Single Beds',
    floor: 'ground',
    description: 'For the adventurers and the bold — this room mirrors the spirit of K2 itself. Three premium singles, each perfectly appointed, waiting for those who conquer the world\'s most demanding peaks.',
    price: 14700,
    priceRiver: 14700,
    priceNonRiver: 12700,
    maxGuests: 3,
    inventory: 2,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', '3 Premium Singles', 'River View Option'],
    image: ROOM_PHOTOS.triple,
    color: '#5a6b5a',
  },
  {
    id: 'gf-2-single',
    name: 'Sadpara Vista',
    bedConfig: '2 Single Beds',
    floor: 'ground',
    description: 'Overlooking the spirit of Sadpara Lake\'s serene beauty, this polished twin room offers two premium single beds — refined, restful, and perfectly positioned between mountains and river.',
    price: 12700,
    priceRiver: 12700,
    priceNonRiver: 11700,
    maxGuests: 2,
    inventory: 2,
    amenities: ['AC', 'LED Lighting', 'Marble Ensuite', 'Twin Premium Singles', 'River View Option'],
    image: ROOM_PHOTOS.twin,
    color: '#6b5a4a',
  },
  {
    id: 'ff-master-1-single',
    name: 'Shigar Escape',
    bedConfig: 'Master + 1 Single',
    floor: 'first',
    description: 'Elevated on the first floor with the romance of Shigar Valley woven into every detail — a master bed and single companion arrangement, enhanced ceiling height, and elevated mountain panoramas through expansive windows.',
    price: 19800,
    maxGuests: 3,
    inventory: 2,
    amenities: ['AC', 'LED Lighting', 'Premium Ensuite', 'Elevated Views', 'Extra Ceiling Height'],
    image: ROOM_PHOTOS.family,
    color: '#5c4a3a',
  },
  {
    id: 'ff-master-master',
    name: 'Deosai Panorama',
    bedConfig: 'Master + Master',
    floor: 'first',
    description: 'As vast and magnificent as the Deosai Plains, this premium first-floor suite spreads across two master beds with commanding mountain panoramas, refined furnishings, and exclusive first-floor privileges.',
    price: 24700,
    maxGuests: 4,
    inventory: 1,
    amenities: ['AC', 'LED Lighting', 'Premium Ensuite', 'Twin Masters', 'Mountain Panorama', 'Priority Service'],
    image: ROOM_PHOTOS.suite,
    color: '#4a5568',
  },
  {
    id: 'ff-single-single-master',
    name: 'Upper Indus Suite',
    bedConfig: 'Single + Single + Master',
    floor: 'first',
    description: 'The Upper Indus Suite channels the grandeur of the high-altitude Indus basin — a master bed flanked by two singles in a wide first-floor layout, with elevated views and all premium amenities throughout.',
    price: 24700,
    maxGuests: 4,
    inventory: 1,
    amenities: ['AC', 'LED Lighting', 'Premium Ensuite', 'Triple Bed Configuration', 'Elevated Views'],
    image: ROOM_PHOTOS.premium,
    color: '#3d4f5c',
  },
  {
    id: 'ff-single-single',
    name: 'Shangrila Twin',
    bedConfig: 'Single + Single',
    floor: 'first',
    description: 'Named after Skardu\'s legendary Shangrila Resort, this pristine first-floor twin room carries an air of timeless discovery — two premium singles, refined finishes, and a window framing the Karakoram horizon.',
    price: 14700,
    maxGuests: 2,
    inventory: 1,
    amenities: ['AC', 'LED Lighting', 'Premium Ensuite', 'Twin Premium Singles', 'Elevated Views'],
    image: ROOM_PHOTOS.twin,
    color: '#5a6b5a',
  },
  {
    id: 'ff-master',
    name: 'Summit Sanctuary',
    bedConfig: 'Master',
    floor: 'first',
    description: 'The pinnacle of solitary luxury — the Summit Sanctuary sits atop the first floor with a king master bed, bespoke Balti decor, and a window-view of Skardu\'s legendary mountain silhouettes at dusk.',
    price: 14700,
    maxGuests: 2,
    inventory: 1,
    amenities: ['AC', 'LED Lighting', 'Premium Ensuite', 'King Master Bed', 'Mountain Silhouette View', 'Bespoke Decor'],
    image: ROOM_PHOTOS.master,
    color: '#6b5344',
  },
]

export const PACKAGES: Package[] = [
  {
    id: 'river-view-package',
    name: 'Riverside Serenity',
    tier: 'river-view',
    description: 'Our signature riverside experience — wake to the glacial Indus at your window with curated inclusions crafted for two guests seeking pure mountain serenity.',
    inclusions: [
      'Scenic Indus River View',
      'Complimentary Breakfast for 2',
      'Welcome Tea & Kahwa',
      'Dry Fruit & Walnut Platter',
      'Complimentary Mineral Water',
      'Laundry Service',
      'Late Checkout (subject to availability)',
    ],
    price: 19800,
    maxGuests: 2,
    image: ROOM_PHOTOS.riverView,
  },
  {
    id: 'package-standard',
    name: 'Mountain Retreat',
    tier: 'standard',
    description: 'Two beautifully appointed rooms sharing an exclusive private lounge — perfect for families and small groups who want the comfort of a home with the luxury of Nestopia.',
    inclusions: [
      'Two Premium Rooms',
      'Exclusive Private Lounge',
      'Premium Bedding & Pillows',
      'Ensuite Marble Bathrooms',
      'Daily Housekeeping',
      'Complimentary Breakfast',
      'Welcome Gift Hamper',
    ],
    price: 37900,
    maxGuests: 6,
    image: ROOM_PHOTOS.lounge,
  },
  {
    id: 'package-executive',
    name: 'Karakoram Collection',
    tier: 'executive',
    description: 'Curated for the discerning traveller — the Karakoram Collection elevates your stay with two superior rooms, a private lounge, and bespoke concierge service backed by the prestige of Nestopia.',
    inclusions: [
      'Two Superior Rooms',
      'Private Lounge with Mountain View',
      'Premium Bedding & Turkish Towels',
      'Priority Check-in & Check-out',
      'Complimentary Breakfast & High Tea',
      'In-Room Dining Credits',
      'Guided City & Lake Excursion',
      'Airport Transfer (2 way)',
    ],
    price: 47900,
    maxGuests: 6,
    image: ROOM_PHOTOS.executive,
  },
  {
    id: 'package-premium',
    name: 'Grand Nestopia',
    tier: 'premium',
    description: 'The pinnacle of Nestopia hospitality — our Grand package commands two rooms and an exclusive private lounge with panoramic views, VIP treatment, and experiences designed for those who accept nothing less than extraordinary.',
    inclusions: [
      'Two Finest Rooms',
      'Exclusive Private Lounge & Terrace',
      'Bespoke Premium Bedding',
      'VIP Concierge & Butler Service',
      'Full Board (Breakfast, Lunch & Dinner)',
      'Laundry & Dry Cleaning',
      'Guided Karakoram Excursion',
      'Airport VIP Transfer (2 way)',
      'Welcome Hamper & Floral Arrangement',
      'Late Checkout Guaranteed',
    ],
    price: 57900,
    maxGuests: 8,
    image: ROOM_PHOTOS.grand,
  },
]

export const ATTRACTIONS: Attraction[] = [
  { name: 'Kachura (Lower Lake / Shangrila)', distance: '12 km', travelTime: '25 min' },
  { name: 'Upper Kachura Lake', distance: '15 km', travelTime: '30 min' },
  { name: 'Sarfaranga Cold Desert', distance: '15 km', travelTime: '25 min' },
  { name: 'Soq Valley', distance: '25 km', travelTime: '1 hr' },
  { name: 'Shigar Valley / Shigar Fort', distance: '26 km', travelTime: '45 min' },
  { name: 'Deosai Plains (via Sadpara)', distance: '30 km', travelTime: '2 hr 45 min' },
  { name: 'Chunda Valley', distance: '30 km', travelTime: '50 min' },
  { name: 'Basho Valley', distance: '45 km', travelTime: '1 hr 45 min' },
  { name: 'Manthoka Waterfall', distance: '80 km', travelTime: '2 hr 15 min' },
  { name: 'Minimarg', distance: '136 km', travelTime: '4 hr' },
]

/** All items that can be booked (rooms + packages) */
export interface BookableItem {
  id: string
  name: string
  description: string
  price: number
  maxGuests: number
  amenities: string[]
  image: string
  kind: 'room' | 'package'
  floor?: 'ground' | 'first'
  priceRiver?: number
  priceNonRiver?: number
}

export function getAllBookable(): BookableItem[] {
  const rooms: BookableItem[] = ROOMS.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    price: r.price,
    maxGuests: r.maxGuests,
    amenities: r.amenities,
    image: r.image,
    kind: 'room' as const,
    floor: r.floor,
    priceRiver: r.priceRiver,
    priceNonRiver: r.priceNonRiver,
  }))
  const packages: BookableItem[] = PACKAGES.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    maxGuests: p.maxGuests,
    amenities: p.inclusions,
    image: p.image,
    kind: 'package' as const,
  }))
  return [...rooms, ...packages]
}

export function getBookableById(id: string): BookableItem | undefined {
  return getAllBookable().find((b) => b.id === id)
}

const BOOKED_DATES: Record<string, string[]> = {
  'gf-master': ['2026-06-28', '2026-06-29'],
  'ff-master-master': ['2026-07-01', '2026-07-02'],
  'river-view-package': ['2026-07-05', '2026-07-06'],
  'package-premium': ['2026-06-30'],
}

export function checkAvailability(roomId: string, checkIn: string, checkOut: string): boolean {
  const booked = BOOKED_DATES[roomId] || []
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    if (booked.includes(dateStr)) return false
  }
  return true
}

export function getAvailableRooms(checkIn: string, checkOut: string, guests: number): BookableItem[] {
  return getAllBookable().filter(
    (item) => item.maxGuests >= guests && checkAvailability(item.id, checkIn, checkOut)
  )
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

export function saveBooking(booking: Booking): void {
  const existing = JSON.parse(localStorage.getItem('nestopia_bookings') || '[]')
  existing.push(booking)
  localStorage.setItem('nestopia_bookings', JSON.stringify(existing))
}

export function getBookings(): Booking[] {
  return JSON.parse(localStorage.getItem('nestopia_bookings') || '[]')
}

export function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`
}
