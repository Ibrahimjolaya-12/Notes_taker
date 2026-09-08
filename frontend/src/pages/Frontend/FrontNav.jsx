import { Link } from "react-router-dom";
import { Grid } from "antd";
import logo from "../../assets/book-icon.webp";

const { useBreakpoint } = Grid;

const FrontNav = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <header
      className="front-navbar"
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: "100vw", // 👈 Poori screen cover karega bina squeeze hue
        maxWidth: "100%",
        backgroundColor: "rgba(3, 3, 13, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: isMobile ? "12px 16px" : "14px 40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1350px", // 👈 Large displays ke liye clean limit
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // 👈 Logo left par, button right par
        }}
      >
        {/* Brand Logo (Left) */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="ClassNotes Logo"
            style={{
              height: isMobile ? "28px" : "34px",
              width: "auto",
              display: "block",
            }}
          />
          <span
            style={{
              color: "#f8fafc",
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            ClassNotes
          </span>
        </Link>

        {/* Action Button (Right) */}
        <Link
          to="/auth/login"
          style={{
            backgroundColor: "#6366f1",
            color: "#ffffff",
            padding: isMobile ? "7px 18px" : "8px 24px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: 600,
            borderRadius: "8px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default FrontNav;