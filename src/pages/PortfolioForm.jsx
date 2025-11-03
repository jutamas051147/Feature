import React, { useState } from "react";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { uploadPortfolio } from "../api/upload";
import { useNavigate } from "react-router-dom";

import UniversityFilterModal from "../components/UniversityFilterModal";
import YearFilterModal from "../components/YearFilterModal";
import CategoryFilterModal from "../components/CategoryFilterModal";

export default function PortfolioForm() {
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
  const navigate = useNavigate();

  const handleFileChange = (files) => setForm(f => ({ ...f, files }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateFiles(form.files);
    if (!v.ok) return setError(v.msg);
    setError(""); setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("desc", form.description);
    form.files.forEach(file => fd.append("file", file));

    try {
      const result = await uploadPortfolio(fd);
      console.log("uploaded:", result);
      localStorage.removeItem("draftPortfolio");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      backgroundColor: "#ffc1cc",
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
      {/* Close button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          border: "none",
          background: "transparent",
          fontSize: 50,
          fontWeight: "bold",
          cursor: "pointer",
          color: "#fff"
        }}
      >×</button>

      <div style={{
  width: "100%",
  maxWidth: 1000,
  height: "calc(100vh - 40px)", // หรือ height ตามต้องการ
  backgroundColor: "#ffc1cc",
  borderRadius: 12,
  padding: 20,
  boxSizing: "border-box",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",  // scroll ขึ้นลง
  overflowX: "hidden", // ป้องกัน scroll ซ้ายขวา
}}>
      <style>
{`
  ::-webkit-scrollbar {
    width: 8px; /* ความกว้าง scroll */
  }
  ::-webkit-scrollbar-track {
    background: #f0f0f0; /* สีพื้น scroll track */
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #85a2bfff; /* สี scroll thumb */
    border-radius: 4px;
  }
`}
</style>


        <h2 style={{
          textAlign: "center",
          color: "#5b8db8",
          marginBottom: 10,
          fontSize: 55,
          fontWeight: "bold",
          fontFamily: "Poppins"
        }}>Upload Portfolio</h2>

        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
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

          {/* File Input */}
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

          {/* Buttons */}
          <div style={{ display: "flex", gap: 450, marginTop: 10 }}>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("draftPortfolio", JSON.stringify(form));
                navigate("/PortfolioDetail");
              }}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                fontSize: 15,
                border: "1px solid #c0bdbdff",
                background: "#c2bcbcff",
                color: "#000"
              }}
            >
              Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                fontSize: 15,
                border: "1px solid #5b8db8",
                background: "#5b8db8",
                color: "#fff"
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  );
}

