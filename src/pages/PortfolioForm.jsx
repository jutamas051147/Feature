import React, { useState, useRef, useEffect } from "react";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { uploadPortfolio } from "../api/upload";
import { useNavigate } from "react-router-dom";
import { filters } from "../components/FilterPopup"; // หรือ path ตามไฟล์จริง


export default function PortfolioForm({ filterData }) {
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

  const [showUniversityPopup, setShowUniversityPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  const navigate = useNavigate();

  const uniRef = useRef(null);
  const yearRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const draft = localStorage.getItem("draftPortfolio");
    if (draft) setForm(JSON.parse(draft));
  }, []);

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

  // ปิด popup ถ้าคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (uniRef.current && !uniRef.current.contains(event.target)) setShowUniversityPopup(false);
      if (yearRef.current && !yearRef.current.contains(event.target)) setShowYearPopup(false);
      if (catRef.current && !catRef.current.contains(event.target)) setShowCategoryPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderFilterField = (label, value, setValue, showPopup, setShowPopup, options, ref) => (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: 5, position: "relative" }} ref={ref}>
      <label style={{ color: "white", marginBottom: 4 ,fontSize: 20}}>{label}</label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
        />
        <div
          onClick={() => setShowPopup(!showPopup)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: showPopup ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)",
            cursor: "pointer",
            userSelect: "none",
            fontSize: 12,
            transition: "transform 0.2s"
          }}
        >▼</div>
{showPopup && options && (
  <>
    {/* Overlay */}
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.5)",
        zIndex: 999
      }}
      onClick={() => setShowPopup(false)}
    />
    {/* Popup */}
    <div
      style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        background: "#fff",
        borderRadius: 8,
        padding: 20,
        zIndex: 1000,
        maxHeight: 400,
        overflowY: "auto"
      }}
    >
      {options.map(opt => (
        <div
          key={opt}
          style={{ padding: "10px", cursor: "pointer" }}
          onClick={() => { setValue(opt); setShowPopup(false); }}
        >
          {opt}
        </div>
      ))}
    </div>
  </>
)}


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
      
      {/* กากบาทมุมบนขวา */}
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
          color: "#ffffffff"
        }}
      >×</button>

      <div style={{
        width: "100%",
        maxWidth: 1000,
        height: "100%",
        backgroundColor: "#ffc1cc",
        borderRadius: 12,
        padding: 20,
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;               /* ความกว้าง scroll */
          }
          ::-webkit-scrollbar-track {
            background: #f0f0f0;      /* สีพื้น scroll track */
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
        }}>
          Upload Portfolio
        </h2>

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

          {/* Filter Fields */}
          {renderFilterField(
            "University :",
            form.university,
            v => setForm({ ...form, university: v }),
            showUniversityPopup,
            setShowUniversityPopup,
            filters?.universityOptions || [],
            uniRef
          )}

          {renderFilterField(
            "Year of project/work/prize :",
            form.year,
            v => setForm({ ...form, year: v }),
            showYearPopup,
            setShowYearPopup,
            filters?.yearOptions || [],
            yearRef
          )}

          {renderFilterField(
            "Category :",
            form.category,
            v => setForm({ ...form, category: v }),
            showCategoryPopup,
            setShowCategoryPopup,
            filters?.categoryOptions || [],
            catRef
          )}


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

