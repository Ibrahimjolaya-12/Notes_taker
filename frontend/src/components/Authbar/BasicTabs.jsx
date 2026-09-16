import "./Tabs.scss";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const BasicTabs = () => {
  const { isDarkMode } = useTheme();

  const tabs = [
    { id: "login", label: "Sign in", path: "/auth/login" },
    { id: "register", label: "Sign up", path: "/auth/register" },
  ];

  return (
    <div className="auth-tabs" style={{ marginBottom: "20px" }}>
      <div
        className="auth-tabs__nav"
        style={{
          display: "flex",
          backgroundColor: isDarkMode ? "#0c0d1e" : "#f1f5f9",
          border: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid #e2e8f0",
          padding: "4px",
          borderRadius: "10px",
          transition: "all 0.3s ease",
        }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `auth-tabs__btn ${isActive ? "auth-tabs__btn--active" : ""}`
            }
            style={({ isActive }) => ({
              flex: 1,
              textAlign: "center",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: isActive ? 600 : 500,
              textDecoration: "none",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              color: isActive
                ? "#ffffff"
                : isDarkMode
                ? "#94a3b8"
                : "#64748b",
              backgroundColor: isActive ? "#6366f1" : "transparent",
              boxShadow: isActive
                ? "0 2px 8px rgba(99, 102, 241, 0.35)"
                : "none",
            })}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BasicTabs;