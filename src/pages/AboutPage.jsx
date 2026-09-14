import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { Eye, Compass, Award, Shield, Heart, Users, MapPin, Sparkles, CheckCircle2, Trophy, Star, Mail } from "lucide-react"
import { getSetting } from "../services/settingsService"

const TEAM_MEMBERS = [
  {
    name: "Capt. Vikramaditya Singh",
    role: "Founder & Chief Equestrian Instructor",
    experience: "18+ Yrs Exp.",
    specialty: "Dressage & Show Jumping",
    bio: "Former National Medalist and Master Trainer with over 18 years of military & civil equestrian experience. Passionate about building elite riding technique with strict safety standards.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Elena Rostova",
    role: "Senior Equine Coach & Youth Specialist",
    experience: "12+ Yrs Exp.",
    specialty: "Junior Rider Development",
    bio: "Specializes in youth riding foundation, rider balance, and confidence building. Has trained over 400+ junior riders from beginners to regional competition level.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dr. Rajesh K. Varma",
    role: "Chief Veterinary & Care Director",
    experience: "15+ Yrs Exp.",
    specialty: "Equine Health & Welfare",
    bio: "Oversees horse nutrition, health care, temperament testing, and stable hygiene. Ensures all Royal Hoof horses remain in peak athletic condition and gentle spirit.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ananya Sundaram",
    role: "Head of Operations & Academy Experience",
    experience: "8+ Yrs Exp.",
    specialty: "Member Experience & Events",
    bio: "Manages student onboarding, custom scheduling, safety orientation, and club event organization for an extraordinary academy journey at Giri Farms.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80"
  }
]

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
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS)
  const location = useLocation()

  useEffect(() => {
    Promise.all([
      getSetting("about_section_en").catch(() => null),
      getSetting("about_image_url").catch(() => null),
      getSetting("about_team").catch(() => null),
    ]).then(([content, img, team]) => {
      if (content) {
        try {
          const parsed = typeof content === 'string' ? JSON.parse(content) : content
          if (parsed && typeof parsed === 'object') {
            setData(prev => ({ ...prev, ...parsed }))
          }
        } catch (e) {
          console.warn("Error parsing about_section_en:", e)
        }
      }
      if (img && typeof img === 'string') setImageUrl(img)
      if (team) {
        try {
          const parsedTeam = typeof team === 'string' ? JSON.parse(team) : team
          if (Array.isArray(parsedTeam) && parsedTeam.length > 0) {
            setTeamMembers(parsedTeam)
          }
        } catch (e) {
          console.warn("Error parsing about_team:", e)
        }
      }
    })
  }, [])

  // Handle auto-scroll to hash section (#about, #vision, #mission, #our-team) or path section
  useEffect(() => {
    let hash = location.hash.replace("#", "")
    if (!hash) {
      if (location.pathname.includes("vision")) hash = "vision"
      else if (location.pathname.includes("mission")) hash = "mission"
      else if (location.pathname.includes("team")) hash = "our-team"
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
        <meta name="description" content="Discover Royal Hoof Horse Riding Academy, our mission, vision, and expert team in Nallambakkam, Tamil Nadu." />
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
            <a href="#our-team" className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5963A]/20 hover:bg-[#C5963A] text-[#F5EBD8] hover:text-[#082B49] border border-[#C5963A]/40 transition-all duration-300 transform hover:-translate-y-0.5">
              Our Team
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

      {/* SECTION 4: OUR TEAM */}
      <section id="our-team" className="py-20 md:py-28 bg-[#082B49] text-[#F5EBD8] border-t border-[#C5963A]/30 relative scroll-mt-24 overflow-hidden">
        {/* Decorative background grid and ambient lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{
          backgroundImage: "radial-gradient(#C5963A 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C5963A]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#C5963A]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative">
          {/* Section Title Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-[#C5963A]/20 border border-[#C5963A] flex items-center justify-center mx-auto mb-5 text-[#D2AA55] shadow-lg cursor-pointer"
            >
              <Users size={30} />
            </motion.div>

            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D2AA55]" style={{ fontFamily: "'Inter', sans-serif" }}>
              EXPERT INSTRUCTORS & LEADERSHIP
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-[#F5EBD8]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
              Meet Our Team
            </h2>
            <div className="w-24 h-0.5 bg-[#C5963A] mx-auto mt-4 mb-6" />
            
            <p className="text-sm md:text-base text-[#D8C5A0] leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our passionate team of certified equestrian coaches, veterinary specialists, and stable managers are dedicated to nurturing safety, confidence, and riding excellence for every student.
            </p>
          </motion.div>

          {/* Team Cards Grid with Stagger & Hover Animations */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative rounded-xl bg-gradient-to-b from-[#0B304D] to-[#06243F] border border-[#C5963A]/30 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#C5963A] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Image Container with Smooth Zoom Animation */}
                <div className="relative h-72 w-full overflow-hidden bg-[#082B49]">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80"
                    }}
                  />
                  {/* Dark Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B304D] via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#082B49]/85 backdrop-blur border border-[#C5963A]/50 text-[10px] font-bold uppercase tracking-wider text-[#D2AA55] shadow-md">
                    {member.experience}
                  </div>

                  {/* Specialty Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-[#FAF3E4] font-medium bg-[#082B49]/90 backdrop-blur px-3 py-1.5 rounded border border-[#C5963A]/30">
                    <Award size={14} className="text-[#C5963A] shrink-0" />
                    <span className="truncate">{member.specialty}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#F5EBD8] group-hover:text-[#C5963A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#D2AA55] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {member.role}
                    </p>
                    <p className="text-xs text-[#D8C5A0] leading-relaxed mt-3 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {member.bio}
                    </p>
                  </div>

                  {/* Bottom Gold Line & Contact Action */}
                  <div className="pt-4 border-t border-[#C5963A]/20 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5963A]/80">
                      Royal Hoof Staff
                    </span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`mailto:info@royalhoof.com?subject=Enquiry%20for%20${encodeURIComponent(member.name)}`}
                        className="w-8 h-8 rounded-full bg-[#C5963A]/10 hover:bg-[#C5963A] text-[#D2AA55] hover:text-[#082B49] border border-[#C5963A]/40 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        title={`Contact ${member.name}`}
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA Banner */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#C5963A]/20 via-[#0B304D] to-[#C5963A]/20 border border-[#C5963A]/40 text-center flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-left max-w-2xl">
              <h4 className="text-2xl font-bold text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Ready to Train with South India's Top Instructors?
              </h4>
              <p className="text-xs sm:text-sm text-[#D8C5A0] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Book a free trial demo session or speak directly with our senior coaches at Giri Farms, Nallambakkam.
              </p>
            </div>

            <a 
              href="/enquiry"
              className="px-7 py-3 rounded-full bg-[#C5963A] text-[#082B49] hover:bg-[#D2AA55] font-bold text-xs uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex-shrink-0"
            >
              Book Demo Session
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
