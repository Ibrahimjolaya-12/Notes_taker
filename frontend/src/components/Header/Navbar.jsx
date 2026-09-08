import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/greencart_assets/assets";
import { useState, useEffect } from "react";
import { Input, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, ShoppingOutlined } from "@ant-design/icons";

const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

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
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <img src={assets.logo} alt="Green-cart" height="32" />
        </Link>

        {/* Hamburger Toggle Button */}
        <button
          className="navbar-toggler shadow-none border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-lg-center gap-lg-3 gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                All Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>

            {/* Search Input */}
            <li className="nav-item d-none d-lg-block">
              <Search placeholder="Search products..." style={{ width: 250 }} />
            </li>

            {/* Auth Buttons / Avatar */}
            {!token ? (
              <>
                <li className="nav-item ms-lg-2">
                  <button
                    onClick={() => navigate("/auth/login")}
                    className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
                    style={{ backgroundColor: "#4fbf8b" }}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => navigate("/auth/register")}
                    className="border-0 rounded-pill px-4 py-2 btn-sm text-white w-100"
                    style={{ backgroundColor: "#4fbf8b" }}
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Desktop Cart Icon with Badge */}
                <li className="nav-item">
                  <NavLink
                    className="nav-link position-relative d-inline-block px-2"
                    to="/my-orders"
                  >
                    <i className="fa-solid fa-cart-shopping text-dark fs-5"></i>
                    <span
                      className="position-absolute  translate-middle badge rounded-pill"
                      style={{ backgroundColor: "#4fbf8b", fontSize: "10px" }}
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
                      className="cursor-pointer"
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