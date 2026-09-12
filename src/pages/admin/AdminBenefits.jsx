import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Loader2, RefreshCw, Upload, Trash2, Plus, Edit2, Activity, Heart, Target, Users, Sparkles, Image, CheckCircle, ChevronDown, ChevronUp, Check } from "lucide-react"
import { getSetting, setSetting } from "../../services/settingsService"
import { supabase } from "../../lib/supabase"
import { DEFAULT_BENEFITS } from "../../data/defaultBenefits"
import toast from "react-hot-toast"

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(8,43,73,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const ACCENT = "#C5963A"

const inp = "w-full bg-[#FAF3E4] border border-[rgba(8,43,73,0.15)] rounded-lg px-3 py-2 text-sm text-[#292725] placeholder-[#765334]/50 focus:outline-none focus:border-[#082B49]"
const lbl = "text-xs text-[#765334] mb-1 block font-medium"

const BENEFIT_ICON_OPTIONS = [
  { id: "Activity", label: "Activity / Physical" },
  { id: "Heart", label: "Heart / Mental" },
  { id: "Target", label: "Target / Growth" },
  { id: "Users", label: "Users / Social" },
  { id: "Sparkles", label: "Sparkles / Children" }
]

const BENEFIT_ICON_MAP = {
  Activity,
  Heart,
  Target,
  Users,
  Sparkles
}

function BenefitIconPicker({ value, onChange }) {
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

  const selectedOption = BENEFIT_ICON_OPTIONS.find(opt => opt.id === value) || BENEFIT_ICON_OPTIONS[0]
  const SelectedIcon = BENEFIT_ICON_MAP[selectedOption.id] || Activity

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-[#082B49]/20 bg-[#082B49] text-[#F5EBD8] hover:bg-[#0B304D] transition-all shadow-sm text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-[#C5963A]/20 text-[#C5963A] border border-[#C5963A]/40 flex items-center justify-center flex-shrink-0">
            <SelectedIcon size={16} />
          </div>
          <span className="text-xs font-bold text-[#F5EBD8] truncate font-serif">
            {selectedOption.label}
          </span>
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
            className="absolute left-0 right-0 z-50 mt-1.5 p-2 rounded-xl bg-[#082B49] border-2 border-[#C5963A] shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto">
              {BENEFIT_ICON_OPTIONS.map(opt => {
                const IconComp = BENEFIT_ICON_MAP[opt.id] || Activity
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
                        ? "border-[#C5963A] bg-[#C5963A]/25 text-[#F5EBD8] font-bold shadow-sm"
                        : "border-white/10 bg-white/5 text-[#D2AA55] hover:bg-white/15 hover:border-[#C5963A]/50"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#C5963A] text-[#082B49]" : "bg-[#C5963A]/20 text-[#C5963A]"
                    }`}>
                      <IconComp size={14} />
                    </div>
                    <span className="text-xs font-serif truncate leading-tight text-[#F5EBD8] flex-1">
                      {opt.label}
                    </span>
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

export default function AdminBenefits() {
  const [data, setData] = useState(DEFAULT_BENEFITS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0)
  const [uploadingState, setUploadingState] = useState(null)

  useEffect(() => {
    getSetting("benefits_content")
      .then(val => {
        if (val) {
          try {
            const parsed = JSON.parse(val)
            if (parsed && Array.isArray(parsed.categories)) {
              setData(parsed)
            }
          } catch (e) {}
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setSetting("benefits_content", JSON.stringify(data))
      toast.success("Benefits section saved! Live on website.")
    } catch (err) {
      toast.error(err.message || "Failed to save Benefits section")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setData(DEFAULT_BENEFITS)
    toast.success("Reset to defaults. Click Save to apply.")
  }

  // Upload helper for local file storage -> Supabase public bucket
  const uploadImageFile = async (file, pathPrefix) => {
    if (!file) return null
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return null
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB")
      return null
    }

    try {
      const ext = file.name.split(".").pop()
      const fileName = `${pathPrefix}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`benefits/${fileName}`, file, { cacheControl: "3600", upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(`benefits/${fileName}`)
      return urlData.publicUrl
    } catch (err) {
      toast.error(err.message || "Image upload failed")
      return null
    }
  }

  // Handle Category Watermark Image Upload
  const handleCategoryBgUpload = async (catIdx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingState(`cat_bg_${catIdx}`)
    const url = await uploadImageFile(file, `cat_bg_${catIdx}`)
    if (url) {
      const updatedCats = [...data.categories]
      updatedCats[catIdx].bgImage = url
      setData(prev => ({ ...prev, categories: updatedCats }))
      toast.success("Category watermark image updated!")
    }
    setUploadingState(null)
  }

  // Handle Benefit Item Image Upload
  const handleItemImageUpload = async (catIdx, itemIdx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingState(`item_img_${catIdx}_${itemIdx}`)
    const url = await uploadImageFile(file, `item_${catIdx}_${itemIdx}`)
    if (url) {
      const updatedCats = [...data.categories]
      updatedCats[catIdx].items[itemIdx].image = url
      setData(prev => ({ ...prev, categories: updatedCats }))
      toast.success("Benefit item photo updated!")
    }
    setUploadingState(null)
  }

  // Update Category fields
  const handleCategoryChange = (catIdx, field, val) => {
    const updatedCats = [...data.categories]
    updatedCats[catIdx] = { ...updatedCats[catIdx], [field]: val }
    setData(prev => ({ ...prev, categories: updatedCats }))
  }

  // Add Item to Category
  const handleAddItem = (catIdx) => {
    const updatedCats = [...data.categories]
    const currentItems = updatedCats[catIdx].items || []
    const newItem = {
      num: String(currentItems.length + 1),
      title: "New Benefit Item",
      topicTag: "BENEFIT",
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80",
      desc: "Describe the specific physical, mental, or skill benefit here."
    }
    updatedCats[catIdx].items = [...currentItems, newItem]
    setData(prev => ({ ...prev, categories: updatedCats }))
    toast.success("New benefit item added!")
  }

  // Remove Item from Category
  const handleRemoveItem = (catIdx, itemIdx) => {
    const updatedCats = [...data.categories]
    updatedCats[catIdx].items = updatedCats[catIdx].items.filter((_, i) => i !== itemIdx)
    // Re-number
    updatedCats[catIdx].items = updatedCats[catIdx].items.map((it, idx) => ({ ...it, num: String(idx + 1) }))
    setData(prev => ({ ...prev, categories: updatedCats }))
    toast.success("Benefit item removed.")
  }

  // Update Item fields
  const handleItemChange = (catIdx, itemIdx, field, val) => {
    const updatedCats = [...data.categories]
    updatedCats[catIdx].items[itemIdx] = { ...updatedCats[catIdx].items[itemIdx], [field]: val }
    setData(prev => ({ ...prev, categories: updatedCats }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 size={28} className="animate-spin text-[#C5963A]" />
      </div>
    )
  }

  const currentCat = data.categories[activeCategoryIdx] || data.categories[0]

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Benefits of Horse Riding Section
          </h1>
          <p className="text-[#D8C5A0] text-sm mt-1">
            Customize header badge, titles, categories, images (file upload & URL), and benefit cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#C5963A]/40 text-[#F5EBD8] bg-[#082B49] rounded-lg text-sm hover:bg-[#0B304D] transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} /> Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#C5963A] text-[#082B49] font-bold rounded-lg text-sm hover:bg-[#D2AA55] transition-all disabled:opacity-50 shadow-md"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </div>

      {/* Main Section Header Settings */}
      <div className="bg-[#FAF3E4] border border-[rgba(8,43,73,0.15)] rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-[#082B49]" style={{ fontFamily: "Georgia, serif" }}>
          Section Header Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Top Pill Badge</label>
            <input
              value={data.badge || ""}
              onChange={e => setData(prev => ({ ...prev, badge: e.target.value }))}
              className={inp}
              placeholder="RIDING FOR A BETTER TOMORROW"
            />
          </div>

          <div>
            <label className={lbl}>Section Title</label>
            <input
              value={data.title || ""}
              onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
              className={inp}
              placeholder="Benefits of Horse Riding"
            />
          </div>
        </div>

        <div>
          <label className={lbl}>Introductory Paragraph</label>
          <textarea
            rows={2}
            value={data.introText || ""}
            onChange={e => setData(prev => ({ ...prev, introText: e.target.value }))}
            className={`${inp} resize-none`}
            placeholder="At Royal Hoof Horse Riding Academy & Club, every ride promotes physical, mental, and emotional well-being..."
          />
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F5EBD8]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Categories & Benefit Cards
          </h2>
          <span className="text-xs text-[#D8C5A0]">
            Select a category tab below to edit its content & images
          </span>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[rgba(8,43,73,0.15)] pb-3">
          {data.categories.map((cat, idx) => (
            <button
              key={cat.id || idx}
              onClick={() => setActiveCategoryIdx(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategoryIdx === idx
                  ? "bg-[#082B49] text-[#C5963A] shadow-sm"
                  : "bg-[#FAF3E4] text-[#765334] border border-[rgba(8,43,73,0.15)] hover:bg-[#F4E9D2]"
              }`}
            >
              {cat.label || `Category ${idx + 1}`} ({cat.items?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Category Settings */}
      {currentCat && (
        <div className="bg-[#FAF3E4] border border-[rgba(8,43,73,0.15)] rounded-xl p-5 space-y-6">
          <div className="border-b border-[rgba(8,43,73,0.12)] pb-4">
            <h3 className="text-base font-bold text-[#082B49] mb-3">
              Category #{activeCategoryIdx + 1}: {currentCat.label}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Category Tab Label</label>
                <input
                  value={currentCat.label || ""}
                  onChange={e => handleCategoryChange(activeCategoryIdx, "label", e.target.value)}
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Category Badge Tag</label>
                <input
                  value={currentCat.badge || ""}
                  onChange={e => handleCategoryChange(activeCategoryIdx, "badge", e.target.value)}
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Category Icon</label>
                <BenefitIconPicker
                  value={currentCat.iconName || "Activity"}
                  onChange={newIcon => handleCategoryChange(activeCategoryIdx, "iconName", newIcon)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={lbl}>Category Summary Overview</label>
              <input
                value={currentCat.summary || ""}
                onChange={e => handleCategoryChange(activeCategoryIdx, "summary", e.target.value)}
                className={inp}
              />
            </div>

            {/* Category Watermark Background */}
            <div className="mt-4 p-3 bg-[#F4E9D2] rounded-lg border border-[rgba(8,43,73,0.12)] space-y-2">
              <label className={lbl}>Watermark Background Horse Photo (URL or File Upload)</label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={currentCat.bgImage || ""}
                  onChange={e => handleCategoryChange(activeCategoryIdx, "bgImage", e.target.value)}
                  className={`${inp} flex-1 min-w-[200px]`}
                  placeholder="https://images.unsplash.com/..."
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-[#082B49] text-white text-xs rounded-lg cursor-pointer hover:bg-[#0B304D] transition-all">
                  <Upload size={13} />
                  <span>{uploadingState === `cat_bg_${activeCategoryIdx}` ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleCategoryBgUpload(activeCategoryIdx, e)}
                    disabled={uploadingState !== null}
                  />
                </label>
              </div>
              {currentCat.bgImage && (
                <div className="w-24 h-14 rounded overflow-hidden border border-[#082B49]/20 mt-1">
                  <img src={currentCat.bgImage} alt="Watermark preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>

          {/* Benefit Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#082B49] uppercase tracking-wider">
                Benefit Cards in {currentCat.label} ({currentCat.items?.length || 0})
              </h4>
              <button
                onClick={() => handleAddItem(activeCategoryIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#082B49] text-white rounded-lg text-xs font-semibold hover:bg-[#0B304D] transition-all"
              >
                <Plus size={14} /> Add Benefit Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCat.items?.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="bg-[#F4E9D2] border border-[rgba(8,43,73,0.15)] rounded-xl p-4 space-y-3 relative shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-[rgba(8,43,73,0.1)] pb-2">
                    <span className="text-xs font-bold text-[#C5963A] bg-[#082B49] px-2 py-0.5 rounded">
                      Card #{itemIdx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(activeCategoryIdx, itemIdx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                      title="Remove Benefit Card"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <label className={lbl}>Card Title</label>
                    <input
                      value={item.title || ""}
                      onChange={e => handleItemChange(activeCategoryIdx, itemIdx, "title", e.target.value)}
                      className={inp}
                      placeholder="e.g. Improves Core Strength"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={lbl}>Topic Tag</label>
                      <input
                        value={item.topicTag || ""}
                        onChange={e => handleItemChange(activeCategoryIdx, itemIdx, "topicTag", e.target.value)}
                        className={inp}
                        placeholder="e.g. CORE & POSTURE"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Number Badge</label>
                      <input
                        value={item.num || ""}
                        onChange={e => handleItemChange(activeCategoryIdx, itemIdx, "num", e.target.value)}
                        className={inp}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Benefit Description</label>
                    <textarea
                      rows={2}
                      value={item.desc || ""}
                      onChange={e => handleItemChange(activeCategoryIdx, itemIdx, "desc", e.target.value)}
                      className={`${inp} resize-none`}
                      placeholder="Detailed explanation of this benefit..."
                    />
                  </div>

                  {/* Card Image Input (Local File or URL) */}
                  <div className="space-y-1.5">
                    <label className={lbl}>Card Photo (URL or File Upload)</label>
                    <div className="flex items-center gap-2">
                      <input
                        value={item.image || ""}
                        onChange={e => handleItemChange(activeCategoryIdx, itemIdx, "image", e.target.value)}
                        className={`${inp} text-xs`}
                        placeholder="https://..."
                      />
                      <label className="flex items-center gap-1 px-2.5 py-2 bg-[#082B49] text-white text-xs rounded-lg cursor-pointer hover:bg-[#0B304D] transition-all shrink-0">
                        <Upload size={12} />
                        <span>{uploadingState === `item_img_${activeCategoryIdx}_${itemIdx}` ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleItemImageUpload(activeCategoryIdx, itemIdx, e)}
                          disabled={uploadingState !== null}
                        />
                      </label>
                    </div>
                    {item.image && (
                      <div className="w-full h-20 rounded-lg overflow-hidden border border-[#082B49]/15 mt-1">
                        <img src={item.image} alt="Benefit Preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="bg-[#082B49] rounded-xl p-5 border border-[#C5963A]/40 text-[#F5EBD8]">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#C5963A] mb-3 flex items-center gap-2">
          <span>✦</span> Live Preview: {currentCat?.label}
        </h3>

        <div className="bg-[#FAF3E4] text-[#292725] rounded-xl p-6 space-y-4 max-h-[450px] overflow-y-auto">
          <div className="border-b border-[#C5963A]/30 pb-3">
            <h4 className="text-2xl font-bold text-[#082B49]" style={{ fontFamily: "Georgia, serif" }}>
              {currentCat?.label}
            </h4>
            <p className="text-xs text-[#765334] mt-1">{currentCat?.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentCat?.items?.map((it, idx) => (
              <div key={idx} className="bg-white border border-[#C5963A]/30 rounded-lg p-3 space-y-2 shadow-sm">
                {it.image && (
                  <div className="h-24 rounded overflow-hidden">
                    <img src={it.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-bold uppercase bg-[#C5963A]/20 text-[#C5963A] px-2 py-0.5 rounded">
                    {it.topicTag}
                  </span>
                  <span className="text-xs font-bold text-[#082B49]">#{it.num}</span>
                </div>
                <p className="text-xs font-bold text-[#082B49]">{it.title}</p>
                <p className="text-[0.75rem] text-[#5A4430] leading-snug">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
