import { Button, Col, Form, Input, message, Row, Typography } from "antd"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title } = Typography

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const res = await axios.post("/api/auth/register", values)
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
      <Title level={3} className="auth-title">Create Account</Title>
      <p className="auth-subtitle">Sign up for your study hub</p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input placeholder="Full Name" size="large" />
            </Form.Item>
          </Col>

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
            <Form.Item
              label="Confirm Password"
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
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button htmlType="submit" block className="btn-submit" loading={loading}>
              Create account
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Register