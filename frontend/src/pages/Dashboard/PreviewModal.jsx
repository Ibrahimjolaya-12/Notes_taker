import { Modal, Button, ConfigProvider, message, Grid, theme } from "antd";
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

  const handleDownload = async () => {
    if (!rawUrl) return;

    if (isGoogleDrive) {
      const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return window.open(`https://drive.google.com/uc?export=download&id=${driveMatch[1]}`, "_blank");
      }
      return window.open(rawUrl, "_blank");
    }

    try {
      message.loading({ content: "Downloading...", key: "download" });
      const response = await axios.get(rawUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", getFileName());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      message.success({ content: "Downloaded!", key: "download" });
    } catch (error) {
      console.error("Download Error:", error);
      const link = document.createElement("a");
      link.href = rawUrl;
      link.target = "_blank";
      link.download = getFileName();
      link.click();
      message.destroy("download");
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#090a16",
          colorText: "#ffffff",
          colorBorder: "#1e2238",
          colorPrimary: "#6366f1",
          borderRadiusLG: 16,
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={isMobile ? "96%" : 920}
        styles={{
          mask: { backdropFilter: "blur(10px)", backgroundColor: "rgba(2, 6, 23, 0.82)" },
          content: {
            backgroundColor: "#090a16",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: isMobile ? "16px" : "22px 26px",
            borderRadius: "18px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Elegant Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "14px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: isPdf ? "rgba(239, 68, 68, 0.15)" : "rgba(99, 102, 241, 0.15)",
                  color: isPdf ? "#ef4444" : "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                  border: isPdf ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(99, 102, 241, 0.3)",
                }}
              >
                {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: isMobile ? "15px" : "17px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {note.title}
                </h3>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                  {note.chapter ? `${note.chapter} • ` : ""} {getFileName()}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                size="small"
                icon={<ExportOutlined />}
                onClick={handleOpenExternal}
                disabled={!rawUrl}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#cbd5e1",
                  height: "34px",
                  borderRadius: "8px",
                }}
              >
                {!isMobile && "Open"}
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                disabled={!rawUrl}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  height: "34px",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
              >
                {!isMobile && "Download"}
              </Button>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
                style={{ color: "#94a3b8", marginLeft: "4px", fontSize: "16px" }}
              />
            </div>
          </div>

          {/* Immersive Document Canvas */}
          <div
            style={{
              height: isMobile ? "68vh" : "72vh",
              background: "#02040a",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {rawUrl ? (
              isImage ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                  }}
                >
                  <img
                    src={rawUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ) : (
                <iframe
                  src={rawUrl}
                  title="PDF Viewer"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    backgroundColor: "#ffffff",
                  }}
                />
              )
            ) : (
              <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                <FileTextOutlined style={{ fontSize: "36px", marginBottom: "8px" }} />
                <p style={{ margin: 0, fontSize: "14px" }}>No document attached.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default PreviewModal;