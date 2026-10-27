import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Calendar, Package, MessageSquare,
  Clock, Image, Users
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

// Royal Hoof palette
const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(12, 13, 17,0.12)"
const TEXT_PRIMARY = "#292725"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const ACCENT = "#C5963A"
const ACCENT_LIGHT = "#D2AA55"

const StatCard = ({ icon: Icon, label, value, sub, to, accent }) => (
  <Link to={to || "#"} style={{ textDecoration: "none" }}>
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(197,150,58,0.15)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.3s ease",
        minHeight: 140,
        boxShadow: "0 2px 8px rgba(12, 13, 17,0.06)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = ACCENT
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = CARD_BORDER
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      <div style={{
        width: 48, 
        height: 48, 
        borderRadius: 10,
        background: "linear-gradient(135deg, rgba(197,150,58,0.1) 0%, rgba(197,150,58,0.15) 100%)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        border: `1px solid rgba(197,150,58,0.2)`,
      }}>
        <Icon size={22} style={{ color: ACCENT }} strokeWidth={2} />
      </div>
      <div>
        <p style={{ 
          fontSize: "2rem", 
          fontWeight: 700, 
          color: TEXT_PRIMARY, 
          fontFamily: "'Inter', sans-serif", 
          lineHeight: 1,
          marginBottom: 8
        }}>
          {value}
        </p>
        <p style={{ 
          fontSize: "0.875rem", 
          color: TEXT_SECONDARY, 
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          marginBottom: 4
        }}>
          {label}
        </p>
        {sub && (
          <p style={{ 
            fontSize: "0.75rem", 
            color: TEXT_MUTED, 
            fontFamily: "'Inter', sans-serif"
          }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  </Link>
)

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    todayEnquiries: 0,
    newEnquiries: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalPackages: 0,
    activePackages: 0,
  })

  const fetchDashboardData = async () => {
    try {
      // Fetch enquiries
      const { data: enquiries, error: enquiriesError } = await supabase
        .from('enquiries')
        .select('id, created_at, status')
      
      if (enquiriesError) throw enquiriesError

      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, is_active')
      
      if (eventsError) throw eventsError

      // Fetch testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('id, is_approved')
      
      if (testimonialsError) throw testimonialsError

      // Fetch packages
      const { data: packages, error: packagesError } = await supabase
        .from('packages')
        .select('id, is_active')
      
      if (packagesError) throw packagesError

      // Calculate stats
      const today = new Date().toDateString()
      const todayEnquiries = (enquiries || []).filter(e => 
        new Date(e.created_at).toDateString() === today
      ).length
      
      const newEnquiries = (enquiries || []).filter(e => e.status === 'new').length
      const activeEvents = (events || []).filter(e => e.is_active).length
      const pendingTestimonials = (testimonials || []).filter(t => !t.is_approved).length
      const activePackages = (packages || []).filter(p => p.is_active).length

      setStats({
        totalEnquiries: (enquiries || []).length,
        todayEnquiries,
        newEnquiries,
        totalEvents: (events || []).length,
        activeEvents,
        totalTestimonials: (testimonials || []).length,
        pendingTestimonials,
        totalPackages: (packages || []).length,
        activePackages,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: `2px solid ${ACCENT}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page header */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "2rem", 
          fontWeight: 700, 
          color: "#F5EBD8",
          marginBottom: 8,
          letterSpacing: "-0.02em"
        }}>
          Dashboard
        </h1>
        <p style={{ 
          color: "#D8C5A0", 
          fontSize: "0.9375rem", 
          fontFamily: "'Inter', sans-serif" 
        }}>
          Welcome back. Here's what's happening at Royal Hoof.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={MessageSquare} 
          label="Total Enquiries" 
          value={stats.totalEnquiries} 
          sub={`${stats.newEnquiries} new`} 
          to="/admin/enquiries" 
        />
        <StatCard 
          icon={Calendar} 
          label="Events" 
          value={stats.activeEvents} 
          sub={`${stats.totalEvents} total`} 
          to="/admin/events" 
        />
        <StatCard 
          icon={Clock} 
          label="Today's Enquiries" 
          value={stats.todayEnquiries} 
          to="/admin/enquiries?filter=today" 
        />
        <StatCard 
          icon={Users} 
          label="Testimonials" 
          value={stats.pendingTestimonials} 
          sub="Pending approval" 
          to="/admin/testimonials" 
        />
        <StatCard 
          icon={Package} 
          label="Packages" 
          value={stats.activePackages} 
          sub={`${stats.totalPackages} total`} 
          to="/admin/packages" 
        />
        <StatCard 
          icon={MessageSquare} 
          label="New Enquiries" 
          value={stats.newEnquiries} 
          sub="Need attention" 
          to="/admin/enquiries?status=new" 
        />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
