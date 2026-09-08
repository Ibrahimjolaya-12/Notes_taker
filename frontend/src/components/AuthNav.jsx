import { Link } from "react-router-dom"
import logo from "../assets/book-icon.webp"

const AuthNav = () => {
  return (
     <Link to='/'>
    <div className="auth-brand">
      <img src={logo} alt="ClassNotes Logo" />
      <span>ClassNotes</span>
    </div>
     </Link>
  )
}

export default AuthNav