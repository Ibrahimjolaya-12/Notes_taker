import { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, message, Avatar, Tooltip, Grid } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  BulbOutlined,
  BookOutlined,
  PaperClipOutlined,
  AudioOutlined,
  CloseCircleFilled,
  CopyOutlined,
  CheckOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const defaultWelcomeMessage = {
  sender: "ai",
  text: "Assalam-o-Alaikum! I am your ClassNotes AI study partner. Feel free to ask about any subject concept, uploaded PDF documents, notes, or assignment preparation.",
};

const AIChat = ({ currentSubject }) => {
  const [messages, setMessages] = useState([defaultWelcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("You");

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState({ name: "", type: "", url: "" });
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // 1. Initial Load
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.name) setUserName(storedUser.name);

      if (!token) {
        if (isMounted) setFetchingHistory(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [avatarRes, historyRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/avatar/me", { headers }),
          axios.get("http://localhost:5000/api/ai/history", { headers }),
        ]);

        if (isMounted) {
          if (
            avatarRes.status === "fulfilled" &&
            avatarRes.value.data?.avatar
          ) {
            setUserAvatar(avatarRes.value.data.avatar);
          }

          if (
            historyRes.status === "fulfilled" &&
            historyRes.value.data?.success &&
            historyRes.value.data.messages?.length > 0
          ) {
            setMessages(historyRes.value.data.messages);
          } else {
            setMessages([defaultWelcomeMessage]);
          }
        }
      } catch (err) {
        console.error("Chat Init Error:", err);
      } finally {
        if (isMounted) setFetchingHistory(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Smooth Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 3. Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = "en-US";

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognizer.onerror = () => setIsRecording(false);
      recognizer.onend = () => setIsRecording(false);

      recognitionRef.current = recognizer;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      return message.warning(
        "Speech recognition is not supported in your browser.",
      );
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      message.info("Listening... Speak now.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      return message.error("File must be smaller than 15MB");
    }

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    setSelectedFile(file);
    setFilePreview({
      name: file.name,
      type: isPdf ? "pdf" : isImage ? "image" : "doc",
      url: isImage ? URL.createObjectURL(file) : "",
    });
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview({ name: "", type: "", url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Copy Handler
  const handleCopy = async (text, index) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      message.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      message.error("Failed to copy text");
    }
  };

  // 5. Send Message
  const handleSend = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query.trim() && !selectedFile) return;
    if (loading) return;

    const currentFileState = { ...filePreview };

    const userMessage = {
      sender: "user",
      text: query || "",
      mediaUrl: currentFileState.url,
      fileName: currentFileState.name,
      mediaType: currentFileState.type || "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    removeSelectedFile();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("prompt", query);
      formData.append("subject", currentSubject || "");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await axios.post(
        "http://localhost:5000/api/ai/ask",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data?.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.data.reply, mediaType: "text" },
        ]);
      }
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.message || "Failed to fetch response from AI",
      );
    } finally {
      setLoading(false);
    }
  };

  // 6. Clear History
  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/ai/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([defaultWelcomeMessage]);
      message.success("Chat history cleared");
    } catch (err) {
      console.error(err);
      message.error("Failed to clear chat history");
    }
  };

  return (
    <div
      className="ai-chat-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 84px)",
        maxWidth: "1050px",
        width: "100%",
        margin: "0 auto",
        padding: isMobile ? "8px 6px" : "14px 16px",
        overflow: "hidden",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* AI Header */}
      <div
        className="ai-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          gap: "10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <div
            style={{
              width: isMobile ? "32px" : "38px",
              height: isMobile ? "32px" : "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #4338ca)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: isMobile ? "16px" : "18px",
              flexShrink: 0,
            }}
          >
            <RobotOutlined />
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                color: "#f8fafc",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Academic AI Assistant
            </h4>
            <span
              style={{
                color: "#94a3b8",
                fontSize: isMobile ? "11px" : "12px",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Focused study, PDF notes & exam mentor
            </span>
          </div>
        </div>

        <Button
          icon={<ClearOutlined />}
          onClick={handleClearHistory}
          size={isMobile ? "small" : "middle"}
          style={{
            background: "transparent",
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "#cbd5e1",
            fontSize: isMobile ? "12px" : "13px",
            flexShrink: 0,
          }}
        >
          {!isMobile && "Clear History"}
        </Button>
      </div>

      {/* Quick Prompt Chips (X-Axis Scrollbar bilkul hidden) */}
      <div
        className="quick-chips"
        style={{
          display: "flex",
          gap: "8px",
          padding: "10px 0",
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE / Edge
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={() => handleSend("Explain how to write a standard assignment outline.")}
          style={{
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            color: "#cbd5e1",
            borderRadius: "20px",
            padding: "5px 12px",
            fontSize: "12px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <BookOutlined style={{ color: "#818cf8" }} /> Assignment format
        </button>

        <button
          type="button"
          onClick={() => handleSend("Give me top revision tips for university exams.")}
          style={{
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            color: "#cbd5e1",
            borderRadius: "20px",
            padding: "5px 12px",
            fontSize: "12px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <BulbOutlined style={{ color: "#818cf8" }} /> Exam tips
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="chat-messages-area"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // 👈 Inner messages se horizontal bar na aaye
          padding: "10px 2px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {fetchingHistory ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: isMobile ? "8px" : "12px",
                alignItems: "flex-start",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Avatar */}
              <div style={{ flexShrink: 0, marginTop: "2px" }}>
                {msg.sender === "ai" ? (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #4338ca)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    <RobotOutlined />
                  </div>
                ) : (
                  <Avatar
                    size={30}
                    src={userAvatar || undefined}
                    icon={!userAvatar && <UserOutlined />}
                    style={{
                      backgroundColor: userAvatar ? "transparent" : "#4f46e5",
                    }}
                  />
                )}
              </div>

              {/* Message Body */}
              <div
                style={{
                  maxWidth: isMobile ? "86%" : "78%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "3px",
                    padding: "0 4px",
                  }}
                >
                  {msg.sender === "ai" ? "ClassNotes AI" : userName}
                </span>

                <div
                  style={{
                    background: msg.sender === "user" ? "#4f46e5" : "#121626",
                    border:
                      msg.sender === "user"
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius:
                      msg.sender === "user"
                        ? "14px 14px 2px 14px"
                        : "14px 14px 14px 2px",
                    padding: isMobile ? "10px 12px" : "14px 16px",
                    color: "#f8fafc",
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {/* Attachment in Message */}
                  {(msg.mediaUrl || msg.fileName) && (
                    <div style={{ marginBottom: "8px", maxWidth: "100%" }}>
                      {msg.mediaType === "pdf" ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(239, 68, 68, 0.15)",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            fontSize: "12px",
                            maxWidth: "100%",
                          }}
                        >
                          <FilePdfOutlined style={{ color: "#ef4444", fontSize: "16px", flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {msg.fileName || "Attached Document.pdf"}
                          </span>
                        </div>
                      ) : msg.mediaType === "image" && msg.mediaUrl ? (
                        <img
                          src={msg.mediaUrl}
                          alt="Attached"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "220px",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(99, 102, 241, 0.15)",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            fontSize: "12px",
                            maxWidth: "100%",
                          }}
                        >
                          <FileTextOutlined style={{ color: "#818cf8", fontSize: "16px", flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {msg.fileName || "Attached Document"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sender === "ai" ? (
                    <div className="chat-markdown-body" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Copy Action */}
                {msg.text && (
                  <div style={{ marginTop: "4px", padding: "0 4px" }}>
                    <Tooltip title={copiedIndex === index ? "Copied!" : "Copy"}>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, index)}
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedIndex === index ? "#34d399" : "#64748b",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px",
                        }}
                      >
                        {copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
                        <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Bubble */}
        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              <RobotOutlined />
            </div>
            <div
              style={{
                background: "#121626",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px 14px 14px 2px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "12.5px",
              }}
            >
              <Spin size="small" />
              <span>Analyzing & responding...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Box (Strict width + no X-overflow) */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "8px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* Attachment preview chip */}
        {filePreview.name && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#14182b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "6px 10px",
              marginBottom: "6px",
              fontSize: "12px",
              color: "#cbd5e1",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {filePreview.type === "pdf" ? (
              <FilePdfOutlined style={{ color: "#ef4444", flexShrink: 0 }} />
            ) : filePreview.type === "image" ? (
              <img
                src={filePreview.url}
                alt="thumb"
                style={{ width: "20px", height: "20px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <FileTextOutlined style={{ color: "#818cf8", flexShrink: 0 }} />
            )}
            <span
              style={{
                maxWidth: isMobile ? "160px" : "300px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {filePreview.name}
            </span>
            <CloseCircleFilled
              onClick={removeSelectedFile}
              style={{ color: "#94a3b8", cursor: "pointer", marginLeft: "4px", flexShrink: 0 }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            background: "#0c0e1a",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "6px 8px",
            gap: "6px",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Tooltip title="Attach PDF or image">
            <Button
              type="text"
              icon={<PaperClipOutlined />}
              onClick={() => fileInputRef.current?.click()}
              style={{ color: "#cbd5e1", width: "34px", height: "34px", padding: 0, flexShrink: 0 }}
            />
          </Tooltip>

          <Tooltip title={isRecording ? "Listening..." : "Voice typing"}>
            <Button
              type="text"
              icon={<AudioOutlined />}
              onClick={toggleVoiceRecording}
              style={{
                color: isRecording ? "#ef4444" : "#cbd5e1",
                width: "34px",
                height: "34px",
                padding: 0,
                flexShrink: 0,
              }}
            />
          </Tooltip>

          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isRecording
                ? "Listening..."
                : selectedFile
                  ? `Ask about "${filePreview.name}"...`
                  : "Ask a question..."
            }
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              color: "#ffffff",
              fontSize: isMobile ? "13px" : "14px",
              padding: "6px 4px",
              flex: 1,
              resize: "none",
            }}
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={loading}
            style={{
              background: "#6366f1",
              borderColor: "#6366f1",
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              padding: 0,
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChat;