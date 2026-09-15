import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Star, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import ImageUploader from '../../components/admin/ImageUploader'

const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(12, 13, 17,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"
const ACCENT_LIGHT = "#D2AA55"

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

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '', role: '', rating: 5, review: '', image_url: '',
    is_approved: false, is_active: true, display_order: 0
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch { toast.error('Failed to fetch testimonials') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase.from('testimonials').update(formData).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('testimonials').insert([formData])
        if (error) throw error
        toast.success('Created!')
      }
      setShowForm(false); setEditingItem(null); resetForm(); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const toggleApproval = async (item) => {
    try {
      const { error } = await supabase.from('testimonials').update({ is_approved: !item.is_approved }).eq('id', item.id)
      if (error) throw error
      toast.success(item.is_approved ? 'Unapproved' : 'Approved!'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (item) => {
    try {
      const { error } = await supabase.from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id)
      if (error) throw error
      toast.success(item.is_active ? 'Hidden' : 'Visible'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const resetForm = () => setFormData({ name: '', role: '', rating: 5, review: '', image_url: '', is_approved: false, is_active: true, display_order: 0 })
  const startEdit = (item) => { setEditingItem(item); setFormData(item); setShowForm(true) }
  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }))

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return !item.is_approved
    if (filter === 'approved') return item.is_approved
    return true
  })

  if (loading) return <div style={{ padding: 32, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>Loading...</div>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>Testimonials</h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>Review and approve customer testimonials</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingItem(null); resetForm() }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            background: ACCENT, 
            color: "#0C0D11", 
            border: "none", 
            borderRadius: 6, 
            padding: "12px 24px", 
            cursor: "pointer", 
            fontWeight: 600, 
            fontSize: "0.875rem", 
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 2px 8px rgba(197,150,58,0.25)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = ACCENT_LIGHT
            e.currentTarget.style.transform = "translateY(-1px)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(197,150,58,0.35)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = ACCENT
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(197,150,58,0.25)"
          }}
        >
          <Plus size={18} strokeWidth={2.5} /> Add Testimonial
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {['all', 'pending', 'approved'].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            padding: "7px 16px", borderRadius: 4, fontSize: "0.8125rem", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", border: "1px solid", textTransform: "capitalize",
            background: filter === tab ? ACCENT : "transparent",
            color: filter === tab ? "#0C0D11" : TEXT_MUTED,
            borderColor: filter === tab ? ACCENT : CARD_BORDER,
          }}>
            {tab}
            {tab !== 'all' && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>
                ({items.filter(i => tab === 'pending' ? !i.is_approved : i.is_approved).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 24 }}>
          <h2 style={{ color: TEXT_PRIMARY, fontSize: "1.125rem", fontWeight: 600, marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>
            {editingItem ? 'Edit' : 'Add'} Testimonial
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Name *</label>
                <input value={formData.name} onChange={e => set('name', e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Role / Designation</label>
                <input value={formData.role} onChange={e => set('role', e.target.value)} style={inputStyle} placeholder="e.g. Member since 2023" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Review * (Max 1000 chars)</label>
              <textarea maxLength={1000} value={formData.review} onChange={e => set('review', e.target.value)} style={{ ...inputStyle, resize: "none" }} rows={4} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label style={labelStyle}>Rating</label>
                <select value={formData.rating} onChange={e => set('rating', parseInt(e.target.value))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={formData.display_order} onChange={e => set('display_order', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.is_approved} onChange={e => set('is_approved', e.target.checked)} style={{ width: 15, height: 15 }} />
                  <span style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>Approved</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.is_active} onChange={e => set('is_active', e.target.checked)} style={{ width: 15, height: 15 }} />
                  <span style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>Active</span>
                </label>
              </div>
            </div>
            
            {/* Image Uploader */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Profile Image (optional)</label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => set('image_url', url)}
                label="Profile Picture"
                showPreview={true}
              />
              <p style={{ fontSize: '0.75rem', color: TEXT_MUTED, marginTop: 8, fontStyle: 'italic' }}>
                Leave blank to show default avatar
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" style={{ background: ACCENT, color: "#0C0D11", border: "none", borderRadius: 4, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); resetForm() }}
                style={{ background: "rgba(255,255,255,0.06)", color: TEXT_MUTED, border: `1px solid ${CARD_BORDER}`, borderRadius: 4, padding: "10px 24px", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: 20, position: "relative" }}>
            {/* Status badge */}
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              {item.is_approved ? (
                <span style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", fontSize: "0.6875rem", padding: "3px 8px", borderRadius: 9999, display: "flex", alignItems: "center", gap: 4, border: "1px solid rgba(34,197,94,0.2)" }}>
                  <CheckCircle size={11} /> Approved
                </span>
              ) : (
                <span style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24", fontSize: "0.6875rem", padding: "3px 8px", borderRadius: 9999, display: "flex", alignItems: "center", gap: 4, border: "1px solid rgba(234,179,8,0.2)" }}>
                  <XCircle size={11} /> Pending
                </span>
              )}
            </div>

            {/* Stars */}
            <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
              {[...Array(item.rating)].map((_, i) => <Star key={i} size={15} fill={ACCENT} stroke="none" />)}
            </div>

            {/* Review */}
            <p style={{ color: "rgba(243,235,221,0.7)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: 14, fontFamily: "'Inter', sans-serif", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              "{item.review}"
            </p>

            {/* Author */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${CARD_BORDER}` }}>
              <p style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "0.9375rem", fontFamily: "'Inter', sans-serif" }}>{item.name}</p>
              {item.role && <p style={{ color: TEXT_MUTED, fontSize: "0.75rem", marginTop: 2 }}>{item.role}</p>}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => toggleApproval(item)} style={{
                  fontSize: "0.6875rem", padding: "4px 10px", borderRadius: 9999, cursor: "pointer", fontWeight: 500,
                  background: item.is_approved ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                  color: item.is_approved ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${item.is_approved ? "rgba(34,197,94,0.2)" : "rgba(234,179,8,0.2)"}`,
                }}>
                  {item.is_approved ? 'Approved' : 'Approve'}
                </button>
                <button onClick={() => toggleActive(item)} style={{
                  fontSize: "0.6875rem", padding: "4px 8px", borderRadius: 9999, cursor: "pointer",
                  background: item.is_active ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
                  color: item.is_active ? "#4ade80" : TEXT_MUTED,
                  border: `1px solid ${item.is_active ? "rgba(34,197,94,0.2)" : CARD_BORDER}`,
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  {item.is_active ? <><Eye size={11} /></> : <><EyeOff size={11} /></>}
                </button>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => startEdit(item)} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer" }}><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(item.id)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: "48px", textAlign: "center", color: TEXT_MUTED, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
          No {filter !== 'all' ? filter : ''} testimonials yet.
        </div>
      )}
    </div>
  )
}
