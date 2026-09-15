import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { Calendar, User, Mail, Phone, MessageSquare, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { isValidPhone, isValidEmail, sanitizePhone } from '../utils/validation'

const WHATSAPP_NUMBER = "919043700776"

export default function EnquiryPage() {
  const [activeForm, setActiveForm] = useState('enquiry') // enquiry or demo
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false)
  const [submittingDemo, setSubmittingDemo] = useState(false)
  
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'child',
    message: ''
  })

  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'child',
    date: '',
    time: '',
    notes: ''
  })

  const handleEnquirySubmit = async (e) => {
    e.preventDefault()
    if (!enquiryForm.name.trim()) { toast.error('Name required'); return }
    if (!enquiryForm.phone.trim()) { toast.error('Phone required'); return }
    if (!isValidPhone(enquiryForm.phone)) { toast.error('Please enter a valid 10-digit mobile number'); return }
    if (enquiryForm.email.trim() && !isValidEmail(enquiryForm.email)) { toast.error('Please enter a valid email address'); return }
    if (!enquiryForm.category) { toast.error('Category required'); return }
    if (!enquiryForm.message.trim()) { toast.error('Message required'); return }
    
    setSubmittingEnquiry(true)
    const categoryLabel = enquiryForm.category === 'child' ? 'Child' : 'Adult'
    try {
      const enquiryPayload = {
        name: enquiryForm.name.trim(),
        email: enquiryForm.email.trim() || null,
        phone: enquiryForm.phone.trim(),
        message: `[Category: ${categoryLabel}] ${enquiryForm.message.trim()}`.trim(),
        enquiry_type: 'general',
        status: 'new',
        category: enquiryForm.category
      }

      let { error } = await supabase.from('enquiries').insert([enquiryPayload])
      if (error && (error.message?.includes('category') || error.code === '42703')) {
        delete enquiryPayload.category
        const fallbackRes = await supabase.from('enquiries').insert([enquiryPayload])
        if (fallbackRes.error) throw fallbackRes.error
      } else if (error) {
        throw error
      }

      toast.success('Your enquiry has been submitted successfully! We will contact you soon.')
      
      // Also open WhatsApp for immediate contact
      const text = `*General Enquiry*\n\nCategory: ${categoryLabel}\nName: ${enquiryForm.name}\nEmail: ${enquiryForm.email}\nPhone: ${enquiryForm.phone}\n\nMessage:\n${enquiryForm.message}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
      
      // Reset form
      setEnquiryForm({ name: '', email: '', phone: '', category: 'child', message: '' })
      
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      toast.error('Failed to submit enquiry. Please try again or contact us directly via WhatsApp.')
      
      // Fallback to WhatsApp only
      const text = `*General Enquiry*\n\nCategory: ${categoryLabel}\nName: ${enquiryForm.name}\nEmail: ${enquiryForm.email}\nPhone: ${enquiryForm.phone}\n\nMessage:\n${enquiryForm.message}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    } finally {
      setSubmittingEnquiry(false)
    }
  }

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    if (!demoForm.name.trim()) { toast.error('Name required'); return }
    if (!demoForm.phone.trim()) { toast.error('Phone required'); return }
    if (!isValidPhone(demoForm.phone)) { toast.error('Please enter a valid 10-digit mobile number'); return }
    if (demoForm.email.trim() && !isValidEmail(demoForm.email)) { toast.error('Please enter a valid email address'); return }
    if (!demoForm.category) { toast.error('Category required'); return }
    if (!demoForm.date) { toast.error('Preferred date required'); return }
    
    setSubmittingDemo(true)
    const categoryLabel = demoForm.category === 'child' ? 'Child' : 'Adult'
    try {
      const enquiryPayload = {
        name: demoForm.name.trim(),
        email: demoForm.email.trim() || null,
        phone: demoForm.phone.trim(),
        message: `[Category: ${categoryLabel}] ${demoForm.notes.trim()}`.trim(),
        enquiry_type: 'demo',
        status: 'new',
        preferred_date: demoForm.date,
        preferred_time: demoForm.time || null,
        category: demoForm.category
      }

      let { error } = await supabase.from('enquiries').insert([enquiryPayload])
      if (error && (error.message?.includes('category') || error.code === '42703')) {
        delete enquiryPayload.category
        const fallbackRes = await supabase.from('enquiries').insert([enquiryPayload])
        if (fallbackRes.error) throw fallbackRes.error
      } else if (error) {
        throw error
      }

      toast.success('Your demo request has been submitted successfully! We will contact you soon.')
      
      // Also open WhatsApp for immediate contact
      const text = `*Free Demo Session Request*\n\nCategory: ${categoryLabel}\nName: ${demoForm.name}\nEmail: ${demoForm.email}\nPhone: ${demoForm.phone}\nPreferred Date: ${demoForm.date}\nPreferred Time: ${demoForm.time || 'Flexible'}\n\nNotes:\n${demoForm.notes || 'N/A'}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
      
      // Reset form
      setDemoForm({ name: '', email: '', phone: '', category: 'child', date: '', time: '', notes: '' })
      
    } catch (error) {
      console.error('Error submitting demo request:', error)
      toast.error('Failed to submit demo request. Please try again or contact us directly via WhatsApp.')
      
      const text = `*Free Demo Session Request*\n\nCategory: ${categoryLabel}\nName: ${demoForm.name}\nEmail: ${demoForm.email}\nPhone: ${demoForm.phone}\nPreferred Date: ${demoForm.date}\nPreferred Time: ${demoForm.time || 'Flexible'}\n\nNotes:\n${demoForm.notes || 'N/A'}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    } finally {
      setSubmittingDemo(false)
    }
  }

  const inputClass = 'input-premium w-full rounded-sm px-4 py-3 text-[#292725] placeholder-[#B9AFA3]/50'
  const labelClass = 'block text-[#C5963A] text-sm font-medium mb-2'

  return (
    <>
      <Helmet>
        <title>Enquiry & Free Demo - Academy</title>
        <meta name="description" content="Contact us or book a free demo session" />
      </Helmet>

      <div className="min-h-screen py-20 px-6 lg:px-12 xl:px-20" style={{ background: '#F4E9D2' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-3">Get In Touch</p>
            <h1 className="heading-editorial text-4xl mb-4">
              <span style={{ color: "#292725" }}>Enquiry &</span> <span style={{ color: "#D8C7A0", fontStyle: "italic" }}>Free Demo</span>
            </h1>
            <div className="equestrian-divider w-24 mx-auto mb-6" />
            <p className="text-[#C5963A] max-w-2xl mx-auto">
              Have questions or want to experience our academy? Send us an enquiry or book a free demo session.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveForm('enquiry')}
              className={`px-8 py-3 rounded-sm text-sm font-medium uppercase tracking-wider transition-all border ${
                activeForm === 'enquiry'
                  ? 'bg-[#C5963A] text-[#0C0D11] border-[#C5963A]'
                  : 'bg-transparent text-[#765334] border-[rgba(197, 150, 58,0.25)] hover:border-[rgba(197, 150, 58,0.45)] hover:text-[#D8C7A0]'
              }`}
            >
              <MessageSquare size={18} className="inline-block mr-2 mb-1" />
              General Enquiry
            </button>
            <button
              onClick={() => setActiveForm('demo')}
              className={`px-8 py-3 rounded-sm text-sm font-medium uppercase tracking-wider transition-all border ${
                activeForm === 'demo'
                  ? 'bg-[#C5963A] text-[#0C0D11] border-[#C5963A]'
                  : 'bg-transparent text-[#765334] border-[rgba(197, 150, 58,0.25)] hover:border-[rgba(197, 150, 58,0.45)] hover:text-[#D8C7A0]'
              }`}
            >
              <Calendar size={18} className="inline-block mr-2 mb-1" />
              Book Free Demo
            </button>
          </div>

          {/* Forms */}
          <div className="equestrian-card rounded-lg p-8">
            {activeForm === 'enquiry' ? (
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                <div>
                  <label className={labelClass}>
                    <User size={16} className="inline-block mr-2 mb-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={enquiryForm.name}
                    onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      <Mail size={16} className="inline-block mr-2 mb-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={enquiryForm.email}
                      onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Phone size={16} className="inline-block mr-2 mb-1" />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={enquiryForm.phone}
                      onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault()
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 10)
                        setEnquiryForm(prev => ({ ...prev, phone: pasted }))
                      }}
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <Users size={16} className="inline-block mr-2 mb-1" />
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2 h-[48px] max-w-sm">
                    <button
                      type="button"
                      onClick={() => setEnquiryForm({ ...enquiryForm, category: 'child' })}
                      className={`w-full h-full rounded-sm text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                        enquiryForm.category === 'child'
                          ? 'bg-[#0C0D11] text-[#C5963A] border-[#C5963A] shadow-md font-semibold ring-1 ring-[#C5963A]'
                          : 'bg-[#FAF3E4] text-[#0C0D11] border-[rgba(197,150,58,0.4)] hover:border-[#C5963A] hover:bg-[#F2E5CE]'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full transition-all ${enquiryForm.category === 'child' ? 'bg-[#C5963A] scale-110' : 'bg-transparent border border-[#765334]'}`} />
                      Child
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnquiryForm({ ...enquiryForm, category: 'adult' })}
                      className={`w-full h-full rounded-sm text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                        enquiryForm.category === 'adult'
                          ? 'bg-[#0C0D11] text-[#C5963A] border-[#C5963A] shadow-md font-semibold ring-1 ring-[#C5963A]'
                          : 'bg-[#FAF3E4] text-[#0C0D11] border-[rgba(197,150,58,0.4)] hover:border-[#C5963A] hover:bg-[#F2E5CE]'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full transition-all ${enquiryForm.category === 'adult' ? 'bg-[#C5963A] scale-110' : 'bg-transparent border border-[#765334]'}`} />
                      Adult
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <MessageSquare size={16} className="inline-block mr-2 mb-1" />
                    Your Message *
                  </label>
                  <textarea
                    maxLength={1000}
                    value={enquiryForm.message}
                    onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    onPaste={e => {
                      const items = e.clipboardData?.items
                      if (items) {
                        for (let i = 0; i < items.length; i++) {
                          if (items[i].type.indexOf("image") !== -1) {
                            e.preventDefault()
                            toast.error("Images are not allowed in the message field")
                            return
                          }
                        }
                      }
                    }}
                    placeholder="Tell us what you'd like to know... (Max 1000 characters)"
                    rows={6}
                    className={inputClass}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-[#765334]">
                      {(enquiryForm.message || "").length}/1000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="btn-primary-equestrian w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingEnquiry ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Enquiry...
                    </span>
                  ) : (
                    'Send Enquiry'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-6">
                <div>
                  <label className={labelClass}>
                    <User size={16} className="inline-block mr-2 mb-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={demoForm.name}
                    onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      <Mail size={16} className="inline-block mr-2 mb-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={demoForm.email}
                      onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Phone size={16} className="inline-block mr-2 mb-1" />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={demoForm.phone}
                      onChange={e => setDemoForm({ ...demoForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault()
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 10)
                        setDemoForm(prev => ({ ...prev, phone: pasted }))
                      }}
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>
                      <Users size={16} className="inline-block mr-2 mb-1" />
                      Category *
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-[48px]">
                      <button
                        type="button"
                        onClick={() => setDemoForm({ ...demoForm, category: 'child' })}
                        className={`w-full h-full rounded-sm text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                          demoForm.category === 'child'
                            ? 'bg-[#0C0D11] text-[#C5963A] border-[#C5963A] shadow-md font-semibold ring-1 ring-[#C5963A]'
                            : 'bg-[#FAF3E4] text-[#0C0D11] border-[rgba(197,150,58,0.4)] hover:border-[#C5963A] hover:bg-[#F2E5CE]'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full transition-all ${demoForm.category === 'child' ? 'bg-[#C5963A] scale-110' : 'bg-transparent border border-[#765334]'}`} />
                        Child
                      </button>
                      <button
                        type="button"
                        onClick={() => setDemoForm({ ...demoForm, category: 'adult' })}
                        className={`w-full h-full rounded-sm text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                          demoForm.category === 'adult'
                            ? 'bg-[#0C0D11] text-[#C5963A] border-[#C5963A] shadow-md font-semibold ring-1 ring-[#C5963A]'
                            : 'bg-[#FAF3E4] text-[#0C0D11] border-[rgba(197,150,58,0.4)] hover:border-[#C5963A] hover:bg-[#F2E5CE]'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full transition-all ${demoForm.category === 'adult' ? 'bg-[#C5963A] scale-110' : 'bg-transparent border border-[#765334]'}`} />
                        Adult
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Calendar size={16} className="inline-block mr-2 mb-1" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={demoForm.date}
                      onChange={e => setDemoForm({ ...demoForm, date: e.target.value })}
                      className={inputClass}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={demoForm.time}
                      onChange={e => setDemoForm({ ...demoForm, time: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    maxLength={1000}
                    value={demoForm.notes}
                    onChange={e => setDemoForm({ ...demoForm, notes: e.target.value })}
                    onPaste={e => {
                      const items = e.clipboardData?.items
                      if (items) {
                        for (let i = 0; i < items.length; i++) {
                          if (items[i].type.indexOf("image") !== -1) {
                            e.preventDefault()
                            toast.error("Images are not allowed in the message field")
                            return
                          }
                        }
                      }
                    }}
                    placeholder="Any specific requirements or questions... (Max 1000 characters)"
                    rows={4}
                    className={inputClass}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-[#765334]">
                      {(demoForm.notes || "").length}/1000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingDemo}
                  className="btn-primary-equestrian w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingDemo ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking Demo...
                    </span>
                  ) : (
                    'Book Free Demo Session'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-10 text-center text-[#765334]">
            <p className="text-sm">You can also reach us directly:</p>
            <p className="text-lg font-medium text-[#C5963A] mt-2">
              <Phone size={18} className="inline-block mr-2 mb-1" />
              +91 90437 00776
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
