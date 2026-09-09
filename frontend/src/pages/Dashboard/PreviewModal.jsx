import { Modal, Button, ConfigProvider, Grid, theme } from "antd";
import {
  CloseOutlined,
  FilePdfOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { useBreakpoint } = Grid;

const BACKEND_URL =
  process.env.NODE_ENV === "production" || window.location.hostname !== "localhost"
    ? "https://class-notes-backend.vercel.app"
    : "http://localhost:5000";

const PreviewModal = ({ visible, onClose, note }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  if (!note) return null;

  let rawUrl = note.fileUrl || note.driveLink || "";
  
  if (rawUrl.startsWith("http://localhost:5000") || rawUrl.startsWith("https://class-notes-backend.vercel.app")) {
    const pathPart = rawUrl.replace(/^https?:\/\/[^/]+/, "");
    rawUrl = `${BACKEND_URL}${pathPart}`;
  } else if (rawUrl.startsWith("/uploads")) {
    rawUrl = `${BACKEND_URL}${rawUrl}`;
  } else if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.includes("drive.google.com")) {
    rawUrl = `${BACKEND_URL}/uploads/${rawUrl}`;
  }

  const isPdf = rawUrl.toLowerCase().endsWith(".pdf") || rawUrl.includes("drive.google.com") || rawUrl.includes("cloudinary.com");
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);
  const isGoogleDrive = rawUrl.includes("drive.google.com");

  const getFileName = () => {
    if (note.fileUrl) {
      const cleanUrl = rawUrl.split("?")[0];
      const parts = cleanUrl.split("/");
      return parts[parts.length - 1];
    }
    if (note.driveLink) return "Google_Drive_Doc";
    return `${note.title || "document"}.pdf`;
  };

  const handleOpenExternal = () => {
    if (!rawUrl) return;
    window.open(rawUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#080816",
          colorText: "#ffffff",
          colorBorder: "#191b36",
          colorPrimary: "#6366f1",
          borderRadiusLG: 14,
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={isMobile ? "96%" : 750}
        styles={{
          mask: { backdropFilter: "blur(8px)", backgroundColor: "rgba(3, 7, 18, 0.85)" },
          content: {
            backgroundColor: "#080816",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "16px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "14px",
              marginBottom: "18px",
              gap: "10px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: isMobile ? "16px" : "19px",
                  fontWeight: 700,
                }}
              >
                {note.title}
              </h3>
              <p style={{ margin: "4px 0 0", color: "#818cf8", fontSize: "12.5px", fontWeight: 500 }}>
                {note.chapter || "Study Attachment Preview"}
              </p>
            </div>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "#94a3b8", padding: 0 }}
            />
          </div>

          {/* Clean Presentation Preview Box */}
          <div
            style={{
              background: "#0e1124",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "36px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: isPdf ? "rgba(239, 68, 68, 0.15)" : "rgba(99, 102, 241, 0.15)",
                color: isPdf ? "#ef4444" : "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                border: isPdf ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
            </div>

            <div>
              <h4 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, margin: "0 0 4px" }}>
                {getFileName()}
              </h4>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                {isGoogleDrive ? "Google Drive Secure Document" : "Cloudinary Secure Study File"}
              </span>
            </div>

            {/* Action Buttons for Presentation */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", width: "100%", maxWidth: "320px" }}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handleOpenExternal}
                block
                size="large"
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  fontWeight: 600,
                  height: "42px",
                  borderRadius: "8px",
                }}
              >
                Open Document
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default PreviewModal;