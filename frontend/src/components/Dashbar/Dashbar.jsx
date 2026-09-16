// // import { useState, useEffect } from "react";
// // import {
// //   MenuFoldOutlined,
// //   MenuUnfoldOutlined,
// //   HomeOutlined,
// //   CheckSquareOutlined,
// //   MessageOutlined,
// //   UserOutlined,
// //   LogoutOutlined,
// // } from "@ant-design/icons";
// // import { Avatar, Dropdown, Layout, Menu, Grid } from "antd";
// // import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
// // import Dashboard from "../../pages/Dashboard";
// // import logo from "../../assets/book-icon.webp";
// // import Todos from "../../pages/Dashboard/Todos";
// // import Profile from "../../pages/Dashboard/Profile";
// // import axios from "axios";
// // import AIChat from "../../pages/Dashboard/AIChat";
// // import AIToolsHub from "../../pages/Dashboard/AIToolsHub";

// // const { Header, Sider, Content } = Layout;
// // const { useBreakpoint } = Grid;

// // const Dashbar = () => {
// //   const [collapsed, setCollapsed] = useState(false);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [navAvatar, setNavAvatar] = useState("");

// //   // Ant Design Breakpoint Hook
// //   const screens = useBreakpoint();
// //   // md true tab hoga jab screen >= 768px (Tablet / Laptop / Desktop) hogi
// //   const isDesktop = screens.md;

// //   // Jab mobile screen ho to force collapse rakhein
// //   const isSiderCollapsed = !isDesktop ? true : collapsed;

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     navigate("/auth/login");
// //   };

// //   // Sidebar Menu Items
// //   const sidebarMenuItems = [
// //     {
// //       key: "grp-main",
// //       type: "group",
// //       label: isSiderCollapsed ? null : (
// //         <span className="menu-group-title text-center ms-4">Main</span>
// //       ),
// //     },
// //     { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
// //     {
// //       key: "/dashboard/todos",
// //       icon: <CheckSquareOutlined />,
// //       label: "My Todos",
// //     },
// //     { key: "/dashboard/chat", icon: <MessageOutlined />, label: "AI Chat" },
// //     { key: "/dashboard/aiToolsHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>, label: "AI Tools Hub" },
// //     { type: "divider" },
// //     {
// //       key: "logout",
// //       label: "Logout",
// //       icon: <LogoutOutlined />,
// //       danger: true,
// //     },
// //   ];

// //   const handleMenuClick = ({ key }) => {
// //     if (key === "logout") {
// //       handleLogout();
// //       return;
// //     }
// //     navigate(key);
// //   };

// //   const getSelectedKey = () => {
// //     const path = location.pathname;
// //     if (path.startsWith("/dashboard/todos")) return "/dashboard/todos";
// //     if (path.startsWith("/dashboard/chat")) return "/dashboard/chat";
// //     if (path.startsWith("/dashboard/aiToolsHub")) return "/dashboard/aiToolsHub";
// //     if (path.startsWith("/dashboard/profile")) return "/dashboard/profile";
// //     if (path.startsWith("/dashboard/new-subject") || path === "/dashboard")
// //       return "/dashboard";
// //     return path;
// //   };

// //   useEffect(() => {
// //     const fetchNavAvatar = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) return;
// //         const res = await axios.get("https://class-notes-backend.vercel.app/api/avatar/me", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         if (res.data.success && res.data.avatar) {
// //           setNavAvatar(res.data.avatar);
// //         }
// //       } catch (err) {
// //         console.error("FETCH NAV AVATAR ERROR:", err);
// //       }
// //     };
// //     fetchNavAvatar();
// //   }, [location.pathname]);

