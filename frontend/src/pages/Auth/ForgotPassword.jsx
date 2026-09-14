import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography, Row, Col, Grid } from "antd";
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { useBreakpoint } = Grid;

// Live Vercel Backend URL with Vite Env fallback
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://class-notes-backend.vercel.app";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const onFinish = async (values) => {
    setLoading(true);
    const cleanEmail = values.email?.trim().toLowerCase();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: cleanEmail,
      });

      if (res.data.success) {
        message.success(
          res.data.message || "Reset link successfully sent to your email!"
        );
        setSentEmail(cleanEmail);
        setEmailSent(true);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Something went wrong while sending the reset link."
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
        Forgot Password
      </Title>
      <p className="auth-subtitle" style={{ color: "#94a3b8", marginBottom: "24px" }}>
        Enter your email to receive a password reset link
      </p>

      {emailSent ? (
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircleOutlined />
          </div>
          <h4 style={{ color: "#f8fafc", fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>
            Check your email
          </h4>
          <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", margin: "0 0 24px" }}>
            We've <span style={{ color: "#818cf8", fontWeight: 600 }}>{sentEmail}</span> sent a password reset link. Check your inbox or spam folder.
          </p>

          <Link
            to="/auth/login"
            style={{
              color: "#818cf8",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#818cf8")}
          >
            <ArrowLeftOutlined /> Back to Sign In
          </Link>
        </div>
      ) : (
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[0, 4]}>
            <Col span={24}>
              <Form.Item
                label={<span style={{ color: "#cbd5e1" }}>Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email address!" },
                ]}
              >
                <Input
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  prefix={<MailOutlined style={{ color: "#64748b" }} />}
                  placeholder="Enter your registered email"
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

            <Col span={24} style={{ marginTop: "12px" }}>
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
                Send Reset Link
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
      )}
    </>
  );
};

export default ForgotPassword;