import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Spin,
  ConfigProvider,
  Row,
  Col,
  Typography,
  Grid,
  theme,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const UpdateTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // 1. Fetch existing Todo data to populate form
  useEffect(() => {
    const fetchSingleTodo = async () => {
      try {
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

        if (res.data.success) {
          const todo = res.data.todo || res.data.data;
          form.setFieldsValue({
            title: todo.title,
            location: todo.location,
            description: todo.description,
            status: todo.status || "incomplete",
            dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
          });
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
        message.error(
          err.response?.data?.message || "Failed to load todo details!"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchSingleTodo();
  }, [id, form, navigate]);

  // 2. Submit Updated Data
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("You are not logged in!");
        navigate("/auth/login");
        return;
      }

      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      const res = await axios.put(
        `https://class-notes-backend.vercel.app/api/todos/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message || "Todo updated successfully!");
        navigate("/dashboard/todos");
      }
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      message.error(err.response?.data?.message || "Failed to update todo!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#080816",
          colorBgElevated: "#0f121d",
          colorBorder: "#1e1e38",
          colorText: "#ffffff",
          colorTextPlaceholder: "#64748b",
          colorPrimary: "#6366f1",
          borderRadiusLG: 12,
        },
      }}
    >
      <div
        className="custom-todo-wrapper"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: isMobile ? "16px 12px" : "24px 20px",
        }}
      >
        {/* Header with Back Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                color: "#f8fafc",
                margin: "0 0 4px 0",
                fontSize: isMobile ? "20px" : "24px",
              }}
            >
              Update Task
            </Title>
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>
              Modify task schedule, status, or assignment notes
            </span>
          </div>

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard/todos")}
            style={{
              background: "transparent",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
            }}
          >
            {!isMobile && "Back to Todos"}
          </Button>
        </div>

        {/* Task Form Container */}
        <div
          style={{
            background: "#0c0d1e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: isMobile ? "18px 16px" : "28px 30px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Row gutter={[16, 0]}>
              {/* Title Input */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Task Title
                    </span>
                  }
                  name="title"
                  rules={[{ required: true, message: "Title is required!" }]}
                >
                  <Input placeholder="Enter your title ..." size="large" />
                </Form.Item>
              </Col>

              {/* Location Input */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Location / Venue
                    </span>
                  }
                  name="location"
                  rules={[{ required: true, message: "Location is required!" }]}
                >
                  <Input placeholder="Enter your place ..." size="large" />
                </Form.Item>
              </Col>

              {/* Due Date */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Due Date
                    </span>
                  }
                  name="dueDate"
                  rules={[{ required: true, message: "Due date is required!" }]}
                >
                  <DatePicker
                    size="large"
                    placeholder="Select date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {/* Status */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Status
                    </span>
                  }
                  name="status"
                  rules={[{ required: true, message: "Please select status!" }]}
                >
                  <Select size="large">
                    <Option value="incomplete">Incomplete</Option>
                    <Option value="complete">Complete</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Description */}
              <Col span={24}>
                <Form.Item
                  label={
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Description
                    </span>
                  }
                  name="description"
                  rules={[
                    { required: true, message: "Description is required!" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Enter details about this task..."
                    maxLength={250}
                    showCount
                  />
                </Form.Item>
              </Col>

              {/* Submit Button */}
              <Col span={24} style={{ marginTop: "12px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<EditOutlined />}
                  block
                  size="large"
                  loading={loading}
                  style={{
                    background: "#6366f1",
                    borderColor: "#6366f1",
                    fontWeight: 600,
                    height: isMobile ? "44px" : "48px",
                    borderRadius: "10px",
                  }}
                >
                  Update Task
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UpdateTodo;