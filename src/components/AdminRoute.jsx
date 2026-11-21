import { useState } from "react"
import { isAdminAuthenticated } from "../pages/admin/AdminLoginPage"
import AdminLoginPage from "../pages/admin/AdminLoginPage"

export default function AdminRoute({ children }) {
  // Local state triggers re-render when login succeeds
  const [authed, setAuthed] = useState(() => isAdminAuthenticated())

  if (!authed) {
    return <AdminLoginPage onSuccess={() => setAuthed(true)} />
  }

  return children
}

// Keep for Navbar and AuthCallbackPage compatibility
const ADMIN_EMAILS = [
  "sailendrakondapalli@gmail.com",
  "adduriaswani@gmail.com",
  "susmithajewlaries@gmail.com",
  "info@royalhoof.com",
  "naveenreddygandluri51@gmail.com",
  "aswaniadduri11@gmail.com",
  "ssbmanogna@gmail.com",
  "ashforkiro@gmail.com",
  "aswaniasshu11@gmail.com",
]

export const isAdmin = (user) => {
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email?.toLowerCase())
}
