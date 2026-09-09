import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Grid } from "antd";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import logo from "../../assets/book-icon.webp";
import Todos from "../../pages/Dashboard/Todos";
import Profile from "../../pages/Dashboard/Profile";
import axios from "axios";
import AIChat from "../../pages/Dashboard/AIChat";
import AIToolsHub from "../../pages/Dashboard/AIToolsHub";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const Dashbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [navAvatar, setNavAvatar] = useState("");

  // Ant Design Breakpoint Hook
  const screens = useBreakpoint();
  // md true tab hoga jab screen >= 768px (Tablet / Laptop / Desktop) hogi
  const isDesktop = screens.md;

  // Jab mobile screen ho to force collapse rakhein
  const isSiderCollapsed = !isDesktop ? true : collapsed;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  // Sidebar Menu Items
  const sidebarMenuItems = [
    {
      key: "grp-main",
      type: "group",
      label: isSiderCollapsed ? null : (
        <span className="menu-group-title text-center ms-4">Main</span>
      ),
    },
    { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      key: "/dashboard/todos",
      icon: <CheckSquareOutlined />,
      label: "My Todos",
    },
    { key: "/dashboard/chat", icon: <MessageOutlined />, label: "AI Chat" },
    { key: "/dashboard/aiToolsHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>, label: "AI Tools Hub" },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
      return;
    }
    navigate(key);
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/todos")) return "/dashboard/todos";
    if (path.startsWith("/dashboard/chat")) return "/dashboard/chat";
    if (path.startsWith("/dashboard/aiToolsHub")) return "/dashboard/aiToolsHub";
    if (path.startsWith("/dashboard/profile")) return "/dashboard/profile";
    if (path.startsWith("/dashboard/new-subject") || path === "/dashboard")
      return "/dashboard";
    return path;
  };

  useEffect(() => {
    const fetchNavAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("https://class-notes-backend.vercel.app/api/avatar/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.avatar) {
          setNavAvatar(res.data.avatar);
        }
      } catch (err) {
        console.error("FETCH NAV AVATAR ERROR:", err);
      }
    };
    fetchNavAvatar();
  }, [location.pathname]);

  return (
    <Layout className="dashbar-layout" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={isSiderCollapsed}
        collapsedWidth={isDesktop ? 80 : 64}
        width={240}
        className="dashbar-sider"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 100,
          background: "#001529",
        }}
      >
        <Link to="/dashboard" className="text-center text-decoration-none">
          <div
            className={`sider-logo d-flex align-items-center gap-2 p-3 ${
              isSiderCollapsed ? "justify-content-center" : ""
            }`}
          >
            <img src={logo} style={{ height: "30px" }} alt="ClassNotes Logo" />
            {!isSiderCollapsed && (
              <span className="fw-bold fs-5 text-white">ClassNotes</span>
            )}
          </div>
        </Link>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={sidebarMenuItems}
        />
      </Sider>

      {/* Main Screen Layout */}
      <Layout className="dashbar-main">
        <Header
          className="dashbar-header d-flex align-items-center justify-content-between px-3 px-md-4 shadow-sm"
          style={{ background: "#090b14", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Toggle button sirf Tablet/Desktop par show hoga */}
          <div>
            {isDesktop && (
              <button
                className="btn d-flex align-items-center justify-content-center p-2 border-0 text-white"
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "18px", cursor: "pointer" }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
            )}
          </div>

          <div>
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div
                  style={{
                    backgroundColor: "#001529",
                    borderRadius: "8px",
                    padding: "6px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    minWidth: "150px",
                  }}
                >
                  {/* Profile Option */}
                  <div
                    onClick={() => navigate("/dashboard/profile")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      color: "#ffffff",
                      cursor: "pointer",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#11263c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <UserOutlined />
                    <span>Profile</span>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      margin: "6px 0",
                    }}
                  />

                  {/* Logout Option */}
                  <div
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      color: "#ff4d4f",
                      cursor: "pointer",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2a1215")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <LogoutOutlined />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            >
              <Avatar
                size="default"
                src={navAvatar || undefined}
                icon={!navAvatar && <UserOutlined />}
                style={{
                  backgroundColor: navAvatar ? "transparent" : "#5e5e5e",
                  cursor: "pointer",
                  border: navAvatar ? "1px solid #2e3875" : "none",
                }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          className="dashbar-content p-2 p-md-4"
          style={{ backgroundColor: "#02030d", minHeight: "calc(100vh - 64px)" }}
        >
          <Routes>
            <Route path="todos/*" element={<Todos />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="aiToolsHub" element={<AIToolsHub />} />
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashbar;