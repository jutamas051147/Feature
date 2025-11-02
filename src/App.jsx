import React from "react";
import { Routes, Route } from "react-router-dom";
import PortfolioForm from "./pages/PortfolioForm";
import Dashboard from "./pages/Dashboard";
import PortfolioDetail from "./pages/PortfolioDetail";
import EditPage from "./pages/EditPage";
import StudentResubmit from "./pages/StudentResubmit";
import AdminReview from "./pages/AdminReview";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <div style={{ backgroundColor: "#ffc1cc", minHeight: "100vh" }}>
      <Routes>
        <Route path="/portfolio-form" element={<PortfolioForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/PortfolioDetail" element={<PortfolioDetail />} />
        <Route path="/editpage/:id" element={<EditPage />} />
        <Route path="/resubmit/:id" element={<StudentResubmit />} />
        <Route path="/adminadvisor-review/:id" element={<AdminReview role="adminadvisor" />} />
        <Route path="/superadmin-review/:id" element={<AdminReview role="superadmin" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}










