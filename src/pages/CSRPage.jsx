import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { Heart, GraduationCap, Accessibility, Trees, Users2, Sparkles, ArrowRight, Shield } from "lucide-react"
import { getSetting } from "../services/settingsService"

// Unsplash high quality equestrian & community images
const CSR_IMAGES = {
  animalWelfare: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
  education: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
  inclusive: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80",
  sustainability: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  community: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
}

const DEFAULT_CSR = {
  heroTitle: "Making a Difference Beyond Horse Riding",
  overview1: "At Royal Hoof Horse Riding Academy & Club, we believe that true success is measured not only by what we achieve but also by the positive impact we create in our community. Our Corporate Social Responsibility (CSR) initiatives are focused on empowering individuals, promoting animal welfare, supporting education, and fostering a culture of compassion and inclusion.",
  overview2: "We are committed to using the transformative power of horses to enrich lives, build confidence, and create opportunities for people from all backgrounds.",
  commitmentText: "We believe that horses have the power to inspire confidence, discipline, empathy, and personal growth. Through our CSR initiatives, we strive to create a meaningful impact on society while promoting the values of responsibility, respect, and inclusiveness.",
  focusAreas: [
    {
      id: "welfare",
      title: "Animal Welfare & Horse Care",
      subtitle: "Ensuring dignity, health, and holistic well-being for our horses.",
      img: CSR_IMAGES.animalWelfare,
      bullets: [
        "Ensuring the highest standards of horse health and well-being.",
        "Regular veterinary care, dental checkups, and nutrition programs.",
        "Promoting responsible horse ownership and welfare awareness.",
        "Supporting rescue and rehabilitation initiatives where possible."
      ]
    },
    {
      id: "education",
      title: "Education & Youth Development",
      subtitle: "Empowering the next generation through equestrian learning.",
      img: CSR_IMAGES.education,
      bullets: [
        "Free horse riding awareness programs for local schools.",
        "Scholarships and discounted training for deserving students.",
        "Leadership and confidence-building programs through horsemanship.",
        "Educational visits and equestrian exposure programs."
      ]
    },
    {
      id: "inclusive",
      title: "Inclusive Riding Programs",
      subtitle: "Unlocking courage and freedom for differently-abled individuals.",
      img: CSR_IMAGES.inclusive,
      bullets: [
        "Encouraging participation from differently-abled individuals.",
        "Organizing special riding sessions to promote confidence and well-being.",
        "Supporting therapeutic and recreational riding initiatives.",
        "Tailored adaptive gear and specialized trainer assistance."
      ]
    },
    {
      id: "sustainability",
      title: "Environmental Sustainability",
      subtitle: "Protecting ecosystems and fostering eco-friendly equine management.",
      img: CSR_IMAGES.sustainability,
      bullets: [
        "Tree plantation drives within and around our Giri Farms facility.",
        "Responsible water management and rainwater harvesting practices.",
        "Eco-friendly stable maintenance and natural waste recycling.",
        "Creating active awareness about environmental conservation."
      ]
    },
    {
      id: "community",
      title: "Community Engagement",
      subtitle: "Building strong bonds with local youth, schools, and social causes.",
      img: CSR_IMAGES.community,
      bullets: [
        "Hosting community outreach events and awareness campaigns.",
        "Supporting local schools, youth groups, and social organizations.",
        "Organizing charity rides and fundraising events for social causes.",
        "Providing opportunities for volunteering and equestrian skill development."
      ]
    },
  ]
}

const EMOJIS = ["🌱", "🎓", "♿", "🌳", "❤️", "🌟"]
const ICONS = [
  <Heart size={26} className="text-[#C5963A]" key={0} />,
  <GraduationCap size={26} className="text-[#C5963A]" key={1} />,
  <Accessibility size={26} className="text-[#C5963A]" key={2} />,
  <Trees size={26} className="text-[#C5963A]" key={3} />,
  <Users2 size={26} className="text-[#C5963A]" key={4} />,
]

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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

