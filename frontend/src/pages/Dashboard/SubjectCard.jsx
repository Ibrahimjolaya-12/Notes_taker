// import { Button, Col, Form, Input, message, Row, Grid, ConfigProvider, theme } from "antd";
// import { FolderAddOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const { useBreakpoint } = Grid;

// const SubjectCard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post("http://localhost:5000/api/subjects/create", values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success) {
//         message.success(res.data.message || "Subject created successfully!");
//         form.resetFields();
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       console.error(error);
//       message.error(error.response?.data?.message || "Failed to create subject");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         algorithm: theme.darkAlgorithm,
//         token: {
//           colorBgContainer: "#080718",
//           colorBgElevated: "#0c0d1e",
//           colorBorder: "rgba(255, 255, 255, 0.1)",
//           colorText: "#ffffff",
//           colorTextPlaceholder: "#64748b",
//           colorPrimary: "#6366f1",
//           borderRadiusLG: 14,
//         },
//       }}
//     >
//       <div
//         className="subject-create-wrapper"
//         style={{
//           maxWidth: "540px",
//           margin: isMobile ? "20px auto" : "50px auto",
//           padding: isMobile ? "12px" : "20px",
//         }}
//       >
//         {/* Top Header Row with Navigation */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "20px",
//           }}
//         >
//           <Button
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/dashboard")}
//             style={{
//               background: "transparent",
//               borderColor: "rgba(255, 255, 255, 0.12)",
//               color: "#cbd5e1",
//             }}
//           >
//             {!isMobile && "Back to Dashboard"}
//           </Button>

//           <Button
//             type="text"
//             icon={<CloseOutlined />}
//             onClick={() => navigate("/dashboard")}
//             style={{ color: "#94a3b8" }}
//           />
//         </div>

//         {/* Main Card Container */}
//         <div
//           style={{
//             backgroundColor: "#0c0d1e",
//             borderRadius: "16px",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
//             padding: isMobile ? "20px 16px" : "28px 26px",
//           }}
//         >
//           {/* Header Title Section */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
//               paddingBottom: "16px",
//               marginBottom: "22px",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "10px",
//                 background: "linear-gradient(135deg, #6366f1, #4338ca)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#ffffff",
//                 fontSize: "18px",
//                 boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
//                 flexShrink: 0,
//               }}
//             >
//               <FolderAddOutlined />
//             </div>
//             <div>
//               <h3
//                 style={{
//                   color: "#f8fafc",
//                   fontSize: isMobile ? "16px" : "18px",
//                   fontWeight: "700",
//                   margin: 0,
//                 }}
//               >
//                 Create Subject Folder
//               </h3>
//               <span style={{ color: "#94a3b8", fontSize: "12px" }}>
//                 Add a new course container for your study material & notes
//               </span>
//             </div>
//           </div>

//           <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
//             <Row gutter={[0, 4]}>
//               {/* Code Input */}
//               <Col span={24}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Subject Code</span>}
//                   name="code"
//                   rules={[{ required: true, message: "Please input subject code!" }]}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <Input
//                     placeholder="e.g. CS-301 or MATH-102"
//                     size="large"
//                     style={{
//                       backgroundColor: "#060713",
//                       border: "1px solid #1e2448",
//                       color: "#ffffff",
//                       borderRadius: "8px",
//                     }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Name Input */}
//               <Col span={24}>
//                 <Form.Item
//                   label={<span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Subject Name</span>}
//                   name="name"
//                   rules={[{ required: true, message: "Please input subject name!" }]}
//                   style={{ marginBottom: "26px" }}
//                 >
//                   <Input
//                     placeholder="e.g. Software Engineering Fundamentals"
//                     size="large"
//                     style={{
//                       backgroundColor: "#060713",
//                       border: "1px solid #1e2448",
//                       color: "#ffffff",
//                       borderRadius: "8px",
//                     }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Action Buttons */}
//               <Col span={24}>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "10px",
//                     justifyContent: "flex-end",
//                     flexDirection: isMobile ? "column-reverse" : "row",
//                   }}
//                 >
//                   <Button
//                     onClick={() => navigate("/dashboard")}
//                     block={isMobile}
//                     style={{
//                       background: "transparent",
//                       borderColor: "rgba(255, 255, 255, 0.15)",
//                       color: "#cbd5e1",
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     icon={<CheckCircleOutlined />}
//                     loading={loading}
//                     block={isMobile}
//                     style={{
//                       backgroundColor: "#6366f1",
//                       borderColor: "#6366f1",
//                       fontWeight: "600",
//                       borderRadius: "8px",
//                       boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
//                     }}
//                   >
//                     Create Subject
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default SubjectCard;



