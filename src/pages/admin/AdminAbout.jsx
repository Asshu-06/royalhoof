import { useState, useEffect, useRef } from "react"
import { Save, Loader2, RefreshCw, Upload, X, Plus, Trash2, Users, Layers, User, Award } from "lucide-react"
import { getSetting, setSetting } from "../../services/settingsService"
import { supabase } from "../../lib/supabase"
import ImageUploader from "../../components/admin/ImageUploader"
import toast from "react-hot-toast"

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(12, 13, 17,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"
const ACCENT_LIGHT = "#D2AA55"

const DEFAULT = {
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

const DEFAULT_TEAM = [
  {
    id: "team-1",
    name: "Capt. Vikramaditya Singh",
    role: "Founder & Chief Equestrian Instructor",
    experience: "18+ Yrs Exp.",
    specialty: "Dressage & Show Jumping",
    bio: "Former National Medalist and Master Trainer with over 18 years of military & civil equestrian experience. Passionate about building elite riding technique with strict safety standards.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "team-2",
    name: "Elena Rostova",
    role: "Senior Equine Coach & Youth Specialist",
    experience: "12+ Yrs Exp.",
    specialty: "Junior Rider Development",
    bio: "Specializes in youth riding foundation, rider balance, and confidence building. Has trained over 400+ junior riders from beginners to regional competition level.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "team-3",
    name: "Dr. Rajesh K. Varma",
    role: "Chief Veterinary & Care Director",
    experience: "15+ Yrs Exp.",
    specialty: "Equine Health & Welfare",
    bio: "Oversees horse nutrition, health care, temperament testing, and stable hygiene. Ensures all Royal Hoof horses remain in peak athletic condition and gentle spirit.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "team-4",
    name: "Ananya Sundaram",
    role: "Head of Operations & Academy Experience",
    experience: "8+ Yrs Exp.",
    specialty: "Member Experience & Events",
    bio: "Manages student onboarding, custom scheduling, safety orientation, and club event organization for an extraordinary academy journey at Giri Farms.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80"
  }
]

const inputStyle = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid rgba(12, 13, 17,0.15)",
  borderRadius: 6,
  padding: "10px 14px",
  color: TEXT_PRIMARY,
  fontSize: "0.875rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  resize: "vertical",
  transition: "border-color 0.2s, box-shadow 0.2s"
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

export default function AdminAbout() {
  const [data, setData] = useState(DEFAULT)
  const [imageUrl, setImageUrl] = useState("")
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM)
  const [activeTab, setActiveTab] = useState("content") // "content" | "team"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    Promise.all([
      getSetting("about_section_en").catch(() => null),
      getSetting("about_image_url").catch(() => null),
      getSetting("about_team").catch(() => null),
    ]).then(([content, img, team]) => {
      if (content) { try { setData({ ...DEFAULT, ...JSON.parse(content) }) } catch {} }
      if (img) setImageUrl(img)
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
      setLoading(false)
    })
  }, [])

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return }

    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const fileName = `about_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`about/${fileName}`, file, { cacheControl: "3600", upsert: true, contentType: file.type })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(`about/${fileName}`)
      setImageUrl(urlData.publicUrl)
      toast.success("Image uploaded!")
    } catch (err) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await Promise.all([
        setSetting("about_section_en", JSON.stringify(data)),
        setSetting("about_image_url", imageUrl),
        setSetting("about_team", JSON.stringify(teamMembers)),
      ])
      toast.success("About Us section & Team members saved! Changes are live on the website.")
    } catch (err) {
      toast.error(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm("Reset About section & Our Team to defaults?")) {
      setData(DEFAULT)
      setImageUrl("")
      setTeamMembers(DEFAULT_TEAM)
      toast.success("Reset to defaults - click Save to apply")
    }
  }

  const handleAddTeamMember = () => {
    const newMember = {
      id: `team-${Date.now()}`,
      name: "New Team Member",
      role: "Equestrian Riding Coach",
      experience: "5+ Yrs Exp.",
      specialty: "Horse Riding Instructor",
      bio: "Certified equestrian instructor dedicated to building student confidence and proper riding form.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    }
    setTeamMembers(prev => [...prev, newMember])
    toast.success("New team member added!")
  }

  const handleUpdateTeamMember = (id, field, value) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleDeleteTeamMember = (id) => {
    if (teamMembers.length <= 1) {
      toast.error("At least one team member must remain.")
      return
    }
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(prev => prev.filter(m => m.id !== id))
      toast.success("Team member removed.")
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    )
  }

  const fields = [
    { key: "title", label: "Academy Name / Title", rows: 1 },
    { key: "subtitle", label: "Subtitle / Tagline", rows: 1 },
    { key: "p1", label: "Paragraph 1", rows: 3 },
    { key: "p2", label: "Paragraph 2", rows: 3 },
    { key: "p3", label: "Paragraph 3", rows: 3 },
    { key: "p4", label: "Paragraph 4", rows: 2 },
    { key: "p5", label: "Paragraph 5", rows: 2 },
    { key: "p6", label: "Paragraph 6", rows: 2 },
  ]

  const stats = [
    { v: "years", l: "yearsLabel", labelText: "Stat 1 Value & Label" },
    { v: "authentic", l: "authenticLabel", labelText: "Stat 2 Value & Label" },
    { v: "customers", l: "customersLabel", labelText: "Stat 3 Value & Label" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>
            About Us & Our Team Management
          </h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            Edit About section text, banner image, and manage team members with photo uploads.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleReset}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 6, 
              background: "transparent", 
              color: "#D8C5A0", 
              border: `1px solid rgba(216,199,174,0.3)`, 
              borderRadius: 6, 
              padding: "10px 18px", 
              cursor: "pointer", 
              fontSize: "0.875rem", 
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(216,199,174,0.1)"
              e.currentTarget.style.borderColor = "#D8C5A0"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "rgba(216,199,174,0.3)"
            }}
          >
            <RefreshCw size={15} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              background: saving ? "rgba(197,150,58,0.5)" : ACCENT, 
              color: "#0C0D11", 
              border: "none", 
              borderRadius: 6, 
              padding: "10px 24px", 
              cursor: saving ? "not-allowed" : "pointer", 
              fontWeight: 600, 
              fontSize: "0.875rem", 
              fontFamily: "'Inter', sans-serif",
              boxShadow: saving ? "none" : "0 2px 8px rgba(197,150,58,0.25)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              if (!saving) {
                e.currentTarget.style.background = ACCENT_LIGHT
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(197,150,58,0.35)"
              }
            }}
            onMouseLeave={e => {
              if (!saving) {
                e.currentTarget.style.background = ACCENT
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(197,150,58,0.25)"
              }
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, borderBottom: "1px solid rgba(197,150,58,0.3)", pb: 12 }}>
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px 6px 0 0",
            fontWeight: 600,
            fontSize: "0.875rem",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            background: activeTab === "content" ? ACCENT : "rgba(12, 13, 17,0.4)",
            color: activeTab === "content" ? "#0C0D11" : "#F5EBD8",
            border: activeTab === "content" ? `1px solid ${ACCENT}` : "1px solid rgba(197,150,58,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s"
          }}
        >
          <Layers size={16} />
          About Content & Stats
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("team")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px 6px 0 0",
            fontWeight: 600,
            fontSize: "0.875rem",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            background: activeTab === "team" ? ACCENT : "rgba(12, 13, 17,0.4)",
            color: activeTab === "team" ? "#0C0D11" : "#F5EBD8",
            border: activeTab === "team" ? `1px solid ${ACCENT}` : "1px solid rgba(197,150,58,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s"
          }}
        >
          <Users size={16} />
          Our Team & Staff ({teamMembers.length})
        </button>
      </div>

      {/* Two column layout: form + live preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="about-grid">

        {/* LEFT - Edit form */}
        {activeTab === "content" ? (
          <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
              General About Section Content
            </p>

            {/* Image upload */}
            <div>
              <label style={labelStyle}>About Section Main Banner Image</label>
              {imageUrl ? (
                <div style={{ position: "relative", marginBottom: 10 }}>
                  <img src={imageUrl} alt="About" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, border: `1px solid ${CARD_BORDER}` }} />
                  <button
                    onClick={() => setImageUrl("")}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `2px dashed rgba(12, 13, 17,0.2)`, borderRadius: 6, padding: "24px", textAlign: "center", cursor: "pointer", marginBottom: 10 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(12, 13, 17,0.2)"}
                >
                  {uploading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Loader2 size={18} className="animate-spin" style={{ color: ACCENT }} />
                      <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} style={{ color: TEXT_MUTED, margin: "0 auto 8px" }} />
                      <p style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>Click to upload main image</p>
                      <p style={{ color: TEXT_MUTED, fontSize: "0.75rem", marginTop: 4 }}>JPG, PNG, WEBP - max 10MB</p>
                    </>
                  )}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              <div>
                <label style={{ ...labelStyle, marginTop: 6 }}>Or paste image URL</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} placeholder="https://..." />
              </div>
            </div>

            {/* Text fields */}
            {fields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                {f.rows === 1
                  ? <input value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)} style={inputStyle} />
                  : <textarea rows={f.rows} value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)} style={inputStyle} />
                }
              </div>
            ))}

            {/* Stats */}
            <div style={{ borderTop: `1px solid ${CARD_BORDER}`, paddingTop: 16 }}>
              <p style={{ ...labelStyle, fontSize: "0.75rem", marginBottom: 12 }}>Stats / Highlights (3 cards)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.map(s => (
                  <div key={s.v} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Value</label>
                      <input value={data[s.v] || ""} onChange={e => set(s.v, e.target.value)} style={inputStyle} placeholder="e.g. 25+" />
                    </div>
                    <div>
                      <label style={labelStyle}>Label</label>
                      <input value={data[s.l] || ""} onChange={e => set(s.l, e.target.value)} style={inputStyle} placeholder="e.g. Years Experience" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* OUR TEAM EDITOR TAB */
          <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                  Our Team & Staff Members
                </p>
                <p style={{ color: TEXT_SECONDARY, fontSize: "0.8125rem", marginTop: 2 }}>
                  Add, edit, or upload photos for each equestrian coach and staff member.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTeamMember}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#0C0D11",
                  color: "#F5EBD8",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <Plus size={14} style={{ color: ACCENT }} />
                <span>Add Member</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {teamMembers.map((m, idx) => (
                <div 
                  key={m.id || idx}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid rgba(197,150,58,0.3)`,
                    borderRadius: 8,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: "0 2px 8px rgba(12, 13, 17,0.06)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(12, 13, 17,0.08)", paddingBottom: 8 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0C0D11", fontFamily: "'Inter', sans-serif" }}>
                      Team Member #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeamMember(m.id)}
                      style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>

                  {/* Photo Uploader */}
                  <div>
                    <label style={labelStyle}>Member Photo (Upload or Paste URL)</label>
                    <ImageUploader
                      value={m.image || ''}
                      onChange={url => handleUpdateTeamMember(m.id, 'image', url)}
                      label={`Photo for ${m.name || 'Member'}`}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input 
                        type="text"
                        value={m.name || ''}
                        onChange={e => handleUpdateTeamMember(m.id, 'name', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Capt. Vikramaditya Singh"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Role / Designation</label>
                      <input 
                        type="text"
                        value={m.role || ''}
                        onChange={e => handleUpdateTeamMember(m.id, 'role', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Head Instructor"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Experience Badge</label>
                      <input 
                        type="text"
                        value={m.experience || ''}
                        onChange={e => handleUpdateTeamMember(m.id, 'experience', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. 15+ Yrs Exp."
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Specialty Tag</label>
                      <input 
                        type="text"
                        value={m.specialty || ''}
                        onChange={e => handleUpdateTeamMember(m.id, 'specialty', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Dressage & Show Jumping"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Short Biography / Background</label>
                    <textarea 
                      rows={3}
                      value={m.bio || ''}
                      onChange={e => handleUpdateTeamMember(m.id, 'bio', e.target.value)}
                      style={inputStyle}
                      placeholder="Brief background and expertise..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT - Live preview */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24, position: "sticky", top: 80 }}>
          <p style={{ color: ACCENT, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            {activeTab === "content" ? "Live About Section Preview" : "Live Our Team Cards Preview"}
          </p>

          {activeTab === "content" ? (
            /* Main Content Preview */
            <div style={{ background: "#F4E9D2", borderRadius: 8, padding: 20, border: `1px solid rgba(255,255,255,0.05)` }}>
              <p style={{ textAlign: "center", fontSize: "0.6875rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>
                About Us
              </p>

              <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.375rem", fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4 }}>
                {data.title || "Academy Name"}
              </h2>
              <p style={{ textAlign: "center", color: TEXT_MUTED, fontSize: "0.8125rem", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
                {data.subtitle}
              </p>

              {imageUrl ? (
                <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: 6, marginBottom: 16 }}>
                  <img src={imageUrl} alt="About" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(255,255,255,0.04)", borderRadius: 6, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: TEXT_MUTED, fontSize: "0.75rem" }}>No image selected</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[data.p1, data.p2].map((p, i) => p ? (
                  <p key={i} style={{ color: "rgba(12, 13, 17,0.85)", fontSize: "0.8125rem", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                    {p}
                  </p>
                ) : null)}
                {(data.p3 || data.p4 || data.p5 || data.p6) && (
                  <p style={{ color: TEXT_MUTED, fontSize: "0.75rem", fontStyle: "italic" }}>+ more paragraphs below...</p>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {stats.map(s => (
                  <div key={s.v} style={{ textAlign: "center", background: "rgba(12, 13, 17,0.04)", border: `1px solid ${CARD_BORDER}`, borderRadius: 6, padding: "12px 8px" }}>
                    <p style={{ color: ACCENT, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700 }}>{data[s.v] || "-"}</p>
                    <p style={{ color: TEXT_MUTED, fontSize: "0.625rem", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{data[s.l] || "Label"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Team Members Preview Grid */
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "650px", overflowY: "auto", paddingRight: 4 }}>
              {teamMembers.map((m, idx) => (
                <div
                  key={m.id || idx}
                  style={{
                    background: "#0C0D11",
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid rgba(197,150,58,0.3)",
                    color: "#F5EBD8"
                  }}
                >
                  <div style={{ position: "relative", height: 160, width: "100%", background: "#0C0D11" }}>
                    {m.image ? (
                      <img 
                        src={m.image} 
                        alt={m.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80" }}
                      />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#D8C5A0", fontSize: "0.75rem" }}>
                        No Photo
                      </div>
                    )}
                    <span style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(12, 13, 17,0.85)",
                      border: "1px solid rgba(197,150,58,0.5)",
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      color: "#D2AA55"
                    }}>
                      {m.experience || "Exp"}
                    </span>
                  </div>

                  <div style={{ padding: 14 }}>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.125rem", fontWeight: 700, color: "#F5EBD8", margin: 0 }}>
                      {m.name || "Member Name"}
                    </h4>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#D2AA55", textTransform: "uppercase", marginTop: 2 }}>
                      {m.role || "Role"}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: "0.6875rem", color: "#C5963A" }}>
                      <Award size={12} />
                      <span>{m.specialty}</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#D8C5A0", marginTop: 8, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                      {m.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
