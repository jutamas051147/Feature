import React from "react";
import { Routes, Route } from "react-router-dom";
import PortfolioForm from "./pages/PortfolioForm";
import Dashboard from "./pages/Dashboard";
import PortfolioDetail from "./pages/PortfolioDetail";
import EditPage from "./pages/EditPage";
import StudentResubmit from "./pages/StudentResubmit";
import AdminReview from "./pages/AdvisorReview";
import SuperReview from "./pages/SuperReview";
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
        <Route path="/admin/review/:id" element={<AdminReview />} />
        <Route path="/admin/super-review/:id" element={<SuperReview />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}










