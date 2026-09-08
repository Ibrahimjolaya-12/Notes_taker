import { Button, Col, Form, Input, message, Row, Typography } from "antd"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await axios.post("/api/auth/login", values)
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user))
        }
        message.success(res.data.message || "Logged in Successfully")
        form.resetFields()
        // 👈 Sahi route par redirect karo
        navigate("/dashboard")
      }
    } catch (error) {
      console.error(error)
      // 👈 Server ka actual error show karo
      message.error(
        error.response?.data?.message || "Invalid credentials, please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title level={3} className="auth-title">Welcome Back</Title>
      <p className="auth-subtitle">Sign in to your study hub</p>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email address!" },
              ]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button htmlType="submit" block className="btn-submit" loading={loading}>
              Sign In
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Login