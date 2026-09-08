import { Form, Input, DatePicker, Select, Button, message, ConfigProvider } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const AddTodo = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      console.log("CURRENT_TOKEN:", token); // Console me check karo token print hota hai ya null

      if (!token) {
        message.error("You are not logged in!");
        navigate("/auth/login");
        return;
      }

      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      // Corrected URL: /api/todos/addTodos (matching backend router)
      // Correct endpoint: /api/todos/addTodos (with port 5000)
      const res = await axios.post(
        "http://localhost:5000/api/todos/addTodos",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message || "Todo created successfully!");
        form.resetFields();
        navigate("/dashboard/todos");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-todo-container">
      <h3 className="form-heading">Create subject folder</h3>

      <Form
        layout="vertical"
        form={form}
        initialValues={{ status: "incomplete" }}
        onFinish={onFinish}
      >
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
  <ConfigProvider
    theme={{
      token: {
        colorBgContainer: "#080816",
        colorBorder: "#1e1e38",
        colorText: "#ffffff",
        colorTextPlaceholder: "#474a6b",
      },
    }}
  >
    <Select size="large" popupClassName="dark-select-popup">
      <Option value="incomplete">Incomplete</Option>
      <Option value="complete">Complete</Option>
    </Select>
  </ConfigProvider>
</Form.Item>

        <div className="btn-wrapper">
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            block
            loading={loading}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddTodo;