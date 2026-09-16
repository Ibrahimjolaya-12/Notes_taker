// import { Col, Row, Grid, Button } from "antd";
// import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const { useBreakpoint } = Grid;

// const FrontendPage = () => {
//   const navigate = useNavigate();
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   return (
//     <div
//       className="landing-hero-container"
//       style={{
//         maxWidth: "1140px",
//         margin: "0 auto",
//         padding: isMobile ? "30px 16px 20px" : "60px 20px 40px",
//       }}
//     >
//       <Row justify="center" className="text-center">
//         {/* Main Hero Heading */}
//         <Col xs={24} md={20} lg={18}>
//           <h1
//             style={{
//               color: "#6366f1",
//               fontWeight: 900,
//               fontSize: isMobile ? "32px" : screens.md ? "48px" : "56px",
//               lineHeight: 1.18,
//               textAlign: "center",
//               margin: "0 auto 16px",
//               maxWidth: "800px",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             All your class notes, organized.
//           </h1>
//         </Col>

//         {/* Subtitle */}
//         <Col xs={24} sm={20} md={16}>
//           <p
//             style={{
//               color: "#94a3b8",
//               fontSize: isMobile ? "14px" : "17px",
//               lineHeight: 1.6,
//               margin: "0 auto 28px",
//               maxWidth: "620px",
//             }}
//           >
//             Upload PDFs, slides, and notes. Tag by chapter, search instantly, and
//             generate AI summaries and quizzes in one click.
//           </p>
//         </Col>

//         {/* Action Buttons (Mobile par full-width stack, Desktop par inline) */}
//         <Col xs={24}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "12px",
//               maxWidth: isMobile ? "320px" : "100%",
//               margin: "0 auto",
//             }}
//           >
//             <Button
//               type="primary"
//               size="large"
//               icon={<ArrowRightOutlined />}
//               onClick={() => navigate("/auth/register")}
//               block={isMobile}
//               style={{
//                 backgroundColor: "#6366f1",
//                 borderColor: "#6366f1",
//                 color: "#ffffff",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
//               }}
//             >
//               Get started free
//             </Button>

//             <Button
//               size="large"
//               icon={<UserOutlined />}
//               onClick={() => navigate("/auth/login")}
//               block={isMobile}
//               style={{
//                 backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 borderColor: "rgba(255, 255, 255, 0.15)",
//                 color: "#cbd5e1",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//               }}
//             >
//               I have an account
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default FrontendPage;






// import { Col, Row, Grid, Button } from "antd";
// import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../context/ThemeContext";

// const { useBreakpoint } = Grid;

// const FrontendPage = () => {
//   const navigate = useNavigate();
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       className="landing-hero-container"
//       style={{
//         maxWidth: "1140px",
//         margin: "0 auto",
//         padding: isMobile ? "40px 16px 20px" : "70px 20px 40px",
//         width: "100%",
//         boxSizing: "border-box",
//       }}
//     >
//       <Row justify="center" className="text-center">
//         {/* Main Hero Heading */}
//         <Col xs={24} md={20} lg={18}>
//           <h1
//             style={{
//               color: "#6366f1",
//               fontWeight: 900,
//               fontSize: isMobile ? "32px" : screens.md ? "48px" : "56px",
//               lineHeight: 1.18,
//               textAlign: "center",
//               margin: "0 auto 16px",
//               maxWidth: "800px",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             All your class notes, organized.
//           </h1>
//         </Col>

//         {/* Subtitle */}
//         <Col xs={24} sm={20} md={16}>
//           <p
//             style={{
//               color: isDarkMode ? "#94a3b8" : "#64748b",
//               fontSize: isMobile ? "14px" : "17px",
//               lineHeight: 1.6,
//               margin: "0 auto 28px",
//               maxWidth: "620px",
//               transition: "color 0.3s ease",
//             }}
//           >
//             Upload PDFs, slides, and notes. Tag by chapter, search instantly, and
//             generate AI summaries and quizzes in one click.
//           </p>
//         </Col>

//         {/* Action Buttons */}
//         <Col xs={24}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "12px",
//               maxWidth: isMobile ? "320px" : "100%",
//               margin: "0 auto",
//             }}
//           >
//             <Button
//               type="primary"
//               size="large"
//               icon={<ArrowRightOutlined />}
//               onClick={() => navigate("/auth/register")}
//               block={isMobile}
//               style={{
//                 backgroundColor: "#6366f1",
//                 borderColor: "#6366f1",
//                 color: "#ffffff",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
//               }}
//             >
//               Get started free
//             </Button>

//             <Button
//               size="large"
//               icon={<UserOutlined />}
//               onClick={() => navigate("/auth/login")}
//               block={isMobile}
//               style={{
//                 backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
//                 borderColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1",
//                 color: isDarkMode ? "#cbd5e1" : "#334155",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//                 boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               I have an account
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default FrontendPage;





// import { Col, Row, Grid, Button } from "antd";
// import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../context/ThemeContext";

// const { useBreakpoint } = Grid;

// const FrontendPage = () => {
//   const navigate = useNavigate();
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       className="landing-hero-container"
//       style={{
//         maxWidth: "1140px",
//         margin: "0 auto",
//         padding: isMobile ? "30px 16px 20px" : "60px 20px 40px",
//         width: "100%",
//         boxSizing: "border-box",
//       }}
//     >
//       <Row justify="center" className="text-center">
//         <Col xs={24} md={20} lg={18}>
//           <h1
//             style={{
//               color: "#6366f1",
//               fontWeight: 900,
//               fontSize: isMobile ? "32px" : screens.md ? "48px" : "56px",
//               lineHeight: 1.18,
//               textAlign: "center",
//               margin: "0 auto 16px",
//               maxWidth: "800px",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             All your class notes, organized.
//           </h1>
//         </Col>

//         <Col xs={24} sm={20} md={16}>
//           <p
//             style={{
//               color: isDarkMode ? "#94a3b8" : "#64748b",
//               fontSize: isMobile ? "14px" : "17px",
//               lineHeight: 1.6,
//               margin: "0 auto 28px",
//               maxWidth: "620px",
//               transition: "color 0.3s ease",
//             }}
//           >
//             Upload PDFs, slides, and notes. Tag by chapter, search instantly, and
//             generate AI summaries and quizzes in one click.
//           </p>
//         </Col>

//         <Col xs={24}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "12px",
//               maxWidth: isMobile ? "320px" : "100%",
//               margin: "0 auto",
//             }}
//           >
//             <Button
//               type="primary"
//               size="large"
//               icon={<ArrowRightOutlined />}
//               onClick={() => navigate("/auth/register")}
//               block={isMobile}
//               style={{
//                 backgroundColor: "#6366f1",
//                 borderColor: "#6366f1",
//                 color: "#ffffff",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
//               }}
//             >
//               Get started free
//             </Button>

//             <Button
//               size="large"
//               icon={<UserOutlined />}
//               onClick={() => navigate("/auth/login")}
//               block={isMobile}
//               style={{
//                 backgroundColor: isDarkMode
//                   ? "rgba(255, 255, 255, 0.05)"
//                   : "#ffffff",
//                 borderColor: isDarkMode
//                   ? "rgba(255, 255, 255, 0.15)"
//                   : "#cbd5e1",
//                 color: isDarkMode ? "#cbd5e1" : "#334155",
//                 fontWeight: 600,
//                 height: isMobile ? "44px" : "48px",
//                 padding: "0 28px",
//                 borderRadius: "10px",
//                 boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               I have an account
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default FrontendPage;




import { Col, Row, Grid, Button } from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const { useBreakpoint } = Grid;

const FrontendPage = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const { isDarkMode } = useTheme();

  return (
    <div
      className="landing-hero-container"
      style={{
        maxWidth: "1140px",
        margin: "0 auto",
        padding: isMobile ? "30px 16px 20px" : "60px 20px 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Row justify="center" className="text-center">
        {/* Main Heading */}
        <Col xs={24} md={20} lg={18}>
          <h1
            style={{
              color: "#6366f1",
              fontWeight: 900,
              fontSize: isMobile ? "32px" : screens.md ? "48px" : "56px",
              lineHeight: 1.18,
              textAlign: "center",
              margin: "0 auto 16px",
              maxWidth: "800px",
              letterSpacing: "-0.5px",
            }}
          >
            All your class notes, organized.
          </h1>
        </Col>

        {/* Subtitle */}
        <Col xs={24} sm={20} md={16}>
          <p
            style={{
              color: isDarkMode ? "#94a3b8" : "#334155",
              fontSize: isMobile ? "14px" : "17px",
              lineHeight: 1.6,
              margin: "0 auto 28px",
              maxWidth: "620px",
              transition: "color 0.3s ease",
            }}
          >
            Upload PDFs, slides, and notes. Tag by chapter, search instantly, and
            generate AI summaries and quizzes in one click.
          </p>
        </Col>

        {/* Action Buttons */}
        <Col xs={24}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              maxWidth: isMobile ? "320px" : "100%",
              margin: "0 auto",
            }}
          >
            {/* Primary Button */}
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/auth/register")}
              block={isMobile}
              style={{
                backgroundColor: "#6366f1",
                borderColor: "#6366f1",
                color: "#ffffff",
                fontWeight: 600,
                height: isMobile ? "44px" : "48px",
                padding: "0 28px",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
              }}
            >
              Get started free
            </Button>

            {/* Secondary Button: Light mode mein Black background, Dark mode mein Glassy */}
            <Button
              size="large"
              icon={<UserOutlined style={{ color: isDarkMode ? "#cbd5e1" : "#ffffff" }} />}
              onClick={() => navigate("/auth/login")}
              block={isMobile}
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "#0f172a", // 👈 Light mode mein solid black
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.15)"
                  : "#0f172a",
                color: isDarkMode ? "#cbd5e1" : "#ffffff", // 👈 Text bilkul white aur sharp
                fontWeight: 600,
                height: isMobile ? "44px" : "48px",
                padding: "0 28px",
                borderRadius: "10px",
                boxShadow: isDarkMode ? "none" : "0 4px 14px rgba(15, 23, 42, 0.25)",
                transition: "all 0.3s ease",
              }}
            >
              I have an account
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FrontendPage;