import { Button, Col, Form, Input, message, Row, Typography, Grid } from "antd"
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { useBreakpoint } = Grid

const BACKEND_URL = "https://class-notes-backend.vercel.app"

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const screens = useBreakpoint()
  const isMobile = !screens.sm

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const sanitizedValues = {
        name: values.name?.trim(),
        email: values.email?.trim().toLowerCase(),
        password: values.password,
      }
      const res = await axios.post(`${BACKEND_URL}/api/auth/register`, sanitizedValues, {
        withCredentials: true,
      })
      if (res.data.success) {
        message.success(res.data.message || "Registered successfully!")
        form.resetFields()
        navigate("/auth/login")
      }
    } catch (error) {
      console.error(error)
      message.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const darkInputStyle = {
    backgroundColor: "#060713",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
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

      <Title
        level={3}
        className="auth-title"
        style={{ margin: "0 0 4px", color: "#f8fafc" }}
      >
        Create Account
      </Title>
      <p className="auth-subtitle" style={{ color: "#94a3b8", marginBottom: "24px" }}>
        Sign up for your study hub
      </p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[0, 4]}>
          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Full Name</span>}
              name="name"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#64748b" }} />}
                placeholder="Enter your name ..."
                size="large"
                style={darkInputStyle}
              />
            </Form.Item>
          </Col>

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
                placeholder="student@university.edu"
                size="large"
                style={darkInputStyle}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#64748b" }} />}
                placeholder="••••••••"
                size="large"
                style={darkInputStyle}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Confirm Password</span>}
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("Passwords do not match!"))
                  },
                }),
              ]}
              style={{ marginBottom: "22px" }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#64748b" }} />}
                placeholder="••••••••"
                size="large"
                style={darkInputStyle}
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
              Create Account
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Register