import { useEffect, useState, useCallback } from "react";
import { Button, Col, Input, Row, Spin, message, Modal, Space, Popconfirm, Grid } from "antd";
import ReactMarkdown from "react-markdown";
import { ConfigProvider, theme } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  CopyOutlined,
  FileTextOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddNoteModal from "./AddNoteModal";
import PreviewModal from "./PreviewModal";
import QuizModal from "../../components/QuizModal";

const { useBreakpoint } = Grid;

const IndividualCards = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteForPreview, setSelectedNoteForPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const [summaryData, setSummaryData] = useState({
    open: false,
    title: "",
    chapter: "",
    topic: "",
    content: "",
  });

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // 1. Backend Fetch: Subject Details & Notes
  const fetchSubjectAndNotes = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Please login first");
      return navigate("/auth/login");
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const subRes = await axios.get(`https://class-notes-backend.vercel.app/api/subjects/${id}`, { headers });
      if (subRes.data.success) {
        setSubject(subRes.data.subject);
      }

      const notesRes = await axios.get(`https://class-notes-backend.vercel.app/api/notes/subject/${id}`, { headers });
      if (notesRes.data.success) {
        setNotes(notesRes.data.notes);
      }
    } catch (err) {
      console.error("Fetch Data Error:", err);
      message.error(err.response?.data?.message || "Failed to load notes data");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchSubjectAndNotes();
  }, [id, fetchSubjectAndNotes]);

  // 2. AI Summarize Handler
  const handleSummarize = async (note) => {
    try {
      message.loading({ content: `Analyzing & summarizing "${note.title}"...`, key: "sum", duration: 0 });
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `https://class-notes-backend.vercel.app/api/notes/summarize-pdf/${note._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        message.success({ content: "Summary ready!", key: "sum" });
        setSummaryData({
          open: true,
          title: note.title,
          chapter: note.chapter || "General Chapter",
          topic: note.topic || "Core Concept",
          content: res.data.summary,
        });
      } else {
        message.error({
          content: res.data?.message || "Failed to generate summary",
          key: "sum",
        });
      }
    } catch (err) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Failed to generate summary",
        key: "sum",
      });
    }
  };

  // 3. Direct Filter Logic
  const filteredNotes = notes.filter((note) => {
    const noteTags = (note.tag || note.tags || "")
      .split(",")
      .map((t) => t.trim().toLowerCase());

    const matchesTag =
      selectedTag === "All" || noteTags.includes(selectedTag.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      note.title?.toLowerCase().includes(query) ||
      note.topic?.toLowerCase().includes(query) ||
      note.chapter?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query);

    return matchesTag && matchesSearch;
  });

  const allTags = notes.flatMap((note) =>
    (note.tag || note.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );
  const availableTags = ["All", ...new Set(allTags)];

  // 4. Delete Note Handler
  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`https://class-notes-backend.vercel.app/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        message.success("Note deleted successfully");
        setNotes((prev) => prev.filter((n) => n._id !== noteId));
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div
      className="individual-notes-wrapper"
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: isMobile ? "12px" : "20px 24px",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <span
            style={{
              color: "#818cf8",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {subject?.code || "CODE-000"}
          </span>
          <h2
            style={{
              color: "#ffffff",
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: 700,
              margin: "2px 0 0",
            }}
          >
            {subject?.name || "Subject Notes"}
          </h2>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            icon={<ExperimentOutlined />}
            onClick={() => setIsQuizOpen(true)}
            style={{
              background: "rgba(99, 102, 241, 0.12)",
              borderColor: "rgba(99, 102, 241, 0.3)",
              color: "#818cf8",
              fontWeight: 600,
              flex: isMobile ? 1 : "initial",
              height: "38px",
            }}
          >
            Take Quiz
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: "#6366f1",
              borderColor: "#6366f1",
              fontWeight: 600,
              flex: isMobile ? 1 : "initial",
              height: "38px",
            }}
          >
            Add note
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "14px" }}>
        <Input
          size="large"
          placeholder="Search notes by title, topic, chapter or content..."
          prefix={<SearchOutlined style={{ color: "#64748b" }} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "#0c0d1e",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            color: "#ffffff",
          }}
        />
      </div>

      {/* Tag Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "14px",
          scrollbarWidth: "none",
          paddingTop:"10px"
        }}
      >
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{
              background:
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? "#6366f1"
                  : "rgba(255, 255, 255, 0.05)",
              color: selectedTag.toLowerCase() === tag.toLowerCase() ? "#ffffff" : "#94a3b8",
              border:
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? "1px solid #6366f1"
                  : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "12.5px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Content Grid (Desktop: 4 Cards, Tablet: 2 Cards, Mobile: 1 Card) */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div
          style={{
            background: "#0c0d1e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "60px 20px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>No notes found in this folder.</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredNotes.map((note) => (
            <Col xs={24} sm={12} md={12} lg={6} xl={6} key={note._id}>
              <div
                style={{
                  background: "#0c0d1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "230px",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  {/* Title & Delete Action */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        wordBreak: "break-word",
                      }}
                    >
                      {note.title}
                    </h4>

                    {/* Fixed Delete with Popconfirm */}
                    <Popconfirm
                      title="Delete Note"
                      description="Delete this note permanently?"
                      onConfirm={() => handleDeleteNote(note._id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                      cancelButtonProps={{
                        style: {
                          backgroundColor: "#1e1e38",
                          borderColor: "#35355e",
                          color: "#ffffff",
                        },
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title="Delete Note"
                      >
                        <DeleteOutlined style={{ fontSize: "14px" }} />
                      </button>
                    </Popconfirm>
                  </div>

                  {/* 👈 Explicit Topic Display (Fallback if missing) */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: "rgba(99, 102, 241, 0.12)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      marginBottom: "6px",
                    }}
                  >
                    <BookOutlined style={{ fontSize: "11px", color: "#818cf8" }} />
                    <span
                      style={{
                        color: "#a5b4fc",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      {note.topic || note.chapter || "General Topic"}
                    </span>
                  </div>

                  {/* Chapter */}
                  {note.chapter && (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        fontWeight: 500,
                        margin: "0 0 6px 0",
                      }}
                    >
                      Chapter: {note.chapter}
                    </p>
                  )}

                  {/* Content / Description */}
                  <p
                    style={{
                      color: "#cbd5e1",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      margin: "0 0 12px 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.content || "No textual description available."}
                  </p>
                </div>

                <div>
                  {/* Tags Badges */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    {(note.tag || note.tags || "")
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "#cbd5e1",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "11px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                  </div>

                  {/* Actions (Preview & AI Summarize) */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      paddingTop: "10px",
                    }}
                  >
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        if (!note.fileUrl && !note.driveLink) {
                          return message.info("No attachment available for this note");
                        }
                        setSelectedNoteForPreview(note);
                        setIsPreviewOpen(true);
                      }}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        fontSize: "12px",
                        flex: 1,
                      }}
                    >
                      Preview
                    </Button>

                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      onClick={() => handleSummarize(note)}
                      style={{
                        background: "rgba(99, 102, 241, 0.15)",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        color: "#818cf8",
                        fontSize: "12px",
                        flex: 1,
                      }}
                    >
                      Summary
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Note Modal */}
      <AddNoteModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectId={id}
        onNoteCreated={fetchSubjectAndNotes}
      />

      {/* Document Preview Modal */}
      <PreviewModal
        visible={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedNoteForPreview(null);
        }}
        note={selectedNoteForPreview}
      />

      {/* Quiz Modal */}
      <QuizModal
        open={isQuizOpen}
        onCancel={() => setIsQuizOpen(false)}
        subjectId={id}
        subjectName={subject?.name}
      />

      {/* AI Summary Modal */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgElevated: "#0d0f1a",
            colorText: "#f8fafc",
            colorPrimary: "#6366f1",
            borderRadiusLG: 16,
          },
        }}
      >
        <Modal
          open={summaryData.open}
          onCancel={() => setSummaryData((prev) => ({ ...prev, open: false }))}
          footer={null}
          centered
          width={isMobile ? "94%" : 700}
          destroyOnClose
          styles={{
            mask: { backdropFilter: "blur(8px)", backgroundColor: "rgba(3, 7, 18, 0.82)" },
            content: {
              backgroundColor: "#0d0f1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: isMobile ? "16px" : "24px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
            },
            header: {
              backgroundColor: "transparent",
              borderBottom: "none",
            },
          }}
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #4338ca)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  <ThunderboltOutlined />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: "15px", color: "#f8fafc", fontWeight: 700 }}>
                    Exam Review & Summary
                  </h4>
                  <span
                    style={{
                      fontSize: "11.5px",
                      color: "#94a3b8",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {summaryData.topic} • {summaryData.title}
                  </span>
                </div>
              </div>

              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(summaryData.content);
                  message.success("Summary copied!");
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  borderRadius: "6px",
                }}
              >
                {!isMobile && "Copy"}
              </Button>
            </div>
          }
        >
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <FileTextOutlined style={{ color: "#818cf8", fontSize: "16px" }} />
              <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                Extracted directly from notes and study material using AI summarization.
              </span>
            </div>

            <div
              style={{
                background: "#141824",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: isMobile ? "14px 16px" : "18px 22px",
                color: "#cbd5e1",
                fontSize: "13.5px",
                lineHeight: 1.65,
                maxHeight: "380px",
                overflowY: "auto",
              }}
            >
              <ReactMarkdown>{summaryData.content}</ReactMarkdown>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <Button
                type="primary"
                onClick={() => setSummaryData((prev) => ({ ...prev, open: false }))}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "0 22px",
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default IndividualCards;