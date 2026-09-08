import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const SearchBtn = ({ setTodos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (text) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        message.error("Please login first!");
        return;
      }

      // FIX: Exact route match (/api/todos/getAllTodos)
      const res = await axios.get(
        `http://localhost:5000/api/todos/getAllTodos?search=${encodeURIComponent(text)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setTodos(res.data.todos);
      }
    }  catch (error) {
      console.error("AXIOS DETAILED ERROR:", error);
      
      const serverResponse = error.response?.data;
      const status = error.response?.status;
      const errorText = serverResponse?.message || error.message;

      console.log("STATUS CODE:", status);
      console.log("SERVER RESPONSE:", serverResponse);

      message.error(`Status ${status || 'Network'}: ${errorText}`);
    }
  };

  const handleClose = () => {
    setSearchText("");
    setIsOpen(false);
    handleSearch(""); // Table me original data restore karne ke liye
  };

  return (
    <>
      {isOpen ? (
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search todos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchText)}
            style={{ width: "260px" }}
          />

          <button
            className="btn btn-primary"
            onClick={() => handleSearch(searchText)}
          >
            Search
          </button>

          <i
            className="fa-solid fa-xmark text-white fs-4"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </div>
      ) : (
        <i
          className="fa-solid fa-magnifying-glass text-white fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen(true)}
        ></i>
      )}
    </>
  );
};

export default SearchBtn;