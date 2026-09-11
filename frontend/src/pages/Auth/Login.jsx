import { Button, Col, Form, Input, message, Row, Typography, Grid } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const BACKEND_URL = "https://class-notes-backend.vercel.app";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // Sign In Handler
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const sanitizedValues = {
        ...values,
        email: values.email?.trim().toLowerCase(),
      };
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        sanitizedValues,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        message.success(res.data.message || "Logged in Successfully");
        form.resetFields();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message ||
          "Invalid credentials, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #060713 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #ffffff;
        }
      `}</style>

      <Title
        level={3}
        className="auth-title"
        style={{ margin: "0 0 4px", color: "#f8fafc" }}
      >
        Welcome Back
      </Title>
      <p
        className="auth-subtitle"
        style={{ color: "#94a3b8", marginBottom: "24px" }}
      >
        Sign in to your study hub
      </p>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[0, 4]}>
          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                prefix={<MailOutlined style={{ color: "#64748b" }} />}
                placeholder="Enter your email"
                size="large"
                style={{
                  backgroundColor: "#060713",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              style={{ marginBottom: "8px" }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#64748b" }} />}
                placeholder="••••••••"
                size="large"
                style={{
                  backgroundColor: "#060713",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                }}
              />
            </Form.Item>
          </Col>

          {/* Clean Route Link */}
          <Col span={24} style={{ textAlign: "right", marginBottom: "20px" }}>
            {/* Ghalat: to="/forgot-password" */}
            {/* Sahi: Relative to parent auth route */}
            <Link
              to="../forgot-password"
              style={{
                color: "#818cf8",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </Col>

          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                background: "#6366f1",
                borderColor: "#6366f1",
                height: isMobile ? "42px" : "46px",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Sign In
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
