// import { useState, useEffect } from "react";
// import { Modal, Button, ConfigProvider, message, Grid, Spin, Tag } from "antd";
// import {
//   CloseOutlined,
//   FilePdfOutlined,
//   ExportOutlined,
//   DownloadOutlined,
//   FileTextOutlined,
//   GlobalOutlined,
//   FileWordOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { useBreakpoint } = Grid;

// const PreviewModal = ({ visible, onClose, note }) => {
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   const [blobUrl, setBlobUrl] = useState(null);
//   const [loading, setLoading] = useState(false);

//   let rawUrl = note?.fileUrl || note?.driveLink || "";

//   const isPdf =
//     rawUrl.toLowerCase().endsWith(".pdf") ||
//     rawUrl.includes("cloudinary.com") ||
//     rawUrl.includes("drive.google.com");
//   const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);
//   const isGoogleDrive = rawUrl.includes("drive.google.com");

//   // Real selectable PDF stream via Blob URL
//   useEffect(() => {
//     if (!visible || !note || !rawUrl) {
//       setBlobUrl(null);
//       return;
//     }

//     let isMounted = true;
//     let createdUrl = null;

//     const loadSelectablePDF = async () => {
//       if (isPdf && !isGoogleDrive) {
//         try {
//           setLoading(true);
//           const response = await axios.get(rawUrl, { responseType: "blob" });
//           const blob = new Blob([response.data], { type: "application/pdf" });
//           createdUrl = window.URL.createObjectURL(blob);
//           if (isMounted) {
//             setBlobUrl(createdUrl);
//           }
//         } catch (error) {
//           console.warn("Direct blob fallback to raw link:", error);
//           if (isMounted) setBlobUrl(rawUrl);
//         } finally {
//           if (isMounted) setLoading(false);
//         }
//       } else {
//         setBlobUrl(rawUrl);
//       }
//     };

//     loadSelectablePDF();

//     return () => {
//       isMounted = false;
//       if (createdUrl) {
//         window.URL.revokeObjectURL(createdUrl);
//       }
//     };
//   }, [visible, note?._id, rawUrl]);

//   if (!note) return null;

//   const getFileName = () => {
//     if (note.fileUrl) {
//       const cleanUrl = rawUrl.split("?")[0];
//       const parts = cleanUrl.split("/");
//       return parts[parts.length - 1];
//     }
//     if (note.driveLink) return "Google_Drive_Document";
//     return `${note.title || "document"}.pdf`;
//   };

//   // 1. OPEN IN DEFAULT READER / TAB
//   const handleOpenExternal = () => {
//     if (!rawUrl) return;

//     if (isGoogleDrive) {
//       return window.open(rawUrl, "_blank", "noopener,noreferrer");
//     }

//     const openUrl = rawUrl.replace("/fl_attachment/", "/");
//     window.open(openUrl, "_blank", "noopener,noreferrer");
//   };

//   // 2. DIRECT DOWNLOAD LOGIC
//   const handleDownload = async () => {
//     if (!rawUrl) return;

//     if (isGoogleDrive) {
//       const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
//       if (driveMatch && driveMatch[1]) {
//         return window.open(
//           `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`,
//           "_blank"
//         );
//       }
//       return window.open(rawUrl, "_blank");
//     }

