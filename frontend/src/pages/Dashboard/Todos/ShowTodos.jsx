import {
  Button,
  Col,
  Empty,
  message,
  Popconfirm,
  Row,
  Select,
  Spin,
  Tag,
  ConfigProvider,
} from "antd";
const { Option } = Select;
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBtn from "./SearchBtn";

const ShowTodos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // Single dynamic fetch function supporting status filter
  const fetchTodos = async (status = "all") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication token missing. Please log in.");
        navigate("/auth/login");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/todos/getAllTodos?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setTodos(res.data.todos || res.data.data || []);
      }
    } catch (error) {
      console.error("FETCH TODOS ERROR:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to fetch todos!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message || "Todo deleted successfully!");
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete todo!";
      message.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <h2 style={{ margin: 0, color: "#ffffff", fontWeight: 700 }}>
            All Todos
          </h2>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: "#0b0f29",
                colorBgElevated: "#0d1130",
                colorBorder: "#1e2652",
                colorText: "#ffffff",
                controlItemBgActive: "#1c234a",
                controlItemBgHover: "#151b3d",
              },
            }}
          >
            <Select
              defaultValue="all"
              style={{ width: 150, height: 40 }}
              onChange={(value) => fetchTodos(value)}
              popupClassName="dark-select-popup"
            >
              <Option value="all">All Todos</Option>
              <Option value="complete">Completed</Option>
              <Option value="incomplete">Incomplete</Option>
            </Select>
          </ConfigProvider>
        </div>

        <div className="d-flex align-items-center gap-3">
          <SearchBtn setTodos={setTodos} />
          <Button
            type="primary"
            style={{
              backgroundColor: "#6366f1",
              borderColor: "#6366f1",
              fontWeight: 600,
              height: 40,
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            }}
            onClick={() => navigate("addTodos")}
          >
            + Add new Todo
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Row>
        <Col span={24}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : todos.length === 0 ? (
            <div
              style={{
                backgroundColor: "#0d1026",
                border: "1px solid #1c234a",
                borderRadius: "16px",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <Empty
                description={false}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "15px",
                  marginTop: "16px",
                }}
              >
                Hurray! You don't have any pending work. 🥳
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#0d1026",
                border: "1px solid #1c234a",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    color: "#e5e7eb",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#080b1d",
                        borderBottom: "1px solid #1e2652",
                        color: "#9ca3af",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <th style={{ padding: "16px 20px" }}>#</th>
                      <th style={{ padding: "16px 20px" }}>Title</th>
                      <th style={{ padding: "16px 20px" }}>Location</th>
                      <th style={{ padding: "16px 20px" }}>Due Date</th>
                      <th style={{ padding: "16px 20px" }}>Status</th>
                      <th style={{ padding: "16px 20px", textAlign: "right" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo, index) => (
                      <tr
                        key={todo._id || index}
                        style={{
                          borderBottom: "1px solid #141b3d",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#121838")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        {/* Index */}
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#6b7280",
                            fontSize: "13px",
                          }}
                        >
                          {index + 1}
                        </td>

                        {/* Title */}
                        <td
                          style={{
                            padding: "16px 20px",
                            fontWeight: 600,
                            color: "#ffffff",
                            fontSize: "14px",
                          }}
                        >
                          {todo.title}
                        </td>

                        {/* Location */}
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#cbd5e1",
                            fontSize: "13px",
                          }}
                        >
                          {todo.location || "—"}
                        </td>

                        {/* Due Date */}
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#9ca3af",
                            fontSize: "13px",
                          }}
                        >
                          {todo.dueDate
                            ? new Date(todo.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>

                        {/* Status Tag */}
                        <td style={{ padding: "16px 20px" }}>
                          <Tag
                            bordered={false}
                            style={{
                              borderRadius: "6px",
                              padding: "4px 10px",
                              fontWeight: 600,
                              fontSize: "11px",
                              backgroundColor:
                                todo.status === "completed" ||
                                todo.status === "complete"
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : "rgba(244, 63, 94, 0.15)",
                              color:
                                todo.status === "completed" ||
                                todo.status === "complete"
                                  ? "#34d399"
                                  : "#fb7185",
                              border:
                                todo.status === "completed" ||
                                todo.status === "complete"
                                  ? "1px solid rgba(16, 185, 129, 0.3)"
                                  : "1px solid rgba(244, 63, 94, 0.3)",
                            }}
                          >
                            {todo.status
                              ? todo.status.toUpperCase()
                              : "INCOMPLETE"}
                          </Tag>
                        </td>

                        {/* Actions */}
                        <td
                          style={{
                            padding: "16px 20px",
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {/* View */}
                            <button
                              onClick={() => navigate(`viewTodos/${todo._id}`)}
                              title="View todo"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid #1e2652",
                                backgroundColor: "#0b0f29",
                                color: "#38bdf8",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(56, 189, 248, 0.15)";
                                e.currentTarget.style.borderColor = "#38bdf8";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#0b0f29";
                                e.currentTarget.style.borderColor = "#1e2652";
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => navigate(`updateTodos/${todo._id}`)}
                              title="Edit todo"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid #1e2652",
                                backgroundColor: "#0b0f29",
                                color: "#fbbf24",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(251, 191, 36, 0.15)";
                                e.currentTarget.style.borderColor = "#fbbf24";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#0b0f29";
                                e.currentTarget.style.borderColor = "#1e2652";
                              }}
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>

                            {/* Delete */}
                            <Popconfirm
                              title="Delete Todo"
                              description="Are you sure you want to delete this todo?"
                              onConfirm={() => handleDelete(todo._id)}
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
                                title="Delete todo"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "8px",
                                  border: "1px solid #1e2652",
                                  backgroundColor: "#0b0f29",
                                  color: "#f87171",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  transition: "0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(248, 113, 113, 0.15)";
                                  e.currentTarget.style.borderColor = "#f87171";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#0b0f29";
                                  e.currentTarget.style.borderColor = "#1e2652";
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ShowTodos;