// //   return (
// //     <Layout className="dashbar-layout" style={{ minHeight: "100vh" }}>
// //       {/* Sidebar */}
// //       <Sider
// //         trigger={null}
// //         collapsible
// //         collapsed={isSiderCollapsed}
// //         collapsedWidth={isDesktop ? 80 : 64}
// //         width={240}
// //         className="dashbar-sider"
// //         style={{
// //           overflow: "auto",
// //           height: "100vh",
// //           position: "sticky",
// //           top: 0,
// //           left: 0,
// //           zIndex: 100,
// //           background: "#001529",
// //         }}
// //       >
// //         <Link to="/dashboard" className="text-center text-decoration-none">
// //           <div
// //             className={`sider-logo d-flex align-items-center gap-2 p-3 ${
// //               isSiderCollapsed ? "justify-content-center" : ""
// //             }`}
// //           >
// //             <img src={logo} style={{ height: "30px" }} alt="ClassNotes Logo" />
// //             {!isSiderCollapsed && (
// //               <span className="fw-bold fs-5 text-white">ClassNotes</span>
// //             )}
// //           </div>
// //         </Link>

// //         <Menu
// //           theme="dark"
// //           mode="inline"
// //           selectedKeys={[getSelectedKey()]}
// //           onClick={handleMenuClick}
// //           items={sidebarMenuItems}
// //         />
// //       </Sider>

// //       {/* Main Screen Layout */}
// //       <Layout className="dashbar-main">
// //         <Header
// //           className="dashbar-header d-flex align-items-center justify-content-between px-3 px-md-4 shadow-sm"
// //           style={{ background: "#090b14", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
// //         >
// //           {/* Toggle button sirf Tablet/Desktop par show hoga */}
// //           <div>
// //             {isDesktop && (
// //               <button
// //                 className="btn d-flex align-items-center justify-content-center p-2 border-0 text-white"
// //                 onClick={() => setCollapsed(!collapsed)}
// //                 style={{ fontSize: "18px", cursor: "pointer" }}
// //               >
// //                 {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
// //               </button>
// //             )}
// //           </div>

// //           <div>
// //             <Dropdown
// //               trigger={["click"]}
// //               placement="bottomRight"
// //               dropdownRender={() => (
// //                 <div
// //                   style={{
// //                     backgroundColor: "#001529",
// //                     borderRadius: "8px",
// //                     padding: "6px",
// //                     boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
// //                     minWidth: "150px",
// //                   }}
// //                 >
// //                   {/* Profile Option */}
// //                   <div
// //                     onClick={() => navigate("/dashboard/profile")}
// //                     style={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "10px",
// //                       padding: "8px 12px",
// //                       color: "#ffffff",
// //                       cursor: "pointer",
// //                       borderRadius: "6px",
// //                       fontSize: "14px",
// //                       transition: "background 0.2s",
// //                     }}
// //                     onMouseEnter={(e) =>
// //                       (e.currentTarget.style.backgroundColor = "#11263c")
// //                     }
// //                     onMouseLeave={(e) =>
// //                       (e.currentTarget.style.backgroundColor = "transparent")
// //                     }
// //                   >
// //                     <UserOutlined />
// //                     <span>Profile</span>
// //                   </div>

// //                   {/* Divider */}
// //                   <div
// //                     style={{
// //                       height: "1px",
// //                       backgroundColor: "rgba(255, 255, 255, 0.12)",
// //                       margin: "6px 0",
// //                     }}
// //                   />

// //                   {/* Logout Option */}
// //                   <div
// //                     onClick={handleLogout}
// //                     style={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "10px",
// //                       padding: "8px 12px",
// //                       color: "#ff4d4f",
// //                       cursor: "pointer",
// //                       borderRadius: "6px",
// //                       fontSize: "14px",
// //                       transition: "background 0.2s",
// //                     }}
// //                     onMouseEnter={(e) =>
// //                       (e.currentTarget.style.backgroundColor = "#2a1215")
// //                     }
// //                     onMouseLeave={(e) =>
// //                       (e.currentTarget.style.backgroundColor = "transparent")
// //                     }
// //                   >
// //                     <LogoutOutlined />
// //                     <span>Logout</span>
// //                   </div>
// //                 </div>
// //               )}
// //             >
// //               <Avatar
// //                 size="default"
// //                 src={navAvatar || undefined}
// //                 icon={!navAvatar && <UserOutlined />}
// //                 style={{
// //                   backgroundColor: navAvatar ? "transparent" : "#5e5e5e",
// //                   cursor: "pointer",
// //                   border: navAvatar ? "1px solid #2e3875" : "none",
// //                 }}
// //               />
// //             </Dropdown>
// //           </div>
// //         </Header>

