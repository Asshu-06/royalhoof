import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Package } from 'lucide-react'

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

export default function AdminPackages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [features, setFeatures] = useState([''])
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, duration: 'month',
    package_type: 'adult', age_group: '', features: [],
    is_popular: false, is_active: true, display_order: 0
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('packages').select('*').order('display_order', { ascending: true })
      if (error) throw error
      setItems(data || [])
    } catch { toast.error('Failed to fetch packages') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const packageData = { ...formData, features: features.filter(f => f.trim() !== '') }
    try {
      if (editingItem) {
        const { error } = await supabase.from('packages').update(packageData).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Package updated!')
      } else {
        const { error } = await supabase.from('packages').insert([packageData])
        if (error) throw error
        toast.success('Package created!')
      }
      setShowForm(false); setEditingItem(null); resetForm(); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (item) => {
    try {
      const { error } = await supabase.from('packages').update({ is_active: !item.is_active }).eq('id', item.id)
      if (error) throw error
      toast.success(item.is_active ? 'Hidden' : 'Visible'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, duration: 'month', package_type: 'adult', age_group: '', features: [], is_popular: false, is_active: true, display_order: 0 })
    setFeatures([''])
  }

  const startEdit = (item) => {
    setEditingItem(item); setFormData(item)
    setFeatures(item.features?.length > 0 ? item.features : [''])
    setShowForm(true)
  }

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }))

  if (loading) return <div style={{ padding: 32, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>Loading...</div>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>Packages</h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>Manage riding packages and pricing</p>
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
          <Plus size={18} strokeWidth={2.5} /> Add Package
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ 
          background: CARD_BG, 
          border: `2px solid ${ACCENT}`, 
          borderRadius: 12, 
          padding: 32,
          boxShadow: "0 4px 20px rgba(197,150,58,0.12)"
        }}>
          <h2 style={{ 
            color: TEXT_PRIMARY, 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            marginBottom: 24, 
            fontFamily: "'Cormorant Garamond', serif",
            borderBottom: `2px solid ${CARD_BORDER}`,
            paddingBottom: 16
          }}>
            {editingItem ? 'Edit' : 'Add'} Package
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Package Name *</label>
                <input value={formData.name} onChange={e => set('name', e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={formData.package_type} onChange={e => set('package_type', e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="adult">Adult</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description (Max 1000 chars)</label>
              <textarea maxLength={1000} value={formData.description} onChange={e => set('description', e.target.value)} style={{ ...inputStyle, resize: "none" }} rows={2} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input type="number" value={formData.price} onChange={e => set('price', parseFloat(e.target.value))} style={inputStyle} min="0" step="0.01" required />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <select value={formData.duration} onChange={e => set('duration', e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly (3 months)</option>
                  <option value="6 months">6 Months</option>
                  <option value="year">Annual</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Age Group (kids)</label>
                <input value={formData.age_group} onChange={e => set('age_group', e.target.value)} style={inputStyle} placeholder="e.g. 5-12 years" />
              </div>
            </div>

            {/* Features */}
            <div>
              <label style={labelStyle}>Features</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <input value={feature} onChange={e => { const f = [...features]; f[i] = e.target.value; setFeatures(f) }}
                      style={{ ...inputStyle, flex: 1 }} placeholder="e.g. 4 sessions per week" />
                    <button type="button" onClick={() => setFeatures(features.filter((_, fi) => fi !== i))}
                      style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFeatures([...features, ''])}
                  style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.8125rem", fontFamily: "'Inter', sans-serif", padding: 0 }}>
                  + Add Feature
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={formData.display_order} onChange={e => set('display_order', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center", paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.is_popular} onChange={e => set('is_popular', e.target.checked)} style={{ width: 15, height: 15 }} />
                  <span style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>Mark as Popular</span>
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center", paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.is_active} onChange={e => set('is_active', e.target.checked)} style={{ width: 15, height: 15 }} />
                  <span style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>Active</span>
                </label>
              </div>
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

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div 
            key={item.id} 
            style={{ 
              background: CARD_BG, 
              border: `2px solid ${CARD_BORDER}`, 
              borderRadius: 12, 
              padding: 24, 
              position: "relative",
              boxShadow: "0 2px 8px rgba(12, 13, 17,0.06)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = ACCENT
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(197,150,58,0.15)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = CARD_BORDER
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(12, 13, 17,0.06)"
            }}
          >
            {item.is_popular && (
              <div style={{ 
                position: "absolute", 
                top: -12, 
                right: 20,
                background: ACCENT,
                color: "#0C0D11",
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 12px rgba(197,150,58,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}>
                <Star size={14} fill="#0C0D11" stroke="none" />
                POPULAR
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ 
                color: TEXT_PRIMARY, 
                fontSize: "1.25rem", 
                fontWeight: 700, 
                fontFamily: "'Cormorant Garamond', serif", 
                marginBottom: 8,
                lineHeight: 1.2
              }}>
                {item.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ 
                  fontSize: "0.75rem", 
                  padding: "4px 12px", 
                  borderRadius: 6, 
                  background: item.package_type === 'adult' ? "rgba(59,130,246,0.15)" : "rgba(168,85,247,0.15)", 
                  color: item.package_type === 'adult' ? "#3b82f6" : "#a855f7",
                  border: `1px solid ${item.package_type === 'adult' ? "rgba(59,130,246,0.3)" : "rgba(168,85,247,0.3)"}`,
                  fontWeight: 600,
                  textTransform: "capitalize"
                }}>
                  {item.package_type}
                </span>
                {item.age_group && (
                  <span style={{ 
                    color: TEXT_MUTED, 
                    fontSize: "0.75rem",
                    fontWeight: 500
                  }}>
                    {item.age_group}
                  </span>
                )}
              </div>
            </div>

            <div style={{ 
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: `2px solid ${CARD_BORDER}`
            }}>
              <span style={{ 
                color: ACCENT, 
                fontSize: "2rem", 
                fontWeight: 700, 
                fontFamily: "'Cormorant Garamond', serif" 
              }}>
                ₹{item.price?.toLocaleString()}
              </span>
              <span style={{ 
                color: TEXT_MUTED, 
                fontSize: "0.875rem",
                fontWeight: 500
              }}>
                /{item.duration}
              </span>
            </div>

            {item.description && (
              <p style={{ 
                color: TEXT_SECONDARY, 
                fontSize: "0.875rem", 
                marginBottom: 16, 
                lineHeight: 1.6, 
                fontFamily: "'Inter', sans-serif" 
              }}>
                {item.description}
              </p>
            )}

            {item.features?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ 
                  color: TEXT_SECONDARY, 
                  fontSize: "0.75rem", 
                  letterSpacing: "0.05em", 
                  textTransform: "uppercase", 
                  marginBottom: 10, 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700
                }}>
                  Includes
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {item.features.map((f, i) => (
                    <li key={i} style={{ 
                      color: TEXT_PRIMARY, 
                      fontSize: "0.875rem", 
                      fontFamily: "'Inter', sans-serif", 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: 10,
                      lineHeight: 1.4
                    }}>
                      <span style={{ 
                        color: ACCENT, 
                        fontSize: "1rem",
                        marginTop: 2,
                        flexShrink: 0
                      }}>
                        ✓
                      </span> 
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              paddingTop: 16, 
              borderTop: `2px solid ${CARD_BORDER}` 
            }}>
              <button onClick={() => toggleActive(item)} style={{
                display: "flex", 
                alignItems: "center", 
                gap: 6, 
                fontSize: "0.8125rem",
                background: item.is_active ? "rgba(34,197,94,0.1)" : "rgba(100,116,139,0.1)",
                border: `1px solid ${item.is_active ? "rgba(34,197,94,0.3)" : "rgba(100,116,139,0.2)"}`,
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                color: item.is_active ? "#22c55e" : "#64748b",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {item.is_active ? <><Eye size={14} strokeWidth={2.5} /> Visible</> : <><EyeOff size={14} strokeWidth={2.5} /> Hidden</>}
              </button>
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  onClick={() => startEdit(item)} 
                  style={{ 
                    color: ACCENT, 
                    background: "rgba(197,150,58,0.1)", 
                    border: "none", 
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(197,150,58,0.2)"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(197,150,58,0.1)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <Edit2 size={16} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  style={{ 
                    color: "#ef4444", 
                    background: "rgba(239,68,68,0.1)", 
                    border: "none", 
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.2)"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ 
          background: CARD_BG, 
          border: `2px dashed ${CARD_BORDER}`, 
          borderRadius: 12, 
          padding: "64px", 
          textAlign: "center", 
          color: TEXT_SECONDARY, 
          fontSize: "0.9375rem", 
          fontFamily: "'Inter', sans-serif" 
        }}>
          <Package size={48} style={{ color: TEXT_MUTED, margin: "0 auto 16px", opacity: 0.5 }} strokeWidth={1.5} />
          <p style={{ fontWeight: 500 }}>No packages yet.</p>
          <p style={{ color: TEXT_MUTED, fontSize: "0.875rem", marginTop: 4 }}>Click "Add Package" to create your first one.</p>
        </div>
      )}
    </div>
  )
}
