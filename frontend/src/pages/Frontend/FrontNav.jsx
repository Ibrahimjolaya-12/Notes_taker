import { Link } from "react-router-dom"
import logo from "../../assets/book-icon.webp"

const FrontNav = () => {
  return (
    <header className="front-navbar">
      <Link to="/" className="nav-logo">
        <img src={logo} alt="ClassNotes Logo" />
        <span>ClassNotes</span>
      </Link>

      <Link to="/auth/login" className="btn-nav-login" style={{backgroundColor:"#766FFF"}}>
        Sign in
      </Link>
    </header>
  )
}

export default FrontNav