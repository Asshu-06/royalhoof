import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Calendar, Package, MessageSquare,
  Clock, Image, Users
} from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import { formatINR } from '../../utils/format'

// Royal Hoof palette
const CARD_BG = "#FAF3E4"
const CARD_BORDER = "rgba(8,43,73,0.12)"
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
        boxShadow: "0 2px 8px rgba(8,43,73,0.06)",
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
  const { stats, orders, loadOrders, loadProducts, computeStats } = useAdminStore()

  useEffect(() => {
    Promise.all([loadOrders(), loadProducts()]).then(() => computeStats())
  }, [])

  if (!stats) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: `2px solid ${ACCENT}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Derive quick counts from orders
  const today = new Date().toDateString()
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today).length
  const pendingEnquiries = stats.totalOrders || 0

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
        <StatCard icon={MessageSquare} label="Total Enquiries" value={stats.totalOrders ?? 0} sub="All time" to="/admin/enquiries" />
        <StatCard icon={Calendar} label="Events" value={stats.totalProducts ?? 0} sub="Active events" to="/admin/events" />
        <StatCard icon={Clock} label="Today's Enquiries" value={todayOrders} to="/admin/enquiries?filter=today" />
        <StatCard icon={Users} label="Testimonials" value={stats.lowStockCount ?? 0} sub="Pending approval" to="/admin/testimonials" />
      </div>

      {/* Recent orders/enquiries */}
      {(() => {
        const days = []
        for (let i = 0; i < 3; i++) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = d.toDateString()
          const label = i === 0 ? "Today" : i === 1 ? "Yesterday" : d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })
          const dayOrders = orders.filter(o => new Date(o.created_at).toDateString() === ds)
          days.push({ label, orders: dayOrders })
        }
        const hasAny = days.some(d => d.orders.length > 0)
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ 
                color: "#F5EBD8", 
                fontSize: "1.125rem", 
                fontWeight: 600, 
                fontFamily: "'Inter', sans-serif" 
              }}>
                Recent Orders
                <span style={{ 
                  color: "#D8C5A0", 
                  fontWeight: 400, 
                  fontSize: "0.875rem", 
                  marginLeft: 12 
                }}>
                  ({orders.length} total)
                </span>
              </h3>
              <Link 
                to="/admin/orders" 
                style={{ 
                  color: ACCENT_LIGHT, 
                  fontSize: "0.875rem", 
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                onMouseLeave={e => e.currentTarget.style.color = ACCENT_LIGHT}
              >
                View all →
              </Link>
            </div>

            {!hasAny && (
              <div style={{ 
                background: CARD_BG, 
                border: `1px solid ${CARD_BORDER}`, 
                borderRadius: 12, 
                padding: "48px", 
                textAlign: "center", 
                color: TEXT_SECONDARY, 
                fontSize: "0.9375rem",
                boxShadow: "0 2px 8px rgba(8,43,73,0.06)"
              }}>
                No orders in the last 3 days
              </div>
            )}

            {days.map(({ label, orders: dayOrders }) => dayOrders.length === 0 ? null : (
              <div key={label} style={{ 
                background: CARD_BG, 
                border: `1px solid ${CARD_BORDER}`, 
                borderRadius: 12, 
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(8,43,73,0.06)"
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "14px 20px", 
                  borderBottom: `1px solid ${CARD_BORDER}`, 
                  background: "rgba(8,43,73,0.02)" 
                }}>
                  <span style={{ 
                    color: ACCENT, 
                    fontSize: "0.875rem", 
                    fontWeight: 700, 
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.02em"
                  }}>
                    {label}
                  </span>
                  <span style={{ 
                    color: TEXT_SECONDARY, 
                    fontSize: "0.75rem",
                    fontWeight: 500
                  }}>
                    {dayOrders.length} order{dayOrders.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Order ID", "Customer", "Amount", "Status", "Time"].map(h => (
                          <th key={h} style={{ 
                            textAlign: "left", 
                            color: TEXT_SECONDARY, 
                            fontSize: "0.75rem", 
                            padding: "12px 20px", 
                            fontWeight: 600, 
                            fontFamily: "'Inter', sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dayOrders.map(o => {
                        const addr = (() => { try { return typeof o.address === "object" ? o.address : JSON.parse(o.address || "{}") } catch { return {} } })()
                        const customerName = addr.full_name || o.users?.email || "Guest"
                        return (
                          <tr key={o.id} style={{ 
                            borderTop: `1px solid ${CARD_BORDER}`,
                            transition: "background 0.15s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(8,43,73,0.02)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ 
                              padding: "14px 20px", 
                              color: ACCENT, 
                              fontSize: "0.8125rem", 
                              fontFamily: "monospace", 
                              fontWeight: 700 
                            }}>
                              {o.display_order_id || "#" + String(o.id).slice(-6).toUpperCase()}
                            </td>
                            <td style={{ 
                              padding: "14px 20px", 
                              color: TEXT_PRIMARY, 
                              fontSize: "0.8125rem",
                              fontWeight: 500,
                              maxWidth: 180, 
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "nowrap" 
                            }}>
                              {customerName}
                            </td>
                            <td style={{ 
                              padding: "14px 20px", 
                              color: TEXT_PRIMARY, 
                              fontSize: "0.8125rem",
                              fontWeight: 600
                            }}>
                              {formatINR(o.total_amount)}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{
                                fontSize: "0.75rem", 
                                padding: "4px 12px", 
                                borderRadius: 6, 
                                fontWeight: 600,
                                background: o.payment_status === "paid" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                                color: o.payment_status === "paid" ? "#22c55e" : "#eab308",
                                border: `1px solid ${o.payment_status === "paid" ? "rgba(34,197,94,0.3)" : "rgba(234,179,8,0.3)"}`,
                              }}>
                                {o.payment_status === "paid" ? "Paid" : "Pending"}
                              </span>
                            </td>
                            <td style={{ 
                              padding: "14px 20px", 
                              color: TEXT_MUTED, 
                              fontSize: "0.75rem",
                              fontWeight: 500
                            }}>
                              {new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
