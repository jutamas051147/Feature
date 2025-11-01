import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPortfolio from "./pages/UploadPortfolio";
import Lobby from "./pages/Lobby";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/upload" element={<UploadPortfolio />} />
    </Routes>
  );
}




