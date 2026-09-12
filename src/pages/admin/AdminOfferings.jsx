import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, Loader2, RefreshCw, Plus, Trash2, Layers, 
  Target, Sparkles, Calendar, Heart, Users, Shield, Trophy, Star,
  Eye, CheckCircle, Image as ImageIcon, ArrowRight, ChevronDown, Check
} from "lucide-react"
import { getSetting, setSetting } from "../../services/settingsService"
import { DEFAULT_OFFERINGS, DEFAULT_OFFERINGS_HEADER } from "../../data/defaultOfferings"
import ImageUploader from "../../components/admin/ImageUploader"
import toast from "react-hot-toast"

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(8,43,73,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"

const ICON_OPTIONS = [
  { id: "Target", label: "Target / Core" },
  { id: "Sparkles", label: "Sparkles / Kids & Special" },
  { id: "Calendar", label: "Calendar / Schedule" },
  { id: "Heart", label: "Heart / Care & Bonding" },
  { id: "Users", label: "Users / Academic & Team" },
  { id: "Shield", label: "Shield / Corporate & Safety" },
  { id: "Trophy", label: "Trophy / Competitions" },
  { id: "Star", label: "Star / VIP & Club" }
]

const ICON_COMPONENTS = {
  Target,
  Sparkles,
  Calendar,
  Heart,
  Users,
  Shield,
  Trophy,
  Star
}

const inputStyle = {
  width: "100%",
  background: "#FFFFFF",
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: 6,
  padding: "10px 14px",
  color: TEXT_PRIMARY,
  fontSize: "0.875rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none"
}

const labelStyle = {
  display: "block",
  color: TEXT_SECONDARY,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
  fontFamily: "'Inter', sans-serif"
}

function CustomProgramSelect({ programs, selectedId, onSelect, onAddNew }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedProg = programs.find(p => p.id === selectedId) || programs[0]
  const selectedIndex = programs.findIndex(p => p.id === selectedId) + 1

  return (
    <div className="relative flex-1 min-w-0 md:w-80 md:flex-initial" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border-2 border-[#C5963A] bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] shadow-md transition-all text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-[#C5963A] text-[#082B49] text-xs font-bold flex items-center justify-center flex-shrink-0">
            {selectedIndex > 0 ? selectedIndex : 1}
          </span>
          <span className="font-bold text-xs sm:text-sm font-serif truncate text-[#F5EBD8]">
            {selectedProg?.title || "Select Program"}
          </span>
        </div>
        <ChevronDown size={18} className={`text-[#C5963A] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 max-w-[calc(100vw-3rem)] w-full rounded-xl bg-[#082B49] border-2 border-[#C5963A] shadow-2xl overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto divide-y divide-white/10">
              {programs.map((prog, idx) => {
                const isSelected = prog.id === selectedId
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => {
                      onSelect(prog.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected ? 'bg-[#C5963A]/25 text-[#F5EBD8] font-bold border-l-4 border-[#C5963A]' : 'hover:bg-white/10 text-[#D2AA55]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#C5963A]/20 text-[#C5963A] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-serif truncate text-[#F5EBD8]">
                          {prog.title}
                        </p>
                        {prog.tag && (
                          <span className="text-[10px] uppercase tracking-wider text-[#C5963A] font-bold block">
                            {prog.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="text-[#C5963A] flex-shrink-0" />}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => {
                  onAddNew()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#C5963A] hover:bg-[#C5963A]/15 transition-colors bg-[#082B49]"
              >
                <Plus size={16} />
                <span>+ Add New Program...</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProgramIconPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = ICON_OPTIONS.find(opt => opt.id === value) || ICON_OPTIONS[0]
  const SelectedIcon = ICON_COMPONENTS[selectedOption.id] || Target

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg border border-[#C5963A]/40 bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] transition-all shadow-sm text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-[#C5963A]/20 text-[#C5963A] border border-[#C5963A]/40 flex items-center justify-center flex-shrink-0">
            <SelectedIcon size={16} />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-[#F5EBD8] truncate font-serif">
              {selectedOption.label}
            </span>
          </div>
        </div>
        <ChevronDown size={16} className={`text-[#C5963A] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1.5 p-2.5 rounded-xl bg-[#082B49] border-2 border-[#C5963A] shadow-2xl overflow-hidden"
          >
            <div className="text-[10px] font-bold text-[#C5963A] uppercase tracking-wider mb-2 px-1 font-serif">
              Select Program Icon
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-0.5">
              {ICON_OPTIONS.map(opt => {
                const IconComp = ICON_COMPONENTS[opt.id] || Target
                const isSelected = opt.id === value
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-[#C5963A] bg-[#C5963A]/25 text-[#F5EBD8] font-bold shadow-sm ring-1 ring-[#C5963A]"
                        : "border-white/10 bg-white/5 text-[#D2AA55] hover:bg-white/15 hover:border-[#C5963A]/50"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#C5963A] text-[#082B49]" : "bg-[#C5963A]/20 text-[#C5963A]"
                    }`}>
                      <IconComp size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-serif truncate leading-tight text-[#F5EBD8]">
                        {opt.id}
                      </span>
                      <span className="block text-[10px] opacity-75 truncate leading-tight text-[#FAF3E4]">
                        {opt.label.split('/')[1]?.trim() || opt.label}
                      </span>
                    </div>
                    {isSelected && <Check size={14} className="text-[#C5963A] flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminOfferings() {
  const [headerSettings, setHeaderSettings] = useState(DEFAULT_OFFERINGS_HEADER)
  const [programs, setPrograms] = useState(DEFAULT_OFFERINGS)
  const [selectedId, setSelectedId] = useState(DEFAULT_OFFERINGS[0]?.id || "")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const customHeader = await getSetting('site_offerings_header')
        const customPrograms = await getSetting('site_offerings')
        
        if (customHeader) setHeaderSettings(customHeader)
        if (customPrograms && Array.isArray(customPrograms) && customPrograms.length > 0) {
          setPrograms(customPrograms)
          setSelectedId(customPrograms[0]?.id || "")
        }
      } catch (err) {
        console.error("Error loading admin offerings settings:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Find currently selected program from dropdown
  const currentProgram = programs.find(p => p.id === selectedId) || programs[0]

  const handleUpdateCurrent = (field, value) => {
    if (!currentProgram) return
    setPrograms(prev => prev.map(p => {
      if (p.id === currentProgram.id) {
        const updated = { ...p, [field]: value }
        // Auto update slug if title changes
        if (field === 'title' && !p.customSlug) {
          updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }
        return updated
      }
      return p
    }))
  }

  const handleAddProgram = () => {
    const newId = `program-${Date.now()}`
    const newProgram = {
      id: newId,
      slug: `new-equestrian-program-${Date.now()}`,
      tag: "NEW PROGRAM",
      icon: "Target",
      title: "New Equestrian Program",
      shortDesc: "Comprehensive riding program tailored for equestrian enthusiasts.",
      bannerImage: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80",
      suitability: "All Ages & Skill Levels",
      duration: "Flexible 45-min sessions",
      location: "Royal Hoof Academy, Giri Farms",
      overview: "Detailed description of the new program.",
      highlights: [
        { title: "Expert Coaching", desc: "Supervised by certified instructors." },
        { title: "Safe Arenas", desc: "Top tier safety gear and gentle horses." }
      ],
      curriculum: [
        "Module 1: Orientation & Basics",
        "Module 2: Practical Skills & Progress"
      ],
      gallery: [
        "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80"
      ]
    }
    setPrograms(prev => [...prev, newProgram])
    setSelectedId(newId)
    toast.success("New program added! Edit details below.")
  }

  const handleDeleteProgram = (idToDelete) => {
    if (programs.length <= 1) {
      toast.error("At least one program must remain.")
      return
    }
    if (window.confirm("Are you sure you want to delete this program?")) {
      const filtered = programs.filter(p => p.id !== idToDelete)
      setPrograms(filtered)
      setSelectedId(filtered[0]?.id || "")
      toast.success("Program removed.")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setSetting('site_offerings_header', headerSettings)
      await setSetting('site_offerings', programs)
      toast.success("What We Offer section & programs saved successfully!")
    } catch (err) {
      console.error("Save error:", err)
      toast.error("Failed to save settings: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (window.confirm("Reset all 'What We Offer' section settings and programs to defaults?")) {
      setHeaderSettings(DEFAULT_OFFERINGS_HEADER)
      setPrograms(DEFAULT_OFFERINGS)
      setSelectedId(DEFAULT_OFFERINGS[0]?.id || "")
      try {
        await setSetting('site_offerings_header', DEFAULT_OFFERINGS_HEADER)
        await setSetting('site_offerings', DEFAULT_OFFERINGS)
        toast.success("Reset to defaults successfully.")
      } catch (err) {
        console.error("Reset error:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5963A]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl bg-[#FAF3E4] border border-[#082B49]/10 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#C5963A] text-sm font-bold uppercase tracking-wider">
            <Layers size={18} />
            <span>Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#082B49]">
            What We Offer Section & Programs
          </h1>
          <p className="text-xs sm:text-sm text-[#765334] mt-1 font-sans">
            Edit homepage section titles and manage detailed content/images for each program page.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg border border-[#C5963A]/40 text-[#765334] hover:bg-[#082B49]/5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} />
            Reset Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary-equestrian px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Section Header Settings Card */}
      <div className="p-6 rounded-xl bg-[#FAF3E4] border border-[#082B49]/10 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-[#082B49] font-serif border-b border-[#082B49]/10 pb-3 flex items-center gap-2">
          <Layers size={18} className="text-[#C5963A]" />
          Homepage Section Header Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Eyebrow Label</label>
            <input 
              type="text"
              style={inputStyle}
              value={headerSettings.eyebrow}
              onChange={e => setHeaderSettings({ ...headerSettings, eyebrow: e.target.value })}
              placeholder="e.g. OUR SERVICES & PROGRAMS"
            />
          </div>

          <div>
            <label style={labelStyle}>Section Title</label>
            <input 
              type="text"
              style={inputStyle}
              value={headerSettings.title}
              onChange={e => setHeaderSettings({ ...headerSettings, title: e.target.value })}
              placeholder="e.g. What We Offer"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Section Subtitle / Description</label>
          <textarea 
            rows={2}
            style={inputStyle}
            value={headerSettings.subtitle}
            onChange={e => setHeaderSettings({ ...headerSettings, subtitle: e.target.value })}
            placeholder="Subheading explanation for homepage..."
          />
        </div>
      </div>

      {/* Program Selection Dropdown Card */}
      <div className="p-6 rounded-xl bg-[#FAF3E4] border border-[#082B49]/10 shadow-md space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#082B49]/10 pb-4">
          <div>
            <label style={{ ...labelStyle, fontSize: "0.875rem", marginBottom: 4 }}>
              Select Program to Edit (Dropdown)
            </label>
            <p className="text-xs text-[#765334]">
              Choose any of the {programs.length} programs from the dropdown to edit its title, content, images, and highlights.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto min-w-0">
            {/* Custom Royal Hoof Program Dropdown */}
            <CustomProgramSelect
              programs={programs}
              selectedId={selectedId}
              onSelect={id => setSelectedId(id)}
              onAddNew={handleAddProgram}
            />

            <button
              type="button"
              onClick={handleAddProgram}
              className="px-3.5 py-2.5 rounded-lg bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors shadow-md whitespace-nowrap"
            >
              <Plus size={14} className="text-[#C5963A]" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Selected Program Editor Form */}
        {currentProgram && (
          <div className="space-y-6 pt-2">
            
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#C5963A]/30">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#C5963A] text-[#082B49] font-bold flex items-center justify-center text-xs">
                  ID
                </span>
                <div>
                  <h3 className="font-bold text-[#082B49] text-base font-serif">
                    Editing: {currentProgram.title}
                  </h3>
                  <p className="text-xs text-[#765334]">
                    Slug / URL: <code className="bg-[#FAF3E4] px-2 py-0.5 rounded text-[#082B49] font-mono">/programs/{currentProgram.slug}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={`/programs/${currentProgram.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-[#FAF3E4] text-[#082B49] hover:bg-[#C5963A]/20 text-xs font-bold inline-flex items-center gap-1 border border-[#C5963A]/30"
                >
                  <Eye size={14} /> Preview Page
                </a>
                <button
                  onClick={() => handleDeleteProgram(currentProgram.id)}
                  className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold inline-flex items-center gap-1 border border-red-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label style={labelStyle}>Program Title</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.title}
                  onChange={e => handleUpdateCurrent('title', e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Category Tag / Badge</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.tag}
                  onChange={e => handleUpdateCurrent('tag', e.target.value)}
                  placeholder="e.g. CORE PROGRAM"
                />
              </div>

              <div>
                <label style={labelStyle}>URL Slug</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.slug}
                  onChange={e => {
                    handleUpdateCurrent('customSlug', true)
                    handleUpdateCurrent('slug', e.target.value)
                  }}
                  placeholder="e.g. childrens-riding-programs"
                />
              </div>

              <div>
                <label style={labelStyle}>Program Icon</label>
                <ProgramIconPicker
                  value={currentProgram.icon}
                  onChange={newIcon => handleUpdateCurrent('icon', newIcon)}
                />
              </div>

              <div>
                <label style={labelStyle}>Suitability</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.suitability || ''}
                  onChange={e => handleUpdateCurrent('suitability', e.target.value)}
                  placeholder="e.g. Ages 6+ to Adults"
                />
              </div>

              <div>
                <label style={labelStyle}>Duration / Schedule</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.duration || ''}
                  onChange={e => handleUpdateCurrent('duration', e.target.value)}
                  placeholder="e.g. Flexible 45-min sessions"
                />
              </div>

              <div className="md:col-span-2">
                <label style={labelStyle}>Location</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={currentProgram.location || ''}
                  onChange={e => handleUpdateCurrent('location', e.target.value)}
                  placeholder="e.g. Royal Hoof Academy, Giri Farms, Nallambakkam"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label style={labelStyle}>Short Description (Homepage Card)</label>
              <textarea 
                rows={2}
                style={inputStyle}
                value={currentProgram.shortDesc || ''}
                onChange={e => handleUpdateCurrent('shortDesc', e.target.value)}
                placeholder="Brief text displayed on the homepage card..."
              />
            </div>

            {/* Main Banner Image Uploader */}
            <div className="bg-white p-5 rounded-lg border border-[#C5963A]/30 space-y-3">
              <label style={{ ...labelStyle, fontSize: "0.875rem" }}>
                Main Banner / Detail Image for {currentProgram.title}
              </label>
              <ImageUploader
                value={currentProgram.bannerImage || ''}
                onChange={url => handleUpdateCurrent('bannerImage', url)}
                label="Program Banner Image"
              />
            </div>

            {/* Full Overview Text */}
            <div>
              <label style={labelStyle}>Full Overview / Detailed Description (Detail Page)</label>
              <textarea 
                rows={5}
                style={inputStyle}
                value={currentProgram.overview || ''}
                onChange={e => handleUpdateCurrent('overview', e.target.value)}
                placeholder="Write comprehensive details about what students will learn, safety, equipment, etc..."
              />
            </div>

            {/* Key Highlights Dynamic Editor */}
            <div className="bg-white p-5 rounded-lg border border-[#C5963A]/30 space-y-4">
              <div className="flex items-center justify-between">
                <label style={{ ...labelStyle, fontSize: "0.875rem", marginBottom: 0 }}>
                  Key Highlights & Features
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentH = currentProgram.highlights || []
                    handleUpdateCurrent('highlights', [...currentH, { title: "New Feature", desc: "Feature description." }])
                  }}
                  className="px-3 py-1 rounded bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus size={13} className="text-[#C5963A]" /> Add Highlight
                </button>
              </div>

              <div className="space-y-3">
                {(currentProgram.highlights || []).map((hItem, hIdx) => {
                  const hTitle = typeof hItem === 'string' ? hItem : hItem.title
                  const hDesc = typeof hItem === 'object' ? hItem.desc : ''

                  return (
                    <div key={hIdx} className="flex items-start gap-3 p-3 rounded border border-[#C5963A]/20 bg-[#FAF3E4]/50">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          style={inputStyle}
                          value={hTitle}
                          onChange={e => {
                            const updatedH = [...(currentProgram.highlights || [])]
                            updatedH[hIdx] = { title: e.target.value, desc: hDesc }
                            handleUpdateCurrent('highlights', updatedH)
                          }}
                          placeholder="Highlight title..."
                        />
                        <input 
                          type="text"
                          style={{ ...inputStyle, fontSize: "0.8125rem" }}
                          value={hDesc}
                          onChange={e => {
                            const updatedH = [...(currentProgram.highlights || [])]
                            updatedH[hIdx] = { title: hTitle, desc: e.target.value }
                            handleUpdateCurrent('highlights', updatedH)
                          }}
                          placeholder="Highlight description..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedH = (currentProgram.highlights || []).filter((_, i) => i !== hIdx)
                          handleUpdateCurrent('highlights', updatedH)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Curriculum Modules Dynamic Editor */}
            <div className="bg-white p-5 rounded-lg border border-[#C5963A]/30 space-y-4">
              <div className="flex items-center justify-between">
                <label style={{ ...labelStyle, fontSize: "0.875rem", marginBottom: 0 }}>
                  Curriculum & Training Stages
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentC = currentProgram.curriculum || []
                    handleUpdateCurrent('curriculum', [...currentC, `Level ${currentC.length + 1}: New Curriculum Stage`])
                  }}
                  className="px-3 py-1 rounded bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus size={13} className="text-[#C5963A]" /> Add Stage
                </button>
              </div>

              <div className="space-y-2">
                {(currentProgram.curriculum || []).map((stepText, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C5963A] text-[#082B49] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {cIdx + 1}
                    </span>
                    <input 
                      type="text"
                      style={inputStyle}
                      value={stepText}
                      onChange={e => {
                        const updatedC = [...(currentProgram.curriculum || [])]
                        updatedC[cIdx] = e.target.value
                        handleUpdateCurrent('curriculum', updatedC)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedC = (currentProgram.curriculum || []).filter((_, i) => i !== cIdx)
                        handleUpdateCurrent('curriculum', updatedC)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Images List */}
            <div className="bg-white p-5 rounded-lg border border-[#C5963A]/30 space-y-4">
              <div className="flex items-center justify-between">
                <label style={{ ...labelStyle, fontSize: "0.875rem", marginBottom: 0 }}>
                  Program Gallery Images
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentG = currentProgram.gallery || []
                    handleUpdateCurrent('gallery', [...currentG, "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80"])
                  }}
                  className="px-3 py-1 rounded bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus size={13} className="text-[#C5963A]" /> Add Gallery Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentProgram.gallery || []).map((gUrl, gIdx) => (
                  <div key={gIdx} className="p-3 rounded border border-[#C5963A]/20 bg-[#FAF3E4]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#765334]">Image #{gIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedG = (currentProgram.gallery || []).filter((_, i) => i !== gIdx)
                          handleUpdateCurrent('gallery', updatedG)
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <ImageUploader
                      value={gUrl}
                      onChange={newUrl => {
                        const updatedG = [...(currentProgram.gallery || [])]
                        updatedG[gIdx] = newUrl
                        handleUpdateCurrent('gallery', updatedG)
                      }}
                      label={`Gallery Image #${gIdx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  )
}