//     try {
//       message.loading({ content: "Downloading document...", key: "dl" });
//       const response = await axios.get(rawUrl, { responseType: "blob" });
//       const mimeType = isPdf ? "application/pdf" : response.headers["content-type"] || "image/jpeg";
//       const blob = new Blob([response.data], { type: mimeType });
//       const dlBlobUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = dlBlobUrl;
//       link.setAttribute("download", getFileName());
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setTimeout(() => window.URL.revokeObjectURL(dlBlobUrl), 2000);
//       message.success({ content: "Downloaded successfully!", key: "dl" });
//     } catch (err) {
//       let fallbackUrl = rawUrl;
//       if (rawUrl.includes("cloudinary.com") && !rawUrl.includes("fl_attachment")) {
//         fallbackUrl = rawUrl.replace("/upload/", "/upload/fl_attachment/");
//       }
//       const link = document.createElement("a");
//       link.href = fallbackUrl;
//       link.setAttribute("download", getFileName());
//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       message.destroy("dl");
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorBgElevated: "#080816",
//           colorText: "#ffffff",
//           colorBorder: "#191b36",
//           colorPrimary: "#6366f1",
//         },
//       }}
//     >
//       <Modal
//         open={visible}
//         onCancel={onClose}
//         footer={null}
//         closable={false}
//         centered
//         width={isMobile ? "98%" : 940}
//         styles={{
//           mask: {
//             backdropFilter: "blur(10px)",
//             backgroundColor: "rgba(2, 6, 23, 0.88)",
//           },
//           content: {
//             backgroundColor: "#080816",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             padding: isMobile ? "14px 10px" : "18px 22px",
//             borderRadius: "18px",
//             boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
//           },
//         }}
//       >
//         <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header Bar */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
//               paddingBottom: "12px",
//               marginBottom: "12px",
//               gap: "10px",
//             }}
//           >
//             <div style={{ minWidth: 0 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: "#f8fafc",
//                     fontSize: isMobile ? "16px" : "18px",
//                     fontWeight: 700,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {note.title}
//                 </h3>
//                 {note.chapter && (
//                   <Tag color="indigo" style={{ borderRadius: "6px", fontSize: "11px" }}>
//                     {note.chapter}
//                   </Tag>
//                 )}
//               </div>
//               <p style={{ margin: "4px 0 0", color: "#818cf8", fontSize: "12px", fontWeight: 500 }}>
//                 {note.content || "Class Notes Interactive Workspace"}
//               </p>
//             </div>

//             <Button
//               type="text"
//               icon={<CloseOutlined />}
//               onClick={onClose}
//               style={{ color: "#94a3b8", padding: 0, fontSize: "16px" }}
//             />
//           </div>

//           {/* Action & Engine Metadata Pill Bar */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "space-between",
//               alignItems: isMobile ? "stretch" : "center",
//               gap: "10px",
//               background: "#0d0f22",
//               border: "1px solid rgba(255, 255, 255, 0.06)",
//               borderRadius: "12px",
//               padding: "10px 14px",
//               marginBottom: "12px",
//             }}
//           >
//             {/* Left Specs */}
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
//               <div
//                 style={{
//                   width: "36px",
//                   height: "36px",
//                   borderRadius: "9px",
//                   background: isPdf ? "rgba(99, 102, 241, 0.18)" : "rgba(239, 68, 68, 0.18)",
//                   color: isPdf ? "#818cf8" : "#ef4444",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "18px",
//                   flexShrink: 0,
//                   border: isPdf ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
//                 }}
//               >
//                 {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
//               </div>
//               <div style={{ minWidth: 0 }}>
//                 <span
//                   style={{
//                     color: "#ffffff",
//                     fontSize: "13px",
//                     fontWeight: 600,
//                     display: "block",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {getFileName()}
//                 </span>
//                 <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
//                   <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
//                     <FileWordOutlined style={{ color: "#38bdf8" }} /> MS Word Doc
//                   </span>
//                   <span style={{ color: "#475569" }}>•</span>
//                   <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
//                     <GlobalOutlined style={{ color: "#4ade80" }} /> Chrome PDF Viewer
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right Buttons */}
//             <div style={{ display: "flex", gap: "8px" }}>
//               <Button
//                 size="small"
//                 icon={<ExportOutlined />}
//                 onClick={handleOpenExternal}
//                 style={{
//                   background: "rgba(255, 255, 255, 0.05)",
//                   borderColor: "rgba(255, 255, 255, 0.12)",
//                   color: "#cbd5e1",
//                   height: "34px",
//                   borderRadius: "7px",
//                   fontWeight: 500,
//                 }}
//               >
//                 Open
//               </Button>
//               <Button
//                 size="small"
//                 type="primary"
//                 icon={<DownloadOutlined />}
//                 onClick={handleDownload}
//                 style={{
//                   background: "#6366f1",
//                   borderColor: "#6366f1",
//                   height: "34px",
//                   borderRadius: "7px",
//                   fontWeight: 600,
//                 }}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>