// //         <Content
// //           className="dashbar-content p-2 p-md-4"
// //           style={{ backgroundColor: "#02030d", minHeight: "calc(100vh - 64px)" }}
// //         >
// //           <Routes>
// //             <Route path="todos/*" element={<Todos />} />
// //             <Route path="profile" element={<Profile />} />
// //             <Route path="chat" element={<AIChat />} />
// //             <Route path="aiToolsHub" element={<AIToolsHub />} />
// //             <Route path="/*" element={<Dashboard />} />
// //           </Routes>
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // };

// // export default Dashbar;

// import { useState, useEffect } from "react";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   HomeOutlined,
//   CheckSquareOutlined,
//   MessageOutlined,
//   UserOutlined,
//   LogoutOutlined,
//   SunOutlined,
//   MoonOutlined,
// } from "@ant-design/icons";
// import { Avatar, Dropdown, Layout, Menu, Grid, Button } from "antd";
// import {
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
//   Link,
// } from "react-router-dom";
// import Dashboard from "../../pages/Dashboard";
// import logo from "../../assets/book-icon.webp";
// import Todos from "../../pages/Dashboard/Todos";
// import Profile from "../../pages/Dashboard/Profile";
// import axios from "axios";
// import AIChat from "../../pages/Dashboard/AIChat";
// import AIToolsHub from "../../pages/Dashboard/AIToolsHub";
// import { useTheme } from "../../context/ThemeContext";

// const { Header, Sider, Content } = Layout;
// const { useBreakpoint } = Grid;

// const Dashbar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [navAvatar, setNavAvatar] = useState("");
//   const { isDarkMode, toggleTheme } = useTheme();

//   const screens = useBreakpoint();
//   const isDesktop = screens.md;
//   const isSiderCollapsed = !isDesktop ? true : collapsed;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/auth/login");
//   };

//   const sidebarMenuItems = [
//     {
//       key: "grp-main",
//       type: "group",
//       label: isSiderCollapsed ? null : (
//         <span className="menu-group-title text-center ms-4">Main</span>
//       ),
//     },
//     { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
//     {
//       key: "/dashboard/todos",
//       icon: <CheckSquareOutlined />,
//       label: "My Todos",
//     },
//     { key: "/dashboard/chat", icon: <MessageOutlined />, label: "AI Chat" },
//     {
//       key: "/dashboard/aiToolsHub",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="lucide lucide-sparkles"
//         >
//           <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
//           <path d="M20 2v4" />
//           <path d="M22 4h-4" />
//           <circle cx="4" cy="20" r="2" />
//         </svg>
//       ),
//       label: "AI Tools Hub",
//     },
//     { type: "divider" },
//     {
//       key: "logout",
//       label: "Logout",
//       icon: <LogoutOutlined />,
//       danger: true,
//     },
//   ];

//   const handleMenuClick = ({ key }) => {
//     if (key === "logout") {
//       handleLogout();
//       return;
//     }
//     navigate(key);
//   };

//   const getSelectedKey = () => {
//     const path = location.pathname;
//     if (path.startsWith("/dashboard/todos")) return "/dashboard/todos";
//     if (path.startsWith("/dashboard/chat")) return "/dashboard/chat";
//     if (path.startsWith("/dashboard/aiToolsHub"))
//       return "/dashboard/aiToolsHub";
//     if (path.startsWith("/dashboard/profile")) return "/dashboard/profile";
//     if (path.startsWith("/dashboard/new-subject") || path === "/dashboard")
//       return "/dashboard";
//     return path;
//   };

//   useEffect(() => {
//     const fetchNavAvatar = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const res = await axios.get(
//           "https://class-notes-backend.vercel.app/api/avatar/me",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         if (res.data.success && res.data.avatar) {
//           setNavAvatar(res.data.avatar);
//         }
//       } catch (err) {
//         console.error("FETCH NAV AVATAR ERROR:", err);
//       }
//     };
//     fetchNavAvatar();
//   }, [location.pathname]);

