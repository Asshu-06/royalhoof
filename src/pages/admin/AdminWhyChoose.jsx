import { useState, useEffect } from "react"
import { Save, Loader2, RefreshCw, Award, Shield, CheckCircle, Users, Heart, Star, Target, Trophy, Compass, Sparkles, Clock, MapPin, Plus, Trash2 } from "lucide-react"
import { getSetting, setSetting } from "../../services/settingsService"
import toast from "react-hot-toast"

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(8,43,73,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"
const ACCENT_LIGHT = "#D2AA55"

// Available badge/icon options for equestrian & riding features
export const DEFAULT_ICONS = [
  { name: "Award", label: "Award & Certification", icon: <Award size={20} /> },
  { name: "Shield", label: "Safety & Protection", icon: <Shield size={20} /> },
  { name: "CheckCircle", label: "Quality Verified", icon: <CheckCircle size={20} /> },
  { name: "Users", label: "Family & Community", icon: <Users size={20} /> },
  { name: "Heart", label: "Horse & Rider Care", icon: <Heart size={20} /> },
  { name: "Star", label: "Excellence & VIP", icon: <Star size={20} /> },
  { name: "Target", label: "Personalized Focus", icon: <Target size={20} /> },
  { name: "Trophy", label: "Skills & Competition", icon: <Trophy size={20} /> },
  { name: "Compass", label: "Structured Guidance", icon: <Compass size={20} /> },
  { name: "Sparkles", label: "Confidence Building", icon: <Sparkles size={20} /> },
  { name: "Clock", label: "Flexible Timing", icon: <Clock size={20} /> },
  { name: "MapPin", label: "Facility Arena", icon: <MapPin size={20} /> },
]

export const ICON_MAP = {
  Award: <Award size={22} />,
  Shield: <Shield size={22} />,
  CheckCircle: <CheckCircle size={22} />,
  Users: <Users size={22} />,
  Heart: <Heart size={22} />,
  Star: <Star size={22} />,
  Target: <Target size={22} />,
  Trophy: <Trophy size={22} />,
  Compass: <Compass size={22} />,
  Sparkles: <Sparkles size={22} />,
  Clock: <Clock size={22} />,
  MapPin: <MapPin size={22} />,
}

const DEFAULT_SETTINGS = {
  eyebrow: "Premium Service",
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

export default function AdminWhyChoose() {
  const [data, setData] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSetting("why_choose_us_en")
      .then(val => {
        if (val) {
          try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val
            if (parsed && typeof parsed === 'object') {
              setData({ ...DEFAULT_SETTINGS, ...parsed })
            }
          } catch (e) {
            // fallback
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleFeatureChange = (index, field, value) => {
    const updated = [...data.features]
    updated[index] = { ...updated[index], [field]: value }
    setData(prev => ({ ...prev, features: updated }))
  }

  const handleAddFeature = () => {
    if (data.features.length >= 8) {
      toast.error("Maximum 8 features allowed")
      return
    }
    setData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { title: "New Feature", desc: "Short description of this feature.", icon: "CheckCircle" }
      ]
    }))
  }

  const handleRemoveFeature = (index) => {
    if (data.features.length <= 1) {
      toast.error("At least 1 feature is required")
      return
    }
    const updated = data.features.filter((_, i) => i !== index)
    setData(prev => ({ ...prev, features: updated }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setSetting("why_choose_us_en", JSON.stringify(data))
      toast.success("Why Choose Us section saved! Live on website.")
    } catch (err) {
      toast.error(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setData(DEFAULT_SETTINGS)
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
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>
            Why Choose Royal Hoof Section
          </h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            Manage section title, feature bullets, and select custom equestrian badges/icons.
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

      {/* Grid: Edit Form + Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="why-grid">
        
        {/* Left: Form */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 14 }}>
              Section Header
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Section Tagline / Eyebrow</label>
                <input value={data.eyebrow || ""} onChange={e => setData(d => ({ ...d, eyebrow: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Section Main Title</label>
                <input value={data.title || ""} onChange={e => setData(d => ({ ...d, title: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Section Subtitle / Description</label>
                <textarea rows={2} value={data.subtitle || ""} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${CARD_BORDER}`, paddingTop: 18 }}>
            <div style={{ display: "flex", itemsCenter: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                Feature Cards & Badges ({data.features.length})
              </p>
              <button 
                onClick={handleAddFeature}
                style={{ 
                  display: "flex", alignItems: "center", gap: 4, 
                  background: "rgba(197,150,58,0.15)", color: "#082B49", 
                  border: `1px solid ${ACCENT}`, borderRadius: 4, 
                  padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" 
                }}>
                <Plus size={14} /> Add Feature
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {data.features.map((feat, idx) => (
                <div key={idx} style={{ background: "#FFFFFF", border: "1px solid rgba(8,43,73,0.15)", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: ACCENT, fontFamily: "'Inter', sans-serif" }}>
                      Feature #{idx + 1}
                    </span>
                    <button 
                      onClick={() => handleRemoveFeature(idx)}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label style={labelStyle}>Feature Title</label>
                    <input 
                      value={feat.title} 
                      onChange={e => handleFeatureChange(idx, "title", e.target.value)} 
                      style={inputStyle} 
                      placeholder="e.g. Professional and certified trainers"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Subtitle / Details (Optional)</label>
                    <input 
                      value={feat.desc || ""} 
                      onChange={e => handleFeatureChange(idx, "desc", e.target.value)} 
                      style={inputStyle} 
                      placeholder="e.g. Certified instructors dedicated to rider progress."
                    />
                  </div>

                  {/* Badge / Icon Selector */}
                  <div>
                    <label style={labelStyle}>Choose Badge / Icon</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginTop: 6 }}>
                      {DEFAULT_ICONS.map(item => {
                        const selected = feat.icon === item.name
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => handleFeatureChange(idx, "icon", item.name)}
                            title={item.label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px",
                              borderRadius: 6,
                              border: selected ? `2px solid ${ACCENT}` : "1px solid rgba(8,43,73,0.15)",
                              background: selected ? "rgba(197,150,58,0.2)" : "#FFFFFF",
                              color: selected ? ACCENT : TEXT_MUTED,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {item.icon}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, position: "sticky", top: 80 }}>
          <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            Live Section Preview
          </p>

          <div style={{ background: "#F4E9D2", borderRadius: 8, padding: 20, border: "1px solid rgba(8,43,73,0.1)" }}>
            <p style={{ textAlign: "center", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>
              {data.eyebrow || "Premium Service"}
            </p>
            <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.375rem", fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 12 }}>
              {data.title || "Why Choose Royal Hoof?"}
            </h2>

            {/* Grid preview of features */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              {data.features.map((feat, i) => (
                <div key={i} style={{ background: "#FAF3E4", border: "1px solid rgba(197,150,58,0.3)", borderRadius: 6, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#082B49", color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {ICON_MAP[feat.icon] || <CheckCircle size={16} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#082B49", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>
                      ✔ {feat.title}
                    </span>
                  </div>
                  {feat.desc && (
                    <p style={{ fontSize: "0.6875rem", color: TEXT_SECONDARY, fontFamily: "'Inter', sans-serif", paddingLeft: 36 }}>
                      {feat.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
