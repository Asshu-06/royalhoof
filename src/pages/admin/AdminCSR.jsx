import { useState, useEffect, useRef } from "react"
import { Save, Loader2, RefreshCw, Upload, X, Heart, GraduationCap, Accessibility, Trees, Users2, Sparkles } from "lucide-react"
import { getSetting, setSetting } from "../../services/settingsService"
import { supabase } from "../../lib/supabase"
import toast from "react-hot-toast"

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(8,43,73,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"
const ACCENT_LIGHT = "#D2AA55"

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
      img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
      bullets: [
        "Ensuring the highest standards of horse health and well-being.",
        "Regular veterinary care and nutrition programs.",
        "Promoting responsible horse ownership and welfare awareness.",
        "Supporting rescue and rehabilitation initiatives where possible."
      ]
    },
    {
      id: "education",
      title: "Education & Youth Development",
      subtitle: "Empowering the next generation through equestrian learning.",
      img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      bullets: [
        "Free horse riding awareness programs for schools.",
        "Scholarships and discounted training for deserving students.",
        "Leadership and confidence-building programs through horsemanship.",
        "Educational visits and equestrian exposure programs."
      ]
    },
    {
      id: "inclusive",
      title: "Inclusive Riding Programs",
      subtitle: "Unlocking courage and freedom for differently-abled individuals.",
      img: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80",
      bullets: [
        "Encouraging participation from differently-abled individuals.",
        "Organizing special riding sessions to promote confidence and well-being.",
        "Supporting therapeutic and recreational riding initiatives."
      ]
    },
    {
      id: "sustainability",
      title: "Environmental Sustainability",
      subtitle: "Protecting ecosystems and fostering eco-friendly equine management.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      bullets: [
        "Tree plantation drives within and around our facility.",
        "Responsible water management practices.",
        "Eco-friendly stable maintenance and waste management.",
        "Creating awareness about environmental conservation."
      ]
    },
    {
      id: "community",
      title: "Community Engagement",
      subtitle: "Building strong bonds with local youth, schools, and social causes.",
      img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      bullets: [
        "Hosting community outreach events and awareness campaigns.",
        "Supporting local schools, youth groups, and social organizations.",
        "Organizing charity rides and fundraising events for social causes.",
        "Providing opportunities for volunteering and skill development."
      ]
    }
  ]
}

const inputStyle = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid rgba(8,43,73,0.15)",
  borderRadius: 6,
  padding: "10px 14px",
  color: TEXT_PRIMARY,
  fontSize: "0.875rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  boxSizing: "border-box",
}

const labelStyle = {
  display: "block",
  color: TEXT_SECONDARY,
  fontSize: "0.75rem",
  letterSpacing: "0.02em",
  fontWeight: 600,
  marginBottom: 6,
  fontFamily: "'Inter', sans-serif",
}

