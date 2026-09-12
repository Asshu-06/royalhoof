import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { Eye, Compass, Award, Shield, Heart, Users, MapPin, Sparkles, CheckCircle2, Trophy, Star } from "lucide-react"
import { getSetting } from "../services/settingsService"

const DEFAULT_ABOUT = {
  title: "Royal Hoof Horse Riding Academy",
  subtitle: "Nallambakkam, Tamil Nadu",
  p1: "Welcome to Royal Hoof Horse Riding Academy, located at GIRI FARMS in Nallambakkam, Tamil Nadu. We offer professional horse riding lessons for all ages in a safe, nurturing environment.",
  p2: "Our certified trainers are passionate about equestrian sports and dedicated to building a strong foundation for every rider - from complete beginners to experienced equestrians.",
  p3: "We offer a wide range of programmes including beginner lessons, advanced training, competitive riding, and special kids' sessions designed to build confidence and develop lifelong skills.",
  p4: "Safety is our top priority. All sessions are supervised by experienced professionals, and our horses are well-trained, healthy, and temperament-tested for rider compatibility.",
  p5: "Located conveniently within the Uniworld City, Aspen Greens community, our facility is equipped with quality arena space, stables, and training equipment.",
  p6: "Join our growing family of riders and experience the joy, freedom, and discipline that horse riding brings.",
  years: "GIRI FARMS",
  yearsLabel: "Our Home",
  authentic: "All Ages",
  authenticLabel: "Welcome",
  customers: "Mon - Sun",
  customersLabel: "6 AM - 8 PM",
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
}

