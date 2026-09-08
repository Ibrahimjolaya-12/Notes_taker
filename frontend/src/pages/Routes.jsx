import { Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import Frontend from "./Frontend";
import Dashbar from "../components/Dashbar/Dashbar";
import ProtectedRoute from "../Config/ProtectedRoute";

const Index = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashbar />
        </ProtectedRoute>
        } />
      <Route path="/*" element={<Frontend />} />
    </Routes>
  );
};

export default Index;