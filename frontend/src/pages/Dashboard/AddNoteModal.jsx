import { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, message, ConfigProvider, Select, Grid, theme } from "antd";
import { UploadOutlined, CloseOutlined, LinkOutlined, FileAddOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const AddNoteModal = ({ visible, onClose, subjectId, onNoteCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("topic", values.topic || "");
      formData.append("chapter", values.chapter || "");
      formData.append("tags", values.tags || "general");
      formData.append("content", values.content || "");
      formData.append("driveLink", values.driveLink || "");

      if (fileList.length > 0) {
        formData.append("file", fileList[0]);
      }

      const res = await axios.post(
        `https://class-notes-backend.vercel.app/api/notes/create/${subjectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        message.success("Note created successfully!");
        form.resetFields();
        setFileList([]);
        onClose();
        if (onNoteCreated) onNoteCreated();
      }
    } catch (error) {
      console.error("Create note error:", error);
      message.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#080816",
          colorBgContainer: "#03030d",
          colorText: "#ffffff",
          colorTextHeading: "#ffffff",
          colorTextPlaceholder: "#64748b",
          colorBorder: "#1e2652",
          colorPrimary: "#6366f1",
          borderRadiusLG: 14,
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={handleClose}
        footer={null}
        closable={false}
        centered
        width={isMobile ? "94%" : 540}
        styles={{
          mask: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0, 0, 0, 0.78)" },
          content: {
            backgroundColor: "#080816",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: isMobile ? "16px" : "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          },
        }}
      >
        <div className="new-note-container">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileAddOutlined style={{ color: "#818cf8", fontSize: "18px" }} />
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: isMobile ? "16px" : "18px", fontWeight: 700 }}>
                New Note
              </h3>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleClose}
              style={{ color: "#94a3b8" }}
            />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ tags: "general" }}
            requiredMark={false}
          >
            {/* Title */}
            <Form.Item
              label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Title</span>}
              name="title"
              rules={[{ required: true, message: "Please enter note title!" }]}
            >
              <Input placeholder="Enter title..." size="large" />
            </Form.Item>

            {/* Topic & Chapter Responsive Grid */}
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Topic</span>} name="topic">
                  <Input placeholder="Topic name" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Chapter</span>} name="chapter">
                  <Input placeholder="e.g., Chapter 1" size="large" />
                </Form.Item>
              </Col>
            </Row>

            {/* Tags (Dropdown Select) */}
            <Form.Item label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Tag</span>} name="tags">
              <Select
                size="large"
                popupClassName="dark-select-dropdown"
                options={[
                  { label: "Midterm (mid)", value: "mid" },
                  { label: "Important (imp)", value: "imp" },
                  { label: "Final Exam (final)", value: "final" },
                  { label: "General (general)", value: "general" },
                ]}
              />
            </Form.Item>

            {/* Content */}
            <Form.Item label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Content</span>} name="content">
              <TextArea rows={4} placeholder="Write or paste note key points here..." />
            </Form.Item>

            {/* File Upload */}
            <Form.Item label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Attachment (PDF, image, doc)</span>}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#03030d",
                  border: "1px dashed rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              >
                <input
                  type="file"
                  id="note-file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setFileList([e.target.files[0]]);
                    }
                  }}
                />
                <label
                  htmlFor="note-file"
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                    color: "#818cf8",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Choose File
                </label>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "12.5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fileList.length > 0 ? fileList[0].name : "No file chosen"}
                </span>
              </div>
            </Form.Item>

            {/* Google Drive Link */}
            <Form.Item
              label={
                <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                  <LinkOutlined style={{ marginRight: 6 }} />
                  Or paste a Google Drive link
                </span>
              }
              name="driveLink"
              extra={
                <span style={{ color: "#64748b", fontSize: "11.5px" }}>
                  File must be shared as "Anyone with the link can view".
                </span>
              }
            >
              <Input size="large" placeholder="https://drive.google.com/file/d/.../view" />
            </Form.Item>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleClose}
                block={isMobile}
                style={{
                  background: "transparent",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#cbd5e1",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UploadOutlined />}
                block={isMobile}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  fontWeight: 600,
                }}
              >
                Save Note
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddNoteModal;