import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ChevronDown, Settings, Store } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/authStore"
import { useAdminStore } from "../store/adminStore"
import { isAdmin as checkIsAdmin } from "./AdminRoute"
import logoImg from "../assets/logo.png"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdownKey, setActiveDropdownKey] = useState(null)
  const [openMobileDropdownKey, setOpenMobileDropdownKey] = useState(null)
  const [dbPackages, setDbPackages] = useState([])
  const [dbEvents, setDbEvents] = useState([])
  const { user } = useAuthStore()
  const { products, loadProducts } = useAdminStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const userRef = useRef(null)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const isAdmin = checkIsAdmin(user)
  const isOnAdminPanel = pathname.startsWith("/admin")

  useEffect(() => {
    if (!products.length) loadProducts()
  }, [])

  useEffect(() => {
    async function loadSearchData() {
      try {
        const [pkgRes, evtRes] = await Promise.all([
          supabase.from('packages').select('id, name, price, duration, package_type, is_active').eq('is_active', true),
          supabase.from('events').select('id, title, category, is_active').eq('is_active', true)
        ])
        if (pkgRes.data && pkgRes.data.length > 0) {
          setDbPackages(pkgRes.data)
        } else {
          setDbPackages([
            { id: 1, name: 'Basic', price: 2999, duration: 'month' },
            { id: 2, name: 'Premium', price: 7999, duration: 'quarter' },
            { id: 3, name: 'Elite', price: 14999, duration: '6 months' }
          ])
        }
        if (evtRes.data) setDbEvents(evtRes.data)
      } catch (err) {
        console.error('Error fetching search data:', err)
        setDbPackages([
          { id: 1, name: 'Basic', price: 2999, duration: 'month' },
          { id: 2, name: 'Premium', price: 7999, duration: 'quarter' },
          { id: 3, name: 'Elite', price: 14999, duration: '6 months' }
        ])
      }
    }
    loadSearchData()
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
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([])
        setSearchOpen(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdownKey(null)
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSuggestions([])
        setActiveDropdownKey(null)
      }
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const getSearchIndex = () => {
    const staticItems = [
      {
        title: "Our Services & Offers",
        type: "Services",
        path: "/#what-we-offer",
        icon: "🐎",
        keywords: ["services", "offers", "programs", "riding", "lessons", "what we offer"]
      },
      {
        title: "Upcoming Events & Competitions",
        type: "Events",
        path: "/events",
        icon: "📅",
        keywords: ["events", "event", "competition", "workshop", "bootcamp", "schedule", "calendar", "show", "riding", "tournament"]
      },
      {
        title: "Packages & Memberships",
        type: "Packages",
        path: "/packages",
        icon: "💎",
        keywords: ["package", "packages", "price", "pricing", "membership", "cost", "fee", "rate", "adult", "kids", "month", "quarter"]
      },
      {
        title: "Book Free Demo Session",
        type: "Enquiry",
        path: "/enquiry",
        icon: "🗓️",
        keywords: ["demo", "free demo", "book", "trial", "session", "schedule", "experience"]
      },
      {
        title: "General Enquiry",
        type: "Enquiry",
        path: "/enquiry",
        icon: "💬",
        keywords: ["enquiry", "inquire", "ask", "question", "form", "message"]
      },
      {
        title: "Contact Us & Location",
        type: "Contact",
        path: "/contact",
        icon: "📍",
        keywords: ["contact", "address", "phone", "mobile", "whatsapp", "call", "location", "map", "giri farms", "nallambakkam", "hours", "timing"]
      },
      {
        title: "About Royal Hoof Academy",
        type: "About",
        path: "/about",
        icon: "🏰",
        keywords: ["about", "story", "history", "academy", "instructors", "coaches", "facilities", "stables", "horses"]
      },
      {
        title: "Our Vision",
        type: "About",
        path: "/about#vision",
        icon: "👁️",
        keywords: ["vision", "future", "goals", "excellence"]
      },
      {
        title: "Our Mission",
        type: "About",
        path: "/about#mission",
        icon: "🎯",
        keywords: ["mission", "values", "training", "standards"]
      },
      {
        title: "Our Expert Team & Coaches",
        type: "About",
        path: "/about#our-team",
        icon: "🏇",
        keywords: ["team", "our team", "instructors", "coaches", "trainers", "staff", "management", "founders"]
      },
      {
        title: "Visual Gallery Showcase",
        type: "Gallery",
        path: "/gallery",
        icon: "🖼️",
        keywords: ["gallery", "photos", "images", "pictures", "videos", "media", "showcase"]
      },
      {
        title: "Testimonials & Reviews",
        type: "Testimonials",
        path: "/testimonials",
        icon: "⭐️",
        keywords: ["testimonials", "reviews", "ratings", "feedback", "stories", "students", "parents"]
      },
      {
        title: "CSR Initiatives",
        type: "CSR",
        path: "/csr",
        icon: "🌱",
        keywords: ["csr", "social", "community", "environment", "initiatives", "giving back"]
      },
      {
        title: "FAQ & Safety Guidelines",
        type: "FAQ",
        path: "/faq",
        icon: "❓",
        keywords: ["faq", "help", "safety", "gear", "clothing", "equipment", "age limit", "rules", "rain"]
      }
    ]

    const packageItems = dbPackages.map(pkg => ({
      title: `${pkg.name} Package${pkg.price ? ` (₹${pkg.price.toLocaleString('en-IN')}/${pkg.duration || 'period'})` : ''}`,
      type: "Package",
      path: "/packages",
      icon: "💎",
      keywords: [pkg.name.toLowerCase(), "package", "membership", "price", "cost"]
    }))

    const eventItems = dbEvents.map(evt => ({
      title: evt.title,
      type: "Event",
      path: "/events",
      icon: "📅",
      keywords: [evt.title.toLowerCase(), "event", "competition", evt.category?.toLowerCase() || ''].filter(Boolean)
    }))

    return [...staticItems, ...packageItems, ...eventItems]
  }

  const handleSearchChange = (e) => {
    const q = e.target.value
    setSearchQuery(q)
    if (q.trim().length >= 1) {
      const lower = q.toLowerCase().trim()
      const searchIndex = getSearchIndex()
      const matches = searchIndex.filter(item =>
        item.title.toLowerCase().includes(lower) ||
        item.type.toLowerCase().includes(lower) ||
        item.keywords.some(k => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()))
      ).slice(0, 6)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      const searchIndex = getSearchIndex()
      const match = searchIndex.find(item =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))
      ) || suggestions[0]

      if (match) {
        navigate(match.path)
      } else {
        navigate('/events')
      }
      setSearchQuery("")
      setSuggestions([])
      setMenuOpen(false)
    }
  }

  const handleSuggestionClick = (item) => {
    navigate(item.path)
    setSearchQuery("")
    setSuggestions([])
    setMenuOpen(false)
  }

  const closeAll = () => { 
    setMenuOpen(false)
    setActiveDropdownKey(null)
    setSearchOpen(false)
  }

  const handleNavLinkClick = (to) => {
    closeAll()
    if (to.includes('#')) {
      const [path, hashId] = to.split('#')
      if (pathname === path || (pathname === '/' && (path === '' || path === '/'))) {
        setTimeout(() => {
          const element = document.getElementById(hashId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 50)
      }
    }
  }

  const isAboutActive = pathname.startsWith("/about") || pathname.startsWith("/vision") || pathname.startsWith("/mission")

  const isActive = (to) => {
    if (to === "/") return pathname === "/"
    if (to === "/about") return isAboutActive
    return pathname.startsWith(to)
  }

  const navStyle = {
    background: "#0C0D11",
    borderBottom: "1px solid rgba(197, 150, 58, 0.35)",
    boxShadow: scrolled ? "0 4px 24px rgba(0, 0, 0, 0.6)" : "0 2px 12px rgba(0, 0, 0, 0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const desktopNavLinks = [
    { to: "/", label: "Home" },
    { to: "/#what-we-offer", label: "Our Services" },
    {
      to: "/about",
      label: "About Us",
      hasDropdown: true,
      items: [
        { to: "/about#about", label: "About" },
        { to: "/about#vision", label: "Our Vision" },
        { to: "/about#mission", label: "Our Mission" },
        { to: "/about#our-team", label: "Our Team" },
      ],
    },
    { to: "/events", label: "Events" },
    { to: "/packages", label: "Packages" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/csr", label: "CSR" },
    { to: "/faq", label: "FAQ" },
    { to: "/enquiry", label: "Enquiry" },
  ]

  const navLinks = [
    ...desktopNavLinks,
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
          background: "linear-gradient(180deg, #121318 0%, #0C0D11 100%)",
          borderLeft: "1px solid rgba(197,150,58,0.35)",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.6)",
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
            <img src={logoImg} alt="Logo" style={{ width: 35, height: 35, objectFit: "contain" }} onError={(e) => { e.target.src = "/logo.png" }} />
            <span style={{
              fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
              fontSize: "1.1875rem",
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
              const isOpen = openMobileDropdownKey === item.label
              return (
                <div key={item.label} style={{ borderBottom: "1px solid rgba(197,150,58,0.12)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 24px",
                      color: isActive(item.to) ? "#D2AA55" : "#F5EBD8",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1875rem",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      borderLeft: isActive(item.to) ? "2px solid #C5963A" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpenMobileDropdownKey(isOpen ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                  {isOpen && (
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
                            fontSize: "1rem",
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
                onClick={() => handleNavLinkClick(item.to)}
                style={{
                  display: "block",
                  padding: "13px 24px",
                  color: isActive(item.to) ? "#D2AA55" : "#F5EBD8",
                  textDecoration: "none",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1875rem",
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
                  color: "#0C0D11",
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
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* LEFT: Logo & Brand + Desktop Nav Links immediately beside it */}
          <div className="flex items-center gap-5 lg:gap-6 xl:gap-8 flex-1 min-w-0">
            {/* Logo and Brand Name */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0" onClick={closeAll}>
              <img 
                src={logoImg} 
                alt="Royal Hoof Logo" 
                className="h-[49px] w-[49px] object-contain flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
              <div className="block leading-tight flex-shrink-0">
                <div className="font-medium tracking-[0.06em] text-[1.1875rem] text-[#C5963A]" 
                  style={{ 
                    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                    letterSpacing: '0.06em',
                    color: '#C5963A'
                  }}>
                  ROYAL HOOF
                </div>
                <div className="text-[0.5625rem] tracking-[0.10em] uppercase mt-0.5 text-[#D2AA55]" 
                  style={{ 
                    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                    fontWeight: 400,
                    letterSpacing: '0.10em',
                    color: '#D2AA55'
                  }}>
                  Horse Riding Academy
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links in one evenly spaced horizontal row */}
            {!isOnAdminPanel && (
              <div className="hidden lg:flex items-center gap-2.5 lg:gap-3.5 xl:gap-5 flex-nowrap min-w-0">
                {desktopNavLinks.map(item => {
                  if (item.hasDropdown) {
                    const isOpen = activeDropdownKey === item.label
                    return (
                      <div
                        key={item.label}
                        ref={dropdownRef}
                        className="relative flex-shrink-0"
                        onMouseEnter={() => setActiveDropdownKey(item.label)}
                        onMouseLeave={() => setActiveDropdownKey(null)}
                      >
                        <Link
                          to={item.to}
                          onClick={closeAll}
                          className="relative py-2 px-1 flex items-center gap-1 text-[0.9375rem] font-medium tracking-[0.04em] transition-colors duration-300 whitespace-nowrap"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: isActive(item.to) ? "#D2AA55" : "rgba(245,235,216,0.85)",
                          }}
                          onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.color = "#F5EBD8" }}
                          onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.color = "rgba(245,235,216,0.85)" }}
                        >
                          {item.label}
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D2AA55]' : ''}`} />
                          {isActive(item.to) && (
                            <span className="absolute bottom-0.5 left-0 right-0 h-[2px] bg-[#C5963A]" />
                          )}
                        </Link>

                        {/* Dropdown Menu */}
                        {isOpen && (
                          <div
                            className="absolute top-full left-0 mt-2 w-48 rounded-sm shadow-xl z-50 overflow-hidden py-1"
                            style={{
                              background: "#0F1015",
                              border: "1px solid rgba(197, 150, 58, 0.35)",
                              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.8)"
                            }}
                          >
                            {item.items.map(subItem => (
                              <Link
                                key={subItem.to}
                                to={subItem.to}
                                onClick={() => {
                                  setActiveDropdownKey(null)
                                  closeAll()
                                }}
                                className="block px-4 py-2.5 text-sm tracking-wider transition-colors duration-200"
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
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => handleNavLinkClick(item.to)}
                      className="relative py-2 px-1 flex items-center text-[0.9375rem] font-medium tracking-[0.04em] transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: isActive(item.to) ? "#D2AA55" : "rgba(245,235,216,0.85)",
                      }}
                      onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.color = "#F5EBD8" }}
                      onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.color = "rgba(245,235,216,0.85)" }}
                    >
                      {item.label}
                      {isActive(item.to) && (
                        <span className="absolute bottom-0.5 left-0 right-0 h-[2px] bg-[#C5963A]" />
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Search Icon on far right + Admin Button + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto pl-3">
            {/* Search Icon & Popover */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#C5963A] hover:text-[#D2AA55] transition-colors rounded-full hover:bg-[rgba(197,150,58,0.1)] flex items-center justify-center cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <Search size={20} />
              </button>

              {searchOpen && (
                <div
                  className="absolute top-full right-0 mt-3 w-80 sm:w-96 rounded-md z-50 overflow-hidden shadow-2xl border border-[#C5963A]/40"
                  style={{
                    background: "#0F1015",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <form onSubmit={handleSearch} className="relative p-3 bg-[#14151B] border-b border-[#C5963A]/25 flex items-center gap-2">
                    <Search size={16} className="text-[#C5963A] flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search courses, packages, events..."
                      autoFocus
                      className="w-full bg-transparent text-sm text-[#F5EBD8] placeholder-[#F5EBD8]/40 outline-none border-none px-2 py-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); setSuggestions([]) }}
                        className="text-[#F5EBD8]/50 hover:text-[#F5EBD8] p-1 text-xs"
                      >
                        ✕
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="text-[#F5EBD8]/40 hover:text-[#F5EBD8] p-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </form>

                  {suggestions.length > 0 && (
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#C5963A]/15 bg-[#0F1015]">
                      {suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSuggestionClick(item)
                            setSearchOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#C5963A]/15 transition-all text-left group"
                        >
                          <span className="text-lg flex-shrink-0 w-8 h-8 rounded-full bg-[#C5963A]/10 flex items-center justify-center text-[#C5963A]">
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#F5EBD8] text-xs sm:text-sm font-medium truncate group-hover:text-[#D2AA55] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {item.title}
                            </p>
                            <p className="text-[#C5963A]/80 text-[0.6875rem] font-medium tracking-wider uppercase mt-0.5">
                              {item.type}
                            </p>
                          </div>
                          <span className="text-[#C5963A] text-xs font-bold whitespace-nowrap flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                            View →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Button */}
            {isAdmin && (
              <Link to={isOnAdminPanel ? "/" : "/admin"}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[0.6875rem] font-semibold rounded-sm transition-all tracking-wide uppercase"
                style={{ 
                  background: "#C5963A", 
                  color: "#0C0D11",
                  fontFamily: "'Inter', sans-serif" 
                }}>
                {isOnAdminPanel ? <><Store size={13} /> User</> : <><Settings size={13} /> Admin</>}
              </Link>
            )}

            {/* Mobile Hamburger Button */}
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