//   return (
//     <Layout className="dashbar-layout" style={{ minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Sider
//         trigger={null}
//         collapsible
//         collapsed={isSiderCollapsed}
//         collapsedWidth={isDesktop ? 80 : 64}
//         width={240}
//         className="dashbar-sider"
//         style={{
//           overflow: "auto",
//           height: "100vh",
//           position: "sticky",
//           top: 0,
//           left: 0,
//           zIndex: 100,
//           background: isDarkMode ? "#001529" : "#ffffff",
//           borderRight: isDarkMode
//             ? "1px solid rgba(255,255,255,0.08)"
//             : "1px solid #e2e8f0",
//           transition: "background 0.3s ease",
//         }}
//       >
//         <Link to="/dashboard" className="text-center text-decoration-none">
//           <div
//             className={`sider-logo d-flex align-items-center gap-2 p-3 ${
//               isSiderCollapsed ? "justify-content-center" : ""
//             }`}
//           >
//             <img src={logo} style={{ height: "30px" }} alt="ClassNotes Logo" />
//             {!isSiderCollapsed && (
//               <span
//                 className={`fw-bold fs-5 ${
//                   isDarkMode ? "text-white" : "text-dark"
//                 }`}
//               >
//                 ClassNotes
//               </span>
//             )}
//           </div>
//         </Link>

//         <Menu
//           theme={isDarkMode ? "dark" : "light"}
//           mode="inline"
//           selectedKeys={[getSelectedKey()]}
//           onClick={handleMenuClick}
//           items={sidebarMenuItems}
//           style={{
//             background: "transparent",
//             borderRight: "none",
//           }}
//         />
//       </Sider>

//       {/* Main Screen Layout */}
//       <Layout className="dashbar-main">
//         <Header
//           className="dashbar-header d-flex align-items-center justify-content-between px-3 px-md-4 shadow-sm"
//           style={{
//             background: isDarkMode ? "#090b14" : "#ffffff",
//             borderBottom: isDarkMode
//               ? "1px solid rgba(255,255,255,0.08)"
//               : "1px solid #e2e8f0",
//             transition: "all 0.3s ease",
//           }}
//         >
//           {/* Toggle button sirf Tablet/Desktop par show hoga */}
//           <div>
//             {isDesktop && (
//               <button
//                 className={`btn d-flex align-items-center justify-content-center p-2 border-0 ${
//                   isDarkMode ? "text-white" : "text-dark"
//                 }`}
//                 onClick={() => setCollapsed(!collapsed)}
//                 style={{ fontSize: "18px", cursor: "pointer" }}
//               >
//                 {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//               </button>
//             )}
//           </div>

//           {/* Right Header Actions: Theme Switcher & User Avatar */}
//           <div className="d-flex align-items-center gap-3">
//             {/* Theme Toggle Button */}
//             <Button
//               type="default"
//               onClick={toggleTheme}
//               aria-label="Toggle Theme"
//               icon={
//                 isDarkMode ? (
//                   <SunOutlined style={{ color: "#f59e0b", fontSize: "17px" }} />
//                 ) : (
//                   <MoonOutlined
//                     style={{ color: "#4f46e5", fontSize: "17px" }}
//                   />
//                 )
//               }
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "38px",
//                 height: "38px",
//                 borderRadius: "8px",
//                 backgroundColor: isDarkMode ? "#1e1b4b" : "#e0e7ff",
//                 borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "#c7d2fe",
//                 cursor: "pointer",
//                 boxShadow: "none",
//               }}
//             />

