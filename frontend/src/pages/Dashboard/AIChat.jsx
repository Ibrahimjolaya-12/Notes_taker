import { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, message, Avatar, Tooltip } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  BulbOutlined,
  BookOutlined,
  PictureOutlined,
  AudioOutlined,
  CloseCircleFilled,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

const defaultWelcomeMessage = {
  sender: "ai",
  text: "Assalam-o-Alaikum! Main aapka **ClassNotes AI** study partner hoon. Kisi bhi subject ke concept, notebook diagrams ya assignment preparation ke mutabiq poochein.",
};

const AIChat = ({ currentSubject }) => {
  const [messages, setMessages] = useState([defaultWelcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("You");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

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
          if (avatarRes.status === "fulfilled" && avatarRes.value.data?.avatar) {
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      return message.warning("Speech recognition is not supported in your browser.");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return message.error("Image must be smaller than 5MB");
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Copy Message Handler
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
    if (!query.trim() && !selectedImage) return;
    if (loading) return;

    const currentImgPreview = imagePreview;

    const userMessage = {
      sender: "user",
      text: query || "",
      mediaUrl: currentImgPreview,
      mediaType: selectedImage ? "image" : "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("prompt", query);
      formData.append("subject", currentSubject || "");
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await axios.post("http://localhost:5000/api/ai/ask", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.data.reply, mediaType: "text" },
        ]);
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to fetch response from AI");
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
    <div className="ai-chat-wrapper">
      <div className="ai-header">
        <div className="d-flex align-items-center gap-3">
          <div className="ai-header-badge">
            <RobotOutlined />
          </div>
          <div>
            <h4 className="title">Academic AI Assistant</h4>
            <span className="subtitle">Focused study, notes, diagrams & exam mentor</span>
          </div>
        </div>

        <Button
          icon={<ClearOutlined />}
          className="btn-clear"
          onClick={handleClearHistory}
        >
          Clear History
        </Button>
      </div>

      <div className="quick-chips">
        <button
          className="chip"
          onClick={() => handleSend("Explain how to write a standard assignment outline.")}
        >
          <BookOutlined /> Assignment format
        </button>
        <button
          className="chip"
          onClick={() => handleSend("Give me top revision tips for university exams.")}
        >
          <BulbOutlined /> Exam tips
        </button>
      </div>

      <div className="chat-messages-area">
        {fetchingHistory ? (
          <div className="text-center py-5">
            <Spin size="large" />
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message-bubble-row ${msg.sender}`}>
              <div className="bubble-avatar">
                {msg.sender === "ai" ? (
                  <RobotOutlined />
                ) : (
                  <Avatar
                    size={32}
                    src={userAvatar || undefined}
                    icon={!userAvatar && <UserOutlined />}
                    style={{
                      backgroundColor: userAvatar ? "transparent" : "#4f46e5",
                    }}
                  />
                )}
              </div>

              <div className="bubble-body">
  <span className="sender-tag">
    {msg.sender === "ai" ? "ClassNotes AI" : userName}
  </span>

  <div className="bubble-text">
    {msg.mediaUrl && (
      <div className="chat-image-attachment mb-2">
        <img src={msg.mediaUrl} alt="Attached Note" />
      </div>
    )}

    {msg.sender === "ai" ? (
      <ReactMarkdown>{msg.text}</ReactMarkdown>
    ) : (
      msg.text
    )}
  </div>

  {/* 👈 Text ke bilkul neeche footer row */}
  {msg.text && (
    <div className="bubble-footer-actions">
      <Tooltip title={copiedIndex === index ? "Copied!" : "Copy"}>
        <button
          className={`btn-copy-bubble ${copiedIndex === index ? "copied" : ""}`}
          onClick={() => handleCopy(msg.text, index)}
          aria-label="Copy message"
        >
          {copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
          <span className="copy-label">{copiedIndex === index ? "Copied" : "Copy"}</span>
        </button>
      </Tooltip>
    </div>
  )}
</div>
            </div>
          ))
        )}

        {loading && (
          <div className="message-bubble-row ai">
            <div className="bubble-avatar">
              <RobotOutlined />
            </div>
            <div className="bubble-body">
              <span className="sender-tag">ClassNotes AI</span>
              <div className="bubble-text loading-state">
                <Spin size="small" />
                <span>Analyzing notes & preparing explanation...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper-box">
        {imagePreview && (
          <div className="attached-preview-chip">
            <img src={imagePreview} alt="Preview" />
            <span>Note Image Attached</span>
            <CloseCircleFilled className="remove-img-btn" onClick={removeSelectedImage} />
          </div>
        )}

        <div className="chat-input-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <Tooltip title="Attach note diagram or photo">
            <Button
              type="text"
              icon={<PictureOutlined />}
              className="action-icon-btn"
              onClick={() => fileInputRef.current?.click()}
            />
          </Tooltip>

          <Tooltip title={isRecording ? "Listening..." : "Voice typing"}>
            <Button
              type="text"
              icon={<AudioOutlined />}
              className={`action-icon-btn ${isRecording ? "recording-active" : ""}`}
              onClick={toggleVoiceRecording}
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
                ? "Listening to your voice..."
                : selectedImage
                ? "Add a question about this image (or press Enter)..."
                : "Ask a question about your study or assignment..."
            }
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="ai-input-field"
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={loading}
            className="btn-send-ai"
          />
        </div>
      </div>
    </div>
  );
};

export default AIChat;