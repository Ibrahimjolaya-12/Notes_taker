// import { Form, Input, DatePicker, Select, Button, message, ConfigProvider, Row, Col, Typography, Grid, theme } from "antd";
// import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const { TextArea } = Input;
// const { Option } = Select;
// const { Title } = Typography;
// const { useBreakpoint } = Grid;

// const BACKEND_URL = "https://class-notes-backend.vercel.app";

// const AddTodo = () => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   const onFinish = async (values) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("You are not logged in!");
//         navigate("/auth/login");
//         return;
//       }

//       const payload = {
//         ...values,
//         dueDate: values.dueDate ? values.dueDate.toISOString() : null,
//       };

//       const res = await axios.post(
//         `${BACKEND_URL}/api/todos/addTodos`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data?.success) {
//         message.success(res.data.message || "Todo created successfully!");
//         form.resetFields();
//         navigate("/dashboard/todos");
//       }
//     } catch (err) {
//       console.error("AXIOS ERROR:", err.response?.data || err.message);
//       message.error(err.response?.data?.message || "Failed to create task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         algorithm: theme.darkAlgorithm,
//         token: {
//           colorBgContainer: "#080816",
//           colorBgElevated: "#0f121d",
//           colorBorder: "#1e1e38",
//           colorText: "#ffffff",
//           colorTextPlaceholder: "#64748b",
//           colorPrimary: "#6366f1",
//           borderRadiusLG: 12,
//         },
//       }}
//     >
//       <div
//         className="custom-todo-wrapper"
//         style={{
//           maxWidth: "760px",
//           margin: "0 auto",
//           padding: isMobile ? "16px 12px" : "24px 20px",
//         }}
//       >
//         {/* Header with Back Navigation */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
//           <div>
//             <Title level={3} style={{ color: "#f8fafc", margin: "0 0 4px 0", fontSize: isMobile ? "20px" : "24px" }}>
//               Create New Task
//             </Title>
//             <span style={{ color: "#94a3b8", fontSize: "13px" }}>
//               Add and schedule academic tasks or assignment milestones
//             </span>
//           </div>

//           <Button
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/dashboard/todos")}
//             style={{
//               background: "transparent",
//               borderColor: "rgba(255, 255, 255, 0.12)",
//               color: "#cbd5e1",
//             }}
//           >
//             {!isMobile && "Back to Todos"}
//           </Button>
//         </div>

//         {/* Task Form Container */}
//         <div
//           style={{
//             background: "#0c0d1e",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             borderRadius: "16px",
//             padding: isMobile ? "18px 16px" : "28px 30px",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
//           }}
//         >
//           <Form
//             layout="vertical"
//             form={form}
//             initialValues={{ status: "incomplete" }}
//             onFinish={onFinish}
//             requiredMark={false}
//           >
//             <Row gutter={[16, 0]}>
//               {/* Title Input */}
//               <Col xs={24} sm={12}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Task Title</span>}
//                   name="title"
//                   rules={[{ required: true, message: "Title is required!" }]}
//                 >
//                   <Input placeholder="e.g., Read Discrete Math Chapter 3" size="large" />
//                 </Form.Item>
//               </Col>

//               {/* Location Input */}
//               <Col xs={24} sm={12}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Location / Venue</span>}
//                   name="location"
//                   rules={[{ required: true, message: "Location is required!" }]}
//                 >
//                   <Input placeholder="e.g., Campus Library / Room 204" size="large" />
//                 </Form.Item>
//               </Col>

//               {/* Due Date */}
//               <Col xs={24} sm={12}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Due Date</span>}
//                   name="dueDate"
//                   rules={[{ required: true, message: "Due date is required!" }]}
//                 >
//                   <DatePicker
//                     size="large"
//                     placeholder="Select deadline date"
//                     style={{ width: "100%" }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Status */}
//               <Col xs={24} sm={12}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Status</span>}
//                   name="status"
//                   rules={[{ required: true, message: "Please select status!" }]}
//                 >
//                   <Select size="large">
//                     <Option value="incomplete">Incomplete</Option>
//                     <Option value="complete">Complete</Option>
//                   </Select>
//                 </Form.Item>
//               </Col>

//               {/* Description */}
//               <Col span={24}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontWeight: 600 }}>Description</span>}
//                   name="description"
//                   rules={[{ required: true, message: "Description is required!" }]}
//                 >
//                   <TextArea
//                     rows={4}
//                     placeholder="Provide details or notes regarding this specific task..."
//                     maxLength={250}
//                     showCount
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Submit Button */}
//               <Col span={24} style={{ marginTop: "12px" }}>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   icon={<CheckCircleOutlined />}
//                   block
//                   size="large"
//                   loading={loading}
//                   style={{
//                     background: "#6366f1",
//                     borderColor: "#6366f1",
//                     fontWeight: 600,
//                     height: isMobile ? "44px" : "48px",
//                     borderRadius: "10px",
//                   }}
//                 >
//                   Create Task
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default AddTodo;



