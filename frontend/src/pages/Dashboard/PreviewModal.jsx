import { Modal, Button, ConfigProvider, message } from "antd";
import {
  CloseOutlined,
  FilePdfOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";

const PreviewModal = ({ visible, onClose, note }) => {
  if (!note) return null;

  // 1. URL Resolution logic
  let rawUrl = note.fileUrl || note.driveLink || "";
  if (rawUrl.startsWith("/uploads")) {
    rawUrl = `http://localhost:5000${rawUrl}`;
  } else if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.includes("drive.google.com")) {
    rawUrl = `http://localhost:5000/uploads/${rawUrl}`;
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
    // PDF toolbar aur fit mode enable karne ke liye
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
        token: {
          colorBgElevated: "#070716",
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
        width={900}
        wrapClassName="dark-preview-modal-overlay"
        className="custom-preview-modal"
      >
        <div className="preview-modal-content">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h3 className="note-main-title">{note.title}</h3>
              <p className="note-sub-desc">{note.content || note.chapter || "Document Viewer"}</p>
            </div>
            <CloseOutlined className="btn-close-modal" onClick={onClose} />
          </div>

          {/* Meta Bar */}
          <div className="file-info-bar d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="file-type-icon">
                {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
              </div>
              <div>
                <span className="file-name-text">{getFileName()}</span>
                <span className="file-type-subtext">
                  {isGoogleDrive ? "GOOGLE DRIVE FILE" : "ATTACHED DOCUMENT"}
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                icon={<ExportOutlined />}
                className="action-pill-btn"
                onClick={handleOpenExternal}
                disabled={!rawUrl}
              >
                Open
              </Button>
              <Button
                icon={<DownloadOutlined />}
                className="action-pill-btn"
                onClick={handleDownload}
                disabled={!rawUrl}
              >
                Save
              </Button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="document-viewer-container">
            {rawUrl ? (
              isImage ? (
                <div className="image-viewer-wrapper">
                  <img src={rawUrl} alt="Note Attachment" />
                </div>
              ) : (
                /* Object tag browser ke native PDF plugin ko force invoke karta hai */
                <object
                  data={getEmbedUrl(rawUrl)}
                  type="application/pdf"
                  className="pdf-iframe-viewer"
                >
                  <iframe
                    src={getEmbedUrl(rawUrl)}
                    title="Document Preview"
                    className="pdf-iframe-viewer"
                    frameBorder="0"
                  />
                </object>
              )
            ) : (
              <div className="no-file-screen">
                <p>No document attached to this note.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default PreviewModal;