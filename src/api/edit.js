// src/api/edit.js
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

export async function editPortfolio(id, formData) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    method: "PUT",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Edit failed");
  return data;
}
