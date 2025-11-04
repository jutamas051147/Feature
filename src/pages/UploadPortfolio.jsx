import React, { useState, useRef, useEffect } from "react";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { uploadPortfolio } from "../api/upload";
import { useNavigate } from "react-router-dom";


export default function UploadPortfolio() {
  const [form, setForm] = useState({
    title: "",
    university: [],
    year: [],
    category: [],
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

  const filters = {
    universityOptions: ["KMUTT", "KU", "SWU", "CU", "BU", "TU", "MU", "KMITL", "RSU"],
    yearOptions: ["2020", "2021", "2022", "2023", "2024", "2025"],
    categoryOptions: [
      "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
      "IOT", "Gaming", "Web Development", "Coding", "Data Science",
      "Hackathon", "Bigdata", "Data Analytics"
    ]
  };

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
    fd.append("university", JSON.stringify(form.university));
    fd.append("year", JSON.stringify(form.year));
    fd.append("category", JSON.stringify(form.category));
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

  const renderMultiFilter = (label, values, setValues, showPopup, setShowPopup, options, ref) => (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: 5,fontSize: 12, position: "relative" }} ref={ref}>
      <label style={{ color: "white", marginBottom: 4 ,fontSize: 20}}>{label}</label>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          onClick={() => setShowPopup(!showPopup)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: 12,
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          {values.length > 0 ? values.join(", ") : "Select..."}
          <span style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: showPopup ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)",
            fontSize: 12,
            transition: "transform 0.2s",
            userSelect: "none"
          }}>▼</span>
        </div>

        {showPopup && options && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            zIndex: 10,
            marginTop: 2,
            maxHeight: 150,
            overflowY: "auto"
          }}>
            {options.map(opt => {
              const isSelected = values.includes(opt);
              return (
                <div key={opt}
                  onClick={() => {
                    if (isSelected) {
                      setValues(values.filter(v => v !== opt));
                    } else {
                      setValues([...values, opt]);
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    background: isSelected ? "#d8e9ff" : "white",
                    fontWeight: isSelected ? "bold" : "normal"
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

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

        {/* Multi-Select Filters */}
          {renderMultiFilter("University :", form.university, v => setForm({ ...form, university: v }),
            showUniversityPopup, setShowUniversityPopup, filters.universityOptions, uniRef)}

          {renderMultiFilter("Year of project/work/prize :", form.year, v => setForm({ ...form, year: v }),
            showYearPopup, setShowYearPopup, filters.yearOptions, yearRef)}

          {renderMultiFilter("Category :", form.category, v => setForm({ ...form, category: v }),
            showCategoryPopup, setShowCategoryPopup, filters.categoryOptions, catRef)}


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