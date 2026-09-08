import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Spin,
  ConfigProvider,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const UpdateTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Fetch existing Todo data to populate form
  useEffect(() => {
    const fetchSingleTodo = async () => {
      try {
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
          const todo = res.data.todo || res.data.data;
          form.setFieldsValue({
            title: todo.title,
            location: todo.location,
            description: todo.description,
            status: todo.status || "incomplete",
            dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
          });
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
        message.error(
          err.response?.data?.message || "Failed to load todo details!",
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchSingleTodo();
  }, [id, form, navigate]);

  // 2. Submit Updated Data
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("You are not logged in!");
        navigate("/auth/login");
        return;
      }

      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      // FIX: axios.put for update request
      const res = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        message.success(res.data.message || "Todo updated successfully!");
        navigate("/dashboard/todos");
      }
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      message.error(err.response?.data?.message || "Failed to update todo!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="custom-todo-container">
      <h3 className="form-heading">Update Todo</h3>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input placeholder="Enter your title ..." size="large" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Location is required!" }]}
        >
          <Input placeholder="Enter your place ..." size="large" />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: "Due date is required!" }]}
        >
          <DatePicker
            size="large"
            placeholder="Select date"
            className="w-100"
            popupClassName="dark-picker-popup"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required!" }]}
        >
          <TextArea
            rows={3}
            placeholder="Enter details about this task..."
            maxLength={200}
            showCount
          />
        </Form.Item>

     <Form.Item
  label="Status"
  name="status"
  rules={[{ required: true, message: "Please select status!" }]}
>
  <Select
  size="large"
  style={{
    backgroundColor: "#080816",
  }}
  popupClassName="dark-select-dropdown"
  options={[
    { label: "Incomplete", value: "incomplete" },
    { label: "Complete", value: "complete" },
  ]}
/>
</Form.Item>

        <div className="btn-wrapper">
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            loading={loading}
          >
            Update Todo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateTodo;
