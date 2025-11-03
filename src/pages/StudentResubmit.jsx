// src/pages/StudentResubmit.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { resubmitPortfolio } from "../api/resubmit";
import { getPortfolio } from "../api/portfolio";

export default function StudentResubmit() {
  const { id } = useParams(); // id ของ portfolio ที่ fall
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    university: "",
    year: "",
    category: "",
    description: "",
    files: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // โหลด draft/fall portfolio จาก localStorage หรือ API
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const data = await getPortfolio(id);
        setForm({
          title: data.title || "",
          university: data.university || "",
          year: data.year || "",
          category: data.category || "",
          description: data.desc || "",
          files: data.files || [],
        });
      } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", err);
    fetchPortfolio();
  }, [id]);

  const handleFileChange = (files) => setForm(f => ({ ...f, files }));

  const handleResubmit = async (e) => {
    e.preventDefault();
    const v = validateFiles(form.files);
    if (!v.ok) return setError(v.msg);

    setError(""); 
    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("desc", form.description);
    form.files.forEach(file => fd.append("file", file));

    try {
      await resubmitPortfolio(id, fd);
      navigate("/dashboard"); // หลัง resubmit กลับ dashboard
    } catch (err) {
      setError(err.message || "Resubmit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      backgroundColor: "#ff6b2b",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative",
      padding: 20,
      fontSize: 20,
      fontFamily: "sans-serif"
    }}>
      
      {/* กากบาทมุมบนขวา */}
      <button
        onClick={() => navigate("/fall-status-error")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          border: "none",
          background: "transparent",
          fontSize: 50,
          fontWeight: "bold",
          cursor: "pointer",
          color: "#ffffffff"
        }}
      >×</button>

      <div style={{
        width: "100%",
        maxWidth: 1000,
        height: "calc(100vh - 40px)",
        backgroundColor: "#ff6b2b",
        borderRadius: 12,
        padding: 20,
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        <style>
          {`
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #f0f0f0;
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb {
              background-color: #85a2bfff;
              border-radius: 4px;
            }
          `}
        </style>

        <h2 style={{
          textAlign: "center",
          color: "#e4b94cff",
          marginBottom: 10,
          fontSize: 55,
          fontWeight: "bold",
          fontFamily: "Poppins"
        }}>
          Edit Portfolio
        </h2>

        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}

        <form onSubmit={handleResubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <div style={{ marginBottom: 5 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>Title :</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          {/* University Filter */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>University :</label>
            <UniversityFilterModal
              value={form.university}
              onChange={v => setForm({ ...form, university: v })}
            />
          </div>

          {/* Year Filter */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>Year of project/work/prize :</label>
            <YearFilterModal
              value={form.year}
              onChange={v => setForm({ ...form, year: v })}
            />
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: 10 }}>
            <CategoryFilterModal
              value={form.category}
              onChange={v => setForm({ ...form, category: v })}
            />
          </div>

          {/* FileInput */}
          <div style={{ marginBottom: 5 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4}}>Attach Files (at least one picture max ten picture) :</label>
            <FileInput files={form.files} onChange={handleFileChange} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 2 }}>
            <label style={{ color: "white", display: "block", marginBottom: 4 }}>Description :</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          {/* Resubmit Button */}
          <div style={{ margin: "0 auto", marginTop: 15}}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                fontSize: 16,
                border: "1px solid #edd54eff",
                background: "#edd54eff",
                color: "#000000ff",
                margin: "0 auto"
              }}
            >
              {loading ? "Resubmitting..." : "Resubmit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