//           {/* Interactive Viewer Viewport */}
//           <div
//             style={{
//               height: isMobile ? "68vh" : "74vh",
//               background: "#05060d",
//               border: "1px solid rgba(255, 255, 255, 0.08)",
//               borderRadius: "14px",
//               overflow: "hidden",
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {loading ? (
//               <div style={{ textAlign: "center" }}>
//                 <Spin size="large" />
//                 <p style={{ marginTop: "14px", color: "#818cf8", fontSize: "13px" }}>
//                   Mounting Chrome PDF Reader engine...
//                 </p>
//               </div>
//             ) : rawUrl ? (
//               isGoogleDrive ? (
//                 <iframe
//                   src={rawUrl.replace(/\/view.*$/, "/preview")}
//                   title="Document Preview"
//                   style={{ width: "100%", height: "100%", border: "none" }}
//                 />
//               ) : isImage ? (
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     overflowY: "auto",
//                     padding: "16px",
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src={rawUrl}
//                     alt="Document"
//                     style={{
//                       maxWidth: "100%",
//                       height: "auto",
//                       alignSelf: "flex-start",
//                       borderRadius: "6px",
//                       boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <iframe
//                   src={`${blobUrl || rawUrl}#toolbar=1&navpanes=0&scrollbar=1`}
//                   title="Chrome PDF Engine"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     border: "none",
//                     backgroundColor: "#ffffff",
//                   }}
//                 />
//               )
//             ) : (
//               <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
//                 <FileTextOutlined style={{ fontSize: "36px", marginBottom: "8px" }} />
//                 <p style={{ margin: 0, fontSize: "14px" }}>No document attached to this note.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal>
//     </ConfigProvider>
//   );
// };

// export default PreviewModal;





// import { Modal, Button, ConfigProvider, Grid, Tag } from "antd";
// import {
//   CloseOutlined,
//   FilePdfOutlined,
//   ExportOutlined,
//   DownloadOutlined,
//   FileTextOutlined,
//   GlobalOutlined,
//   FileWordOutlined,
// } from "@ant-design/icons";

// const { useBreakpoint } = Grid;

// const BACKEND_URL =
//   import.meta.env.MODE === "production" || window.location.hostname !== "localhost"
//     ? "https://class-notes-backend.vercel.app"
//     : "http://localhost:5000";

// const PreviewModal = ({ visible, onClose, note }) => {
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   if (!note) return null;

//   const rawUrl = note.fileUrl || note.driveLink || "";
//   const isPdf =
//     rawUrl.toLowerCase().endsWith(".pdf") ||
//     rawUrl.includes("cloudinary.com") ||
//     rawUrl.includes("drive.google.com");
//   const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);
//   const isGoogleDrive = rawUrl.includes("drive.google.com");

//   // Server streaming endpoint jo browser native viewer ko trigger karega
//   const streamUrl = note._id
//     ? `${BACKEND_URL}/api/notes/view-file/${note._id}`
//     : rawUrl;

//   const getFileName = () => {
//     if (note.fileUrl) {
//       const cleanUrl = rawUrl.split("?")[0];
//       const parts = cleanUrl.split("/");
//       return parts[parts.length - 1];
//     }
//     if (note.driveLink) return "Google_Drive_Document";
//     return `${note.title || "document"}.pdf`;
//   };

//   // Open Button: Full browser window mein kholne ke liye
//   const handleOpenExternal = () => {
//     if (!rawUrl) return;
//     if (isGoogleDrive) {
//       return window.open(rawUrl, "_blank", "noopener,noreferrer");
//     }
//     window.open(streamUrl, "_blank", "noopener,noreferrer");
//   };

//   // Save Button: Direct file download trigger karega
//   const handleDownload = () => {
//     if (!rawUrl) return;
//     if (isGoogleDrive) {
//       const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
//       if (driveMatch && driveMatch[1]) {
//         return window.open(`https://drive.google.com/uc?export=download&id=${driveMatch[1]}`, "_blank");
//       }
//       return window.open(rawUrl, "_blank");
//     }
//     window.open(`${streamUrl}?download=true`, "_self");
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorBgElevated: "#080816",
//           colorText: "#ffffff",
//           colorBorder: "#191b36",
//           colorPrimary: "#6366f1",
//         },
//       }}
//     >
//       <Modal
//         open={visible}
//         onCancel={onClose}
//         footer={null}
//         closable={false}
//         centered
//         width={isMobile ? "98%" : 940}
//         styles={{
//           mask: {
//             backdropFilter: "blur(10px)",
//             backgroundColor: "rgba(2, 6, 23, 0.88)",
//           },
//           content: {
//             backgroundColor: "#080816",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             padding: isMobile ? "14px 10px" : "18px 22px",
//             borderRadius: "18px",
//             boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
//           },
//         }}
//       >
//         <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
//               paddingBottom: "12px",
//               marginBottom: "12px",
//               gap: "10px",
//             }}
//           >
//             <div style={{ minWidth: 0 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: "#f8fafc",
//                     fontSize: isMobile ? "16px" : "18px",
//                     fontWeight: 700,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {note.title}
//                 </h3>
//                 {note.chapter && (
//                   <Tag color="indigo" style={{ borderRadius: "6px", fontSize: "11px" }}>
//                     {note.chapter}
//                   </Tag>
//                 )}
//               </div>
//               <p style={{ margin: "4px 0 0", color: "#818cf8", fontSize: "12px", fontWeight: 500 }}>
//                 {note.content || "Class Notes Interactive Workspace"}
//               </p>
//             </div>

//             <Button
//               type="text"
//               icon={<CloseOutlined />}
//               onClick={onClose}
//               style={{ color: "#94a3b8", padding: 0, fontSize: "16px" }}
//             />
//           </div>

//           {/* Metadata Pill Bar */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "space-between",
//               alignItems: isMobile ? "stretch" : "center",
//               gap: "10px",
//               background: "#0d0f22",
//               border: "1px solid rgba(255, 255, 255, 0.06)",
//               borderRadius: "12px",
//               padding: "10px 14px",
//               marginBottom: "12px",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
//               <div
//                 style={{
//                   width: "36px",
//                   height: "36px",
//                   borderRadius: "9px",
//                   background: isPdf ? "rgba(99, 102, 241, 0.18)" : "rgba(239, 68, 68, 0.18)",
//                   color: isPdf ? "#818cf8" : "#ef4444",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "18px",
//                   flexShrink: 0,
//                   border: isPdf ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
//                 }}
//               >
//                 {isImage ? <FileTextOutlined /> : <FilePdfOutlined />}
//               </div>
//               <div style={{ minWidth: 0 }}>
//                 <span
//                   style={{
//                     color: "#ffffff",
//                     fontSize: "13px",
//                     fontWeight: 600,
//                     display: "block",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {getFileName()}
//                 </span>
//                 <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
//                   <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
//                     <FileWordOutlined style={{ color: "#38bdf8" }} /> MS Word Doc
//                   </span>
//                   <span style={{ color: "#475569" }}>•</span>
//                   <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
//                     <GlobalOutlined style={{ color: "#4ade80" }} /> Chrome PDF Viewer
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div style={{ display: "flex", gap: "8px" }}>
//               <Button
//                 size="small"
//                 icon={<ExportOutlined />}
//                 onClick={handleOpenExternal}
//                 style={{
//                   background: "rgba(255, 255, 255, 0.05)",
//                   borderColor: "rgba(255, 255, 255, 0.12)",
//                   color: "#cbd5e1",
//                   height: "34px",
//                   borderRadius: "7px",
//                   fontWeight: 500,
//                 }}
//               >
//                 Open
//               </Button>
//               <Button
//                 size="small"
//                 type="primary"
//                 icon={<DownloadOutlined />}
//                 onClick={handleDownload}
//                 style={{
//                   background: "#6366f1",
//                   borderColor: "#6366f1",
//                   height: "34px",
//                   borderRadius: "7px",
//                   fontWeight: 600,
//                 }}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>

//           {/* Chrome / Edge Native PDF Engine Canvas */}
//           <div
//             style={{
//               height: isMobile ? "68vh" : "74vh",
//               background: "#05060d",
//               border: "1px solid rgba(255, 255, 255, 0.08)",
//               borderRadius: "14px",
//               overflow: "hidden",
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {rawUrl ? (
//               isImage ? (
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     overflowY: "auto",
//                     padding: "16px",
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src={rawUrl}
//                     alt="Document Attachment"
//                     style={{
//                       maxWidth: "100%",
//                       height: "auto",
//                       alignSelf: "flex-start",
//                       borderRadius: "6px",
//                       boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <iframe
//                   src={`${streamUrl}#toolbar=1&navpanes=0&scrollbar=1`}
//                   title="Chrome PDF Engine"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     border: "none",
//                     backgroundColor: "#ffffff",
//                   }}
//                 />
//               )
//             ) : (
//               <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
//                 <FileTextOutlined style={{ fontSize: "36px", marginBottom: "8px" }} />
//                 <p style={{ margin: 0, fontSize: "14px" }}>No document attached to this note.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal>
//     </ConfigProvider>
//   );
// };

// export default PreviewModal;





import { useState, useEffect } from "react";
import { Modal, Button, ConfigProvider, message, Grid, Tag } from "antd";
import {
  CloseOutlined,
  FilePdfOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
  GlobalOutlined,
  FileWordOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

const PreviewModal = ({ visible, onClose, note }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // Maximum 12 pages tak auto-render karega; jo page exist nahi karega woh automatically hide ho jayega
  const [pages, setPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  let rawUrl = note?.fileUrl || note?.driveLink || "";

  const isPdf =
    rawUrl.toLowerCase().endsWith(".pdf") ||
    rawUrl.includes("cloudinary.com") ||
    rawUrl.includes("drive.google.com");
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);
  const isGoogleDrive = rawUrl.includes("drive.google.com");

  useEffect(() => {
    setPages([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }, [note?._id, rawUrl]);

  if (!note) return null;

  // Cloudinary multi-page HD rendering URL
  const getCloudinaryPageUrl = (url, pageNumber) => {
    if (!url) return "";
    if (url.includes("cloudinary.com") && isPdf) {
      const transformed = url.replace(
        /\/upload\/(pg_\d+[^/]*\/)?/,
        `/upload/pg_${pageNumber},f_auto,q_auto/`
      );
      return transformed.replace(/\.pdf(\?.*)?$/i, ".jpg$1");
    }
    return url;
  };

  const handlePageError = (failedPage) => {
    setPages((prev) => prev.filter((p) => p < failedPage));
  };

  const getFileName = () => {
    if (note.fileUrl) {
      const cleanUrl = rawUrl.split("?")[0];
      const parts = cleanUrl.split("/");
      return parts[parts.length - 1];
    }
    if (note.driveLink) return "Google_Drive_Document";
    return `${note.title || "document"}.pdf`;
  };

  // 1. OPEN BUTTON: Direct viewer tab me khulega (Pehle download hone ka jhanjhat khatam)
  const handleOpenExternal = () => {
    if (!rawUrl) return;

    if (isGoogleDrive) {
      return window.open(rawUrl, "_blank", "noopener,noreferrer");
    }

    if (isPdf) {
      const onlineViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}`;
      return window.open(onlineViewer, "_blank", "noopener,noreferrer");
    }

    window.open(rawUrl, "_blank", "noopener,noreferrer");
  };

  // 2. SAVE BUTTON: Direct hard drive download
  const handleDownload = () => {
    if (!rawUrl) return;

    if (isGoogleDrive) {
      const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return window.open(
          `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`,
          "_blank"
        );
      }
      return window.open(rawUrl, "_blank");
    }

    let downloadUrl = rawUrl;
    if (rawUrl.includes("cloudinary.com")) {
      downloadUrl = rawUrl.replace(
        /\/upload\/(fl_attachment[^/]*\/)?/,
        "/upload/fl_attachment/"
      );
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", getFileName());
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success({ content: "Download started!", key: "dl", duration: 2 });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "#080816",
          colorText: "#ffffff",
          colorBorder: "#191b36",
          colorPrimary: "#6366f1",
        },
      }}
    >
      <style>{`
        .custom-doc-scrollbar {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          display: block !important;
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #0a0b16;
        }
        .custom-doc-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-doc-scrollbar::-webkit-scrollbar-track {
          background: #0a0b16;
        }
        .custom-doc-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 4px;
        }
        .custom-doc-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>

      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={isMobile ? "98%" : 940}
        styles={{
          mask: {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(2, 6, 23, 0.88)",
          },
          content: {
            backgroundColor: "#080816",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: isMobile ? "14px 10px" : "18px 22px",
            borderRadius: "18px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
                {note.chapter && (
                  <Tag color="indigo" style={{ borderRadius: "6px", fontSize: "11px" }}>
                    {note.chapter}
                  </Tag>
                )}
              </div>
              <p style={{ margin: "4px 0 0", color: "#818cf8", fontSize: "12px", fontWeight: 500 }}>
                {note.content || "Class Notes Interactive Workspace"}
              </p>
            </div>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "#94a3b8", padding: 0, fontSize: "16px" }}
            />
          </div>

          {/* Metadata Pill Bar */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: "10px",
              background: "#0d0f22",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "10px 14px",
              marginBottom: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  background: isPdf ? "rgba(99, 102, 241, 0.18)" : "rgba(239, 68, 68, 0.18)",
                  color: isPdf ? "#818cf8" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                  border: isPdf ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
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
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FileWordOutlined style={{ color: "#38bdf8" }} /> MS Word Doc
                  </span>
                  <span style={{ color: "#475569" }}>•</span>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <GlobalOutlined style={{ color: "#4ade80" }} /> Chrome PDF Viewer
                  </span>
                </div>
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
                  height: "34px",
                  borderRadius: "7px",
                  fontWeight: 500,
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
                  height: "34px",
                  borderRadius: "7px",
                  fontWeight: 600,
                }}
              >
                Save
              </Button>
            </div>
          </div>

          {/* Document Canvas (Continuous Multi-Page Sheets & Smooth Scroll) */}
          <div
            className="custom-doc-scrollbar"
            style={{
              height: isMobile ? "68vh" : "74vh",
              background: "#0a0b16",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: isMobile ? "12px 6px" : "20px 14px",
            }}
          >
            {rawUrl ? (
              isGoogleDrive ? (
                <iframe
                  src={rawUrl.replace(/\/view.*$/, "/preview")}
                  title="Document Preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              ) : isImage ? (
                <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "24px" }}>
                  <img
                    src={rawUrl}
                    alt="Attachment"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: "6px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
                    }}
                  />
                </div>
              ) : (
                <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "30px" }}>
                  {pages.map((pageNum) => (
                    <div key={pageNum} style={{ marginBottom: "22px" }}>
                      <div
                        style={{
                          background: "#ffffff",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={getCloudinaryPageUrl(rawUrl, pageNum)}
                          alt={`Page ${pageNum}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                          }}
                          onError={() => handlePageError(pageNum)}
                        />
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "11px",
                          marginTop: "6px",
                          fontWeight: 500,
                        }}
                      >
                        Page {pageNum}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
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