export default function AboutPage() {
  const [data, setData] = useState(DEFAULT_ABOUT)
  const [imageUrl, setImageUrl] = useState("")
  const location = useLocation()

  useEffect(() => {
    Promise.all([
      getSetting("about_section_en").catch(() => null),
      getSetting("about_image_url").catch(() => null),
    ]).then(([content, img]) => {
      if (content) {
        try {
          setData(prev => ({ ...prev, ...JSON.parse(content) }))
        } catch (e) {
          // Keep default
        }
      }
      if (img) setImageUrl(img)
    })
  }, [])

  // Handle auto-scroll to hash section (#about, #vision, #mission) or path section
  useEffect(() => {
    let hash = location.hash.replace("#", "")
    if (!hash) {
      if (location.pathname.includes("vision")) hash = "vision"
      else if (location.pathname.includes("mission")) hash = "mission"
      else if (location.pathname.includes("about")) hash = "about"
    }

    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 150)
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [location])

  return (
    <div className="min-h-screen bg-royal-cream text-[#292725] overflow-x-hidden">
      <Helmet>
        <title>About Us | Royal Hoof Horse Riding Academy</title>
        <meta name="description" content="Discover Royal Hoof Horse Riding Academy, our mission, and our vision in Nallambakkam, Tamil Nadu." />
      </Helmet>

      {/* HERO BANNER */}
      <section className="relative bg-[#082B49] text-[#F5EBD8] py-24 px-6 lg:px-12 border-b border-[#C5963A]/40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{
          backgroundImage: "radial-gradient(#C5963A 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C5963A]/10 blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D2AA55] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              ESTABLISHED 2026 • GIRI FARMS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-[0.04em] mb-4 text-[#F5EBD8]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
              ABOUT ROYAL HOOF
            </h1>
            <div className="w-24 h-0.5 bg-[#C5963A] mx-auto mb-6" />
            <p className="text-base md:text-lg text-[#D8C5A0] max-w-2xl mx-auto font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Nurturing equestrian excellence, passion, and safety in Nallambakkam, Tamil Nadu.
            </p>
          </motion.div>

          {/* Quick jump tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-10"
          >
            <a href="#about" className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5963A]/20 hover:bg-[#C5963A] text-[#F5EBD8] hover:text-[#082B49] border border-[#C5963A]/40 transition-all duration-300 transform hover:-translate-y-0.5">
              About Us
            </a>
            <a href="#vision" className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5963A]/20 hover:bg-[#C5963A] text-[#F5EBD8] hover:text-[#082B49] border border-[#C5963A]/40 transition-all duration-300 transform hover:-translate-y-0.5">
              Our Vision
            </a>
            <a href="#mission" className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5963A]/20 hover:bg-[#C5963A] text-[#F5EBD8] hover:text-[#082B49] border border-[#C5963A]/40 transition-all duration-300 transform hover:-translate-y-0.5">
              Our Mission
            </a>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: ABOUT US */}
      <section id="about" className="py-16 md:py-24 px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto scroll-mt-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5963A]" style={{ fontFamily: "'Inter', sans-serif" }}>
            WELCOME TO OUR ACADEMY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-[#082B49]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {data.title || "Royal Hoof Horse Riding Academy"}
          </h2>
          <p className="text-sm text-[#765334] mt-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.subtitle || "Nallambakkam, Tamil Nadu"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={scaleIn}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-lg overflow-hidden border border-[#C5963A]/30 shadow-xl bg-[#082B49]">
              <img
                src={imageUrl || "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80"}
                alt="Royal Hoof Horse Riding Academy"
                className="w-full h-[380px] md:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082B49]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[#082B49]/90 backdrop-blur border border-[#C5963A]/40 text-[#F5EBD8]">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#C5963A] shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-[#D2AA55] uppercase tracking-wider">Located at GIRI FARMS</p>
                    <p className="text-xs text-[#D8C5A0]">Uniworld City, Aspen Greens, Nallambakkam</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="lg:col-span-6 space-y-5 text-base text-[#5A4430] leading-relaxed" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <motion.p variants={fadeInUp}>{data.p1}</motion.p>
            <motion.p variants={fadeInUp}>{data.p2}</motion.p>
            <motion.p variants={fadeInUp}>{data.p3}</motion.p>
            {data.p4 && <motion.p variants={fadeInUp}>{data.p4}</motion.p>}
            {data.p5 && <motion.p variants={fadeInUp}>{data.p5}</motion.p>}
            {data.p6 && <motion.p variants={fadeInUp}>{data.p6}</motion.p>}

            {/* Highlights Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#C5963A]/20">
              <div className="p-4 rounded-md bg-[#FAF3E4] border border-[#C5963A]/30 text-center transition-all hover:shadow-md hover:border-[#C5963A]">
                <p className="text-lg md:text-xl font-bold text-[#C5963A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.years || "GIRI FARMS"}
                </p>
                <p className="text-xs text-[#765334] font-medium mt-1">{data.yearsLabel || "Our Home"}</p>
              </div>
              <div className="p-4 rounded-md bg-[#FAF3E4] border border-[#C5963A]/30 text-center transition-all hover:shadow-md hover:border-[#C5963A]">
                <p className="text-lg md:text-xl font-bold text-[#C5963A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.authentic || "All Ages"}
                </p>
                <p className="text-xs text-[#765334] font-medium mt-1">{data.authenticLabel || "Welcome"}</p>
              </div>
              <div className="p-4 rounded-md bg-[#FAF3E4] border border-[#C5963A]/30 text-center transition-all hover:shadow-md hover:border-[#C5963A]">
                <p className="text-lg md:text-xl font-bold text-[#C5963A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.customers || "Mon - Sun"}
                </p>
                <p className="text-xs text-[#765334] font-medium mt-1">{data.customersLabel || "6 AM - 8 PM"}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OUR VISION */}
      <section id="vision" className="py-20 md:py-28 bg-[#082B49] text-[#F5EBD8] border-y border-[#C5963A]/30 relative scroll-mt-24 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5963A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 rounded-full bg-[#C5963A]/20 border border-[#C5963A] flex items-center justify-center mx-auto mb-5 text-[#D2AA55] shadow-lg cursor-pointer"
            >
              <Eye size={30} />
            </motion.div>
            
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D2AA55]" style={{ fontFamily: "'Inter', sans-serif" }}>
              LOOKING TO THE FUTURE
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-[#F5EBD8]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
              Our Vision
            </h2>
            <div className="w-24 h-0.5 bg-[#C5963A] mx-auto mt-4 mb-8" />
            
            {/* Vision Banner Card with luxury borders */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 rounded-xl bg-gradient-to-b from-[#0B304D] to-[#06243F] border border-[#C5963A]/40 shadow-2xl relative"
            >
              <span className="absolute top-4 left-6 text-5xl text-[#C5963A]/20 font-serif leading-none">“</span>
              <p className="text-xl md:text-2xl font-serif text-[#F5EBD8] leading-relaxed italic relative z-10 px-4">
                To become South India's most trusted and respected horse riding academy and equestrian club, inspiring individuals to embrace the values of discipline, courage, and sportsmanship through the world of horses.
              </p>
              <span className="absolute bottom-2 right-6 text-5xl text-[#C5963A]/20 font-serif leading-none">”</span>
            </motion.div>
          </motion.div>

          {/* Vision Pillars Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, borderColor: "#C5963A" }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-lg bg-[#0B304D] border border-[#C5963A]/30 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5963A]/20 text-[#D2AA55] flex items-center justify-center mb-6">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Trusted Excellence
              </h3>
              <p className="text-sm text-[#D8C5A0] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Setting South India's standard in professional equestrian instruction, safety protocols, and certified rider progression.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, borderColor: "#C5963A" }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-lg bg-[#0B304D] border border-[#C5963A]/30 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5963A]/20 text-[#D2AA55] flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Discipline & Courage
              </h3>
              <p className="text-sm text-[#D8C5A0] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Instilling core character values of bravery, composure, emotional maturity, and sportsmanship in every rider.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, borderColor: "#C5963A" }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-lg bg-[#0B304D] border border-[#C5963A]/30 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5963A]/20 text-[#D2AA55] flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Equestrian Community
              </h3>
              <p className="text-sm text-[#D8C5A0] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Creating an inclusive haven for riders, families, and horse enthusiasts to share their passion and grow together.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: OUR MISSION */}
      <section id="mission" className="py-20 md:py-28 px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto scroll-mt-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-[#C5963A]/20 border border-[#C5963A] flex items-center justify-center mx-auto mb-5 text-[#C5963A] shadow-md cursor-pointer"
          >
            <Compass size={30} />
          </motion.div>

          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5963A]" style={{ fontFamily: "'Inter', sans-serif" }}>
            OUR PURPOSE & DRIVING FORCE
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-[#082B49]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
            Our Mission
          </h2>
          <div className="w-24 h-0.5 bg-[#C5963A] mx-auto mt-4 mb-8" />

          {/* Mission Main Text Box */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="p-8 md:p-10 rounded-xl bg-[#FAF3E4] border border-[#C5963A]/40 shadow-xl text-center relative"
          >
            <p className="text-lg md:text-2xl font-serif text-[#082B49] leading-relaxed font-medium">
              "To develop confident riders, responsible horse lovers, and future equestrians through quality training, safety, and excellence in horsemanship."
            </p>
          </motion.div>
        </motion.div>

        {/* 4 Mission Cards with animations */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#C5963A" }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-xl bg-[#FAF3E4] border border-[#C5963A]/30 shadow-md flex gap-5 items-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shrink-0 shadow">
              <Award size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#082B49] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Quality Training & Pedigree
              </h3>
              <p className="text-sm text-[#5A4430] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Delivering structured, professional training modules designed to take beginners from basic balance to advanced riding techniques.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#C5963A" }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-xl bg-[#FAF3E4] border border-[#C5963A]/30 shadow-md flex gap-5 items-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shrink-0 shadow">
              <Shield size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#082B49] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Safety & Peace of Mind
              </h3>
              <p className="text-sm text-[#5A4430] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enforcing strict safety guidelines, certified helmet standards, supervised arena sessions, and calm, temperament-tested horses.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#C5963A" }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-xl bg-[#FAF3E4] border border-[#C5963A]/30 shadow-md flex gap-5 items-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shrink-0 shadow">
              <Heart size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#082B49] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Responsible Horse Care
              </h3>
              <p className="text-sm text-[#5A4430] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Teaching riders empathy, grooming, horse feeding, and holistic equine care to foster a genuine, compassionate connection.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#C5963A" }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-xl bg-[#FAF3E4] border border-[#C5963A]/30 shadow-md flex gap-5 items-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#082B49] text-[#C5963A] flex items-center justify-center shrink-0 shadow">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#082B49] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Excellence in Horsemanship
              </h3>
              <p className="text-sm text-[#5A4430] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Building future equestrians with strong leadership skills, poise, confidence, and sportsmanship both on and off the horse.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
