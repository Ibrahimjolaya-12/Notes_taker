import { Card, Button, message, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const fetchTodoDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          message.error("You are not logged in!");
          navigate("/auth/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setTodo(res.data.todo);
        }
      } catch (err) {
        console.error("VIEW TODO ERROR:", err);
        message.error(err.response?.data?.message || "Failed to fetch todo details!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTodoDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="view-todo-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="view-todo-container text-white text-center">
        <h4>No Todo Found!</h4>
        <Button
          type="primary"
          className="mt-3"
          onClick={() => navigate("/dashboard/todos")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="view-todo-container">
      <Card className="view-todo-card" bordered={false}>
        <h3 className="card-heading">Todo Details</h3>

        <div className="detail-item">
          <span className="label">Title</span>
          <p className="value">{todo.title}</p>
        </div>

        <div className="detail-item">
          <span className="label">Location</span>
          <p className="value">{todo.location}</p>
        </div>

        <div className="detail-item">
          <span className="label">Due Date</span>
          <p className="value">
            {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <div className="detail-item">
          <span className="label">Description</span>
          <p className="value description-box">{todo.description}</p>
        </div>

        <div className="btn-wrapper">
          <Button
            type="primary"
            className="back-btn"
            onClick={() => navigate("/dashboard/todos")}
          >
            Back to Todos
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ViewTodo;