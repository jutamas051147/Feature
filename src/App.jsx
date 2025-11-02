import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPortfolio from "./pages/UploadPortfolio";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadPortfolio />} />
    </Routes>
  );
}




