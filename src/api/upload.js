// src/api/upload.js

// BASE API URL จาก .env หรือ fallback เป็น localhost
const BASE = import.meta.env.VITE_API_BASE;

/**
 * Upload portfolio form with files
 * @param {FormData} formData - FormData object containing title, description, files, etc.
 * @param {string} [token] - optional Bearer token for authorization
 * @returns {Promise<Object>} - JSON response from server
 */
export async function uploadPortfolio(formData, token) {
  const res = await fetch(`${BASE}/api/portfolio`, {
    method: "POST",
    headers: {
      // ถ้าใช้ token ให้ใส่ Authorization
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: formData, // browser จะตั้ง multipart/form-data อัตโนมัติ
  });

  // อ่าน response จาก server
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}

