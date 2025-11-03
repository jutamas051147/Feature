// src/api/portfolio.js
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";
export async function getPortfolio(id) {
  const res = await fetch(`http://localhost:3000/api/portfolio/${id}`);
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return await res.json();
}

