import { message } from "antd";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Check karo ke token exist karta hai aur "null"/"undefined" string nahi hai
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    message.error("Please login youself first")
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;