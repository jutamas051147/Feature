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

  const [showUniversityPopup, setShowUniversityPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

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
        //console.error("โหลดข้อมูลไม่สำเร็จ:", err);
        console.warn("⚠️ โหลดข้อมูลจริงไม่ได้ ใช้ mock แทน:", err.message);
        const mock = {
          title: "Mock Portfolio Title",
          university: "Chulalongkorn University",
          year: "2024",
          category: "Design",
          desc: "This is mock portfolio content for testing.",
          files: [{ name: "mock_portfolio.pdf" }],
        };
        setForm({
          title: mock.title,
          university: mock.university,
          year: mock.year,
          category: mock.category,
          description: mock.desc,
          files: mock.files,
        });
      }
    }

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
            cursor: "pointer",
            fontSize: 12,
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
        height: "100%",
        backgroundColor: "#ff6b2b",
        borderRadius: 12,
        padding: 20,
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
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
