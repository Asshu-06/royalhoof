import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { ArrowRight, Shield, CheckCircle, Star, Award, Users, Calendar, MapPin, ChevronLeft, ChevronRight, Mail, Phone, MessageSquare, Activity, Heart, Target, Sparkles, Trophy, Compass, Quote } from "lucide-react"
import { CATEGORIES } from "../data/products"
import { fetchProducts } from "../services/productService"
import { getSetting } from "../services/settingsService"
import { useLanguage } from "../context/LanguageContext"
import { supabase } from "../lib/supabase"
import ProductCard from "../components/ProductCard"
import SkeletonCard from "../components/SkeletonCard"
import ScrollReveal from "../components/ScrollReveal"
import ReviewsSection from "../components/ReviewsSection"
import hero1Img from "../assets/hero1.png"
import { DEFAULT_BENEFITS } from "../data/defaultBenefits"
import toast from 'react-hot-toast'
import { isValidPhone, isValidEmail } from '../utils/validation'

const LOCAL_HERO_FALLBACK = hero1Img
const FALLBACK_CAT_IMG = "https://images.unsplash.com/photo-1614703012479-0fe5f6a89be0?w=600&q=80"
const CAT_DESC = {
  "1-14 Mukhi": "Premium riding equipment",
  "Horse Riding Mala": "Professional gear collection",
  "Bracelets": "Elegant accessories",
  "Rare Collectibles": "Exclusive collection",
}
const PX = "px-6 lg:px-12 xl:px-20"

