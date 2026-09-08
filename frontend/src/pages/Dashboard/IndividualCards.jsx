import { useEffect, useState, useCallback } from "react";
import { Button, Col, Input, Row, Spin, message, Modal, Space, Popconfirm } from "antd";
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
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddNoteModal from "./AddNoteModal";
import PreviewModal from "./PreviewModal";
import QuizModal from "../../components/QuizModal";

const IndividualCards = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Modals visibility & data state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteForPreview, setSelectedNoteForPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // 👈 Custom Summary Modal State
  const [summaryData, setSummaryData] = useState({
    open: false,
    title: "",
    chapter: "",
    content: "",
  });

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

      const subRes = await axios.get(`http://localhost:5000/api/subjects/${id}`, { headers });
      if (subRes.data.success) {
        setSubject(subRes.data.subject);
      }

      const notesRes = await axios.get(`http://localhost:5000/api/notes/subject/${id}`, { headers });
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
        `http://localhost:5000/api/notes/summarize-pdf/${note._id}`,
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
          chapter: note.chapter || "General Topic",
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
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
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
    <div className="individual-notes-wrapper">
      {/* Top Header */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <span className="subject-badge">{subject?.code || "CODE-000"}</span>
          <h2 className="subject-name">{subject?.name || "Subject Notes"}</h2>
        </Col>

        <Col className="d-flex align-items-center gap-2">
          <Space size={"middle"}>
            <button
              className="btn-quiz d-flex gap-2 align-items-center justify-content-center"
              onClick={() => setIsQuizOpen(true)}
            >
              <ExperimentOutlined />
              Take Quiz
            </button>

            <Button
              type="primary"
              className="btn-add-note"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Add note
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col span={24}>
          <Input
            size="large"
            placeholder="Search notes..."
            prefix={<SearchOutlined style={{ color: "#7b7a94" }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark-search-bar"
          />
        </Col>
      </Row>

      {/* Tag Filters */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`filter-tag-pill ${selectedTag.toLowerCase() === tag.toLowerCase() ? "active" : ""}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-notes-box">
          <p>No notes found in this folder.</p>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredNotes.map((note) => (
            <Col xs={24} sm={12} md={8} key={note._id}>
              <div className="note-card">
                <div className="d-flex justify-content-between align-items-start">
                  <h4 className="note-title">{note.title}</h4>
                  <Popconfirm
                    title="Delete Note"
                    description="Are you sure you want to delete this Notes?"
                    onConfirm={() => handleDeleteNote(notes._id)}
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
                      title="Delete Subject"
                      style={{
                        background: "rgba(244, 63, 94, 0.12)",
                        border: "1px solid rgba(244, 63, 94, 0.25)",
                        color: "#f87171",
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "13px" }} />
                    </button>
                  </Popconfirm>
                </div>

                <p className="note-chapter">{note.chapter}</p>
                <p className="note-desc">{note.content}</p>

                <div className="d-flex flex-wrap gap-1 mb-2">
                  {(note.tag || note.tags || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, idx) => (
                      <span key={idx} className="note-tag-badge">
                        {t}
                      </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-2 mt-3">
                  <button
                    className="action-btn"
                    onClick={() => {
                      if (!note.fileUrl && !note.driveLink) {
                        return message.info("No attachment available for this note");
                      }
                      setSelectedNoteForPreview(note);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <EyeOutlined /> Preview
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleSummarize(note)}
                  >
                    <ThunderboltOutlined /> Summarize
                  </button>
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

      {/* 👈 Clean Custom AI Summary Modal */}
      {/* 👈 Clean Dark-Themed AI Summary Modal with Markdown */}
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
          width={700}
          destroyOnClose
          className="quiz-dark-modal"
          styles={{
            mask: { backdropFilter: "blur(8px)", backgroundColor: "rgba(3, 7, 18, 0.82)" },
            content: {
              backgroundColor: "#0d0f1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
            },
            header: {
              backgroundColor: "transparent",
              borderBottom: "none",
            },
          }}
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #4338ca)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "18px",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                  }}
                >
                  <ThunderboltOutlined />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: "#f8fafc", fontWeight: 700 }}>
                    Exam Review & Summary
                  </h4>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {summaryData.chapter} • {summaryData.title}
                  </span>
                </div>
              </div>

              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(summaryData.content);
                  message.success("Summary copied to clipboard!");
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  borderRadius: "6px",
                }}
              >
                Copy
              </Button>
            </div>
          }
        >
          <div style={{ marginTop: "16px" }}>
            {/* Context Info Banner */}
            <div
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <FileTextOutlined style={{ color: "#818cf8", fontSize: "16px" }} />
              <span style={{ fontSize: "12.5px", color: "#cbd5e1" }}>
                Extracted directly from notes and study material using AI summarization.
              </span>
            </div>

            {/* Markdown Rendered Content Body */}
            <div
              className="summary-markdown-body"
              style={{
                background: "#141824",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "18px 22px",
                color: "#cbd5e1",
                fontSize: "14px",
                lineHeight: 1.7,
                maxHeight: "420px",
                overflowY: "auto",
              }}
            >
              <ReactMarkdown>{summaryData.content}</ReactMarkdown>
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <Button
                type="primary"
                size="middle"
                onClick={() => setSummaryData((prev) => ({ ...prev, open: false }))}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "0 24px",
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