export default function CSRPage() {
  const [data, setData] = useState(DEFAULT_CSR)

  useEffect(() => {
    getSetting("csr_section_en")
      .then(val => {
        if (val) {
          try {
            const parsed = JSON.parse(val)
            setData(prev => ({ ...prev, ...parsed }))
          } catch (e) {}
        }
      })
      .catch(() => {})
  }, [])

  const focusAreasList = data.focusAreas && data.focusAreas.length ? data.focusAreas : DEFAULT_CSR.focusAreas

  return (
    <div className="min-h-screen bg-[#041424] text-[#F5EBD8] overflow-x-hidden">
      <Helmet>
        <title>CSR Initiatives | Royal Hoof Horse Riding Academy</title>
        <meta name="description" content="Explore Corporate Social Responsibility (CSR) initiatives at Royal Hoof: animal welfare, youth education, inclusive riding, and sustainability." />
      </Helmet>

      {/* HERO BANNER - Deep dark vignette & black shadow style */}
      <section className="relative py-24 md:py-32 px-6 lg:px-12 border-b border-[#C5963A]/30 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #082B49 0%, #041424 85%)",
          boxShadow: "inset 0 -30px 60px rgba(0,0,0,0.8)"
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{
          backgroundImage: "radial-gradient(#C5963A 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C5963A]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D2AA55] bg-[#C5963A]/10 px-4 py-1.5 rounded-full border border-[#C5963A]/30 shadow-[0_4px_16px_rgba(0,0,0,0.6)] inline-block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              CORPORATE SOCIAL RESPONSIBILITY (CSR)
            </span>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-[0.04em] mb-4 text-[#F5EBD8]" 
              style={{ 
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                textShadow: "0 8px 30px rgba(0,0,0,0.9)"
              }}>
              {data.heroTitle || "Making a Difference Beyond Horse Riding"}
            </h1>
            
            <div className="w-28 h-0.5 bg-[#C5963A] mx-auto mb-8 shadow-[0_0_12px_#C5963A]" />

            <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-[#D8C5A0] leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
              {data.overview1 && (
                <p className="bg-[#061D33]/80 p-6 rounded-lg border border-[#C5963A]/25 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-md">
                  {data.overview1}
                </p>
              )}
              {data.overview2 && (
                <p className="text-sm md:text-base text-[#D2AA55] italic">
                  "{data.overview2}"
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CSR FOCUS AREAS - 5 Deep Black Shadow Realistic Cards */}
      <section className="py-20 md:py-28 px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5963A]" style={{ fontFamily: "'Inter', sans-serif" }}>
            OUR FIVE PILLARS OF IMPACT
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-[#F5EBD8]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
            Our CSR Focus Areas
          </h2>
          <div className="w-24 h-0.5 bg-[#C5963A] mx-auto mt-4 mb-4" />
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {focusAreasList.map((area, index) => {
            const isEven = index % 2 === 0
            const emoji = EMOJIS[index % EMOJIS.length]
            const icon = ICONS[index % ICONS.length]
            return (
              <motion.div
                key={area.id || index}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl overflow-hidden border border-[#C5963A]/30 bg-[#061D33] p-6 lg:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative`}
                style={{
                  boxShadow: "0 25px 60px rgba(0,0,0,0.75), 0 0 1px rgba(197,150,58,0.3)"
                }}
              >
                {/* Image side */}
                <div className={`lg:col-span-6 relative overflow-hidden rounded-lg border border-[#C5963A]/20 shadow-[0_15px_35px_rgba(0,0,0,0.9)] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative w-full h-[280px] md:h-[340px] group">
                    <img 
                      src={area.img || CSR_IMAGES.animalWelfare} 
                      alt={area.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { e.target.src = CSR_IMAGES.animalWelfare }}
                    />
                    {/* Realistic Black Shadow Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041424] via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 text-2xl p-2 rounded-full bg-black/60 backdrop-blur border border-[#C5963A]/40 shadow-lg">
                      {emoji}
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#082B49] border border-[#C5963A]/40 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                      {icon}
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#D2AA55]">
                      FOCUS AREA #{index + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {area.title}
                  </h3>

                  <p className="text-sm text-[#D8C5A0] italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {area.subtitle}
                  </p>

                  <div className="w-full h-px bg-[#C5963A]/20 my-3" />

                  <ul className="space-y-2.5">
                    {area.bullets && area.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-xs md:text-sm text-[#D8C5A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="text-[#C5963A] font-bold mt-0.5 shrink-0">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* COMMITMENT SECTION - Black Glassmorphism Card */}
      <section className="py-20 px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="relative rounded-2xl p-8 md:p-14 text-center border border-[#C5963A]/40 bg-[#061D33] overflow-hidden"
          style={{
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(197, 150, 58, 0.08)"
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5963A]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#C5963A]/20 border border-[#C5963A] flex items-center justify-center mx-auto mb-6 text-[#D2AA55] shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
              <Sparkles size={28} />
            </div>

            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#D2AA55] mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              🌟 OUR COMMITMENT TO SOCIETY
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#F5EBD8]" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
              Empowering Lives Through Horses
            </h2>

            <p className="text-base md:text-xl font-serif italic text-[#F5EBD8] leading-relaxed mb-8">
              "{data.commitmentText || "We believe that horses have the power to inspire confidence, discipline, empathy, and personal growth."}"
            </p>

            <a 
              href="/contact" 
              className="btn-primary-equestrian inline-flex items-center gap-3 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.8)"
              }}
            >
              Partner With Us for CSR <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
