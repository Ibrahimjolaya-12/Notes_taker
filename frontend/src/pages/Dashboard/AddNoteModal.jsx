import { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, message, ConfigProvider, Select } from "antd";
import { UploadOutlined, CloseOutlined, LinkOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const AddNoteModal = ({ visible, onClose, subjectId, onNoteCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("topic", values.topic || "");
      formData.append("chapter", values.chapter || "");
      formData.append("tags", values.tags || "general"); // 👈 Selected tag
      formData.append("content", values.content || "");
      formData.append("driveLink", values.driveLink || "");

      if (fileList.length > 0) {
        formData.append("file", fileList[0]);
      }

      const res = await axios.post(
        `http://localhost:5000/api/notes/create/${subjectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "#080816",
          colorBgContainer: "#03030d",
          colorText: "#ffffff",
          colorTextHeading: "#ffffff",
          colorTextPlaceholder: "#4b4a62",
          colorBorder: "#1e2652",
          controlItemBgActive: "#1c234a",
          controlItemBgHover: "#11263c",
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={520}
        wrapClassName="dark-modal-overlay"
        className="custom-dark-modal"
      >
        <div className="new-note-container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="modal-title">New note</h3>
            <CloseOutlined className="close-btn" onClick={onClose} />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ tags: "general" }} // 👈 Default value set ki hai
          >
            {/* Title */}
            <Form.Item
              label={<span className="field-label">Title</span>}
              name="title"
              rules={[{ required: true, message: "Please enter note title!" }]}
            >
              <Input className="dark-field highlight-field" placeholder="Enter title" />
            </Form.Item>

            {/* Topic & Chapter */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={<span className="field-label">Topic</span>} name="topic">
                  <Input className="dark-field" placeholder="Topic name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="field-label">Chapter</span>} name="chapter">
                  <Input className="dark-field" placeholder="Chapter 1" />
                </Form.Item>
              </Col>
            </Row>

            {/* Tags (Dropdown Select) */}
            <Form.Item label={<span className="field-label">Tag</span>} name="tags">
              <Select
                className="dark-select"
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
            <Form.Item label={<span className="field-label">Content</span>} name="content">
              <TextArea rows={4} className="dark-field dark-textarea" placeholder="Write note content here..." />
            </Form.Item>

            {/* File Upload */}
            <Form.Item label={<span className="field-label">File (PDF, image, video, PPT, text)</span>}>
              <div className="custom-file-input">
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
                <label htmlFor="note-file" className="file-btn">
                  Choose File
                </label>
                <span className="file-name">
                  {fileList.length > 0 ? fileList[0].name : "No file chosen"}
                </span>
              </div>
            </Form.Item>

            {/* Google Drive Link */}
            <Form.Item
              label={
                <span className="field-label">
                  <LinkOutlined style={{ marginRight: 6 }} />
                  Or paste a Google Drive link
                </span>
              }
              name="driveLink"
              extra={
                <span className="field-hint">
                  File must be shared as "Anyone with the link can view".
                </span>
              }
            >
              <Input
                className="dark-field"
                placeholder="https://drive.google.com/file/d/.../view"
              />
            </Form.Item>

            {/* Save Button */}
            <div className="d-flex justify-content-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UploadOutlined />}
                className="btn-save"
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddNoteModal;