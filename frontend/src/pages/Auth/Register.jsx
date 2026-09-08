import { Button, Col, Form, Input, message, Row, Typography, Grid } from "antd"
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { useBreakpoint } = Grid

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const screens = useBreakpoint()
  const isMobile = !screens.sm

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const res = await axios.post("http://localhost:5000/api/auth/register", values)
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

  return (
    <>
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
                placeholder="Muhammad Ibrahim"
                size="large"
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
                prefix={<MailOutlined style={{ color: "#64748b" }} />}
                placeholder="student@university.edu"
                size="large"
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