/* --- Hero Section --- */
function HeroSlider() {
  const { t } = useLanguage()
  const [slide, setSlide] = useState(0)
  const timerRef = useRef(null)
  const TOTAL = 3
  
  useEffect(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % TOTAL), 6000)
    return () => clearInterval(timerRef.current)
  }, [])
  
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(500px, 75vh, 720px)" }}>
      {/* Background */}
      <div className="absolute inset-0 bg-[#F4E9D2]" />
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-95"
        style={{ objectPosition: 'center' }}
      >
        <source src="/herovideo.mp4" type="video/mp4" />
      </video>
      
      {/* Cinematic overlay - Enhanced for better text contrast */}
      <div className="absolute inset-0" style={{ 
        background: "linear-gradient(to top, rgba(244,233,210,0.35) 0%, rgba(244,233,210,0.25) 45%, rgba(8,43,73,0.30) 100%)" 
      }} />
      {/* Subtle gold vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 80%, rgba(197, 150, 58,0.08) 0%, transparent 60%)",
      }} />
      
      {/* Content */}
      <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <p className="eyebrow-label mb-4" style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            color: "#D2AA55"
          }}>Horse Riding Academy & Club</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-[0.06em] mb-4 text-[#C5963A]" 
              style={{ 
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                letterSpacing: '0.04em',
                fontWeight: 500,
                lineHeight: 1.1,
                color: "#C5963A",
                textShadow: "0 4px 16px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)"
              }}>
            ROYAL HOOF
          </h1>
          <div className="ornamental-divider w-48 mx-auto mb-4" />
          <p className="text-sm md:text-base tracking-[0.15em] uppercase text-[#D2AA55]" 
             style={{ 
               fontFamily: "'Inter', sans-serif",
               letterSpacing: '0.15em',
               fontWeight: 500,
               color: "#D2AA55",
               textShadow: "0 2px 8px rgba(0,0,0,0.5)"
             }}>
            Nallambakkam, Tamil Nadu · ESTD. 2026
          </p>
        </motion.div>

        {/* Book Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link 
            to="/enquiry"
            className="btn-primary-equestrian inline-flex items-center gap-3 px-8 py-4 text-base"
            style={{
              boxShadow: "0 4px 16px rgba(197, 150, 58, 0.4)"
            }}
          >
            <Calendar size={20} />
            Book Now
          </Link>
        </motion.div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5">
        {Array(TOTAL).fill(0).map((_, i) => (
          <button 
            key={i} 
            onClick={() => { setSlide(i); clearInterval(timerRef.current) }}
            className={`rounded-full transition-all duration-500 ${
              i === slide 
                ? "w-8 h-1 bg-[#C5963A] shadow-[0_0_8px_rgba(197, 150, 58,0.4)]" 
                : "w-1.5 h-1.5 bg-[#082B49]/25 hover:bg-[#082B49]/50"
            }`} 
          />
        ))}
      </div>
    </section>
  )
}

/* --- About Section --- */
function AboutSection() {
  const [dbData, setDbData] = useState(null)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    getSetting("about_section_en").then(val => {
      if (val) { try { setDbData(JSON.parse(val)) } catch {} }
    }).catch(() => {})
    getSetting("about_image_url").then(url => {
      if (url) setImageUrl(url)
    }).catch(() => {})
  }, [])

  const d = dbData || {
    title: "Royal Hoof Horse Riding Academy",
    subtitle: "Nallambakkam, Tamil Nadu",
    p1: "Welcome to Royal Hoof Horse Riding Academy, located at GIRI FARMS in Nallambakkam, Tamil Nadu. We offer professional horse riding lessons for all ages in a safe, nurturing environment.",
    p2: "Our certified trainers are passionate about equestrian sports and dedicated to building a strong foundation for every rider � from complete beginners to experienced equestrians.",
    p3: "We offer a wide range of programmes including beginner lessons, advanced training, competitive riding, and special kids' sessions designed to build confidence and develop lifelong skills.",
    p4: "Safety is our top priority. All sessions are supervised by experienced professionals, and our horses are well-trained, healthy, and temperament-tested for rider compatibility.",
    p5: "Located conveniently within the Uniworld City, Aspen Greens community, our facility is equipped with quality arena space, stables, and training equipment.",
    p6: "Join our growing family of riders and experience the joy, freedom, and discipline that horse riding brings.",
    years: "GIRI FARMS",
    yearsLabel: "Our Home",
    authentic: "All Ages",
    authenticLabel: "Welcome",
    customers: "Mon � Sun",
    customersLabel: "6 AM � 8 PM",
  }

  const stats = [
    { value: d.years, label: d.yearsLabel, icon: <Award size={22} /> },
    { value: d.authentic, label: d.authenticLabel, icon: <CheckCircle size={22} /> },
    { value: d.customers, label: d.customersLabel, icon: <Users size={22} /> },
  ]

  const displayImage = imageUrl || "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80"

  return (
    <section className={`w-full py-20 bg-[#F4E9D2] ${PX}`}>
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <p className="text-center eyebrow-label mb-3">About Us</p>
          
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="inline-block heading-editorial font-medium tracking-[0.04em]"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
              {d.title}
            </h2>
            <span className="block text-base mt-2 font-medium text-[#765334]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {d.subtitle}
            </span>
          </div>
          <div className="equestrian-divider w-24 mx-auto mb-12" />

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
                <img
                  src={displayImage}
                  alt="About Royal Hoof"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { e.target.src = hero1Img }}
                />
              </div>

              {/* Stats below image */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {stats.map((s, i) => (
                  <div key={i} className="text-center py-5 rounded-sm equestrian-card"
                    style={{ transform: "none" }}>
                    <div className="flex justify-center mb-2" style={{ color: "#C5963A" }}>{s.icon}</div>
                    <p className="font-bold text-base text-[#082B49]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</p>
                    <p className="text-xs mt-1 text-[#765334]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text content */}
            <div className="w-full space-y-5">
              {[d.p1, d.p2, d.p3, d.p4, d.p5, d.p6].filter(Boolean).map((para, i) => (
                <p key={i} className="leading-relaxed text-base text-[#292725]"
                  style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.8" }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

/* --- What We Offer Section --- */
function WhatWeOfferSection() {
  const OFFERS = [
    {
      icon: <Target size={26} />,
      tag: "CORE PROGRAM",
      title: "Beginner to Advanced Horse Riding Training",
      desc: "Structured progressive riding curriculum tailored for novices through competitive equestrians with certified instructors."
    },
    {
      icon: <Sparkles size={26} />,
      tag: "KIDS & JUNIORS",
      title: "Children's Riding Programs",
      desc: "Fun, safe, and nurturing riding experiences designed to build confidence, posture, and lifelong equestrian passion."
    },
    {
      icon: <Calendar size={26} />,
      tag: "RECREATIONAL",
      title: "Weekend & Recreational Riding Sessions",
      desc: "Relaxing weekend riding slots and flexible sessions perfect for busy professionals, families, and leisure riders."
    },
    {
      icon: <Heart size={26} />,
      tag: "HANDS-ON CARE",
      title: "Horse Grooming & Care Education",
      desc: "Learn essential equine hygiene, feeding, stable management, and bonding directly with our gentle, healthy horses."
    },
    {
      icon: <Users size={26} />,
      tag: "ACADEMIC",
      title: "School & College Partnership Programs",
      desc: "Customized sports programs, educational field trips, and accredited equestrian training for schools and universities."
    },
    {
      icon: <Shield size={26} />,
      tag: "CORPORATE",
      title: "Corporate Team-Building Activities",
      desc: "Unique outdoor team bonding experiences focusing on leadership, trust, communication, and equine harmony."
    },
    {
      icon: <Trophy size={26} />,
      tag: "COMPETITIONS",
      title: "Equestrian Events and Competitions",
      desc: "Host and participate in intra-club showcases, dressage, showjumping, and regional equestrian tournaments."
    },
    {
      icon: <Star size={26} />,
      tag: "VIP CLUB",
      title: "Club Membership & Exclusive Riding Benefits",
      desc: "Priority booking, exclusive arena access, horse boarding privileges, and private club member discounts."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <section className={`w-full py-24 bg-gradient-to-b from-[#F4E9D2] via-[#FAF3E4] to-[#F4E9D2] ${PX} relative overflow-hidden`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "radial-gradient(#C5963A 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <p className="eyebrow-label mb-3">OUR SERVICES & PROGRAMS</p>
          <h2 className="heading-editorial font-medium tracking-[0.04em]"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}>
            What We Offer
          </h2>
          <div className="equestrian-divider w-28 mx-auto mt-4 mb-5" />
          <p className="text-base text-[#765334] font-medium max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore our comprehensive range of equestrian training, recreational riding, academic programs, and exclusive club privileges.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid of 8 Offers */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {OFFERS.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="group relative p-7 rounded-lg bg-[#FAF3E4] border-2 border-[#C5963A]/25 shadow-md hover:shadow-[0_12px_36px_rgba(8,43,73,0.2)] hover:border-[#082B49] transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, #FAF3E4 0%, #F4E9D2 100%)",
            }}
          >
            {/* Top blue line accent on hover */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#082B49] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shadow-md group-hover:bg-[#082B49] group-hover:text-[#C5963A] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(8,43,73,0.3)] transition-all duration-300 transform group-hover:rotate-6">
                  {item.icon}
                </div>
                <span className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[#C5963A] bg-[#C5963A]/10 px-2.5 py-1 rounded border border-[#C5963A]/20 group-hover:bg-[#082B49] group-hover:text-[#C5963A] group-hover:border-[#082B49] transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#082B49] mb-3 group-hover:text-[#082B49] transition-colors leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#5A4430] leading-relaxed group-hover:text-[#292725] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item.desc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#C5963A]/15 group-hover:border-[#082B49]/30 flex items-center justify-between text-xs font-semibold text-[#082B49] transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="text-[#765334] group-hover:text-[#082B49] font-bold transition-colors">Explore Program</span>
              <ArrowRight size={14} className="text-[#C5963A] group-hover:text-[#082B49] group-hover:translate-x-1.5 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA bar */}
      <ScrollReveal delay={0.4}>
        <div className="mt-16 text-center">
          <Link
            to="/enquiry"
            className="btn-primary-equestrian inline-flex items-center gap-3 px-9 py-4 text-sm tracking-wider uppercase"
            style={{
              boxShadow: "0 6px 20px rgba(197, 150, 58, 0.35)"
            }}
          >
            <Calendar size={18} />
            Book a Session or Enquire Today
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}

/* --- Section Title --- */
function SectionTitle({ eyebrow, title }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && <p className="eyebrow-label mb-3">{eyebrow}</p>}
      <h2 className="heading-editorial"
        style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
        {title}
      </h2>
      <div className="equestrian-divider w-24 mx-auto mt-4" />
    </div>
  )
}

/* --- Events Slider Component --- */
function EventsSlider({ events }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  const totalSlides = events.length

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides)
      }, 4000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isAutoPlaying, totalSlides])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume auto-play after 5 seconds
  }

  const goToPrevious = () => {
    setCurrentSlide(prev => prev === 0 ? totalSlides - 1 : prev - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  if (totalSlides === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#765334] text-sm">No upcoming events at the moment</p>
        <p className="text-[#765334] text-xs mt-2">Check back soon for updates!</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Slider */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="min-w-full">
              <Link to="/events" className="group block">
                <div className="relative">
                  {/* Event Image */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img 
                      src={event.image_url || 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80'} 
                      alt={event.title} 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Event Category Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="bg-[#C5963A] text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                        {event.category || 'Event'}
                      </span>
                    </div>
                    
                    {/* Event Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-bold text-2xl md:text-3xl mb-3 text-white leading-tight"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        {event.title}
                      </h3>
                      <p className="text-base leading-relaxed mb-4 text-white/90 max-w-2xl">
                        {event.description || "Join us for this exciting event"}
                      </p>
                      <div className="flex flex-wrap items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} />
                          <span className="text-sm font-medium">{new Date(event.event_date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            weekday: 'long'
                          })}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={18} />
                            <span className="text-sm font-medium">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? "w-8 h-2 bg-[#C5963A] rounded-full" 
                  : "w-2 h-2 bg-[#C5963A]/30 rounded-full hover:bg-[#C5963A]/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {totalSlides > 1 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {events.map((event, index) => (
            <button
              key={event.id}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                index === currentSlide 
                  ? "ring-2 ring-[#C5963A] scale-105" 
                  : "hover:ring-1 hover:ring-[#C5963A]/50 hover:scale-102"
              }`}
            >
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80'} 
                  alt={event.title} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                {index !== currentSlide && (
                  <div className="absolute inset-0 bg-black/40" />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-medium truncate">
                  {event.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
function SectionHeader({ label, title, link }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <p className="eyebrow-label mb-2">{label}</p>
        <h2 className="heading-editorial text-2xl sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="flex items-center gap-2 text-sm font-medium transition-colors shrink-0 hover:gap-3 duration-300"
          style={{ color: "#C5963A", fontFamily: "'Inter', sans-serif" }}>
          View All <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}

/* --- Quick Contact Section --- */
function QuickContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill all required fields')
      return
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            phone: formData.phone.trim(),
            message: formData.message.trim(),
            enquiry_type: 'general',
            status: 'new'
          }
        ])

      if (error) throw error

      toast.success('Your message has been sent! We will contact you soon.')
      setFormData({ name: '', email: '', phone: '', message: '' })
      
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast.error('Failed to send message. Please try our contact page.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className={`w-full py-20 bg-[#F4E9D2] ${PX}`}>
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <SectionTitle eyebrow="Get In Touch" title="Quick Contact" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-[#292725] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: "#292725" }}>Have Questions? We're Here to</span> <span style={{ color: "#D8C7A0", fontStyle: "italic" }}>Help!</span>
              </h3>
              <p className="text-[#765334] mb-8 leading-relaxed">
                Get in touch with our expert team. Whether you need product advice, have questions about our services, or want to learn more about our offerings, we're ready to assist you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C5963A]/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#C5963A]" />
                  </div>
                  <div>
                    <p className="text-[#292725] font-medium">Call or WhatsApp</p>
                    <p className="text-[#765334] text-sm">+91 90437 00776</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C5963A]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#C5963A]" />
                  </div>
                  <div>
                    <p className="text-[#292725] font-medium">Email Us</p>
                    <p className="text-[#765334] text-sm">info@royalhoof.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(8,43,73,0.15)]">
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#C5963A] hover:text-[#8A6640] font-medium transition-colors"
                >
                  Full Contact Page <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="equestrian-card rounded-lg p-8">
              <h4 className="text-xl font-bold text-[#292725] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Send Quick Message
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#C5963A] text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-[#F4E9D2] border border-[rgba(8,43,73,0.15)] rounded-lg px-4 py-3 text-[#292725] placeholder-[#B9AFA3]/50 focus:outline-none focus:border-[#C5963A] transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#C5963A] text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-[#F4E9D2] border border-[rgba(8,43,73,0.15)] rounded-lg px-4 py-3 text-[#292725] placeholder-[#B9AFA3]/50 focus:outline-none focus:border-[#C5963A] transition-colors"
                    placeholder="Your email address"
                  />
                </div>

                <div>
                  <label className="block text-[#C5963A] text-sm font-medium mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    maxLength={13}
                    className="w-full bg-[#F4E9D2] border border-[rgba(8,43,73,0.15)] rounded-lg px-4 py-3 text-[#292725] placeholder-[#B9AFA3]/50 focus:outline-none focus:border-[#C5963A] transition-colors"
                    placeholder="Your 10-digit phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#C5963A] text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={4}
                    className="w-full bg-[#F4E9D2] border border-[rgba(8,43,73,0.15)] rounded-lg px-4 py-3 text-[#292725] placeholder-[#B9AFA3]/50 focus:outline-none focus:border-[#C5963A] transition-colors resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C5963A] hover:bg-[#8A6640] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

/* --- Enquiry CTA Section --- */
function EnquiryCTASection() {
  return (
    <section className={`w-full py-20 section-navy ${PX}`}>
      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow-label mb-3">Begin Your Journey</p>
          <h3 className="heading-editorial text-3xl mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}>
            Ready to Get Started?
          </h3>
          <div className="equestrian-divider w-24 mx-auto mb-6" />
          <p className="text-[#D8C5A0] mb-8 max-w-2xl mx-auto">
            Submit a detailed enquiry or book a free demo session to experience our services firsthand. 
            Our experts are ready to guide you through your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/enquiry"
              className="btn-gold-equestrian inline-flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Submit Enquiry
            </Link>
            
            <Link
              to="/contact"
              className="btn-secondary-equestrian inline-flex items-center gap-2"
            >
              <Phone size={20} />
              Contact Us
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

/* --- Why Choose Us Section --- */
const DEFAULT_WHY_CHOOSE = {
  eyebrow: "PREMIUM EQUESTRIAN EXPERIENCE",
  title: "Why Choose Royal Hoof?",
  subtitle: "Experience excellence, safety, and equestrian passion at Tamil Nadu's premier riding academy.",
  features: [
    { title: "Professional and certified trainers", desc: "Expert instructors dedicated to progressive learning.", icon: "Award" },
    { title: "Well-maintained and rider-friendly horses", desc: "Healthy, gentle, and temperament-tested horses.", icon: "Heart" },
    { title: "Safe and structured learning environment", desc: "Safety-first protocols and well-equipped arena.", icon: "Shield" },
    { title: "Personalized training programs", desc: "Tailored lessons for beginner to advanced equestrians.", icon: "Target" },
    { title: "Focus on rider confidence and skill development", desc: "Building poise, balance, and lifelong horsemanship.", icon: "Sparkles" },
    { title: "Family-friendly club atmosphere", desc: "Welcoming community for riders of all ages.", icon: "Users" },
  ]
}

function getIconByName(iconName, size = 22) {
  switch (iconName) {
    case "Award": return <Award size={size} />
    case "Shield": return <Shield size={size} />
    case "CheckCircle": return <CheckCircle size={size} />
    case "Users": return <Users size={size} />
    case "Heart": return <Heart size={size} />
    case "Star": return <Star size={size} />
    case "Target": return <Target size={size} />
    case "Trophy": return <Trophy size={size} />
    case "Compass": return <Compass size={size} />
    case "Sparkles": return <Sparkles size={size} />
    case "Clock": return <Clock size={size} />
    case "MapPin": return <MapPin size={size} />
    default: return <CheckCircle size={size} />
  }
}

function WhyChooseUs({ customData }) {
  const canvasRef = useRef(null)
  const d = customData || DEFAULT_WHY_CHOOSE
  const featuresList = d.features && d.features.length ? d.features : DEFAULT_WHY_CHOOSE.features

  useEffect(() => {
    let dotLottie = null
    const loadDotLottie = async () => {
      if (canvasRef.current) {
        try {
          const { DotLottie } = await import('@lottiefiles/dotlottie-web')
          dotLottie = new DotLottie({
            canvas: canvasRef.current,
            src: '/Horse Run.lottie',
            loop: true,
            autoplay: true,
          })
        } catch (error) {
          console.error('Failed to load DotLottie:', error)
        }
      }
    }
    loadDotLottie()
    return () => { if (dotLottie) dotLottie.destroy() }
  }, [])

  return (
    <section className={`w-full py-20 ${PX}`} style={{ background: "#F4E9D2", borderTop: "1px solid rgba(197, 150, 58, 0.15)", borderBottom: "1px solid rgba(197, 150, 58, 0.15)" }}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="eyebrow-label mb-2">{d.eyebrow || "PREMIUM EQUESTRIAN EXPERIENCE"}</p>
        <h2 className="heading-editorial font-medium tracking-[0.04em]" style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}>
          {d.title || "Why Choose Royal Hoof?"}
        </h2>
        <div className="equestrian-divider w-28 mx-auto mt-4 mb-4" />
        {d.subtitle && (
          <p className="text-sm md:text-base text-[#765334] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {d.subtitle}
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Central Lottie Horse Banner */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center relative">
          <div className="relative p-6 rounded-full bg-[#FAF3E4] border border-[#C5963A]/30 shadow-xl flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              width={260}
              height={260}
              style={{ 
                width: '260px', 
                height: '260px',
                maxWidth: '80vw',
                maxHeight: '80vw',
                filter: 'brightness(0) saturate(100%) invert(15%) sepia(30%) saturate(2000%) hue-rotate(170deg) brightness(0.35)'
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5963A]" style={{ fontFamily: "'Inter', sans-serif" }}>
              ROYAL HOOF ACADEMY
            </span>
          </div>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {featuresList.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, borderColor: "#C5963A" }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-md bg-[#FAF3E4] border border-[#C5963A]/30 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shrink-0 shadow">
                {getIconByName(item.icon, 20)}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#082B49] flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <span className="text-[#C5963A]">✔</span> {item.title}
                </h3>
                {item.desc && (
                  <p className="text-xs text-[#5A4430] leading-relaxed mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {item.desc}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --- Gallery Item Component --- */
function GalleryItemCard({ item }) {
  return (
    <Link to="/gallery" className="group block">
      <div className="relative overflow-hidden rounded-sm aspect-square">
        <img 
          src={item.media_url || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80'} 
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {item.media_type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium truncate">{item.title}</p>
          {item.category && (
            <p className="text-white/70 text-xs">{item.category}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

/* --- Package Item Component --- */  
function PackageCard({ pkg }) {
  return (
    <Link to="/packages" className="group block">
      <div className="rounded-lg p-5 h-full group-hover:scale-105 group-hover:shadow-[0_4px_20px_rgba(197,150,58,0.25)] transition-all duration-300"
        style={{
          background: "#FAF3E4",
          border: "1px solid #C5963A",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
        <h3 className="text-lg font-bold text-[#292725] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          {pkg.name}
        </h3>
        <div className="mb-4">
          <span className="text-2xl font-bold text-[#C5963A]">
            ₹{pkg.price?.toLocaleString('en-IN') || '0'}
          </span>
          <span className="text-[#765334] text-sm">/{pkg.duration}</span>
        </div>
        {pkg.age_group && (
          <p className="text-[#C5963A] text-sm mb-3 font-medium">{pkg.age_group}</p>
        )}
        {pkg.description && (
          <p className="text-[#765334] text-sm mb-4 leading-relaxed line-clamp-2">
            {pkg.description}
          </p>
        )}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-[#082B49] text-sm font-medium">
            View Details <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function getCategoryIcon(iconName) {
  switch (iconName) {
    case 'Heart': return <Heart size={20} />
    case 'Target': return <Target size={20} />
    case 'Users': return <Users size={20} />
    case 'Sparkles': return <Sparkles size={20} />
    case 'Activity':
    default: return <Activity size={20} />
  }
}

/* --- Benefits Poster Section (Riding for a Better Tomorrow) --- */
function BenefitsPosterSection() {
  const [activeTab, setActiveTab] = useState('physical')
  const [benefitsData, setBenefitsData] = useState(DEFAULT_BENEFITS)

  useEffect(() => {
    getSetting("benefits_content")
      .then(val => {
        if (val) {
          try {
            const parsed = JSON.parse(val)
            if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
              setBenefitsData(parsed)
            }
          } catch (e) {}
        }
      })
      .catch(() => {})
  }, [])

  const categories = benefitsData.categories || DEFAULT_BENEFITS.categories
  const currentCategory = categories.find(c => c.id === activeTab) || categories[0]

  const historicalQuotes = [
    {
      quote: "There is something about the outside of a horse that is good for the inside of a man.",
      author: "WINSTON CHURCHILL"
    },
    {
      quote: "The horse is the projection of peoples' dreams about themselves – strong, powerful, beautiful.",
      author: "PAM BROWN"
    },
    {
      quote: "A good horse is worth more than riches, for it carries your soul forward.",
      author: "EQUESTRIAN WISDOM"
    },
    {
      quote: "No hour of life is wasted that is spent in the saddle.",
      author: "LORD RONALD GOWER"
    }
  ]

  return (
    <section className={`w-full py-12 sm:py-16 bg-gradient-to-b from-[#F4E9D2] via-[#FAF3E4] to-[#F4E9D2] relative overflow-hidden ${PX}`}>
      {/* Decorative background embellishment */}
      <div className="absolute inset-0 pointer-events-none opacity-15" style={{
        backgroundImage: "radial-gradient(#C5963A 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#082B49] text-[#C5963A] text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#C5963A]/40 mb-3 shadow-sm"
          >
            <span>✦</span>
            <span>{benefitsData.badge || "RIDING FOR A BETTER TOMORROW"}</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#082B49] mb-3" 
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            {benefitsData.title || "Benefits of Horse Riding"}
          </motion.h2>

          <div className="equestrian-divider w-24 mx-auto mb-4" />

          <p className="text-sm sm:text-base text-[#5A4430] leading-relaxed font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {benefitsData.introText || "At Royal Hoof Horse Riding Academy & Club, every ride promotes physical, mental, and emotional well-being—building stronger communities, supporting animal welfare, and riding towards a compassionate future."}
          </p>
        </div>

        {/* Interactive Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat, idx) => {
            const catId = cat.id || `cat_${idx}`
            const isActive = activeTab === catId || (idx === 0 && !categories.some(c => c.id === activeTab))
            return (
              <button
                key={catId}
                onClick={() => setActiveTab(catId)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm ${
                  isActive
                    ? 'bg-[#082B49] text-[#C5963A] border-2 border-[#C5963A] shadow-md scale-105'
                    : 'bg-[#FAF3E4] text-[#5A4430] border border-[#C5963A]/30 hover:bg-[#F4E9D2] hover:border-[#C5963A]/60'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className={isActive ? 'text-[#C5963A]' : 'text-[#765334]'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#FAF3E4] rounded-xl border-2 border-[#C5963A]/30 p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden"
            >
              {/* Relevant Horse Background Image (Highly Visible) */}
              {currentCategory.bgImage && (
                <>
                  <div 
                    className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
                    style={{
                      backgroundImage: `url(${currentCategory.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.75,
                      mixBlendMode: 'multiply'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3E4]/20 via-[#FAF3E4]/40 to-[#FAF3E4]/60 pointer-events-none z-0" />
                </>
              )}

              {/* Category Header Bar */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#C5963A]/25">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#082B49] text-[#C5963A] flex items-center justify-center shadow-lg shrink-0 border border-[#C5963A]/40">
                    {getCategoryIcon(currentCategory.iconName || currentCategory.icon)}
                  </div>
                  <div>
                    <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#C5963A] bg-[#C5963A]/10 px-2.5 py-0.5 rounded border border-[#C5963A]/20">
                      {currentCategory.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#082B49] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {currentCategory.label}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4430] max-w-md italic leading-relaxed sm:text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "{currentCategory.summary}"
                </p>
              </div>

              {/* Category Bullet Items Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategory.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group rounded-xl bg-[#FAF3E4] border border-[#C5963A]/35 hover:border-[#C5963A] transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image Banner & Topic Tag */}
                      <div className="relative w-full h-36 overflow-hidden bg-[#082B49]">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#082B49] via-black/20 to-transparent opacity-80" />
                        
                        {/* Number & Topic Badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="w-7 h-7 rounded-full bg-[#C5963A] text-[#082B49] font-bold text-xs flex items-center justify-center shadow">
                            {item.num}
                          </span>
                          <span className="text-[0.625rem] font-bold tracking-[0.15em] uppercase bg-[#082B49]/90 text-[#C5963A] px-2.5 py-1 rounded border border-[#C5963A]/40 backdrop-blur-sm">
                            {item.topicTag}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-[#082B49] leading-snug mb-2 group-hover:text-[#C5963A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#5A4430] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-5 pb-5 pt-2 border-t border-[#C5963A]/15 flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#C5963A]">
                      <CheckCircle size={14} /> Verified Equestrian Benefit
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Signature Callout Ribbon Banner */}
        <div className="my-16 py-6 px-6 md:px-12 poster-ribbon rounded-md text-center">
          <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
            <span className="hidden sm:inline-block text-[#C5963A]">✦ ────────</span>
            <h3 className="text-base sm:text-xl md:text-2xl font-semibold tracking-wider text-[#F5EBD8] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              HORSE RIDING ISN'T JUST A SPORT, IT'S A WAY OF LIFE.
            </h3>
            <span className="hidden sm:inline-block text-[#C5963A]">──────── ✦</span>
          </div>
        </div>

        {/* "LEGENDS HAVE SPOKEN" Quotes Strip */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#082B49] text-[#C5963A] text-xs font-bold uppercase tracking-[0.25em] px-6 py-2 rounded-full border border-[#C5963A]">
              LEGENDS HAVE SPOKEN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {historicalQuotes.map((item, i) => (
              <div key={i} className="poster-parchment-card p-6 rounded-lg flex flex-col justify-between h-full border-t-2 border-t-[#C5963A] shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="text-3xl text-[#C5963A] font-serif leading-none block mb-2">“</span>
                  <p className="text-xs md:text-sm italic text-[#292725] leading-relaxed mb-4">
                    {item.quote}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#C5963A]/20">
                  <p className="text-xs font-bold text-[#082B49] tracking-wider uppercase">
                    — {item.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* --- Main Page --- */
export default function HomePage() {
  const { t } = useLanguage()
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dynamicCategories, setDynamicCategories] = useState(CATEGORIES)
  const [categoryImageMap, setCategoryImageMap] = useState({})
  const [features, setFeatures] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [whyChooseData, setWhyChooseData] = useState(null)
  
  // Gallery and Packages state
  const [galleryItems, setGalleryItems] = useState([])
  const [packages, setPackages] = useState([])
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [loadingPackages, setLoadingPackages] = useState(true)

  useEffect(() => {
    // Load products
    fetchProducts({ sort: "newest" }).then(data => {
      setNewArrivals(data.slice(0, 6))
      setBestSellers(data.filter(p => p.tags?.includes("premium") || p.tags?.includes("certified")).slice(0, 6))
      setLoading(false)
      
      const cats = [...new Set(data.map(p => p.category).filter(Boolean))]
      if (cats.length > 0) setDynamicCategories(cats.sort())
      
      const isVid = u => u && /\.(mp4|mov|webm|ogg)(\?|$)/i.test(u)
      const imgMap = {}
      data.forEach(p => {
        if (!p.category || imgMap[p.category]) return
        const list = Array.isArray(p.images) ? p.images : [p.image || p.images].filter(Boolean)
        const thumb = list.find(m => m && !isVid(m))
        if (thumb) imgMap[p.category] = thumb
      })
      data.forEach(p => {
        if (!p.category || imgMap[p.category]) return
        const list = Array.isArray(p.images) ? p.images : [p.image || p.images].filter(Boolean)
        if (list[0]) imgMap[p.category] = list[0]
      })
      setCategoryImageMap(imgMap)
    })
    
    getSetting("features_bar").then(val => {
      if (val) { try { const p = JSON.parse(val); if (Array.isArray(p) && p.length) setFeatures(p) } catch {} }
    }).catch(() => {})

    getSetting("why_choose_us_en").then(val => {
      if (val) { try { setWhyChooseData(JSON.parse(val)) } catch {} }
    }).catch(() => {})

    // Load events from database
    loadEvents()
    // Load gallery items
    loadGalleryItems()
    // Load packages
    loadPackages()
  }, [])

  const loadEvents = async () => {
    setLoadingEvents(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'upcoming')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(2)

      if (error) {
        console.error('Error loading events:', error)
      } else {
        setUpcomingEvents(data || [])
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoadingEvents(false)
    }
  }

  const loadGalleryItems = async () => {
    setLoadingGallery(true)
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6)

      if (error) {
        console.error('Error loading gallery:', error)
      } else {
        setGalleryItems(data || [])
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoadingGallery(false)
    }
  }

  const loadPackages = async () => {
    setLoadingPackages(true)
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6)

      if (error) {
        console.error('Error loading packages:', error)
      } else {
        setPackages(data || [])
      }
    } catch (error) {
      console.error('Error loading packages:', error)
    } finally {
      setLoadingPackages(false)
    }
  }

  const FEATURES = [
    { icon: <Shield size={24} strokeWidth={1.5} />, title: "SAFE & SECURE", sub: "Safety-first environment" },
    { icon: <CheckCircle size={24} strokeWidth={1.5} />, title: "CERTIFIED TRAINERS", sub: "Professional instructors" },
    { icon: <Star size={24} strokeWidth={1.5} />, title: "ALL AGES WELCOME", sub: "Kids & adults" },
    { icon: <Users size={24} strokeWidth={1.5} />, title: "SMALL BATCH CLASSES", sub: "Personalised attention" },
  ]

  const displayFeatures = features
    ? features.map((f, i) => ({ 
        ...FEATURES[i % FEATURES.length], 
        title: f.title?.toUpperCase() || FEATURES[i % FEATURES.length].title, 
        sub: f.desc || FEATURES[i % FEATURES.length].sub 
      }))
    : FEATURES

  return (
    <>
      <Helmet>
        <title>Equestrian Collection - Premium Riding Equipment</title>
        <meta name="description" content="Discover our curated collection of premium riding equipment and apparel." />
      </Helmet>

      {/* HERO */}
      <HeroSlider />

      {/* ABOUT - Darker */}
      <AboutSection />

      {/* WHAT WE OFFER */}
      <WhatWeOfferSection />

      {/* EVENTS - Lighter */}
      <section id="events" className={`w-full py-20 section-navy ${PX}`}>
        <ScrollReveal>
          <SectionHeader label="Upcoming" title="Events" link="/events" />
        </ScrollReveal>
        {loadingEvents ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-[#C5963A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <EventsSlider events={upcomingEvents} />
        )}
      </section>

      {/* WHY CHOOSE - Darker */}
      <ScrollReveal>
        <WhyChooseUs customData={whyChooseData} />
      </ScrollReveal>

      {/* BENEFITS OF HORSE RIDING - Inspired by Reference Poster */}
      <ScrollReveal>
        <BenefitsPosterSection />
      </ScrollReveal>

      {/* OUR PACKAGES - Lighter */}
      <section className={`w-full py-12 ${PX}`} style={{ background: "#FAF3E4" }}>
        <ScrollReveal>
          <SectionHeader label="Premium Offers" title="Our Packages" link="/packages" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loadingPackages ? Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#FAF3E4] rounded-lg h-48 border border-[#C5963A]/40"></div>
            </div>
          )) : packages.length > 0 ? packages.map((pkg, i) => (
            <ScrollReveal key={pkg.id} delay={i * 0.1}>
              <PackageCard pkg={pkg} />
            </ScrollReveal>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#765334] text-lg">No packages available</p>
              <p className="text-[#765334] text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY - Darker */}
      <section className={`w-full py-20 bg-[#F4E9D2] ${PX}`}>
        <ScrollReveal>
          <SectionHeader label="Visual Showcase" title="Gallery" link="/gallery" />
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loadingGallery ? Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#FAF3E4] rounded-sm aspect-square"></div>
            </div>
          )) : galleryItems.length > 0 ? galleryItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.05}>
              <GalleryItemCard item={item} />
            </ScrollReveal>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#765334] text-lg">No gallery items available</p>
              <p className="text-[#765334] text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS - Lighter */}
      <section className="w-full" style={{ background: "#FAF3E4" }}>
        <ScrollReveal><ReviewsSection /></ScrollReveal>
      </section>

      {/* QUICK CONTACT - Darker */}
      <QuickContactSection />

      {/* ENQUIRY CTA - Lighter */}
      <EnquiryCTASection />
    </>
  )
}
