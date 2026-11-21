import { useLocation, Navigate } from "react-router-dom"
import { isAdminAuthenticated } from "../pages/admin/AdminLoginPage"

export default function AdminRoute({ children }) {
  const location = useLocation()

  if (!isAdminAuthenticated()) {
    // Redirect to admin login, remembering where we were going
    return <Navigate to="/admin-login" state={{ from: location.pathname }} replace />
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