import { Button, Col, Form, Input, message, Row, Grid, ConfigProvider, theme } from "antd";
import { FolderAddOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;

const BACKEND_URL = "https://class-notes-backend.vercel.app";

const SubjectCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BACKEND_URL}/api/subjects/create`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message || "Subject created successfully!");
        form.resetFields();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#080718",
          colorBgElevated: "#0c0d1e",
          colorBorder: "rgba(255, 255, 255, 0.1)",
          colorText: "#ffffff",
          colorTextPlaceholder: "#64748b",
          colorPrimary: "#6366f1",
          borderRadiusLG: 14,
        },
      }}
    >
      <div
        className="subject-create-wrapper"
        style={{
          maxWidth: "540px",
          margin: isMobile ? "20px auto" : "50px auto",
          padding: isMobile ? "12px" : "20px",
        }}
      >
        {/* Top Header Row with Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
            }}
          >
            {!isMobile && "Back to Dashboard"}
          </Button>

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => navigate("/dashboard")}
            style={{ color: "#94a3b8" }}
          />
        </div>

        {/* Main Card Container */}
        <div
          style={{
            backgroundColor: "#0c0d1e",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
            padding: isMobile ? "20px 16px" : "28px 26px",
          }}
        >
          {/* Header Title Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "16px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "18px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                flexShrink: 0,
              }}
            >
              <FolderAddOutlined />
            </div>
            <div>
              <h3
                style={{
                  color: "#f8fafc",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                Create Subject Folder
              </h3>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                Add a new course container for your study material & notes
              </span>
            </div>
          </div>

          <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
            <Row gutter={[0, 4]}>
              {/* Code Input */}
              <Col span={24}>
                <Form.Item
                  label={<span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Subject Code</span>}
                  name="code"
                  rules={[{ required: true, message: "Please input subject code!" }]}
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    placeholder="e.g. CS-301 or MATH-102"
                    size="large"
                    style={{
                      backgroundColor: "#060713",
                      border: "1px solid #1e2448",
                      color: "#ffffff",
                      borderRadius: "8px",
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Name Input */}
              <Col span={24}>
                <Form.Item
                  label={<span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Subject Name</span>}
                  name="name"
                  rules={[{ required: true, message: "Please input subject name!" }]}
                  style={{ marginBottom: "26px" }}
                >
                  <Input
                    placeholder="e.g. Software Engineering Fundamentals"
                    size="large"
                    style={{
                      backgroundColor: "#060713",
                      border: "1px solid #1e2448",
                      color: "#ffffff",
                      borderRadius: "8px",
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Action Buttons */}
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    flexDirection: isMobile ? "column-reverse" : "row",
                  }}
                >
                  <Button
                    onClick={() => navigate("/dashboard")}
                    block={isMobile}
                    style={{
                      background: "transparent",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "#cbd5e1",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<CheckCircleOutlined />}
                    loading={loading}
                    block={isMobile}
                    style={{
                      backgroundColor: "#6366f1",
                      borderColor: "#6366f1",
                      fontWeight: "600",
                      borderRadius: "8px",
                      boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                    }}
                  >
                    Create Subject
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SubjectCard;