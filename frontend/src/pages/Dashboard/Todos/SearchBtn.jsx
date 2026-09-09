import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message, Spin, Grid } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const SearchBtn = ({ setTodos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && searchText === "") return;

    const delayDebounce = setTimeout(() => {
      fetchFilteredTodos(searchText);
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const fetchFilteredTodos = async (text) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        message.error("Please login first!");
        return;
      }

      const res = await axios.get(
        `https://class-notes-backend.vercel.app/api/todos/getAllTodos?search=${encodeURIComponent(text)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setTodos(res.data.todos);
      }
    } catch (error) {
      console.error("AXIOS ERROR:", error);
      const errorText = error.response?.data?.message || "Search failed";
      message.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchText("");
    setIsOpen(false);
    fetchFilteredTodos("");
  };

  return (
    <div
      className="search-pill-container"
      style={{
        width: isOpen ? (isMobile ? "100%" : "260px") : "auto",
        transition: "width 0.25s ease",
      }}
    >
      {isOpen ? (
        <div
          className="modern-search-box"
          style={{
            display: "flex",
            alignItems: "center",
            background: "#0f121d",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "10px",
            padding: "4px 10px",
            gap: "8px",
            width: "100%",
          }}
        >
          {loading ? (
            <Spin size="small" style={{ color: "#818cf8" }} />
          ) : (
            <SearchOutlined style={{ color: "#94a3b8", fontSize: "14px" }} />
          )}

          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "13px",
              width: "100%",
            }}
          />

          <button
            type="button"
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "2px",
            }}
          >
            <CloseOutlined style={{ fontSize: "12px" }} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Search Todos"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#cbd5e1",
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "15px",
            transition: "background 0.2s",
          }}
        >
          <SearchOutlined />
        </button>
      )}
    </div>
  );
};

export default SearchBtn;