import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Image, Video, Eye, EyeOff } from 'lucide-react'
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

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', media_url: '', media_type: 'image',
    category: '', is_active: true, display_order: 0
  })

  // Photos per page & pagination state
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination variables
  const totalPages = itemsPerPage === 'all' ? 1 : Math.max(1, Math.ceil(items.length / (typeof itemsPerPage === 'number' ? itemsPerPage : 1)))
  const safeCurrentPage = Math.min(currentPage, totalPages || 1)
  const indexOfLastItem = itemsPerPage === 'all' ? items.length : safeCurrentPage * (typeof itemsPerPage === 'number' ? itemsPerPage : items.length)
  const indexOfFirstItem = itemsPerPage === 'all' ? 0 : (safeCurrentPage - 1) * (typeof itemsPerPage === 'number' ? itemsPerPage : 0)
  const currentItems = itemsPerPage === 'all' ? items : items.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('display_order', { ascending: true })
      if (error) throw error
      setItems(data || [])
    } catch { toast.error('Failed to fetch gallery items') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase.from('gallery').update(formData).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('gallery').insert([formData])
        if (error) throw error
        toast.success('Added!')
      }
      setShowForm(false); setEditingItem(null); resetForm(); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this gallery item?')) return
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (item) => {
    try {
      const { error } = await supabase.from('gallery').update({ is_active: !item.is_active }).eq('id', item.id)
      if (error) throw error
      toast.success(item.is_active ? 'Hidden' : 'Visible'); fetchItems()
    } catch (err) { toast.error(err.message) }
  }

  const resetForm = () => setFormData({ title: '', description: '', media_url: '', media_type: 'image', category: '', is_active: true, display_order: 0 })
  const startEdit = (item) => { setEditingItem(item); setFormData(item); setShowForm(true) }
  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }))

  if (loading) return <div style={{ padding: 32, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>Loading...</div>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#F5EBD8", letterSpacing: "-0.02em" }}>Gallery</h1>
          <p style={{ color: "#D8C5A0", fontSize: "0.9375rem", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>Manage photos and videos</p>
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
          <Plus size={18} strokeWidth={2.5} /> Add Item
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
            {editingItem ? 'Edit' : 'Add'} Gallery Item
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
                    e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(12, 13, 17,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input 
                  value={formData.category} 
                  onChange={e => set('category', e.target.value)} 
                  style={inputStyle} 
                  placeholder="e.g. Events, Training, Facilities" 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(12, 13, 17,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => set('description', e.target.value)} 
                style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} 
                rows={3} 
                onFocus={e => {
                  e.target.style.borderColor = ACCENT
                  e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(12, 13, 17,0.15)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Image Uploader Component */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Media *</label>
              <ImageUploader
                value={formData.media_url}
                onChange={(url) => set('media_url', url)}
                label="Gallery Image/Video"
                accept="image/*,video/*"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Media Type</label>
                <select 
                  value={formData.media_type} 
                  onChange={e => set('media_type', e.target.value)} 
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(12, 13, 17,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input 
                  type="number" 
                  value={formData.display_order} 
                  onChange={e => set('display_order', parseInt(e.target.value))} 
                  style={inputStyle} 
                  onFocus={e => {
                    e.target.style.borderColor = ACCENT
                    e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(12, 13, 17,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", paddingTop: 8 }}>
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
                {editingItem ? 'Update' : 'Create'}
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

      {/* Controls Bar: Photos per page selection */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT_SECONDARY, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
          <span>Showing</span>
          <span style={{ fontWeight: 700, color: TEXT_PRIMARY }}>{items.length === 0 ? 0 : (itemsPerPage === 'all' ? 1 : indexOfFirstItem + 1)} - {itemsPerPage === 'all' ? items.length : Math.min(indexOfLastItem, items.length)}</span>
          <span>of</span>
          <span style={{ fontWeight: 700, color: TEXT_PRIMARY }}>{items.length}</span>
          <span>photos</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ color: TEXT_SECONDARY, fontSize: "0.8125rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Photos per page:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value)
              setItemsPerPage(val)
              setCurrentPage(1)
            }}
            style={{
              background: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 6,
              padding: "6px 12px",
              color: TEXT_PRIMARY,
              fontSize: "0.8125rem",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map(item => (
          <div key={item.id} style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, overflow: "hidden" }}>
            {/* Preview */}
            <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
              {item.media_type === 'image' ? (
                <img src={item.media_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Video size={28} style={{ color: TEXT_MUTED }} />
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ padding: "12px" }}>
              <p style={{ color: TEXT_PRIMARY, fontSize: "0.875rem", fontWeight: 500, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>{item.title}</p>
              {item.category && (
                <span style={{ fontSize: "0.6875rem", padding: "2px 8px", borderRadius: 9999, background: "rgba(216,199,174,0.1)", color: ACCENT, display: "inline-block", marginBottom: 8 }}>
                  {item.category}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${CARD_BORDER}` }}>
                <button onClick={() => toggleActive(item)} style={{
                  display: "flex", alignItems: "center", gap: 4, fontSize: "0.6875rem", cursor: "pointer",
                  background: "none", border: "none", padding: 0,
                  color: item.is_active ? "#4ade80" : TEXT_MUTED,
                }}>
                  {item.is_active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => startEdit(item)} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer" }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {itemsPerPage !== 'all' && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <button
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: `1px solid ${CARD_BORDER}`,
              background: safeCurrentPage === 1 ? "rgba(12, 13, 17,0.05)" : "#FFFFFF",
              color: safeCurrentPage === 1 ? TEXT_MUTED : TEXT_PRIMARY,
              cursor: safeCurrentPage === 1 ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: `1px solid ${page === safeCurrentPage ? ACCENT : CARD_BORDER}`,
                background: page === safeCurrentPage ? ACCENT : "#FFFFFF",
                color: page === safeCurrentPage ? "#0C0D11" : TEXT_PRIMARY,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.8125rem",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {page}
            </button>
          ))}

          <button
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: `1px solid ${CARD_BORDER}`,
              background: safeCurrentPage === totalPages ? "rgba(12, 13, 17,0.05)" : "#FFFFFF",
              color: safeCurrentPage === totalPages ? TEXT_MUTED : TEXT_PRIMARY,
              cursor: safeCurrentPage === totalPages ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Next
          </button>
        </div>
      )}

      {items.length === 0 && (
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 8, padding: "48px", textAlign: "center", color: TEXT_MUTED, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
          No gallery items yet. Click "Add Item" to create one.
        </div>
      )}
    </div>
  )
}
