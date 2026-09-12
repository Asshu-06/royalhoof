import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Check, Star, Sparkles, Award, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

const WHATSAPP_NUMBER = "919043700776"

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState('adult') // adult or kids
  const [adultPackages, setAdultPackages] = useState([])
  const [kidsPackages, setKidsPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Supabase error loading packages:', error)
        toast.error(`Failed to load packages: ${error.message}`)
        throw error
      }

      console.log('Loaded packages from database:', data)
      
      const adult = (data || []).filter(pkg => pkg.package_type === 'adult').map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        popular: pkg.is_popular,
        features: Array.isArray(pkg.features) ? pkg.features : (pkg.features ? JSON.parse(pkg.features) : []),
        color: pkg.is_popular ? '#C5963A' : '#B9AFA3',
        description: pkg.description
      }))

      const kids = (data || []).filter(pkg => pkg.package_type === 'kids').map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        ageGroup: pkg.age_group,
        features: Array.isArray(pkg.features) ? pkg.features : (pkg.features ? JSON.parse(pkg.features) : []),
        description: pkg.description
      }))

      setAdultPackages(adult)
      setKidsPackages(kids)
    } catch (error) {
      console.error('Error loading packages:', error)
      // Fallback to sample data if database is not set up
      setAdultPackages([
        {
          id: 1,
          name: 'Basic',
          price: 2999,
          duration: 'month',
          popular: false,
          features: [
            'Access to group training sessions',
            'Basic equipment usage',
            '4 sessions per week',
            'Locker facility',
            'General fitness guidance',
          ],
          color: '#765334',
          description: 'Perfect for beginners'
        },
        {
          id: 2,
          name: 'Premium',
          price: 7999,
          duration: 'quarter',
          popular: true,
          features: [
            'All Basic features',
            'Unlimited training sessions',
            'Personal training (2 sessions/month)',
            'Advanced equipment access',
            'Nutrition consultation',
            'Free merchandise kit',
            'Priority event registration',
          ],
          color: '#C5963A',
          description: 'Our most popular package'
        },
        {
          id: 3,
          name: 'Elite',
          price: 14999,
          duration: '6 months',
          popular: false,
          features: [
            'All Premium features',
            'Dedicated coach assignment',
            'Weekly personal training',
            'Customized training plan',
            'Diet chart & supplements guide',
            'Video analysis & feedback',
            'Competition preparation',
            'Premium locker with shower',
            'Free guest passes (2/month)',
          ],
          color: '#C5963A',
          description: 'Complete premium experience'
        },
      ])

      setKidsPackages([
        {
          id: 4,
          name: 'Junior Starter',
          price: 2499,
          duration: 'month',
          ageGroup: '5-12 years',
          features: [
            'Fun & engaging group classes',
            'Age-appropriate equipment',
            '3 sessions per week',
            'Safety gear included',
            'Progress tracking',
          ],
          description: 'Perfect introduction for young riders'
        },
        {
          id: 5,
          name: 'Teen Champion',
          price: 3499,
          duration: 'month',
          ageGroup: '13-18 years',
          features: [
            'Advanced skill development',
            'Competitive training',
            '5 sessions per week',
            'Tournament preparation',
            'Fitness & conditioning',
            'Mentorship program',
          ],
          description: 'Build skills and confidence'
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiry = (pkg) => {
    const text = `*Membership Enquiry*\n\nPackage: ${pkg.name}\nPrice: ₹${pkg.price}/${pkg.duration}\n\nI am interested in this membership package. Please provide more details and help me get started.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    toast.success('Enquiry sent!')
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Packages & Memberships - Royal Hoof Academy</title>
        <meta name="description" content="Choose the perfect membership package for your equestrian goals" />
      </Helmet>

      <div className="min-h-screen py-20 px-6 lg:px-12 xl:px-20" style={{ background: 'linear-gradient(180deg, #F4E9D2 0%, #FAF3E4 100%)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-[#C5963A]/20">
              <Sparkles size={18} className="text-[#C5963A]" />
              <span className="text-[#C5963A] text-sm font-semibold uppercase tracking-wider">Premium Memberships</span>
            </div>
            
            <h1 className="heading-editorial text-5xl md:text-6xl mb-6">
              <span style={{ color: "#292725" }}>Our</span>{" "}
              <span style={{ 
                background: "linear-gradient(135deg, #C5963A 0%, #D2AA55 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Packages
              </span>
            </h1>
            
            <div className="w-32 h-1 mx-auto mb-8" style={{
              background: "linear-gradient(90deg, transparent, #C5963A, transparent)",
              borderRadius: 2
            }} />
            
            <p className="text-[#765334] text-lg max-w-2xl mx-auto leading-relaxed">
              Choose the perfect membership plan that fits your goals and schedule.<br/>
              <span className="text-[#C5963A] font-medium">Start your equestrian journey today!</span>
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-16"
          >
            <button
              onClick={() => setActiveTab('adult')}
              className={`group px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden ${
                activeTab === 'adult'
                  ? 'bg-[#C5963A] text-white shadow-lg shadow-[#C5963A]/30'
                  : 'bg-white text-[#765334] hover:bg-[#FAF3E4] border-2 border-[#C5963A]/20'
              }`}
              style={{
                transform: activeTab === 'adult' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {activeTab === 'adult' && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              <Users size={18} className="inline mr-2" />
              Adult Packages
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`group px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden ${
                activeTab === 'kids'
                  ? 'bg-[#C5963A] text-white shadow-lg shadow-[#C5963A]/30'
                  : 'bg-white text-[#765334] hover:bg-[#FAF3E4] border-2 border-[#C5963A]/20'
              }`}
              style={{
                transform: activeTab === 'kids' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {activeTab === 'kids' && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              <Award size={18} className="inline mr-2" />
              Kids Packages
            </button>
          </motion.div>

          {/* Adult Packages */}
          {activeTab === 'adult' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-[#C5963A] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : adultPackages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl mb-16 border-2 border-dashed border-[#C5963A]/30"
                >
                  <p className="text-[#765334] text-xl font-medium">No adult packages available</p>
                  <p className="text-[#9A8870] text-sm mt-2">Check back soon for exciting updates!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {adultPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      whileHover={{ y: -6, transition: { duration: 0.3 } }}
                      className={`group relative bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                        pkg.popular 
                          ? 'ring-4 ring-[#C5963A] shadow-xl shadow-[#C5963A]/20' 
                          : 'border-2 border-[#C5963A] hover:border-[#C5963A] hover:shadow-lg hover:shadow-[#C5963A]/15'
                      }`}
                      style={{
                        background: pkg.popular 
                          ? 'linear-gradient(135deg, #FFFFFF 0%, #FAF3E4 100%)'
                          : '#FFFFFF'
                      }}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-[#C5963A] to-[#D2AA55] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 shadow-md shadow-[#C5963A]/30">
                            <Star size={14} fill="currentColor" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      <div>
                        {/* Package Name & Description */}
                        <div className="mb-4 pt-2">
                          <h3 className="heading-editorial text-2.5xl text-2rem mb-1" style={{ color: "#292725" }}>
                            {pkg.name}
                          </h3>
                          {pkg.description && (
                            <p className="text-[#9A8870] text-xs font-medium">{pkg.description}</p>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold" style={{ 
                              background: `linear-gradient(135deg, ${pkg.color} 0%, ${pkg.popular ? '#D2AA55' : '#8A6640'} 100%)`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text"
                            }}>
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[#9A8870] text-sm font-medium">/{pkg.duration}</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5963A]/30 to-transparent my-4" />

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[#765334] text-xs leading-snug group/item">
                              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#C5963A]/20 to-[#C5963A]/10 flex items-center justify-center group-hover/item:from-[#C5963A] group-hover/item:to-[#D2AA55] transition-all duration-300">
                                <Check size={12} className="text-[#C5963A] group-hover/item:text-white" strokeWidth={3} />
                              </div>
                              <span className="group-hover/item:text-[#292725] transition-colors">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleEnquiry(pkg)}
                        className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 text-xs relative overflow-hidden group/btn mt-auto ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-[#C5963A] to-[#D2AA55] text-white shadow-md shadow-[#C5963A]/30'
                            : 'bg-[#292725] text-white hover:bg-[#C5963A]'
                        }`}
                      >
                        <span className="relative z-10">View Details →</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Kids Packages */}
          {activeTab === 'kids' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-[#C5963A] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : kidsPackages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl mb-16 border-2 border-dashed border-[#C5963A]/30"
                >
                  <p className="text-[#765334] text-xl font-medium">No kids packages available</p>
                  <p className="text-[#9A8870] text-sm mt-2">Check back soon for exciting updates!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                  {kidsPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      whileHover={{ y: -6, transition: { duration: 0.3 } }}
                      className="group relative bg-white rounded-2xl p-6 border-2 border-[#C5963A] hover:border-[#C5963A] transition-all duration-300 hover:shadow-lg hover:shadow-[#C5963A]/15 flex flex-col justify-between"
                    >
                      <div>
                        {/* Package Name & Age Group */}
                        <div className="mb-4">
                          <h3 className="heading-editorial text-2.5xl text-2rem mb-1.5" style={{ color: "#292725" }}>
                            {pkg.name}
                          </h3>
                          <div className="inline-block bg-gradient-to-r from-[#C5963A]/10 to-[#D2AA55]/10 border border-[#C5963A]/30 px-3 py-1 rounded-lg">
                            <span className="text-[#C5963A] text-xs font-bold">{pkg.ageGroup}</span>
                          </div>
                          {pkg.description && (
                            <p className="text-[#9A8870] text-xs font-medium mt-2">{pkg.description}</p>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold text-[#C5963A]">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[#9A8870] text-sm font-medium">/{pkg.duration}</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5963A]/30 to-transparent my-4" />

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[#765334] text-xs leading-snug group/item">
                              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#C5963A]/20 to-[#C5963A]/10 flex items-center justify-center group-hover/item:from-[#C5963A] group-hover/item:to-[#D2AA55] transition-all duration-300">
                                <Check size={12} className="text-[#C5963A] group-hover/item:text-white" strokeWidth={3} />
                              </div>
                              <span className="group-hover/item:text-[#292725] transition-colors">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleEnquiry(pkg)}
                        className="w-full bg-gradient-to-r from-[#C5963A] to-[#D2AA55] hover:from-[#8A6640] hover:to-[#C5963A] text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 text-xs shadow-md shadow-[#C5963A]/30 relative overflow-hidden group/btn mt-auto"
                      >
                        <span className="relative z-10">View Details →</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Benefits Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-white to-[#FAF3E4] rounded-3xl p-12 text-center border-2 border-[#C5963A]/10 shadow-xl relative overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C5963A]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#D2AA55]/5 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5963A]/10 to-[#D2AA55]/10 px-6 py-3 rounded-full mb-6">
                <Sparkles size={18} className="text-[#C5963A]" />
                <span className="text-[#C5963A] text-sm font-bold uppercase tracking-wider">Member Benefits</span>
              </div>
              
              <h2 className="heading-editorial text-4xl mb-8">
                <span style={{ color: "#292725" }}>Why Choose Our</span>{" "}
                <span style={{ 
                  background: "linear-gradient(135deg, #C5963A 0%, #D2AA55 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Memberships?
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                {[
                  { title: 'Flexible Plans', desc: 'Choose from monthly, quarterly, or annual packages that fit your schedule', icon: '🗓️' },
                  { title: 'No Hidden Costs', desc: 'Transparent pricing with no surprise charges or additional fees', icon: '💰' },
                  { title: 'Expert Coaches', desc: 'Learn from certified and experienced equestrian professionals', icon: '🏆' },
                ].map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#C5963A]/10 hover:border-[#C5963A]/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h4 className="text-[#C5963A] font-bold text-lg mb-3">{benefit.title}</h4>
                    <p className="text-[#765334] text-sm leading-relaxed">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              <a
                href="/enquiry"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C5963A] to-[#D2AA55] hover:from-[#8A6640] hover:to-[#C5963A] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#C5963A]/30 hover:shadow-xl hover:shadow-[#C5963A]/40 hover:scale-105"
              >
                <Sparkles size={20} />
                Book Free Demo
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  )
}

