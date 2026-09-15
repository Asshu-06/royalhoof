import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Users } from 'lucide-react'
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

export default function AdminEvents() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', event_date: '', event_time: '',
    location: '', category: '', capacity: 0, image_url: '',
    status: 'upcoming', is_active: true
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch { toast.error('Failed to fetch events') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase.from('events').update(formData).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Event updated!')
      } else {
        const { error } = await supabase.from('events').insert([formData])
        if (error) throw error
        toast.success('Event created!')
      }
      setShowForm(false); setEditingItem(null); resetForm(); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      toast.success('Event deleted'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (item) => {
    try {
      const { error } = await supabase.from('events').update({ is_active: !item.is_active }).eq('id', item.id)
      if (error) throw error
      toast.success(item.is_active ? 'Hidden' : 'Visible'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const resetForm = () => setFormData({ title: '', description: '', event_date: '', event_time: '', location: '', category: '', capacity: 0, image_url: '', status: 'upcoming', is_active: true })

  const startEdit = (item) => { setEditingItem(item); setFormData(item); setShowForm(true) }

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }))

  if (loading) return <div style={{ padding: 32, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>Loading...</div>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>Events</h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>Manage upcoming and past events</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); resetForm() }}
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
          <Plus size={18} strokeWidth={2.5} /> Add Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ 
          background: CARD_BG, 
          border: `1px solid ${CARD_BORDER}`, 
          borderRadius: 12, 
          padding: 32,
          boxShadow: "0 4px 16px rgba(12, 13, 17,0.08)"
        }}>
          <h2 style={{ 
            color: TEXT_PRIMARY, 
            fontSize: "1.25rem", 
            fontWeight: 700, 
            marginBottom: 24, 
            fontFamily: "'Cormorant Garamond', serif" 
          }}>
            {editingItem ? 'Edit' : 'Add'} Event
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  value={formData.title} 
                  onChange={e => set('title', e.target.value)} 
                  style={inputStyle} 
                  required 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input 
                  value={formData.category} 
                  onChange={e => set('category', e.target.value)} 
                  style={inputStyle} 
                  placeholder="e.g. Competition, Workshop" 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description * (Max 1000 chars)</label>
              <textarea 
                maxLength={1000}
                value={formData.description} 
                onChange={e => set('description', e.target.value)} 
                style={{ ...inputStyle, resize: "vertical", minHeight: 100 }} 
                rows={4} 
                required 
                onFocus={e => {
                  e.target.style.borderColor = ACCENT
                  e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label style={labelStyle}>Event Date *</label>
                <input 
                  type="date" 
                  value={formData.event_date} 
                  onChange={e => set('event_date', e.target.value)} 
                  style={{ ...inputStyle, colorScheme: "light" }} 
                  required 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input 
                  value={formData.event_time} 
                  onChange={e => set('event_time', e.target.value)} 
                  style={inputStyle} 
                  placeholder="e.g. 9:00 AM" 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input 
                  value={formData.location} 
                  onChange={e => set('location', e.target.value)} 
                  style={inputStyle} 
                  placeholder="Main Arena" 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label style={labelStyle}>Capacity</label>
                <input 
                  type="number" 
                  value={formData.capacity} 
                  onChange={e => set('capacity', parseInt(e.target.value))} 
                  style={inputStyle} 
                  min="0" 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => set('status', e.target.value)} 
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = "0 0 0 3px rgba(197,150,58,0.1)"
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(12, 13, 17,0.15)"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", paddingTop: 28 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_active} 
                    onChange={e => set('is_active', e.target.checked)} 
                    style={{ width: 18, height: 18, cursor: "pointer", accentColor: ACCENT }} 
                  />
                  <span style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Active / Visible</span>
                </label>
              </div>
            </div>
            
            {/* Image Uploader */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Event Image</label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => set('image_url', url)}
                label="Event Image"
              />
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
              <button 
                type="submit" 
                style={{ 
                  background: ACCENT, 
                  color: "#0C0D11", 
                  border: "none", 
                  borderRadius: 6, 
                  padding: "12px 32px", 
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
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = ACCENT
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                {editingItem ? 'Update Event' : 'Create Event'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingItem(null); resetForm() }}
                style={{ 
                  background: "transparent", 
                  color: TEXT_SECONDARY, 
                  border: `1px solid ${CARD_BORDER}`, 
                  borderRadius: 6, 
                  padding: "12px 32px", 
                  cursor: "pointer", 
                  fontSize: "0.875rem", 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(12, 13, 17,0.05)"
                  e.currentTarget.style.borderColor = TEXT_SECONDARY
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.borderColor = CARD_BORDER
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ 
        background: CARD_BG, 
        border: `1px solid ${CARD_BORDER}`, 
        borderRadius: 12, 
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(12, 13, 17,0.06)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: "rgba(12, 13, 17,0.02)" }}>
                {["Title", "Date", "Location", "Capacity", "Status", "Actions"].map(h => (
                  <th key={h} style={{ 
                    textAlign: "left", 
                    color: TEXT_SECONDARY, 
                    fontSize: "0.75rem", 
                    padding: "14px 20px", 
                    fontWeight: 600, 
                    fontFamily: "'Inter', sans-serif", 
                    letterSpacing: "0.05em", 
                    textTransform: "uppercase" 
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ 
                  borderBottom: `1px solid ${CARD_BORDER}`, 
                  transition: "background 0.15s" 
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(12, 13, 17,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ 
                      color: TEXT_PRIMARY, 
                      fontSize: "0.9375rem", 
                      fontWeight: 600, 
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: 2
                    }}>
                      {item.title}
                    </p>
                    {item.category && (
                      <p style={{ 
                        color: TEXT_MUTED, 
                        fontSize: "0.75rem",
                        fontWeight: 500
                      }}>
                        {item.category}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      color: TEXT_PRIMARY, 
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      marginBottom: 2
                    }}>
                      <Calendar size={14} style={{ color: ACCENT }} strokeWidth={2} />
                      {new Date(item.event_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {item.event_time && (
                      <p style={{ 
                        color: TEXT_MUTED, 
                        fontSize: "0.75rem", 
                        marginLeft: 22,
                        fontWeight: 500
                      }}>
                        {item.event_time}
                      </p>
                    )}
                  </td>
                  <td style={{ 
                    padding: "16px 20px", 
                    color: TEXT_PRIMARY, 
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}>
                    {item.location || "—"}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      color: TEXT_SECONDARY, 
                      fontSize: "0.875rem",
                      fontWeight: 600
                    }}>
                      <Users size={15} strokeWidth={2} /> 
                      <span>{item.registered_count || 0}</span>
                      <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>/ {item.capacity || 0}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{
                        fontSize: "0.75rem", 
                        padding: "4px 12px", 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        display: "inline-block",
                        width: "fit-content",
                        textTransform: "capitalize",
                        background: item.status === 'upcoming' ? "rgba(34,197,94,0.15)" : item.status === 'past' ? "rgba(100,116,139,0.15)" : "rgba(239,68,68,0.15)",
                        color: item.status === 'upcoming' ? "#22c55e" : item.status === 'past' ? "#64748b" : "#ef4444",
                        border: `1px solid ${item.status === 'upcoming' ? "rgba(34,197,94,0.3)" : item.status === 'past' ? "rgba(100,116,139,0.2)" : "rgba(239,68,68,0.3)"}`,
                      }}>
                        {item.status}
                      </span>
                      <button onClick={() => toggleActive(item)} style={{
                        fontSize: "0.6875rem", 
                        padding: "4px 12px", 
                        borderRadius: 6, 
                        cursor: "pointer", 
                        border: `1px solid ${item.is_active ? "rgba(34,197,94,0.3)" : "rgba(100,116,139,0.2)"}`,
                        background: item.is_active ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.1)",
                        color: item.is_active ? "#22c55e" : "#64748b",
                        display: "flex", 
                        alignItems: "center", 
                        gap: 6, 
                        width: "fit-content",
                        fontWeight: 600,
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        {item.is_active ? <><Eye size={12} strokeWidth={2.5} /> Visible</> : <><EyeOff size={12} strokeWidth={2.5} /> Hidden</>}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                      <button 
                        onClick={() => startEdit(item)} 
                        style={{ 
                          color: ACCENT, 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: 4,
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(197,150,58,0.1)"
                          e.currentTarget.style.transform = "scale(1.1)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "none"
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        <Edit2 size={18} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        style={{ 
                          color: "#ef4444", 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: 4,
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(239,68,68,0.1)"
                          e.currentTarget.style.transform = "scale(1.1)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "none"
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "64px 32px", 
            color: TEXT_SECONDARY, 
            fontSize: "0.9375rem", 
            fontFamily: "'Inter', sans-serif" 
          }}>
            <Calendar size={48} style={{ color: TEXT_MUTED, margin: "0 auto 16px", opacity: 0.5 }} strokeWidth={1.5} />
            <p style={{ fontWeight: 500 }}>No events yet.</p>
            <p style={{ color: TEXT_MUTED, fontSize: "0.875rem", marginTop: 4 }}>Click "Add Event" to create one.</p>
          </div>
        )}
      </div>
    </div>
  )
}
