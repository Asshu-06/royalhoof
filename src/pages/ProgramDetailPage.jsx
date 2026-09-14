import { useState, useEffect } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { 
  Target, Sparkles, Calendar, Heart, Users, Shield, Trophy, Star,
  ArrowLeft, ArrowRight, CheckCircle2, Clock, MapPin, Award,
  Send, Loader2, Phone, Mail, HelpCircle
} from "lucide-react"
import { getSetting } from "../services/settingsService"
import { DEFAULT_OFFERINGS } from "../data/defaultOfferings"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import { isValidPhone, sanitizePhone } from "../utils/validation"

const ICON_MAP = {
  Target: <Target size={24} />,
  Sparkles: <Sparkles size={24} />,
  Calendar: <Calendar size={24} />,
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Shield: <Shield size={24} />,
  Trophy: <Trophy size={24} />,
  Star: <Star size={24} />
}

export default function ProgramDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [offerings, setOfferings] = useState(DEFAULT_OFFERINGS)
  const [loading, setLoading] = useState(true)

  const handleBack = () => {
    if (location.state?.fromSection) {
      navigate(`/#${location.state.fromSection}`)
    } else if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/#what-we-offer')
    }
  }
  
  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [slug])

  useEffect(() => {
    async function loadData() {
      try {
        const customOfferings = await getSetting('site_offerings')
        if (customOfferings && Array.isArray(customOfferings) && customOfferings.length > 0) {
          setOfferings(customOfferings)
        }
      } catch (err) {
        console.error("Error loading offerings:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    const handleUpdate = (e) => {
      if (e.detail?.key === 'site_offerings' && Array.isArray(e.detail?.value)) {
        setOfferings(e.detail.value)
      }
    }
    window.addEventListener('site_settings_updated', handleUpdate)
    return () => window.removeEventListener('site_settings_updated', handleUpdate)
  }, [])

  // Find program by slug or id (case-insensitive & fallback)
  const targetSlug = (slug || '').toLowerCase()
  const program = offerings.find(p => 
    (p.slug && p.slug.toLowerCase() === targetSlug) || 
    (p.id && p.id.toLowerCase() === targetSlug)
  ) || offerings[0]

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your name and phone number')
      return
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setSubmitting(true)
    try {
      const enquiryPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        package_name: program.title,
        message: `[Program Enquiry: ${program.title}] ${formData.message}`.trim(),
        created_at: new Date().toISOString()
      }

      const { error } = await supabase.from('enquiries').insert([enquiryPayload])
      if (error) throw error

      toast.success('Thank you! Your enquiry for ' + program.title + ' has been submitted. We will contact you soon.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Enquiry error:', err)
      toast.error('Failed to submit enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF3E4]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C5963A]" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF3E4] px-4 text-center">
        <HelpCircle className="w-16 h-16 text-[#C5963A] mb-4" />
        <h2 className="text-2xl font-bold text-[#082B49] mb-2 font-serif">Program Not Found</h2>
        <p className="text-[#765334] mb-6">The equestrian program you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary-equestrian px-6 py-3 text-sm">
          Return to Homepage
        </Link>
      </div>
    )
  }

  const IconComponent = ICON_MAP[program.icon] || <Target size={24} />

  // Filter other programs for related section
  const otherPrograms = offerings.filter(p => p.slug !== program.slug && p.id !== program.id).slice(0, 3)

  return (
    <div className="bg-[#FAF3E4] min-h-screen text-[#292725]">
      <Helmet>
        <title>{`${program.title} | Royal Hoof Horse Riding Academy`}</title>
        <meta name="description" content={program.shortDesc || program.overview?.slice(0, 150)} />
      </Helmet>

      {/* Header / Breadcrumbs banner */}
      <div className="bg-[#082B49] text-[#F5EBD8] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#C5963A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D2AA55] mb-6">
            <button 
              onClick={handleBack} 
              className="inline-flex items-center gap-1 hover:text-[#F5EBD8] transition-colors cursor-pointer bg-transparent border-0 text-[#D2AA55] font-medium mr-1"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span>/</span>
            <Link to="/" className="hover:text-[#F5EBD8] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#what-we-offer" className="hover:text-[#F5EBD8] transition-colors">What We Offer</Link>
            <span>/</span>
            <span className="text-[#F5EBD8] font-medium truncate">{program.title}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#C5963A] bg-[#C5963A]/10 px-3 py-1.5 rounded border border-[#C5963A]/30 mb-3">
                {IconComponent}
                <span>{program.tag || "EQUESTRIAN PROGRAM"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#F5EBD8] leading-tight">
                {program.title}
              </h1>
              {program.shortDesc && (
                <p className="mt-3 text-base sm:text-lg text-[#D2AA55] max-w-3xl font-sans">
                  {program.shortDesc}
                </p>
              )}
            </div>

            <a 
              href="#booking-form"
              className="btn-gold-equestrian flex-shrink-0 px-7 py-3.5 text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2 rounded-lg font-bold shadow-lg border-2 border-[#C5963A] transition-all hover:bg-[#D2AA55] hover:border-[#D2AA55] hover:scale-[1.03]"
            >
              <Calendar size={18} className="text-[#082B49]" />
              Book or Enquire Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Main Details Column (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Main Feature Image Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5963A]/30 aspect-video">
              <img 
                src={program.bannerImage || "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80"}
                alt={program.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.opacity = '0.7';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082B49]/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Quick Info Badges Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#F5EBD8]">
                {program.suitability && (
                  <span className="bg-[#082B49]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#C5963A]/40 flex items-center gap-2 font-medium">
                    <Award size={14} className="text-[#C5963A]" />
                    {program.suitability}
                  </span>
                )}
                {program.duration && (
                  <span className="bg-[#082B49]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#C5963A]/40 flex items-center gap-2 font-medium">
                    <Clock size={14} className="text-[#C5963A]" />
                    {program.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-[#F4E9D2] p-8 rounded-2xl border border-[#C5963A]/20 shadow-md">
              <h2 className="text-2xl font-bold font-serif text-[#082B49] mb-4 flex items-center gap-3">
                <span className="w-2 h-7 bg-[#C5963A] rounded-full inline-block" />
                Program Overview
              </h2>
              <div className="prose text-[#5A4430] leading-relaxed space-y-4 font-sans text-base whitespace-pre-line">
                {program.overview || program.shortDesc}
              </div>
            </div>

            {/* Program Key Highlights Grid */}
            {program.highlights && program.highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#082B49] mb-6 flex items-center gap-3">
                  <span className="w-2 h-7 bg-[#C5963A] rounded-full inline-block" />
                  Key Highlights & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.highlights.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-xl bg-white/80 border border-[#C5963A]/20 shadow-sm hover:border-[#082B49] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C5963A] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-[#082B49] text-base mb-1 font-serif">
                            {typeof item === 'string' ? item : item.title}
                          </h3>
                          {typeof item === 'object' && item.desc && (
                            <p className="text-xs sm:text-sm text-[#765334] font-sans leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum / Modules Section */}
            {program.curriculum && program.curriculum.length > 0 && (
              <div className="bg-[#082B49] text-[#F5EBD8] p-8 rounded-2xl shadow-xl border border-[#C5963A]/30">
                <h2 className="text-2xl font-bold font-serif text-[#F5EBD8] mb-6 flex items-center gap-3">
                  <Trophy size={22} className="text-[#C5963A]" />
                  Curriculum & Training Stages
                </h2>
                <div className="space-y-3">
                  {program.curriculum.map((step, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#C5963A] text-[#082B49] font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base text-[#F5EBD8] font-sans">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Gallery */}
            {program.gallery && program.gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#082B49] mb-6 flex items-center gap-3">
                  <Sparkles size={22} className="text-[#C5963A]" />
                  Program Photo Showcase
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {program.gallery.map((imgUrl, gIdx) => (
                    <div 
                      key={gIdx} 
                      className="rounded-xl overflow-hidden shadow-md border border-[#C5963A]/20 aspect-video sm:aspect-square group relative bg-[#082B49]/5"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${program.title} photo ${gIdx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Prevent infinite fallback loop and show clean placeholder style
                          e.target.onerror = null;
                          e.target.style.opacity = '0.5';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Program Details Card & Enquiry Form */}
          <div className="space-y-8">
            
            {/* Quick Info Box */}
            <div className="bg-[#082B49] text-[#F5EBD8] p-6 rounded-2xl shadow-xl border border-[#C5963A]/30">
              <h3 className="text-xl font-bold font-serif text-[#C5963A] mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                <Shield size={18} />
                Program Information
              </h3>
              
              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-[#C5963A] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[#D2AA55] text-xs block uppercase font-bold">Suitability</span>
                    <span className="text-[#F5EBD8] font-medium">{program.suitability || "All Skill Levels"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5963A] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[#D2AA55] text-xs block uppercase font-bold">Duration / Slot</span>
                    <span className="text-[#F5EBD8] font-medium">{program.duration || "Flexible Schedules"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5963A] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[#D2AA55] text-xs block uppercase font-bold">Location</span>
                    <span className="text-[#F5EBD8] font-medium">{program.location || "Giri Farms, Nallambakkam, TN"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5963A] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[#D2AA55] text-xs block uppercase font-bold">Direct Hotline</span>
                    <span className="text-[#F5EBD8] font-medium">+91 90437 00776</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Enquiry / Booking Form */}
            <div id="booking-form" className="bg-[#F4E9D2] p-7 rounded-2xl border-2 border-[#C5963A]/40 shadow-xl">
              <h3 className="text-xl font-bold font-serif text-[#082B49] mb-1">
                Enquire for {program.title}
              </h3>
              <p className="text-xs text-[#765334] mb-6 font-sans">
                Fill in your details to book a trial session or inquire about schedules.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B49] mb-1">
                    Your Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#C5963A]/30 bg-white text-[#292725] text-sm focus:outline-none focus:border-[#082B49]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B49] mb-1">
                    Phone Number *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                        e.preventDefault()
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault()
                      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 10)
                      setFormData(prev => ({ ...prev, phone: pasted }))
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#C5963A]/30 bg-white text-[#292725] text-sm focus:outline-none focus:border-[#082B49]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B49] mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#C5963A]/30 bg-white text-[#292725] text-sm focus:outline-none focus:border-[#082B49]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B49] mb-1">
                    Message / Preferred Timing
                  </label>
                  <textarea 
                    rows={3}
                    maxLength={1000}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify preferred dates, number of riders, or any questions..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#C5963A]/30 bg-white text-[#292725] text-sm focus:outline-none focus:border-[#082B49] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold-equestrian py-3.5 px-4 text-xs font-bold tracking-wider uppercase inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#C5963A] transition-all hover:bg-[#D2AA55] hover:border-[#D2AA55] shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-[#082B49]" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="text-[#082B49]" />
                      Send Enquiry Now
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Explore Other Programs Section */}
        {otherPrograms.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#C5963A]/20">
            <div className="text-center mb-10">
              <p className="eyebrow-label mb-2">EXPLORE MORE EQUESTRIAN OPTIONS</p>
              <h2 className="heading-editorial text-3xl font-medium">Other Programs We Offer</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPrograms.map((op, idx) => (
                <Link
                  key={idx}
                  to={`/programs/${op.slug}`}
                  className="group bg-[#FAF3E4] p-6 rounded-xl border border-[#C5963A]/30 shadow-md hover:shadow-xl hover:border-[#082B49] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-[#C5963A] bg-[#C5963A]/10 px-2.5 py-1 rounded">
                        {op.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#082B49] mb-2 group-hover:text-[#C5963A] transition-colors">
                      {op.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A4430] line-clamp-3 font-sans leading-relaxed">
                      {op.shortDesc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#C5963A]/15 flex items-center justify-between text-xs font-bold text-[#082B49]">
                    <span>Explore Program</span>
                    <ArrowRight size={14} className="text-[#C5963A] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
