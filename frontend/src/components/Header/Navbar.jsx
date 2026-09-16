// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { assets } from "../../assets/greencart_assets/assets";
// import { useState, useEffect } from "react";
// import { Input, Avatar, Dropdown } from "antd";
// import { UserOutlined, LogoutOutlined, ShoppingOutlined } from "@ant-design/icons";

// const { Search } = Input;

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     setToken(localStorage.getItem("token"));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     navigate("/auth/login");
//   };

//   // Avatar Dropdown Menu Items
//   const menuItems = [
//     {
//       key: "1",
//       label: "My Orders",
//       icon: <ShoppingOutlined />,
//       onClick: () => navigate("/my-orders"),
//     },
//     {
//       type: "divider",
//     },
//     {
//       key: "2",
//       label: "Logout",
//       icon: <LogoutOutlined />,
//       danger: true,
//       onClick: handleLogout,
//     },
//   ];

//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
//       <div className="container">
//         {/* Brand Logo */}
//         <Link className="navbar-brand" to="/">
//           <img src={assets.logo} alt="Green-cart" height="32" />
//         </Link>

//         {/* Hamburger Toggle Button */}
//         <button
//           className="navbar-toggler shadow-none border-0"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Nav Links */}
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-lg-center gap-lg-3 gap-2">
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/">
//                 Home
//               </NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/products">
//                 All Products
//               </NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/contact">
//                 Contact
//               </NavLink>
//             </li>

//             {/* Search Input */}
//             <li className="nav-item d-none d-lg-block">
//               <Search placeholder="Search products..." style={{ width: 250 }} />
//             </li>

//             {/* Auth Buttons / Avatar */}
//             {!token ? (
//               <>
//                 <li className="nav-item ms-lg-2">
//                   <button
//                     onClick={() => navigate("/auth/login")}
//                     className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
//                     style={{ backgroundColor: "#4fbf8b" }}
//                   >
//                     Login
//                   </button>
//                 </li>
//                 <li className="nav-item">
//                   <button
//                     onClick={() => navigate("/auth/register")}
//                     className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
//                     style={{ backgroundColor: "#4fbf8b" }}
//                   >
//                     Register
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 {/* Desktop Cart Icon with Badge */}
//                 <li className="nav-item">
//                   <NavLink
//                     className="nav-link position-relative d-inline-block px-2"
//                     to="/my-orders"
//                   >
//                     <i className="fa-solid fa-cart-shopping text-dark fs-5"></i>
//                     <span
//                       className="position-absolute  translate-middle badge rounded-pill"
//                       style={{ backgroundColor: "#4fbf8b", fontSize: "10px" }}
//                     >
//                       1
//                     </span>
//                   </NavLink>
//                 </li>

//                 {/* User Avatar with Dropdown */}
//                 <li className="nav-item ms-lg-2">
//                   <Dropdown
//                     menu={{ items: menuItems }}
//                     trigger={["click"]}
//                     placement="bottomRight"
//                   >
//                     <Avatar
//                       size="default"
//                       icon={<UserOutlined />}
//                       className="cursor-pointer"
//                       style={{
//                         backgroundColor: "#4fbf8b",
//                         cursor: "pointer",
//                       }}
//                     />
//                   </Dropdown>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/greencart_assets/assets";
import { useState, useEffect } from "react";
import { Input, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/auth/login");
  };

  // Avatar Dropdown Menu Items
  const menuItems = [
    {
      key: "1",
      label: "My Orders",
      icon: <ShoppingOutlined />,
      onClick: () => navigate("/my-orders"),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        backgroundColor: isDarkMode ? "#0c0d1e" : "#ffffff",
        borderBottom: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid #e2e8f0",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={assets.logo} alt="Green-cart" height="32" />
        </Link>

        {/* Right Action Icons on Mobile (Theme Toggle + Hamburger) */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <Button
            type="default"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            icon={
              isDarkMode ? (
                <SunOutlined style={{ color: "#ffdb9e", fontSize: "16px" }} />
              ) : (
                <MoonOutlined style={{ color: "#4fbf8b", fontSize: "16px" }} />
              )
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: isDarkMode ? "#1e1b4b" : "#f1f5f9",
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.15)"
                : "#cbd5e1",
            }}
          />

          <button
            className="navbar-toggler shadow-none border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              filter: isDarkMode ? "invert(1)" : "none",
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-lg-center gap-lg-3 gap-2">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                style={{
                  color: isDarkMode ? "#f8fafc" : "#0f172a",
                  fontWeight: 500,
                }}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/products"
                style={{
                  color: isDarkMode ? "#f8fafc" : "#0f172a",
                  fontWeight: 500,
                }}
              >
                All Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/contact"
                style={{
                  color: isDarkMode ? "#f8fafc" : "#0f172a",
                  fontWeight: 500,
                }}
              >
                Contact
              </NavLink>
            </li>

            {/* Search Input */}
            <li className="nav-item d-none d-lg-block">
              <Search
                placeholder="Search products..."
                style={{ width: 220 }}
              />
            </li>

            {/* Desktop Theme Switcher */}
            <li className="nav-item d-none d-lg-block">
              <Button
                type="default"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                icon={
                  isDarkMode ? (
                    <SunOutlined
                      style={{ color: "#ffdb9e", fontSize: "16px" }}
                    />
                  ) : (
                    <MoonOutlined
                      style={{ color: "#4fbf8b", fontSize: "16px" }}
                    />
                  )
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: isDarkMode ? "#1e1b4b" : "#f1f5f9",
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.15)"
                    : "#cbd5e1",
                  cursor: "pointer",
                }}
              />
            </li>

            {/* Auth Buttons / Avatar */}
            {!token ? (
              <>
                <li className="nav-item ms-lg-1">
                  <button
                    onClick={() => navigate("/auth/login")}
                    className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
                    style={{
                      backgroundColor: "#4fbf8b",
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => navigate("/auth/register")}
                    className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
                    style={{
                      backgroundColor: "#4fbf8b",
                      fontWeight: 600,
                    }}
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Cart Icon with Badge */}
                <li className="nav-item">
                  <NavLink
                    className="nav-link position-relative d-inline-block px-2"
                    to="/my-orders"
                  >
                    <i
                      className="fa-solid fa-cart-shopping fs-5"
                      style={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}
                    ></i>
                    <span
                      className="position-absolute translate-middle badge rounded-pill"
                      style={{
                        backgroundColor: "#4fbf8b",
                        fontSize: "10px",
                        top: "8px",
                      }}
                    >
                      1
                    </span>
                  </NavLink>
                </li>

                {/* User Avatar with Dropdown */}
                <li className="nav-item ms-lg-2">
                  <Dropdown
                    menu={{ items: menuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Avatar
                      size="default"
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: "#4fbf8b",
                        cursor: "pointer",
                      }}
                    />
                  </Dropdown>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;