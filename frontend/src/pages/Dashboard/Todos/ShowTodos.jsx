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
  Grid,
  Modal,
  theme,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBtn from "./SearchBtn";

const { Option } = Select;
const { useBreakpoint } = Grid;

const BACKEND_URL = "https://class-notes-backend.vercel.app";

const ShowTodos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // Modal States
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

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
        `${BACKEND_URL}/api/todos/getAllTodos?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
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
      const res = await axios.delete(`${BACKEND_URL}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        message.success(res.data.message || "Todo deleted successfully!");
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
        if (selectedTodo?._id === id) {
          setViewModalOpen(false);
        }
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete todo!";
      message.error(errorMsg);
    }
  };

  const handleOpenViewModal = (todo) => {
    setSelectedTodo(todo);
    setViewModalOpen(true);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const renderStatusTag = (status) => {
    const isCompleted = status === "completed" || status === "complete";
    return (
      <Tag
        bordered={false}
        style={{
          borderRadius: "6px",
          padding: "2px 8px",
          fontWeight: 600,
          fontSize: "11px",
          backgroundColor: isCompleted
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(244, 63, 94, 0.15)",
          color: isCompleted ? "#34d399" : "#fb7185",
          border: isCompleted
            ? "1px solid rgba(16, 185, 129, 0.3)"
            : "1px solid rgba(244, 63, 94, 0.3)",
        }}
      >
        {status ? status.toUpperCase() : "INCOMPLETE"}
      </Tag>
    );
  };

  const popconfirmCancelProps = {
    style: {
      backgroundColor: "#161b2b",
      borderColor: "rgba(255, 255, 255, 0.15)",
      color: "#cbd5e1",
      borderRadius: "6px",
    },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#0d1026",
          colorBgContainer: "#080816",
          colorBorder: "#1e2652",
          colorText: "#ffffff",
          colorTextHeading: "#ffffff",
          colorPrimary: "#6366f1",
          borderRadiusLG: 14,
        },
        components: {
          Popconfirm: {
            colorBgElevated: "#0d1026",
          },
        },
      }}
    >
      <div
        style={{
          padding: isMobile ? "12px" : "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {/* Title + Filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: isMobile ? "18px" : "22px",
              }}
            >
              All Todos
            </h2>

            <Select
              defaultValue="all"
              style={{ width: isMobile ? 125 : 150, height: 38 }}
              onChange={(value) => fetchTodos(value)}
              popupClassName="dark-select-popup"
            >
              <Option value="all">All</Option>
              <Option value="complete">Completed</Option>
              <Option value="incomplete">Incomplete</Option>
            </Select>
          </div>

          {/* Search + Add Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: isMobile ? "space-between" : "flex-end",
            }}
          >
            <SearchBtn setTodos={setTodos} />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: "#6366f1",
                borderColor: "#6366f1",
                fontWeight: 600,
                height: 38,
                borderRadius: "8px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                flex: isMobile ? 1 : "initial",
              }}
              onClick={() => navigate("addTodos")}
            >
              Add Todo
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
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
                  borderRadius: "14px",
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
                    fontSize: "14px",
                    marginTop: "14px",
                  }}
                >
                  Hurray! You don't have any pending work. 🥳
                </p>
              </div>
            ) : isMobile ? (
              /* 📱 Mobile Responsive Cards Grid */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {todos.map((todo, index) => (
                  <div
                    key={todo._id || index}
                    style={{
                      backgroundColor: "#0d1026",
                      border: "1px solid #1c234a",
                      borderRadius: "12px",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          color: "#ffffff",
                          fontSize: "15px",
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {todo.title}
                      </h4>
                      {renderStatusTag(todo.status)}
                    </div>

                    {/* Metadata */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "12px",
                        fontSize: "12.5px",
                        color: "#9ca3af",
                      }}
                    >
                      {todo.location && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <EnvironmentOutlined style={{ color: "#64748b" }} />
                          <span>{todo.location}</span>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CalendarOutlined style={{ color: "#64748b" }} />
                        <span>
                          {todo.dueDate
                            ? new Date(todo.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "No deadline"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleOpenViewModal(todo)}
                        title="View Details"
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
                        }}
                      >
                        <EyeOutlined />
                      </button>

                      <button
                        onClick={() => navigate(`updateTodos/${todo._id}`)}
                        title="Edit"
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
                        }}
                      >
                        <EditOutlined />
                      </button>

                      <Popconfirm
                        title="Delete Todo"
                        description="Are you sure you want to delete this todo?"
                        onConfirm={() => handleDelete(todo._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                        cancelButtonProps={popconfirmCancelProps}
                      >
                        <button
                          type="button"
                          title="Delete Todo"
                          style={{
                            background: "rgba(244, 63, 94, 0.12)",
                            border: "1px solid rgba(244, 63, 94, 0.25)",
                            color: "#f87171",
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
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
                ))}
              </div>
            ) : (
              /* 💻 Desktop Table View */
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
                          fontSize: "12.5px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <th style={{ padding: "14px 18px" }}>#</th>
                        <th style={{ padding: "14px 18px" }}>Title</th>
                        <th style={{ padding: "14px 18px" }}>Location</th>
                        <th style={{ padding: "14px 18px" }}>Due Date</th>
                        <th style={{ padding: "14px 18px" }}>Status</th>
                        <th
                          style={{
                            padding: "14px 18px",
                            textAlign: "right",
                          }}
                        >
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
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#6b7280",
                              fontSize: "13px",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
                              fontWeight: 600,
                              color: "#ffffff",
                              fontSize: "14px",
                            }}
                          >
                            {todo.title}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#cbd5e1",
                              fontSize: "13px",
                            }}
                          >
                            {todo.location || "—"}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#9ca3af",
                              fontSize: "13px",
                            }}
                          >
                            {todo.dueDate
                              ? new Date(todo.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            {renderStatusTag(todo.status)}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
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
                              <button
                                onClick={() => handleOpenViewModal(todo)}
                                title="View Details"
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
                                }}
                              >
                                <EyeOutlined />
                              </button>

                              <button
                                onClick={() =>
                                  navigate(`updateTodos/${todo._id}`)
                                }
                                title="Edit"
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
                                }}
                              >
                                <EditOutlined />
                              </button>

                              <Popconfirm
                                title="Delete Todo"
                                description="Are you sure you want to delete this todo?"
                                onConfirm={() => handleDelete(todo._id)}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ danger: true }}
                                cancelButtonProps={popconfirmCancelProps}
                              >
                                <button
                                  type="button"
                                  title="Delete Todo"
                                  style={{
                                    background: "rgba(244, 63, 94, 0.12)",
                                    border: "1px solid rgba(244, 63, 94, 0.25)",
                                    color: "#f87171",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
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

        {/* View Todo Modal */}
        <Modal
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          closable={false}
          centered
          width={isMobile ? "94%" : 540}
          styles={{
            mask: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.78)",
            },
            content: {
              backgroundColor: "#080816",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: isMobile ? "16px" : "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
            },
          }}
        >
          {selectedTodo && (
            <div>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  paddingBottom: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(99, 102, 241, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#818cf8",
                      fontSize: "16px",
                    }}
                  >
                    <FileTextOutlined />
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "#f8fafc",
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: 700,
                      }}
                    >
                      Task Details
                    </h3>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Overview & Schedule
                    </span>
                  </div>
                </div>

                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setViewModalOpen(false)}
                  style={{ color: "#94a3b8" }}
                />
              </div>

              {/* Title & Status */}
              <div
                style={{
                  background: "#0d1026",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedTodo.title}
                  </h4>
                  {renderStatusTag(selectedTodo.status)}
                </div>
              </div>

              {/* Info Grid (Location & Date) */}
              <Row gutter={[12, 12]} style={{ marginBottom: "14px" }}>
                <Col span={isMobile ? 24 : 12}>
                  <div
                    style={{
                      background: "#0d1026",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <EnvironmentOutlined style={{ color: "#818cf8" }} /> Location
                    </span>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#f8fafc",
                        fontSize: "13.5px",
                        fontWeight: 500,
                      }}
                    >
                      {selectedTodo.location || "Not Specified"}
                    </p>
                  </div>
                </Col>

                <Col span={isMobile ? 24 : 12}>
                  <div
                    style={{
                      background: "#0d1026",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <CalendarOutlined style={{ color: "#818cf8" }} /> Due Date
                    </span>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#f8fafc",
                        fontSize: "13.5px",
                        fontWeight: 500,
                      }}
                    >
                      {selectedTodo.dueDate
                        ? new Date(selectedTodo.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "No deadline"}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Description */}
              <div
                style={{
                  background: "#0d1026",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Description / Notes
                </span>
                <p
                  style={{
                    margin: 0,
                    color: "#cbd5e1",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTodo.description ||
                    "No extra description provided."}
                </p>
              </div>

              {/* Footer Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() => setViewModalOpen(false)}
                  style={{
                    background: "transparent",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "#cbd5e1",
                  }}
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setViewModalOpen(false);
                    navigate(`updateTodos/${selectedTodo._id}`);
                  }}
                  style={{
                    background: "#6366f1",
                    borderColor: "#6366f1",
                    fontWeight: 600,
                  }}
                >
                  Edit Task
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ShowTodos;