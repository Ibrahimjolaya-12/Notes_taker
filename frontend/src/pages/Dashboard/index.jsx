// Dashboard.jsx
import { Route, Routes } from "react-router-dom";
import Dashhome from "./Dashhome";
import SubjectCard from "./SubjectCard";
import IndividualCards from "./IndividualCards";
import Profile from "./Profile";

const Dashboard = () => {
  return (
    <Routes>
      <Route index element={<Dashhome />} />
      <Route path="new-subject" element={<SubjectCard />} />
      <Route path=":id" element={<IndividualCards />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default Dashboard;