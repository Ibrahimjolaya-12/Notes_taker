import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message, Typography, Row, Col, Grid } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { useBreakpoint } = Grid;

// Live Vercel Backend URL with Vite Env fallback
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://class-notes-backend.vercel.app";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/reset-password/${token}`,
        { newPassword: values.password }
      );

      if (res.data.success) {
        message.success(res.data.message || "Password successfully updated!");
        form.resetFields();
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Reset Error:", error);
      message.error(
        error.response?.data?.message ||
          "Link has expired or the token is invalid."
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

      <Title level={3} className="auth-title" style={{ margin: "0 0 4px", color: "#f8fafc" }}>
        Reset Password
      </Title>
      <p className="auth-subtitle" style={{ color: "#94a3b8", marginBottom: "24px" }}>
        Enter and confirm your new account password
      </p>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[0, 4]}>
          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>New Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#64748b" }} />}
                placeholder="••••••••"
                size="large"
                style={{
                  backgroundColor: "#060713",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  borderRadius: "8px",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Confirm Password</span>}
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
              style={{ marginBottom: "16px" }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#64748b" }} />}
                placeholder="••••••••"
                size="large"
                style={{
                  backgroundColor: "#060713",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  borderRadius: "8px",
                }}
              />
            </Form.Item>
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
              Update Password
            </Button>
          </Col>

          <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              to="/auth/login"
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <ArrowLeftOutlined /> Back to Sign In
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ResetPassword;