import { Form, Input, DatePicker, Select, Button, message, Row, Col, Typography, Grid } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const BACKEND_URL = "https://class-notes-backend.vercel.app";

const AddTodo = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

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

      const res = await axios.post(
        `${BACKEND_URL}/api/todos/addTodos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        message.success(res.data.message || "Todo created successfully!");
        form.resetFields();
        navigate("/dashboard/todos");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const dynamicInputStyle = {
    backgroundColor: isDarkMode ? "#080816" : "#ffffff",
    borderColor: isDarkMode ? "#1e1e38" : "#cbd5e1",
    color: isDarkMode ? "#ffffff" : "#0f172a",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };

  return (
    <div
      className="custom-todo-wrapper"
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: isMobile ? "16px 12px" : "24px 20px",
      }}
    >
      {/* Header with Back Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <Title
            level={3}
            style={{
              color: isDarkMode ? "#f8fafc" : "#0f172a",
              margin: "0 0 4px 0",
              fontSize: isMobile ? "20px" : "24px",
              transition: "color 0.3s ease",
            }}
          >
            Create New Task
          </Title>
          <span style={{ color: isDarkMode ? "#94a3b8" : "#64748b", fontSize: "13px" }}>
            Add and schedule academic tasks or assignment milestones
          </span>
        </div>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard/todos")}
          style={{
            background: isDarkMode ? "transparent" : "#f1f5f9",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#cbd5e1",
            color: isDarkMode ? "#cbd5e1" : "#334155",
            fontWeight: 500,
          }}
        >
          {!isMobile && "Back to Todos"}
        </Button>
      </div>

      {/* Task Form Container */}
      <div
        style={{
          background: isDarkMode ? "#0c0d1e" : "#ffffff",
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: isMobile ? "18px 16px" : "28px 30px",
          boxShadow: isDarkMode ? "0 20px 40px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ status: "incomplete" }}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Row gutter={[16, 0]}>
            {/* Title Input */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span style={{ color: isDarkMode ? "#cbd5e1" : "#334155", fontWeight: 600 }}>
                    Task Title
                  </span>
                }
                name="title"
                rules={[{ required: true, message: "Title is required!" }]}
              >
                <Input
                  placeholder="e.g., Read Discrete Math Chapter 3"
                  size="large"
                  style={dynamicInputStyle}
                />
              </Form.Item>
            </Col>

            {/* Location Input */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span style={{ color: isDarkMode ? "#cbd5e1" : "#334155", fontWeight: 600 }}>
                    Location / Venue
                  </span>
                }
                name="location"
                rules={[{ required: true, message: "Location is required!" }]}
              >
                <Input
                  placeholder="e.g., Campus Library / Room 204"
                  size="large"
                  style={dynamicInputStyle}
                />
              </Form.Item>
            </Col>

            {/* Due Date */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span style={{ color: isDarkMode ? "#cbd5e1" : "#334155", fontWeight: 600 }}>
                    Due Date
                  </span>
                }
                name="dueDate"
                rules={[{ required: true, message: "Due date is required!" }]}
              >
                <DatePicker
                  size="large"
                  placeholder="Select deadline date"
                  style={{
                    width: "100%",
                    backgroundColor: isDarkMode ? "#080816" : "#ffffff",
                    borderColor: isDarkMode ? "#1e1e38" : "#cbd5e1",
                    color: isDarkMode ? "#ffffff" : "#0f172a",
                    borderRadius: "8px",
                  }}
                />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span style={{ color: isDarkMode ? "#cbd5e1" : "#334155", fontWeight: 600 }}>
                    Status
                  </span>
                }
                name="status"
                rules={[{ required: true, message: "Please select status!" }]}
              >
                <Select size="large" style={{ width: "100%" }}>
                  <Option value="incomplete">Incomplete</Option>
                  <Option value="complete">Complete</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Description */}
            <Col span={24}>
              <Form.Item
                label={
                  <span style={{ color: isDarkMode ? "#cbd5e1" : "#334155", fontWeight: 600 }}>
                    Description
                  </span>
                }
                name="description"
                rules={[{ required: true, message: "Description is required!" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Provide details or notes regarding this specific task..."
                  maxLength={250}
                  showCount
                  style={{
                    ...dynamicInputStyle,
                    resize: "none",
                  }}
                />
              </Form.Item>
            </Col>

            {/* Submit Button */}
            <Col span={24} style={{ marginTop: "12px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
                block
                size="large"
                loading={loading}
                style={{
                  background: "#6366f1",
                  borderColor: "#6366f1",
                  fontWeight: 600,
                  height: isMobile ? "44px" : "48px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                }}
              >
                Create Task
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AddTodo;