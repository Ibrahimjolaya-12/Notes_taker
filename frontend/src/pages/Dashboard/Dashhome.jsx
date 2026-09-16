import { useEffect, useState } from "react";
import { Popconfirm, Spin, message, Grid, Button } from "antd";
import {
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTheme } from "../../context/ThemeContext";

const { useBreakpoint } = Grid;

const BACKEND_URL = "https://class-notes-backend.vercel.app";

const Dashhome = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // 1. Fetch Subjects & apply saved order
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/subjects/my-subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const fetchedSubjects = res.data.subjects;
        const savedOrder = JSON.parse(
          localStorage.getItem("subjects_order") || "[]"
        );

        if (savedOrder.length > 0) {
          const sorted = [...fetchedSubjects].sort((a, b) => {
            const indexA = savedOrder.indexOf(a._id);
            const indexB = savedOrder.indexOf(b._id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
          setSubjects(sorted);
        } else {
          setSubjects(fetchedSubjects);
        }
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

  // 2. Smooth Drop Reorder Handler
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(subjects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSubjects(items);
    localStorage.setItem(
      "subjects_order",
      JSON.stringify(items.map((s) => s._id))
    );
  };

  // 3. Delete Subject
  const handleDelete = async (subjectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${BACKEND_URL}/api/subjects/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        message.success(res.data.message || "Subject deleted successfully");
        setSubjects((prev) => {
          const filtered = prev.filter((sub) => sub._id !== subjectId);
          localStorage.setItem(
            "subjects_order",
            JSON.stringify(filtered.map((s) => s._id))
          );
          return filtered;
        });
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
        color: isDarkMode ? "#f8fafc" : "#0f172a",
      }}
    >
      {/* Top Header */}
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
              color: isDarkMode ? "#ffffff" : "#0f172a",
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              margin: 0,
              transition: "color 0.3s ease",
            }}
          >
            Your Subjects
          </h2>
          <p
            style={{
              color: isDarkMode ? "#94a3b8" : "#64748b",
              fontSize: "13px",
              margin: "4px 0 0",
              transition: "color 0.3s ease",
            }}
          >
            Drag and reposition cards freely across your study dashboard.
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      ) : subjects.length === 0 ? (
        <div
          style={{
            width: "100%",
            background: isDarkMode ? "#0d1026" : "#ffffff",
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: isMobile ? "45px 16px" : "70px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: isDarkMode ? "none" : "0 4px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: isDarkMode ? "rgba(99, 102, 241, 0.15)" : "#e0e7ff",
              color: isDarkMode ? "#818cf8" : "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              border: isDarkMode
                ? "1px solid rgba(99, 102, 241, 0.25)"
                : "1px solid #c7d2fe",
            }}
          >
            <BookOutlined style={{ fontSize: "24px" }} />
          </div>
          <h3
            style={{
              color: isDarkMode ? "#ffffff" : "#0f172a",
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Your shelf is empty
          </h3>
          <p
            style={{
              color: isDarkMode ? "#94a3b8" : "#64748b",
              fontSize: "13.5px",
              maxWidth: "440px",
              marginBottom: "20px",
              lineHeight: 1.5,
            }}
          >
            Create your first subject folder to start organizing notes,
            interacting with AI, and preparing for exams.
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
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable
            droppableId="subjects-board"
            direction={isMobile ? "vertical" : "horizontal"}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "16px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {subjects.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}
                  >
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          ...dragProvided.draggableProps.style,
                        }}
                      >
                        <div
                          style={{
                            background: snapshot.isDragging
                              ? isDarkMode
                                ? "#111432"
                                : "#e0e7ff"
                              : isDarkMode
                              ? "#0c0d1e"
                              : "#ffffff",
                            border: snapshot.isDragging
                              ? "1.5px solid #6366f1"
                              : isDarkMode
                              ? "1px solid rgba(255, 255, 255, 0.08)"
                              : "1px solid #e2e8f0",
                            borderRadius: "14px",
                            padding: "18px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "185px",
                            height: "100%",
                            boxSizing: "border-box",
                            boxShadow: snapshot.isDragging
                              ? "0 20px 40px rgba(99, 102, 241, 0.35), 0 0 15px rgba(99, 102, 241, 0.2)"
                              : isDarkMode
                              ? "none"
                              : "0 2px 10px rgba(0, 0, 0, 0.04)",
                            transform: snapshot.isDragging
                              ? "scale(1.03)"
                              : "none",
                            transition: snapshot.isDragging
                              ? "box-shadow 0.2s ease, border-color 0.2s ease"
                              : "transform 0.2s ease, background 0.3s ease, border-color 0.3s ease",
                            position: "relative",
                            userSelect: "none",
                          }}
                        >
                          {/* Drag Handle Grip */}
                          <div
                            {...dragProvided.dragHandleProps}
                            style={{
                              position: "absolute",
                              top: "14px",
                              right: "14px",
                              color: snapshot.isDragging
                                ? "#6366f1"
                                : isDarkMode
                                ? "#475569"
                                : "#94a3b8",
                              fontSize: "15px",
                              cursor: "grab",
                              padding: "4px",
                            }}
                            title="Drag Card"
                          >
                            <HolderOutlined />
                          </div>

                          {/* Card Content Area */}
                          <div
                            onClick={() => navigate(`/dashboard/${item._id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                background:
                                  "linear-gradient(135deg, #6366f1, #4338ca)",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontSize: "18px",
                                marginBottom: "14px",
                                boxShadow:
                                  "0 4px 12px rgba(99, 102, 241, 0.3)",
                              }}
                            >
                              <BookOutlined />
                            </div>

                            <span
                              style={{
                                color: isDarkMode ? "#818cf8" : "#4f46e5",
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
                                color: isDarkMode ? "#ffffff" : "#0f172a",
                                fontSize: "15.5px",
                                fontWeight: "600",
                                margin: "0 0 12px 0",
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                                transition: "color 0.3s ease",
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
                              borderTop: isDarkMode
                                ? "1px solid rgba(255, 255, 255, 0.06)"
                                : "1px solid #f1f5f9",
                              paddingTop: "12px",
                              marginTop: "6px",
                            }}
                          >
                            <div
                              onClick={() => navigate(`/dashboard/${item._id}`)}
                              style={{
                                color: isDarkMode ? "#818cf8" : "#4f46e5",
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
                                  backgroundColor: isDarkMode
                                    ? "#1e1e38"
                                    : "#f1f5f9",
                                  borderColor: isDarkMode
                                    ? "#35355e"
                                    : "#cbd5e1",
                                  color: isDarkMode ? "#ffffff" : "#334155",
                                },
                              }}
                            >
                              <button
                                type="button"
                                title="Delete Subject"
                                style={{
                                  background: isDarkMode
                                    ? "rgba(244, 63, 94, 0.12)"
                                    : "#fee2e2",
                                  border: isDarkMode
                                    ? "1px solid rgba(244, 63, 94, 0.25)"
                                    : "1px solid #fecaca",
                                  color: isDarkMode ? "#f87171" : "#dc2626",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "6px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: "13px" }} />
                              </button>
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Dashhome;