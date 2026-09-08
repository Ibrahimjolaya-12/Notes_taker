import { useEffect, useState } from "react";
import { Col, Popconfirm, Row, Spin, message } from "antd";
import { PlusOutlined, BookOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashhome = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Subjects from MongoDB
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/subjects/my-subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (error) {
      console.error("Fetch subjects error:", error);
      message.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // 2. Delete Subject Handler with Local State Sync
  const handleDelete = async (e, subjectId) => {
    e.stopPropagation(); // 👈 Card click navigate hone se rokega
    const confirmDelete = window.confirm("Are you sure you want to delete this subject folder?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message || "Subject deleted successfully");
        // 👈 State update taake card bina page reload ke screen se gayab ho jaye
        setSubjects((prev) => prev.filter((sub) => sub._id !== subjectId));
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1140px", margin: "0 auto", padding: "12px" }}>
      {/* Top Header Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: "32px" }}>
        <Col>
          <h2 style={{ color: "#ffffff", fontSize: "26px", fontWeight: "700", margin: 0 }}>
            Your subjects
          </h2>
          <p style={{ color: "#7b7a94", fontSize: "14px", margin: "4px 0 0" }}>
            Open a folder to view and upload notes.
          </p>
        </Col>

        <Col>
          <button
            onClick={() => navigate("/dashboard/new-subject")}
            style={{
              backgroundColor: "#827AFF",
              color: "#000000",
              padding: "10px 22px",
              border: "none",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            <PlusOutlined /> New Subject
          </button>
        </Col>
      </Row>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      ) : subjects.length === 0 ? (
        /* Empty State */
        <div
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "70px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "rgba(125, 95, 255, 0.15)",
              color: "#827aff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              border: "1px solid rgba(125, 95, 255, 0.25)",
            }}
          >
            <BookOutlined style={{ fontSize: "22px" }} />
          </div>
          <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
            Your shelf is empty
          </h3>
          <p style={{ color: "#7b7a94", fontSize: "14px", maxWidth: "460px", marginBottom: "24px" }}>
            Create your first subject folder to start uploading notes, chatting with AI, and generating quizzes.
          </p>
          <button
            onClick={() => navigate("/dashboard/new-subject")}
            style={{
              background: "#827AFF",
              color: "#000000",
              border: "none",
              padding: "10px 22px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Create your first subject
          </button>
        </div>
      ) : (
        /* Dynamic Subject Cards */
        <Row gutter={[20, 20]}>
          {subjects.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <div
                style={{
                  background: "rgba(13, 12, 29, 0.45)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "22px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Clickable Area to open Details */}
                <div onClick={() => navigate(`/dashboard/${item._id}`)}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "#6c5ce7",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    <BookOutlined />
                  </div>

                  <span
                    style={{
                      color: "#7b7a94",
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {item.code}
                  </span>

                  <h4
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 0 16px 0",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>

                {/* Footer Actions */}
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <div style={{ color: "#827aff", fontSize: "12.5px", fontWeight: "500" }}>
                    ✨ Take quiz
                  </div>
                 
                  <Popconfirm
                          title="Delete Subject"
                          description="Are you sure to delete this Subject?"
                          onConfirm={(e) => handleDelete(e,item._id)}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                          cancelButtonProps={{
                            style: {
                              backgroundColor: "#1e1e38",
                              borderColor: "#35355e",
                              color: "#ffffff",
                            },
                          }}
                        >
                          <button
                            className="btn btn-sm "
                            title="delete todo"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </Popconfirm>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dashhome;