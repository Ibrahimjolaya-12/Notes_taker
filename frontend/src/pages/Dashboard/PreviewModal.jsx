import { Modal, Button, ConfigProvider, message, Grid } from "antd";
import {
  CloseOutlined,
  FilePdfOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { useBreakpoint } = Grid;

const BACKEND_URL =
  import.meta.env.MODE === "production" || window.location.hostname !== "localhost"
    ? "https://class-notes-backend.vercel.app"
    : "http://localhost:5000";

const PreviewModal = ({ visible, onClose, note }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  if (!note) return null;

  // Direct backend native streaming link
  const fileStreamUrl = note._id ? `${BACKEND_URL}/api/notes/view-file/${note._id}` : (note.fileUrl || "");
  const rawUrl = note.fileUrl || note.driveLink || "";

  const isPdf = rawUrl.toLowerCase().endsWith(".pdf") || rawUrl.includes("cloudinary.com") || rawUrl.includes("drive.google.com");
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
    if (!fileStreamUrl) return;
    window.open(fileStreamUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async () => {
    if (!fileStreamUrl) return;
    try {
      message.loading({ content: "Downloading...", key: "dl" });
      const response = await axios.get(fileStreamUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: isPdf ? "application/pdf" : "image/jpeg" });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", getFileName());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      message.success({ content: "Downloaded!", key: "dl" });
    } catch (err) {
      window.open(fileStreamUrl, "_blank");
      message.destroy("dl");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "#080816",
          colorText: "#ffffff",
          colorBorder: "#191b36",
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={isMobile ? "96%" : 880}
        styles={{
          mask: { backdropFilter: "blur(8px)", backgroundColor: "rgba(3, 7, 18, 0.85)" },
          content: {
            backgroundColor: "#080816",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: isMobile ? "14px 12px" : "20px 24px",
            borderRadius: "16px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* 1. Header (Matches Demo) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "12px",
              marginBottom: "12px",
              gap: "10px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {note.title}
              </h3>
              <p style={{ margin: "3px 0 0", color: "#818cf8", fontSize: "12px", fontWeight: 500 }}>
                {note.content || note.chapter || "Document Viewer"}
              </p>
            </div>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "#94a3b8", padding: 0 }}
            />
          </div>

          {/* 2. File Bar (Matches Demo Pill Bar) */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: "10px",
              background: "#0e1124",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: isPdf ? "rgba(99, 102, 241, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  color: isPdf ? "#818cf8" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
                  flexShrink: 0,
                }}
              >
                {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {getFileName()}
                </span>
                <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase" }}>
                  {isGoogleDrive ? "GOOGLE DRIVE FILE" : isPdf ? "PDF DOCUMENT" : "ATTACHED DOCUMENT"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                size="small"
                icon={<ExportOutlined />}
                onClick={handleOpenExternal}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  height: "32px",
                  borderRadius: "6px",
                }}
              >
                Open
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  height: "32px",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                Save
              </Button>
            </div>
          </div>

          {/* 3. Document Viewer Canvas (Native Browser PDF Viewer) */}
          <div
            style={{
              height: isMobile ? "65vh" : "70vh",
              background: "#03040a",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {fileStreamUrl ? (
              isImage ? (
                <div style={{ width: "100%", height: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                  <img src={fileStreamUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "6px" }} />
                </div>
              ) : (
                <object
                  data={`${fileStreamUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  type="application/pdf"
                  style={{ width: "100%", height: "100%", border: "none" }}
                >
                  <iframe
                    src={`${fileStreamUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    title="Document Preview"
                    style={{ width: "100%", height: "100%", border: "none", backgroundColor: "#ffffff" }}
                  />
                </object>
              )
            ) : (
              <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                <FileTextOutlined style={{ fontSize: "36px", marginBottom: "8px" }} />
                <p style={{ margin: 0, fontSize: "14px" }}>No document attached to this note.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default PreviewModal;