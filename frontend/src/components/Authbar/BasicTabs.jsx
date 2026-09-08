import "./Tabs.scss";
import { NavLink } from "react-router-dom";

const BasicTabs = () => {
  const tabs = [
    { id: "login", label: "Sign in", path: "/auth/login" },
    { id: "register", label: "Sign up", path: "/auth/register" },
  ];

  return (
    <div className="auth-tabs">
      <div className="auth-tabs__nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `auth-tabs__btn ${isActive ? "auth-tabs__btn--active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BasicTabs;