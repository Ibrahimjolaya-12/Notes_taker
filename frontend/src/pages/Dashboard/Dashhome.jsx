import { useEffect, useState } from "react";
import { Col, Popconfirm, Row, Spin, message, Grid, Button } from "antd";
import { PlusOutlined, BookOutlined, DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { useBreakpoint } = Grid;

const Dashhome = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

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

  // 2. Delete Subject Handler
  const handleDelete = async (subjectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message || "Subject deleted successfully");
        setSubjects((prev) => prev.filter((sub) => sub._id !== subjectId));
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div
      className="dashhome-container"
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: isMobile ? "12px" : "24px 20px",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#ffffff",
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Your Subjects
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>
            Open a subject folder to view notes, generate quizzes, or chat with AI.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/new-subject")}
          style={{
            backgroundColor: "#6366f1",
            borderColor: "#6366f1",
            fontWeight: 600,
            height: isMobile ? "40px" : "44px",
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          }}
        >
          New Subject
        </Button>
      </div>

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
            background: "#0d1026",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: isMobile ? "45px 16px" : "70px 20px",
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
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              border: "1px solid rgba(99, 102, 241, 0.25)",
            }}
          >
            <BookOutlined style={{ fontSize: "24px" }} />
          </div>
          <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
            Your shelf is empty
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "13.5px", maxWidth: "440px", marginBottom: "20px", lineHeight: 1.5 }}>
            Create your first subject folder to start organizing notes, interacting with AI, and preparing for exams.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/dashboard/new-subject")}
            style={{
              background: "#6366f1",
              borderColor: "#6366f1",
              fontWeight: 600,
              height: "40px",
              borderRadius: "8px",
            }}
          >
            Create your first subject
          </Button>
        </div>
      ) : (
        /* Dynamic Subject Cards */
        <Row gutter={[16, 16]}>
          {subjects.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <div
                style={{
                  background: "#0c0d1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "180px",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
              >
                {/* Clickable Area to open Subject Details */}
                <div
                  onClick={() => navigate(`/dashboard/${item._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #6366f1, #4338ca)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "18px",
                      marginBottom: "14px",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    <BookOutlined />
                  </div>

                  <span
                    style={{
                      color: "#818cf8",
                      fontSize: "11.5px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.code || "SUBJECT"}
                  </span>

                  <h4
                    style={{
                      color: "#ffffff",
                      fontSize: "15.5px",
                      fontWeight: "600",
                      margin: "0 0 12px 0",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>

                {/* Footer Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    paddingTop: "12px",
                    marginTop: "6px",
                  }}
                >
                  <div
                    onClick={() => navigate(`/dashboard/${item._id}`)}
                    style={{
                      color: "#818cf8",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <ThunderboltOutlined /> Take quiz
                  </div>

                  <Popconfirm
                    title="Delete Subject"
                    description="Are you sure you want to delete this folder?"
                    onConfirm={() => handleDelete(item._id)}
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
                      type="button"
                      title="Delete Subject"
                      style={{
                        background: "rgba(244, 63, 94, 0.12)",
                        border: "1px solid rgba(244, 63, 94, 0.25)",
                        color: "#f87171",
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "13px" }} />
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