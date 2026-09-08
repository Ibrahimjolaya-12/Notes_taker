import { Route, Routes, Navigate } from "react-router-dom"
import Login from "./Login"
import Register from "./Register"
import Authbar from "../../components/Authbar"
import AuthNav from "../../components/AuthNav"

const Auth = () => {
  return (
    <>
    <div className="auth-wrapper">
    <AuthNav/>
      <div className="auth-card">
        <Authbar />
        <Routes>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </div>
    </div>
    </>
  )
}

export default Auth