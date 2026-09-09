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

const PreviewModal = ({ visible, onClose, note }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  if (!note) return null;

  // 1. URL Resolution logic
  let rawUrl = note.fileUrl || note.driveLink || "";
  if (rawUrl.startsWith("/uploads")) {
    rawUrl = `https://class-notes-backend.vercel.app${rawUrl}`;
  } else if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.includes("drive.google.com")) {
    rawUrl = `https://class-notes-backend.vercel.app/uploads/${rawUrl}`;
  }

  const isPdf = rawUrl.toLowerCase().endsWith(".pdf") || rawUrl.includes("drive.google.com");
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);
  const isGoogleDrive = rawUrl.includes("drive.google.com");

  // File Name resolver
  const getFileName = () => {
    if (note.fileUrl) {
      const cleanUrl = rawUrl.split("?")[0];
      const parts = cleanUrl.split("/");
      return parts[parts.length - 1];
    }
    if (note.driveLink) return "Google_Drive_Doc";
    return `${note.title || "document"}.pdf`;
  };

  // Safe Embed URL generator
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com/file/d/")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    return `${url}#toolbar=1&navpanes=0&scrollbar=1`;
  };

  // Open in native reader or tab
  const handleOpenExternal = () => {
    if (!rawUrl) return;
    window.open(rawUrl, "_blank", "noopener,noreferrer");
  };

  // Direct safe download logic
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
          {/* Header */}
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
              <p
                style={{
                  margin: "3px 0 0",
                  color: "#818cf8",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {note.chapter || "Study Attachment"}
              </p>
            </div>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "#94a3b8", padding: 0 }}
            />
          </div>

          {/* Meta Bar */}
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
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: isPdf ? "rgba(239, 68, 68, 0.15)" : "rgba(99, 102, 241, 0.15)",
                  color: isPdf ? "#ef4444" : "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
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
                  {isGoogleDrive ? "Google Drive Document" : "Attached Study File"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                size="small"
                icon={<ExportOutlined />}
                onClick={handleOpenExternal}
                disabled={!rawUrl}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  flex: isMobile ? 1 : "initial",
                  height: "32px",
                }}
              >
                Open
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
                  flex: isMobile ? 1 : "initial",
                  height: "32px",
                }}
              >
                Download
              </Button>
            </div>
          </div>

          {/* Viewer Canvas */}
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
                    padding: "10px",
                  }}
                >
                  <img
                    src={rawUrl}
                    alt="Attachment Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ) : (
                <iframe
                  src={getEmbedUrl(rawUrl)}
                  title="Document Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
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