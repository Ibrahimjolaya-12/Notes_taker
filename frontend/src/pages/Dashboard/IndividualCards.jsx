import { useEffect, useState, useCallback } from "react";
import { Button, Col, Input, Row, Spin, message, Modal } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddNoteModal from "./AddNoteModal";
import PreviewModal from "./PreviewModal";

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

  // 2. AI Summarize Handler (YAHAN DEFINE HOGA)
  const handleSummarize = async (note) => {
    try {
      message.loading({ content: "AI is analyzing & summarizing...", key: "sum", duration: 0 });
      const token = localStorage.getItem("token");

      const prompt = `Provide a concise 3-to-4 bullet summary with key exam takeaways for this study topic: "${note.title}".
Chapter: "${note.chapter || "N/A"}"
Content details: "${note.content || "N/A"}"`;

      const res = await axios.post(
        "http://localhost:5000/api/ai/ask",
        {
          prompt,
          subject: subject?.name || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        message.success({ content: "Summary ready!", key: "sum" });

        // Clean popup modal instead of basic alert
        Modal.info({
          title: `AI Summary: ${note.title}`,
          width: 580,
          centered: true,
          content: (
            <div style={{ whiteSpace: "pre-wrap", color: "#d1d5db", marginTop: 12, lineHeight: 1.6 }}>
              {res.data.reply}
            </div>
          ),
          okText: "Got it",
          okButtonProps: {
            style: { background: "#6366f1", borderColor: "#6366f1" },
          },
        });
      }
    } catch (err) {
      console.error(err);
      message.error({ content: err.response?.data?.message || "Failed to generate summary", key: "sum" });
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
          <Button
            className="btn-quiz"
            icon={<ExperimentOutlined />}
            onClick={() => message.info("Quiz feature coming soon!")}
          >
            Take Quiz
          </Button>

          <Button
            type="primary"
            className="btn-add-note"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add note
          </Button>
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
                  <DeleteOutlined
                    className="icon-delete"
                    onClick={() => handleDeleteNote(note._id)}
                  />
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

                  {/* 👈 YAHAN CONNECT HUA HAI SUMMARIZE BUTTON */}
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
    </div>
  );
};

export default IndividualCards;