import { Button, Col, Form, Input, message, Row } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubjectCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/subjects/create", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message || "Subject created successfully!");
        form.resetFields();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "460px",
        margin: "60px auto",
        backgroundColor: "#080718", // 👈 Exact Modal Deep Dark Color
        padding: "24px 28px",
        borderRadius: "14px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Modal Top Header with Close Icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 style={{ color: "#ffffff", fontSize: "16px", fontWeight: "600", margin: 0 }}>
          Create subject folder
        </h4>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6b6a82",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          {/* Code Input */}
          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>Code</span>}
              name="code"
              rules={[{ required: true, message: "Please input subject code!" }]}
              style={{ marginBottom: "16px" }}
            >
              <Input
                placeholder="e.g. BIO-201"
                style={{
                  backgroundColor: "#050410",
                  border: "1px solid #28244e", // Subtle purple outline
                  color: "#ffffff",
                  height: "40px",
                  borderRadius: "8px",
                  padding: "0 12px",
                }}
              />
            </Form.Item>
          </Col>

          {/* Name Input */}
          <Col span={24}>
            <Form.Item
              label={<span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>Name</span>}
              name="name"
              rules={[{ required: true, message: "Please input subject name!" }]}
              style={{ marginBottom: "24px" }}
            >
              <Input
                placeholder="e.g. Biology 201"
                style={{
                  backgroundColor: "#050410",
                  border: "1px solid #1a182f",
                  color: "#ffffff",
                  height: "40px",
                  borderRadius: "8px",
                  padding: "0 12px",
                }}
              />
            </Form.Item>
          </Col>

          {/* Right Aligned Submit Button */}
          <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: "#5445d1",
                borderColor: "#5445d1",
                color: "#ffffff",
                height: "36px",
                padding: "0 22px",
                fontWeight: "500",
                fontSize: "13px",
                borderRadius: "6px",
              }}
            >
              Create
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SubjectCard;