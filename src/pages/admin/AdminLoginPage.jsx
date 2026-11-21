import { useState } from "react"
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import logoImg from "../../assets/logo.png"

// Credentials are checked client-side.
// For stronger security, move this to a server-side endpoint.
const ADMIN_USERNAME = "RoyalhoofAdmin"
const ADMIN_PASSWORD = "Admin@Royalhoof123"
export const ADMIN_SESSION_KEY = "rh_admin_auth"

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
}

export default function AdminLoginPage({ onSuccess }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Small delay for UX (feels less instant / brute-forceable)
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true")
        // If rendered in-place by AdminRoute, call onSuccess to re-render the panel.
        // If rendered as a standalone route, fall back to full reload.
        if (typeof onSuccess === "function") {
          onSuccess()
        } else {
          window.location.reload()
        }
      } else {
        setLoading(false)
        setError("Incorrect username or password.")
        setShake(true)
        setTimeout(() => setShake(false), 600)
        setPassword("")
      }
    }, 400)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #1a1409 0%, #0C0D11 60%)",
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(197,150,58,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 0] } : { opacity: 1, y: 0 }}
        transition={shake ? { duration: 0.5 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div
          style={{
            background: "#0C0D11",
            border: "1px solid rgba(197,150,58,0.3)",
            borderRadius: "12px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(197,150,58,0.08)",
            padding: "40px 36px",
          }}
        >
          {/* Logo + brand */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                width: 68, height: 68,
                borderRadius: "50%",
                background: "rgba(197,150,58,0.1)",
                border: "2px solid rgba(197,150,58,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
                boxShadow: "0 0 24px rgba(197,150,58,0.15)",
              }}
            >
              <img
                src={logoImg}
                alt="Royal Hoof"
                style={{ width: 46, height: 46, objectFit: "contain" }}
                onError={e => { e.target.style.display = "none" }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "#C5963A",
                letterSpacing: "0.08em",
                lineHeight: 1.1,
              }}
            >
              ROYAL HOOF
            </span>
            <span
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.22em",
                color: "rgba(197,150,58,0.6)",
                textTransform: "uppercase",
                marginTop: 3,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Admin Panel
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-7">
            <h1
              style={{
                color: "#F5EBD8",
                fontSize: "1.125rem",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                marginBottom: 4,
              }}
            >
              Sign in to continue
            </h1>
            <div
              style={{
                width: 40, height: 1,
                background: "linear-gradient(90deg, transparent, #C5963A, transparent)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 6,
                padding: "10px 12px",
                marginBottom: 18,
              }}
            >
              <AlertCircle size={14} style={{ color: "#f87171", flexShrink: 0 }} />
              <span style={{ color: "#f87171", fontSize: "0.8125rem", fontFamily: "'Inter', sans-serif" }}>
                {error}
              </span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Username */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(197,150,58,0.8)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={15}
                  style={{
                    position: "absolute", left: 12, top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(197,150,58,0.5)", pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  required
                  placeholder="Enter username"
                  style={{
                    width: "100%",
                    paddingLeft: 36, paddingRight: 14,
                    paddingTop: 11, paddingBottom: 11,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(197,150,58,0.2)",
                    borderRadius: 6,
                    color: "#F5EBD8",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(197,150,58,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(197,150,58,0.2)"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(197,150,58,0.8)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute", left: 12, top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(197,150,58,0.5)", pointerEvents: "none",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  placeholder="Enter password"
                  style={{
                    width: "100%",
                    paddingLeft: 36, paddingRight: 40,
                    paddingTop: 11, paddingBottom: 11,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(197,150,58,0.2)",
                    borderRadius: 6,
                    color: "#F5EBD8",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(197,150,58,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(197,150,58,0.2)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                    color: "rgba(197,150,58,0.5)", display: "flex", alignItems: "center",
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "12px",
                background: loading || !username || !password
                  ? "rgba(197,150,58,0.35)"
                  : "linear-gradient(135deg, #C5963A, #a87d2a)",
                border: "none",
                borderRadius: 6,
                color: loading || !username || !password ? "rgba(255,255,255,0.4)" : "#0C0D11",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: loading || !username || !password ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "opacity 0.2s, transform 0.1s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => { if (!loading && username && password) e.currentTarget.style.opacity = "0.9" }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 15, height: 15,
                    border: "2px solid rgba(12,13,17,0.4)",
                    borderTopColor: "#0C0D11",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(197,150,58,0.35)",
            fontSize: "0.6875rem",
            marginTop: 16,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Restricted to authorised personnel only
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(245,235,216,0.2); }
      `}</style>
    </div>
  )
}
