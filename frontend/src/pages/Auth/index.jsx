import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Authbar from "../../components/Authbar";
import AuthNav from "../../components/AuthNav";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const Auth = () => {
  const location = useLocation();

  // Agar URL mein forgot-password ya reset-password ho toh tabs chupa do
  const hideAuthBar =
    location.pathname.includes("forgot-password") ||
    location.pathname.includes("reset-password");

  return (
    <div
      className="auth-wrapper"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 20px", // Top par 80px space taake top navbar ke niche na dabe
        boxSizing: "border-box",
      }}
    >
      {/* Top Navbar: Absolute at top */}
      <AuthNav />

      {/* Main Single Centered Card */}
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          margin: "0 auto",
          zIndex: 2,
        }}
      >
        {/* Sign In / Sign Up tabs */}
        {!hideAuthBar && <Authbar />}

        <Routes>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default Auth;