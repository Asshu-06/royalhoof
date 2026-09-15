import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, MapPin, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import logoImg from '../assets/logo.png'
import { DEFAULT_OFFERINGS } from '../data/defaultOfferings'
import { getSetting } from '../services/settingsService'

const FacebookIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export default function Footer() {
  const { t } = useLanguage()
  const [offerings, setOfferings] = useState(DEFAULT_OFFERINGS)

  useEffect(() => {
    async function loadOfferings() {
      try {
        const customOffers = await getSetting('site_offerings')
        if (customOffers && Array.isArray(customOffers) && customOffers.length > 0) {
          setOfferings(customOffers)
        }
      } catch (err) {
        console.error("Error loading footer offerings:", err)
      }
    }
    loadOfferings()

    const handleUpdate = (e) => {
      if (e.detail && e.detail.key === 'site_offerings' && Array.isArray(e.detail.value)) {
        setOfferings(e.detail.value)
      }
    }
    window.addEventListener('site_settings_updated', handleUpdate)
    return () => window.removeEventListener('site_settings_updated', handleUpdate)
  }, [])
  return (
    <footer style={{
      background: "linear-gradient(180deg, #0C0D11 0%, #0C0D11 60%, #0C0D11 100%)",
      borderTop: "2px solid #C5963A",
    }} className="mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(197,150,58,0.1) 0%, transparent 60%)",
      }} />

      {/* Decorative top ribbon strip */}
      <div className="bg-[#0C0D11] border-b border-[#C5963A]/40 py-2.5 px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C5963A] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
          ✦ RIDE • LEARN • GROW • BELONG ✦
        </p>
      </div>

      <div className="relative w-full px-6 lg:px-12 xl:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <img src={logoImg} alt="Royal Hoof Logo" className="w-12 h-12 object-contain flex-shrink-0" onError={(e) => { e.target.src = "/logo.png" }} />
              <h3 className="text-2xl md:text-3xl font-bold text-[#C5963A]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif", letterSpacing: "0.06em" }}>
                ROYAL HOOF
              </h3>
            </div>
            <p className="text-xs font-semibold mb-5 tracking-[0.2em] uppercase text-[#D2AA55]" style={{ fontFamily: "'Inter', sans-serif" }}>
              HORSE RIDING ACADEMY & CLUB
            </p>
            <p className="text-sm leading-relaxed mb-8 max-w-md text-[#D8C5A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Experience premium horse riding with professional training, boarding facilities, and trail rides. Established 2026.
            </p>

            <div className="space-y-3.5 text-sm text-[#D8C5A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C5963A] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#F5EBD8]">GIRI FARMS, Uniworld City</p>
                  <p>Aspen Greens, Nallambakkam, Chennai, Tamil Nadu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C5963A]" />
                <span className="font-medium text-[#F5EBD8]">9043700776</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-[#C5963A]" />
                <span className="font-medium text-[#F5EBD8]">www.royalhoof.com</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 pt-4 border-t border-[#C5963A]/20">
              <p className="text-xs uppercase tracking-widest text-[#C5963A] font-semibold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/royalhoofhorseriddingacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0C0D11] border border-[#C5963A]/40 text-[#C5963A] hover:text-[#0C0D11] hover:bg-[#C5963A] hover:border-[#C5963A] transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110"
                  title="Facebook"
                  aria-label="Royal Hoof Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href="https://www.instagram.com/royal_hoof_horse_ridding?stkn=eWwydWVidzcxMjRq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0C0D11] border border-[#C5963A]/40 text-[#C5963A] hover:text-[#0C0D11] hover:bg-[#C5963A] hover:border-[#C5963A] transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110"
                  title="Instagram"
                  aria-label="Royal Hoof Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Services & Quick Links side-by-side */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <div>
              <h4 className="eyebrow-label mb-5 text-[#C5963A]">Our Services</h4>
              <ul className="space-y-2.5">
                {offerings.map(item => (
                  <li key={item.id || item.slug}>
                    <Link
                      to={`/programs/${item.slug || item.id}`}
                      className="text-xs sm:text-sm text-[#D8C5A0] hover:text-[#C5963A] transition-colors duration-200 block py-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="eyebrow-label mb-5 text-[#C5963A]">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { to: "/", label: "Home" },
                  { to: "/events", label: "Upcoming Events" },
                  { to: "/packages", label: "Packages & Pricing" },
                  { to: "/gallery", label: "Visual Showcase" },
                  { to: "/csr", label: "CSR Initiatives" },
                  { to: "/enquiry", label: "Book a Session" },
                  { to: "/contact", label: "Contact Us" },
                ].map(item => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm transition-colors duration-300 text-[#D8C5A0]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C5963A"}
                      onMouseLeave={e => e.currentTarget.style.color = "#D8C5A0"}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="equestrian-divider my-8" />

        {/* Poster bottom contact strip layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D8C5A0] border-t border-[#C5963A]/20 pt-6"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex flex-wrap items-center justify-center gap-4 text-center md:text-left">
            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#C5963A]" /> NALLAMBAKKAM, CHENNAI</span>
            <span className="text-[#C5963A]">|</span>
            <span className="flex items-center gap-1.5"><Globe size={13} className="text-[#C5963A]" /> www.royalhoof.com</span>
            <span className="text-[#C5963A]">|</span>
            <span className="flex items-center gap-1.5"><Phone size={13} className="text-[#C5963A]" /> 9043700776</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#C5963A] font-semibold tracking-widest text-[0.7rem]">ESTD. 2026</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/royalhoofhorseriddingacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8C5A0] hover:text-[#C5963A] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://www.instagram.com/royal_hoof_horse_ridding?stkn=eWwydWVidzcxMjRq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8C5A0] hover:text-[#C5963A] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
