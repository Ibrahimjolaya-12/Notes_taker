// import { Link } from "react-router-dom"
// import logo from "../assets/book-icon.webp"

// const AuthNav = () => {
//   return (
//      <Link to='/'>
//     <div className="auth-brand">
//       <img src={logo} alt="ClassNotes Logo" />
//       <span>ClassNotes</span>
//     </div>
//      </Link>
//   )
// }

// export default AuthNav



import { Link } from "react-router-dom";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import logo from "../assets/book-icon.webp";
import { useTheme } from "../context/ThemeContext";

const AuthNav = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="auth-navbar"
      style={{
        position: "absolute", // 👈 Flex flow se azaad karega
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Name (Top Left) */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          className="auth-brand"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={logo}
            alt="ClassNotes Logo"
            style={{
              height: "32px",
              width: "auto",
              display: "block",
            }}
          />
          <span
            style={{
              color: isDarkMode ? "#ffffff" : "#0f172a",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "-0.3px",
              transition: "color 0.3s ease",
            }}
          >
            ClassNotes
          </span>
        </div>
      </Link>

      {/* Theme Switcher Button (Top Right) */}
      <Button
        type="default"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        icon={
          isDarkMode ? (
            <SunOutlined style={{ color: "#f59e0b", fontSize: "16px" }} />
          ) : (
            <MoonOutlined style={{ color: "#4f46e5", fontSize: "16px" }} />
          )
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "38px",
          height: "38px",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "#1e1b4b" : "#e0e7ff",
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "#c7d2fe",
          cursor: "pointer",
          boxShadow: "none",
          transition: "all 0.3s ease",
        }}
      />
    </header>
  );
};

export default AuthNav;