import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Authbar from "../../components/Authbar";
import AuthNav from "../../components/AuthNav";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const Auth = () => {
  const location = useLocation();

  // Agar URL mein forgot-password ya reset-password aaye toh true ho jayega
  const hideAuthBar =
    location.pathname.includes("forgot-password") ||
    location.pathname.includes("reset-password");

  return (
    <div className="auth-wrapper">
      <AuthNav />
      <div className="auth-card">
        {/* Jab hideAuthBar false hoga, sirf tabhi Authbar show hoga */}
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