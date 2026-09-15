import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { X, Play, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function GalleryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // all, images, videos
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)

  const handleBack = () => {
    if (location.state?.fromSection) {
      navigate(`/#${location.state.fromSection}`)
    } else if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/#gallery')
    }
  }

  useEffect(() => {
    loadGalleryItems()
  }, [])

  const loadGalleryItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Supabase error loading gallery:', error)
        toast.error(`Failed to load gallery: ${error.message}`)
        throw error
      }

      console.log('Loaded gallery items from database:', data)
      setGalleryItems(data || [])
    } catch (error) {
      console.error('Error loading gallery:', error)
      // Fallback to sample data if database is not set up
      setGalleryItems([
        { id: 1, media_url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80', category: 'Events', title: 'Event 1', media_type: 'image' },
        { id: 2, media_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80', category: 'Training', title: 'Training Session', media_type: 'image' },
        { id: 3, media_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80', category: 'Events', title: 'Event 2', media_type: 'image' },
        { id: 4, media_url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80', category: 'Facilities', title: 'Our Facility', media_type: 'image' },
        { id: 5, media_url: '/herovideo.mp4', category: 'Videos', title: 'Academy Tour', media_type: 'video' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(galleryItems.map(item => item.category))]
  const images = galleryItems.filter(item => item.media_type === 'image')
  const videos = galleryItems.filter(item => item.media_type === 'video')

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  const allMedia = [...filteredImages.map(img => ({ ...img, type: 'image', src: img.media_url })), ...videos.map(vid => ({ ...vid, type: 'video', src: vid.media_url, thumbnail: vid.media_url }))]
  const displayMedia = activeTab === 'all' ? allMedia : activeTab === 'images' ? filteredImages.map(img => ({ ...img, type: 'image', src: img.media_url })) : videos.map(vid => ({ ...vid, type: 'video', src: vid.media_url, thumbnail: vid.media_url }))

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(displayMedia.length / itemsPerPage)
  const safeCurrentPage = Math.min(currentPage, totalPages || 1)
  const paginatedMedia = itemsPerPage === 'all' 
    ? displayMedia 
    : displayMedia.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage)

  return (
    <>
      <Helmet>
        <title>Gallery - Academy</title>
        <meta name="description" content="Explore our photo and video gallery" />
      </Helmet>

      <div className="min-h-screen py-20 px-6 lg:px-12 xl:px-20" style={{ background: '#F4E9D2' }}>
        <div className="max-w-7xl mx-auto">
          {/* Top navigation bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C0D11] text-[#C5963A] hover:bg-[#C5963A] hover:text-[#0C0D11] transition-all text-xs font-semibold uppercase tracking-wider border border-[#C5963A]/40 shadow-sm cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="text-xs text-[#765334] font-medium flex items-center gap-1.5 font-sans">
              <Link to="/" className="hover:text-[#C5963A] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/#gallery" className="hover:text-[#C5963A] transition-colors">Gallery</Link>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-3">Visual Showcase</p>
            <h1 className="heading-editorial text-4xl mb-4">
              <span style={{ color: "#292725" }}>Visual</span> <span style={{ color: "#D8C7A0", fontStyle: "italic" }}>Gallery</span>
            </h1>
            <div className="equestrian-divider w-24 mx-auto" />
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {['all', 'images', 'videos'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-sm text-sm font-medium uppercase tracking-wider transition-all border ${
                  activeTab === tab 
                    ? 'bg-[#C5963A] text-[#0C0D11] border-[#C5963A]' 
                    : 'bg-transparent text-[#765334] border-[rgba(197, 150, 58,0.25)] hover:border-[rgba(197, 150, 58,0.45)] hover:text-[#D8C7A0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category Filter (for images) */}
          {(activeTab === 'all' || activeTab === 'images') && (
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#C5963A]/20 text-[#C5963A] border border-[#C5963A]' 
                      : 'bg-[#FAF3E4] text-[#765334] hover:bg-[#FAF3E4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Photos per page control bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#FAF3E4] border border-[rgba(197,150,58,0.3)] rounded-lg p-3 sm:px-6">
            <div className="text-xs sm:text-sm text-[#765334] font-medium">
              Showing <span className="font-bold text-[#0C0D11]">{displayMedia.length === 0 ? 0 : (itemsPerPage === 'all' ? 1 : (safeCurrentPage - 1) * itemsPerPage + 1)} - {itemsPerPage === 'all' ? displayMedia.length : Math.min(safeCurrentPage * itemsPerPage, displayMedia.length)}</span> of <span className="font-bold text-[#0C0D11]">{displayMedia.length}</span> photos
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0C0D11]">
                Photos per page:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value === 'all' ? 'all' : Number(e.target.value)
                  setItemsPerPage(val)
                  setCurrentPage(1)
                }}
                className="bg-white border border-[#C5963A]/40 rounded px-3 py-1 text-xs sm:text-sm font-bold text-[#0C0D11] focus:outline-none focus:border-[#0C0D11] cursor-pointer"
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

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-[#C5963A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayMedia.length === 0 ? (
            <div className="text-center py-20 equestrian-card rounded-lg">
              <p className="text-[#765334] text-lg">No gallery items found</p>
              <p className="text-[#765334] text-sm mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedMedia.map(item => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => setSelectedMedia(item)}
                  className="relative group cursor-pointer overflow-hidden rounded-sm aspect-square border border-[rgba(197, 150, 58,0.12)] hover:border-[rgba(197, 150, 58,0.35)] transition-all duration-400"
                >
                  <img 
                    src={item.type === 'video' ? (item.thumbnail || item.src) : item.src} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {item.type === 'video' && (
                      <div className="w-12 h-12 rounded-full bg-[#FAF3E4]/90 flex items-center justify-center">
                        <Play size={24} className="text-[#0C0D11] ml-1" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 text-xs uppercase font-bold tracking-wider rounded border border-[#C5963A]/30 bg-white text-[#0C0D11] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C5963A] hover:text-[#0C0D11] transition-all"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded text-xs font-bold transition-all border ${
                    page === safeCurrentPage
                      ? 'bg-[#C5963A] text-[#0C0D11] border-[#C5963A]'
                      : 'bg-white text-[#765334] border-[#C5963A]/30 hover:border-[#C5963A]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 text-xs uppercase font-bold tracking-wider rounded border border-[#C5963A]/30 bg-white text-[#0C0D11] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C5963A] hover:text-[#0C0D11] transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FAF3E4]/10 hover:bg-[#FAF3E4]/20 flex items-center justify-center transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          
          <div onClick={e => e.stopPropagation()} className="max-w-5xl w-full">
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full h-auto rounded-lg" />
            ) : (
              <video src={selectedMedia.src} controls autoPlay className="w-full h-auto rounded-lg" />
            )}
            <p className="text-white text-center mt-4 text-lg">{selectedMedia.title}</p>
          </div>
        </div>
      )}
    </>
  )
}
