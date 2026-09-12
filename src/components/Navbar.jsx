import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { createPortal } from "react-dom"
import { Search, Settings, Store, ChevronDown } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useAdminStore } from "../store/adminStore"
import { getSetting } from "../services/settingsService"
import { isAdmin as checkIsAdmin } from "./AdminRoute"
import logoImg from "../assets/logo.png"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const { user } = useAuthStore()
  const { products, loadProducts } = useAdminStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const userRef = useRef(null)
  const searchRef = useRef(null)
  const aboutRef = useRef(null)
  const isAdmin = checkIsAdmin(user)
  const isOnAdminPanel = pathname.startsWith("/admin")

  useEffect(() => {
    if (!products.length) loadProducts()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        // Handle user menu if needed
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([])
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler) }
  }, [])

  const handleSearchChange = (e) => {
    const q = e.target.value
    setSearchQuery(q)
    if (q.trim().length >= 2 && products.length) {
      const lower = q.toLowerCase()
      const matches = products.filter(p =>
        p.name?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        (p.custom_id || "").toLowerCase().includes(lower)
      ).slice(0, 6)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery(""); setSuggestions([])
      setMenuOpen(false)
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product.id}`)
    setSearchQuery(""); setSuggestions([])
  }

  const closeAll = () => { 
    setMenuOpen(false)
    setAboutDropdownOpen(false)
  }

  const isAboutActive = pathname.startsWith("/about") || pathname.startsWith("/vision") || pathname.startsWith("/mission")

  const isActive = (to) => {
    if (to === "/") return pathname === "/"
    if (to === "/about") return isAboutActive
    return pathname.startsWith(to)
  }

  const navStyle = {
    background: scrolled
      ? "rgba(8, 43, 73, 0.98)"
      : (pathname === "/" ? "rgba(8, 43, 73, 0.95)" : "rgba(8, 43, 73, 0.98)"),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(197, 150, 58, 0.35)",
    boxShadow: scrolled ? "0 4px 24px rgba(8, 43, 73, 0.2)" : "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const navLinks = [
    { to: "/", label: "Home" },
    {
      to: "/about",
      label: "About Us",
      hasDropdown: true,
      items: [
        { to: "/about#about", label: "About" },
        { to: "/about#vision", label: "Our Vision" },
        { to: "/about#mission", label: "Our Mission" },
      ],
    },
    { to: "/events", label: "Events" },
    { to: "/packages", label: "Packages" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/csr", label: "CSR" },
    { to: "/faq", label: "FAQ" },
    { to: "/enquiry", label: "Enquiry" },
    { to: "/contact", label: "Contact" },
  ]

  // Mobile sidebar rendered via portal so it escapes ALL stacking contexts
  const mobileSidebar = menuOpen ? createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)" }}
      />
      {/* Sidebar panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "280px",
          background: "linear-gradient(180deg, #0B304D 0%, #082B49 100%)",
          borderLeft: "1px solid rgba(197,150,58,0.35)",
          boxShadow: "-12px 0 40px rgba(8,43,73,0.35)",
          display: "flex",
          flexDirection: "column",
          zIndex: 100000,
        }}
      >
        {/* Sidebar header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(197,150,58,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logoImg} alt="Logo" style={{ width: 34, height: 34, objectFit: "contain" }} onError={(e) => { e.target.src = "/logo.png" }} />
            <span style={{
              fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: '#C5963A',
              letterSpacing: "0.06em",
            }}>
              ROYAL HOOF
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ color: "#F5EBD8", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {navLinks.map(item => {
            if (item.hasDropdown) {
              return (
                <div key={item.to} style={{ borderBottom: "1px solid rgba(197,150,58,0.12)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 24px",
                      color: isActive(item.to) ? "#D2AA55" : "#F5EBD8",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.0625rem",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      borderLeft: isActive(item.to) ? "2px solid #C5963A" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} style={{ transform: mobileAboutOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                  {mobileAboutOpen && (
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "4px 0" }}>
                      {item.items.map(sub => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: "block",
                            padding: "10px 24px 10px 36px",
                            color: "#D8C5A0",
                            textDecoration: "none",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.875rem",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#D2AA55" }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#D8C5A0" }}
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "13px 24px",
                  color: isActive(item.to) ? "#D2AA55" : "#F5EBD8",
                  textDecoration: "none",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.0625rem",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  borderBottom: "1px solid rgba(197,150,58,0.12)",
                  borderLeft: isActive(item.to) ? "2px solid #C5963A" : "2px solid transparent",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(197,150,58,0.1)"
                  e.currentTarget.style.color = "#D2AA55"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = isActive(item.to) ? "#D2AA55" : "#F5EBD8"
                }}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Admin button inside sidebar */}
          {isAdmin && (
            <div style={{ padding: "20px 24px 0" }}>
              <Link
                to={isOnAdminPanel ? "/" : "/admin"}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  background: "#C5963A",
                  color: "#082B49",
                  padding: "10px 16px",
                  borderRadius: "4px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {isOnAdminPanel ? "User Panel" : "Admin Panel"}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <nav className="sticky top-0 w-full" style={{ ...navStyle, zIndex: 50 }}>
        {/* MAIN ROW */}
        <div className="w-full px-6 lg:px-12 xl:px-20 h-20 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" onClick={closeAll}>
            <img 
              src={logoImg} 
              alt="Royal Hoof Logo" 
              className="h-12 w-12 object-contain flex-shrink-0"
              onError={(e) => {
                e.target.src = '/logo.png';
              }}
            />
            <div className="block leading-tight">
              <div className="font-medium tracking-[0.06em] text-[1.125rem] sm:hidden text-[#C5963A]" 
                style={{ 
                  fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                  letterSpacing: '0.06em',
                  color: '#C5963A'
                }}>
                ROYAL HOOF
              </div>
              <div className="hidden sm:block">
                <div className="font-medium tracking-[0.06em] text-[1.125rem] text-[#C5963A]" 
                  style={{ 
                    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                    letterSpacing: '0.06em',
                    color: '#C5963A'
                  }}>
                  ROYAL HOOF
                </div>
                <div className="text-[0.5rem] tracking-[0.10em] uppercase mt-0.5 text-[#D2AA55]" 
                  style={{ 
                    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                    fontWeight: 400,
                    letterSpacing: '0.10em',
                    color: '#D2AA55'
                  }}>
                  Horse Riding Academy
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isOnAdminPanel && (
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map(item => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.to}
                      ref={aboutRef}
                      className="relative"
                      onMouseEnter={() => setAboutDropdownOpen(true)}
                      onMouseLeave={() => setAboutDropdownOpen(false)}
                    >
                      <Link
                        to={item.to}
                        onClick={closeAll}
                        className="relative px-3.5 h-10 flex items-center gap-1 text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: isActive(item.to) ? "#D2AA55" : "rgba(245,235,216,0.8)",
                        }}
                        onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.color = "#F5EBD8" }}
                        onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.color = "rgba(245,235,216,0.8)" }}
                      >
                        {item.label}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-[#D2AA55]' : ''}`} />
                        {isActive(item.to) && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-[#C5963A]" />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      {aboutDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 w-44 rounded-sm shadow-xl z-50 overflow-hidden py-1"
                          style={{
                            background: "#0B304D",
                            border: "1px solid rgba(197, 150, 58, 0.35)",
                            boxShadow: "0 12px 32px rgba(8, 43, 73, 0.35)"
                          }}
                        >
                          {item.items.map(subItem => (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              onClick={() => {
                                setAboutDropdownOpen(false)
                                closeAll()
                              }}
                              className="block px-4 py-2.5 text-xs tracking-wider transition-colors duration-200"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                color: "#F5EBD8",
                                borderBottom: "1px solid rgba(197,150,58,0.08)"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(197, 150, 58, 0.15)"
                                e.currentTarget.style.color = "#D2AA55"
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.color = "#F5EBD8"
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link key={item.to} to={item.to} onClick={closeAll}
                    className="relative px-3.5 h-10 flex items-center text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: isActive(item.to) ? "#D2AA55" : "rgba(245,235,216,0.8)",
                    }}
                    onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.color = "#F5EBD8" }}
                    onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.color = "rgba(245,235,216,0.8)" }}
                  >
                    {item.label}
                    {isActive(item.to) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-[#C5963A]" />
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Desktop Search */}
          <div ref={searchRef} className="hidden lg:block relative w-72 ml-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#765334] pointer-events-none" />
              <input
                type="text" value={searchQuery} onChange={handleSearchChange}
                placeholder="Search..."
                className="input-premium w-full rounded-sm pl-11 pr-4 py-2.5 text-sm text-[#082B49] placeholder-[#765334]/50"
              />
            </form>
            {suggestions.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 rounded-sm z-50 overflow-hidden"
                style={{ 
                  background: "#FAF3E4", 
                  border: "1px solid rgba(197, 150, 58, 0.35)",
                  boxShadow: "0 12px 32px rgba(8, 43, 73, 0.15)" 
                }}>
                {suggestions.map(p => (
                  <button key={p.id} onClick={() => handleSuggestionClick(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(197,150,58,0.08)] transition-colors text-left">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-sm flex-shrink-0" 
                        onError={e => { e.target.style.display = "none" }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#082B49] text-sm font-medium truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{p.name}</p>
                      <p className="text-[#765334] text-xs">{p.category}</p>
                    </div>
                    <span className="text-[#082B49] text-sm font-semibold flex-shrink-0">
                      {p.price?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto lg:ml-0">
            {isAdmin && (
              <Link to={isOnAdminPanel ? "/" : "/admin"}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[0.6875rem] font-semibold rounded-sm transition-all mr-2 tracking-wide uppercase"
                style={{ 
                  background: "#C5963A", 
                  color: "#082B49",
                  fontFamily: "'Inter', sans-serif" 
                }}>
                {isOnAdminPanel ? <><Store size={13} /> User</> : <><Settings size={13} /> Admin</>}
              </Link>
            )}

            {/* Hamburger button */}
            <button 
              className="lg:hidden p-2 transition-colors"
              style={{ color: "#F5EBD8", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar rendered at document.body level via portal */}
      {mobileSidebar}
    </>
  )
}
