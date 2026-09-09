import { Card, Button, message, Spin, Tag, Typography, Grid } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const ViewTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    const fetchTodoDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          message.error("You are not logged in!");
          navigate("/auth/login");
          return;
        }

        const res = await axios.get(`https://class-notes-backend.vercel.app/api/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success) {
          setTodo(res.data.todo || res.data.data);
        }
      } catch (err) {
        console.error("VIEW TODO ERROR:", err);
        message.error(
          err.response?.data?.message || "Failed to fetch todo details!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTodoDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!todo) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "#ffffff",
        }}
      >
        <h4 style={{ fontSize: "18px", marginBottom: "16px" }}>
          No Todo Found!
        </h4>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          style={{ background: "#6366f1", borderColor: "#6366f1" }}
          onClick={() => navigate("/dashboard/todos")}
        >
          Back to Todos
        </Button>
      </div>
    );
  }

  const isCompleted =
    todo.status === "complete" || todo.status === "completed";

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: isMobile ? "16px 12px" : "24px 20px",
      }}
    >
      {/* Top Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard/todos")}
          style={{
            background: "transparent",
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "#cbd5e1",
          }}
        >
          Back
        </Button>

        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/dashboard/todos/updateTodos/${todo._id}`)}
          style={{
            background: "#6366f1",
            borderColor: "#6366f1",
            fontWeight: 600,
          }}
        >
          Edit Task
        </Button>
      </div>

      {/* Main Details Card */}
      <Card
        bordered={false}
        style={{
          backgroundColor: "#0c0d1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: isMobile ? "16px" : "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Header: Title + Status */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                color: "#f8fafc",
                margin: "0 0 6px 0",
                fontSize: isMobile ? "20px" : "24px",
                lineHeight: 1.3,
              }}
            >
              {todo.title}
            </Title>
            <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
              Task Information & Milestones
            </span>
          </div>

          <Tag
            bordered={false}
            style={{
              borderRadius: "6px",
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: "12px",
              backgroundColor: isCompleted
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(244, 63, 94, 0.15)",
              color: isCompleted ? "#34d399" : "#fb7185",
              border: isCompleted
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(244, 63, 94, 0.3)",
            }}
          >
            {todo.status ? todo.status.toUpperCase() : "INCOMPLETE"}
          </Tag>
        </div>

        {/* Metadata Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#14182b",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              <EnvironmentOutlined style={{ color: "#818cf8" }} />
              <span>Location / Venue</span>
            </div>
            <div
              style={{
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: 600,
                wordBreak: "break-word",
              }}
            >
              {todo.location || "Not Specified"}
            </div>
          </div>

          <div
            style={{
              background: "#14182b",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              <CalendarOutlined style={{ color: "#818cf8" }} />
              <span>Due Date</span>
            </div>
            <div
              style={{
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {todo.dueDate
                ? new Date(todo.dueDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No deadline assigned"}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div
          style={{
            background: "#14182b",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#94a3b8",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            <FileTextOutlined style={{ color: "#818cf8" }} />
            <span>Description</span>
          </div>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: "13.5px",
              lineHeight: 1.6,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {todo.description || "No description provided for this task."}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ViewTodo;