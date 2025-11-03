// src/api/upload.js
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

export async function uploadPortfolio(formData, token) {
  const res = await fetch(`${BASE}/api/portfolio`, {
    method: "POST",
    headers: {
      // ถ้าใช้ token ใส่ Authorization
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: formData, // browser จะตั้ง multipart/form-data ให้เอง
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data; // { message, data }
}

