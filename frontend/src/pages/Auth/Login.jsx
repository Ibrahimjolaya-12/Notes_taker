import { Button, Col, Form, Input, message, Row, Typography, Modal, ConfigProvider, theme, Grid } from "antd"
import { LockOutlined, MailOutlined, KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const BACKEND_URL = "https://class-notes-backend.vercel.app"

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const screens = useBreakpoint()
  const isMobile = !screens.sm

  // Forgot Password States
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState("email")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const [forgotEmailForm] = Form.useForm()
  const [resetPassForm] = Form.useForm()

  // 1. Sign In
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const sanitizedValues = {
        ...values,
        email: values.email?.trim().toLowerCase(),
      }
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, sanitizedValues, {
        withCredentials: true,
      })
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user))
        }
        message.success(res.data.message || "Logged in Successfully")
        form.resetFields()
        navigate("/dashboard")
      }
    } catch (error) {
      console.error(error)
      message.error(error.response?.data?.message || "Invalid credentials, please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 2. Send Reset OTP
  const handleSendOTP = async (values) => {
    setForgotLoading(true)
    try {
      const email = values.email?.trim().toLowerCase()
      const res = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email }, {
        withCredentials: true,
      })
      if (res.data.success) {
        message.success(res.data.message || "Reset OTP sent to your email!")
        setResetEmail(email)
        setForgotStep("reset")
      }
    } catch (error) {
      console.error(error)
      message.error("Please wait for developer action")
    } finally {
      setForgotLoading(false)
    }
  }

  // 3. Verify OTP & Set New Password
  const handleResetPassword = async (values) => {
    setForgotLoading(true)
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/reset-password`,
        {
          email: resetEmail,
          otp: values.otp,
          newPassword: values.newPassword,
        },
        { withCredentials: true }
      )
      if (res.data.success) {
        message.success(res.data.message || "Password reset successful! Please log in.")
        closeForgotModal()
      }
    } catch (error) {
      console.error(error)
      message.error("Please wait for developer action")
    } finally {
      setForgotLoading(false)
    }
  }

  const closeForgotModal = () => {
    setForgotModalOpen(false)
    setForgotStep("email")
    setResetEmail("")
    forgotEmailForm.resetFields()
    resetPassForm.resetFields()
  }

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
        Welcome Back
      </Title>
      <p className="auth-subtitle" style={{ color: "#94a3b8", marginBottom: "24px" }}>
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
                { type: "email", message: "Please enter a valid email address!" },
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
              rules={[{ required: true, message: "Please input your password!" }]}
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

          {/* Forgot Password Link */}
          <Col span={24} style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#818cf8",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Forgot password?
            </button>
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

      {/* Forgot Password OTP Modal */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgElevated: "#0f121d",
            colorText: "#f8fafc",
            colorPrimary: "#6366f1",
            borderRadiusLG: 16,
          },
        }}
      >
        <Modal
          open={forgotModalOpen}
          onCancel={closeForgotModal}
          footer={null}
          closable={false}
          centered
          width={isMobile ? "92%" : 460}
          destroyOnClose
          styles={{
            mask: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.75)" },
            content: {
              backgroundColor: "#0f121d",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: isMobile ? "20px" : "28px",
            },
          }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                <KeyOutlined />
              </div>
              <span style={{ fontSize: "16px", color: "#f8fafc", fontWeight: 600 }}>
                {forgotStep === "email" ? "Reset Password" : "Enter Verification Code"}
              </span>
            </div>
          }
        >
          {forgotStep === "email" ? (
            <div style={{ paddingTop: "12px" }}>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5, marginBottom: "20px" }}>
                Enter your account email address and we will send you a 6-digit OTP verification code.
              </p>

              <Form layout="vertical" form={forgotEmailForm} onFinish={handleSendOTP}>
                <Form.Item
                  label={<span style={{ color: "#cbd5e1" }}>Email Address</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Enter a valid email address!" },
                  ]}
                >
                  <Input
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    prefix={<MailOutlined style={{ color: "#64748b" }} />}
                    placeholder="student@university.edu"
                    size="large"
                    style={{
                      backgroundColor: "#060713",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      color: "#ffffff",
                    }}
                  />
                </Form.Item>

                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                  <Button onClick={closeForgotModal} block style={{ background: "transparent", color: "#94a3b8" }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" block loading={forgotLoading} style={{ background: "#6366f1" }}>
                    Send OTP
                  </Button>
                </div>
              </Form>
            </div>
          ) : (
            <div style={{ paddingTop: "12px" }}>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5, marginBottom: "16px" }}>
                OTP sent to <Text strong style={{ color: "#818cf8" }}>{resetEmail}</Text>. Enter the code and set your new password.
              </p>

              <Form layout="vertical" form={resetPassForm} onFinish={handleResetPassword}>
                <Form.Item
                  label={<span style={{ color: "#cbd5e1" }}>6-Digit OTP</span>}
                  name="otp"
                  rules={[
                    { required: true, message: "Please input the OTP!" },
                    { len: 6, message: "OTP must be exactly 6 digits!" },
                  ]}
                >
                  <Input
                    placeholder="123456"
                    size="large"
                    maxLength={6}
                    style={{
                      backgroundColor: "#060713",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      color: "#ffffff",
                      letterSpacing: "4px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={{ color: "#cbd5e1" }}>New Password</span>}
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please enter your new password!" },
                    { min: 6, message: "Password must be at least 6 characters!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#64748b" }} />}
                    placeholder="Enter new password"
                    size="large"
                    style={{
                      backgroundColor: "#060713",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      color: "#ffffff",
                    }}
                  />
                </Form.Item>

                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => setForgotStep("email")}
                    style={{ background: "transparent", color: "#94a3b8" }}
                  >
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" block loading={forgotLoading} style={{ background: "#10b981", borderColor: "#10b981" }}>
                    Update Password
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </>
  )
}

export default Login