//             {/* Profile Dropdown */}
//             <Dropdown
//               trigger={["click"]}
//               placement="bottomRight"
//               dropdownRender={() => (
//                 <div
//                   style={{
//                     backgroundColor: isDarkMode ? "#001529" : "#ffffff",
//                     borderRadius: "8px",
//                     padding: "6px",
//                     boxShadow: isDarkMode
//                       ? "0 4px 16px rgba(0,0,0,0.5)"
//                       : "0 4px 16px rgba(0,0,0,0.1)",
//                     minWidth: "150px",
//                     border: isDarkMode
//                       ? "1px solid rgba(255,255,255,0.1)"
//                       : "1px solid #e2e8f0",
//                   }}
//                 >
//                   {/* Profile Option */}
//                   <div
//                     onClick={() => navigate("/dashboard/profile")}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       padding: "8px 12px",
//                       color: isDarkMode ? "#ffffff" : "#0f172a",
//                       cursor: "pointer",
//                       borderRadius: "6px",
//                       fontSize: "14px",
//                       transition: "background 0.2s",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = isDarkMode
//                         ? "#11263c"
//                         : "#f1f5f9")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "transparent")
//                     }
//                   >
//                     <UserOutlined />
//                     <span>Profile</span>
//                   </div>

//                   {/* Divider */}
//                   <div
//                     style={{
//                       height: "1px",
//                       backgroundColor: isDarkMode
//                         ? "rgba(255, 255, 255, 0.12)"
//                         : "#e2e8f0",
//                       margin: "6px 0",
//                     }}
//                   />

//                   {/* Logout Option */}
//                   <div
//                     onClick={handleLogout}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       padding: "8px 12px",
//                       color: "#ff4d4f",
//                       cursor: "pointer",
//                       borderRadius: "6px",
//                       fontSize: "14px",
//                       transition: "background 0.2s",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = isDarkMode
//                         ? "#2a1215"
//                         : "#fee2e2")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "transparent")
//                     }
//                   >
//                     <LogoutOutlined />
//                     <span>Logout</span>
//                   </div>
//                 </div>
//               )}
//             >
//               <Avatar
//                 size="default"
//                 src={navAvatar || undefined}
//                 icon={!navAvatar && <UserOutlined />}
//                 style={{
//                   backgroundColor: navAvatar ? "transparent" : "#5e5e5e",
//                   cursor: "pointer",
//                   border: navAvatar
//                     ? "1px solid #6366f1"
//                     : isDarkMode
//                       ? "1px solid rgba(255,255,255,0.2)"
//                       : "1px solid #cbd5e1",
//                 }}
//               />
//             </Dropdown>
//           </div>
//         </Header>

//         {/* Content View */}
//         <Content
//           className="dashbar-content p-2 p-md-4"
//           style={{
//             backgroundColor: isDarkMode ? "#02030d" : "#f8fafc",
//             minHeight: "calc(100vh - 64px)",
//             transition: "background-color 0.3s ease",
//           }}
//         >
//           <Routes>
//             <Route path="todos/*" element={<Todos />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="chat" element={<AIChat />} />
//             <Route path="aiToolsHub" element={<AIToolsHub />} />
//             <Route path="/*" element={<Dashboard />} />
//           </Routes>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default Dashbar;





