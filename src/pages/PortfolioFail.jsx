import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFallPortfolio } from "../api/fail";

export default function PortfolioFail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);

  const [form, setForm] = useState({
    title: "",
    university: "",
    year: "",
    category: "",
    description: "",
    files: [],
  });

  // โหลด mock portfolio (หรือจาก backend จริง)
useEffect(() => {
    async function fetchPortfolio() {
      try {
        // ✅ ลองโหลดจาก backend ก่อน
        const token = localStorage.getItem("token"); // ถ้ามี token ก็แนบไป
        const data = await getFallPortfolio(id, token);

        setPortfolio(data);
        setForm({
          title: data.title || "",
          university: data.university || "",
          year: data.year || "",
          category: data.category || "",
          description: data.description || "",
          files: data.files || [],
        });
      } catch (err) {
        console.warn("⚠️ โหลดข้อมูลจริงไม่ได้ ใช้ mock แทน:", err.message);

        // ✅ ใช้ mock ถ้า fetch ไม่สำเร็จ
        const mock = {
          title: "My Portfolio – Graphic Design",
          university: "ABC University",
          year: "2025",
          category: "UI/UX",
          description: "รวมผลงานออกแบบ UI ที่ทำในปี 2025",
          files: [
            { name: "design-portfolio.pdf", url: "#" },
            { name: "ui-wireframe.png", url: "#" },
            { name: "ux-flow.jpg", url: "#" },
          ],
          feedback: "ควรเพิ่มรายละเอียดในส่วน UX และโครงสร้างการออกแบบค่ะ",
        };

        setPortfolio(mock);
        setForm({
          title: mock.title,
          university: mock.university,
          year: mock.year,
          category: mock.category,
          description: mock.description,
          files: mock.files,
        });
      }
    }

    fetchPortfolio();
  }, [id]);


  if (!portfolio) return <p style={{ textAlign: "center" }}>⏳ กำลังโหลด...</p>;

  return (
    <div style={{
      minHeight: "100vh",
      padding: 20,
      backgroundColor: "#ff6b2b",
      fontFamily: "sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 700,
        backgroundColor: "#ff6b2b",
        borderRadius: 12,
        padding: 20,
        position: "relative"
      }}>
        {/* ไอคอนดินสอ */}
        <button
          onClick={() => navigate(`/resubmit`)}
          style={{
            position: "absolute",
            top: -5,
            right: 15,
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer"
          }}
        >
          🖊
        </button>

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
          color: "#000000ff",
          marginBottom: 10,
          fontSize: 45
        }}>
          Fail 
          Status Error
        </h2>

        {/* Feedback */}
        <div style={{
          width: "101%",
          marginBottom: 10,
          padding: 5,
          background: "#ece4e4ff",
          borderRadius: 8,
          border: "1px solid #ccc"
        }}>
          <strong>Feedback:</strong>
          <p style={{ marginTop: 4 , marginBottom: 4}}>{portfolio.feedback}</p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: "#fff", marginBottom: 4, display: "block" }}>Title :</label>
          <input
            type="text"
            value={portfolio.title}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* University */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: "#fff", marginBottom: 4, display: "block" }}>University :</label>
          <input
            type="text"
            value={portfolio.university}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Year */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: "#fff", marginBottom: 4, display: "block" }}>Year :</label>
          <input
            type="text"
            value={portfolio.year}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: "#fff", marginBottom: 4, display: "block" }}>Category :</label>
          <input
            type="text"
            value={portfolio.category}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        {/* Attached Files */}
        <div style={{ marginBottom: 15,color: "white" }}>
          <label>Attached Files:</label>
          <ul style={{ paddingLeft: 20 }}>
            {portfolio.files.map((file, idx) => (
              <li key={idx}>
                <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: "#fff", marginBottom: 4, display: "block" }}>Description :</label>
          <textarea
            value={portfolio.description}
            readOnly
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "none" }}
          />
        </div>

        {/* OK Button */}
        <button
          onClick={() => navigate(`/PortfolioDetail`)}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#419463ff",
            border: "none",
            color: "white",
            padding: "10px 25px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