export default function AdminCSR() {
  const [data, setData] = useState(DEFAULT_CSR)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState(null)

  const fileInputRefs = useRef([])

  useEffect(() => {
    getSetting("csr_section_en")
      .then(val => {
        if (val) {
          try {
            const parsed = JSON.parse(val)
            setData({ ...DEFAULT_CSR, ...parsed })
          } catch (e) {}
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleFocusChange = (idx, field, val) => {
    const updated = [...data.focusAreas]
    updated[idx] = { ...updated[idx], [field]: val }
    setData(prev => ({ ...prev, focusAreas: updated }))
  }

  const handleBulletChange = (areaIdx, bulletIdx, val) => {
    const updatedAreas = [...data.focusAreas]
    const updatedBullets = [...updatedAreas[areaIdx].bullets]
    updatedBullets[bulletIdx] = val
    updatedAreas[areaIdx].bullets = updatedBullets
    setData(prev => ({ ...prev, focusAreas: updatedAreas }))
  }

  const handleImageUpload = async (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return }

    setUploadingIdx(idx)
    try {
      const ext = file.name.split(".").pop()
      const fileName = `csr_${Date.now()}_${idx}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`csr/${fileName}`, file, { cacheControl: "3600", upsert: true, contentType: file.type })
      
      if (uploadError) throw uploadError
      
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(`csr/${fileName}`)
      handleFocusChange(idx, "img", urlData.publicUrl)
      toast.success("Image uploaded successfully!")
    } catch (err) {
      toast.error(err.message || "Image upload failed")
    } finally {
      setUploadingIdx(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setSetting("csr_section_en", JSON.stringify(data))
      toast.success("CSR section saved! Live on website.")
    } catch (err) {
      toast.error(err.message || "Failed to save CSR section")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setData(DEFAULT_CSR)
    toast.success("Reset to defaults. Click Save to apply.")
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>
            Corporate Social Responsibility (CSR) Section
          </h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            Edit CSR focus areas, bullet points, commitment statement, and upload images from local storage or URL.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleReset}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, 
              background: "transparent", color: "#D8C5A0", 
              border: `1px solid rgba(216,199,174,0.3)`, borderRadius: 6, 
              padding: "10px 18px", cursor: "pointer", fontSize: "0.875rem", 
              fontFamily: "'Inter', sans-serif" 
            }}>
            <RefreshCw size={15} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ 
              display: "flex", alignItems: "center", gap: 8, 
              background: saving ? "rgba(197,150,58,0.5)" : ACCENT, color: "#082B49", 
              border: "none", borderRadius: 6, padding: "10px 24px", 
              cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, 
              fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" 
            }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Grid: Form + Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="csr-grid">
        
        {/* LEFT: Form */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Section 1: Overview Text */}
          <div>
            <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 14 }}>
              Hero & Overview Content
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Hero Headline Title</label>
                <input value={data.heroTitle || ""} onChange={e => setData(d => ({ ...d, heroTitle: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Overview Paragraph 1</label>
                <textarea rows={3} value={data.overview1 || ""} onChange={e => setData(d => ({ ...d, overview1: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Overview Paragraph 2</label>
                <textarea rows={2} value={data.overview2 || ""} onChange={e => setData(d => ({ ...d, overview2: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Our Commitment Statement</label>
                <textarea rows={3} value={data.commitmentText || ""} onChange={e => setData(d => ({ ...d, commitmentText: e.target.value }))} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Section 2: 5 Focus Areas with Image Upload & URL */}
          <div style={{ borderTop: `1px solid ${CARD_BORDER}`, paddingTop: 20 }}>
            <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
              CSR Focus Areas & Images ({data.focusAreas.length})
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {data.focusAreas.map((area, idx) => (
                <div key={area.id || idx} style={{ background: "#FFFFFF", border: "1px solid rgba(8,43,73,0.15)", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: ACCENT, fontFamily: "'Inter', sans-serif" }}>
                      Pillar #{idx + 1}: {area.title}
                    </span>
                  </div>

                  <div>
                    <label style={labelStyle}>Pillar Title</label>
                    <input value={area.title} onChange={e => handleFocusChange(idx, "title", e.target.value)} style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Pillar Subtitle / Tagline</label>
                    <input value={area.subtitle} onChange={e => handleFocusChange(idx, "subtitle", e.target.value)} style={inputStyle} />
                  </div>

                  {/* Image Upload from Local Storage or URL */}
                  <div>
                    <label style={labelStyle}>Focus Area Image</label>
                    {area.img ? (
                      <div style={{ position: "relative", marginBottom: 10 }}>
                        <img src={area.img} alt={area.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, border: `1px solid ${CARD_BORDER}` }} />
                        <button
                          onClick={() => handleFocusChange(idx, "img", "")}
                          style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        style={{ border: `2px dashed rgba(8,43,73,0.2)`, borderRadius: 6, padding: "16px", textAlign: "center", cursor: "pointer", marginBottom: 8, background: "rgba(8,43,73,0.02)" }}
                      >
                        {uploadingIdx === idx ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <Loader2 size={16} className="animate-spin" style={{ color: ACCENT }} />
                            <span style={{ color: TEXT_MUTED, fontSize: "0.8125rem" }}>Uploading from device...</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={20} style={{ color: TEXT_MUTED, margin: "0 auto 4px" }} />
                            <p style={{ color: TEXT_SECONDARY, fontSize: "0.8125rem", fontWeight: 600 }}>Click to upload image from local storage</p>
                            <p style={{ color: TEXT_MUTED, fontSize: "0.75rem", marginTop: 2 }}>JPG, PNG, WEBP — max 10MB</p>
                          </>
                        )}
                      </div>
                    )}

                    <input 
                      ref={el => fileInputRefs.current[idx] = el}
                      type="file" 
                      accept="image/*" 
                      style={{ display: "none" }} 
                      onChange={e => handleImageUpload(idx, e)} 
                    />

                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.6875rem", marginTop: 4 }}>Or paste image URL directly</label>
                      <input 
                        value={area.img || ""} 
                        onChange={e => handleFocusChange(idx, "img", e.target.value)} 
                        style={inputStyle} 
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div>
                    <label style={labelStyle}>Bullet Points ({area.bullets.length})</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {area.bullets.map((bText, bIdx) => (
                        <div key={bIdx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700 }}>•</span>
                          <input 
                            value={bText} 
                            onChange={e => handleBulletChange(idx, bIdx, e.target.value)} 
                            style={inputStyle} 
                            placeholder={`Bullet #${bIdx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, position: "sticky", top: 80, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            Live Preview
          </p>

          <div style={{ background: "#041424", borderRadius: 8, padding: 16, border: "1px solid rgba(197,150,58,0.3)", color: "#F5EBD8", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid rgba(197,150,58,0.2)", paddingBottom: 12 }}>
              <span style={{ fontSize: "0.625rem", letterSpacing: "0.2em", color: ACCENT, textTransform: "uppercase" }}>CSR INITIATIVES</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#F5EBD8", marginTop: 4 }}>
                {data.heroTitle || "Making a Difference Beyond Horse Riding"}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {data.focusAreas.map((fa, i) => (
                <div key={i} style={{ background: "#061D33", borderRadius: 6, border: "1px solid rgba(197,150,58,0.25)", overflow: "hidden" }}>
                  {fa.img && (
                    <img src={fa.img} alt={fa.title} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                  )}
                  <div style={{ padding: 12 }}>
                    <h4 style={{ color: "#F5EBD8", fontSize: "0.875rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                      {fa.title}
                    </h4>
                    <p style={{ color: "#D8C5A0", fontSize: "0.6875rem", marginTop: 2, fontStyle: "italic" }}>
                      {fa.subtitle}
                    </p>
                    <ul style={{ marginTop: 6, paddingLeft: 12, fontSize: "0.6875rem", color: "#D8C5A0" }}>
                      {fa.bullets.map((b, bi) => (
                        <li key={bi}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .csr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