import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Grid, Button } from "antd";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import logo from "../../assets/book-icon.webp";
import Todos from "../../pages/Dashboard/Todos";
import Profile from "../../pages/Dashboard/Profile";
import axios from "axios";
import AIChat from "../../pages/Dashboard/AIChat";
import AIToolsHub from "../../pages/Dashboard/AIToolsHub";
import { useTheme } from "../../context/ThemeContext";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const Dashbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [navAvatar, setNavAvatar] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();

  const screens = useBreakpoint();
  const isDesktop = screens.md;
  const isSiderCollapsed = !isDesktop ? true : collapsed;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const sidebarMenuItems = [
    {
      key: "grp-main",
      type: "group",
      label: isSiderCollapsed ? null : (
        <span
          className="menu-group-title"
          style={{
            color: isDarkMode ? "#64748b" : "#94a3b8",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginLeft: "8px",
          }}
        >
          Main
        </span>
      ),
    },
    { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      key: "/dashboard/todos",
      icon: <CheckSquareOutlined />,
      label: "My Todos",
    },
    { key: "/dashboard/chat", icon: <MessageOutlined />, label: "AI Chat" },
    {
      key: "/dashboard/aiToolsHub",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
          <path d="M20 2v4" />
          <path d="M22 4h-4" />
          <circle cx="4" cy="20" r="2" />
        </svg>
      ),
      label: "AI Tools Hub",
    },
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
        const res = await axios.get(
          "https://class-notes-backend.vercel.app/api/avatar/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    <Layout
      className="dashbar-layout"
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#02030d" : "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        theme={isDarkMode ? "dark" : "light"}
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
          backgroundColor: isDarkMode ? "#060713" : "#ffffff",
          borderRight: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid #e2e8f0",
          transition: "all 0.3s ease",
        }}
      >
        <Link to="/dashboard" className="text-center text-decoration-none">
          <div
            className={`sider-logo d-flex align-items-center gap-2 p-3 ${
              isSiderCollapsed ? "justify-content-center" : ""
            }`}
          >
            <img src={logo} style={{ height: "30px", width: "auto" }} alt="ClassNotes Logo" />
            {!isSiderCollapsed && (
              <span
                className="fw-bold fs-5"
                style={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                  transition: "color 0.3s ease",
                }}
              >
                ClassNotes
              </span>
            )}
          </div>
        </Link>

        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={sidebarMenuItems}
          style={{
            backgroundColor: "transparent",
            borderRight: "none",
          }}
        />
      </Sider>

      {/* Main Screen Layout */}
      <Layout
        className="dashbar-main"
        style={{
          backgroundColor: isDarkMode ? "#02030d" : "#f8fafc",
          transition: "background-color 0.3s ease",
        }}
      >
        <Header
          className="dashbar-header d-flex align-items-center justify-content-between px-3 px-md-4 shadow-sm"
          style={{
            background: isDarkMode ? "#090b14" : "#ffffff",
            borderBottom: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid #e2e8f0",
            height: "64px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Collapse Burger Button */}
          <div>
            {isDesktop && (
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "6px",
                  transition: "color 0.2s ease",
                }}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
            )}
          </div>

          {/* Right Header Actions: Theme Switcher & User Avatar */}
          <div className="d-flex align-items-center gap-3">
            <Button
              type="default"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              icon={
                isDarkMode ? (
                  <SunOutlined style={{ color: "#f59e0b", fontSize: "17px" }} />
                ) : (
                  <MoonOutlined style={{ color: "#4f46e5", fontSize: "17px" }} />
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
                  ? "rgba(255,255,255,0.15)"
                  : "#c7d2fe",
                cursor: "pointer",
                boxShadow: "none",
                transition: "all 0.3s ease",
              }}
            />

            {/* Profile Dropdown */}
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div
                  style={{
                    backgroundColor: isDarkMode ? "#090b14" : "#ffffff",
                    borderRadius: "8px",
                    padding: "6px",
                    boxShadow: isDarkMode
                      ? "0 4px 16px rgba(0,0,0,0.5)"
                      : "0 4px 16px rgba(0,0,0,0.08)",
                    minWidth: "150px",
                    border: isDarkMode
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e2e8f0",
                  }}
                >
                  <div
                    onClick={() => navigate("/dashboard/profile")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      color: isDarkMode ? "#ffffff" : "#0f172a",
                      cursor: "pointer",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#13172e"
                        : "#f1f5f9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <UserOutlined />
                    <span>Profile</span>
                  </div>

                  <div
                    style={{
                      height: "1px",
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "#e2e8f0",
                      margin: "6px 0",
                    }}
                  />

                  <div
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      color: "#ef4444",
                      cursor: "pointer",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#2a1215"
                        : "#fee2e2")
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
                  backgroundColor: navAvatar ? "transparent" : isDarkMode ? "#334155" : "#e2e8f0",
                  color: isDarkMode ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  border: navAvatar
                    ? "2px solid #6366f1"
                    : isDarkMode
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #cbd5e1",
                }}
              />
            </Dropdown>
          </div>
        </Header>

        {/* Content View */}
        <Content
          className="dashbar-content p-2 p-md-4"
          style={{
            backgroundColor: isDarkMode ? "#02030d" : "#f8fafc",
            minHeight: "calc(100vh - 64px)",
            transition: "background-color 0.3s ease",
          }}
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