// import { Col, Row, Grid } from "antd";

// const { useBreakpoint } = Grid;

// const FrontFooter = () => {
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;

//   return (
//     <footer
//       className="front-footer"
//       style={{
//         borderTop: "1px solid rgba(255, 255, 255, 0.08)",
//         backgroundColor: "#03030d",
//         padding: isMobile ? "16px 12px" : "20px 24px",
//         marginTop: "auto",
//       }}
//     >
//       <div
//         className="container"
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         <Row align="middle" justify="space-between">
//           <Col
//             span={24}
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//               justifyContent: isMobile ? "center" : "space-between",
//               gap: isMobile ? "8px" : "16px",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             {/* Copyright Statement */}
//             <p
//               style={{
//                 color: "#94a3b8",
//                 fontSize: "13px",
//                 margin: 0,
//               }}
//             >
//               &copy; {new Date().getFullYear()} ClassNotes. All rights reserved.
//             </p>

//             {/* Developer Credits */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 color: "#94a3b8",
//                 fontSize: "13px",
//                 margin: 0,
//               }}
//             >
//               <span>Designed & Developed by</span>
//               <span
//                 style={{
//                   color: "#818cf8",
//                   fontWeight: 600,
//                 }}
//               >
//                 Muhammad Ibrahim
//               </span>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </footer>
//   );
// };

// export default FrontFooter;


// import { Col, Row, Grid } from "antd";
// import { useTheme } from "../../context/ThemeContext";

// const { useBreakpoint } = Grid;

// const FrontFooter = () => {
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;
//   const { isDarkMode } = useTheme();

//   return (
//     <footer
//       className="front-footer"
//       style={{
//         borderTop: isDarkMode
//           ? "1px solid rgba(255, 255, 255, 0.08)"
//           : "1px solid #e2e8f0",
//         backgroundColor: isDarkMode ? "#03030d" : "#ffffff",
//         padding: isMobile ? "16px 12px" : "20px 24px",
//         marginTop: "auto",
//         width: "100%",
//         transition: "background-color 0.3s ease, border-color 0.3s ease",
//       }}
//     >
//       <div
//         className="container"
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         <Row align="middle" justify="space-between">
//           <Col
//             span={24}
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//               justifyContent: isMobile ? "center" : "space-between",
//               gap: isMobile ? "8px" : "16px",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             {/* Copyright Statement */}
//             <p
//               style={{
//                 color: isDarkMode ? "#94a3b8" : "#64748b",
//                 fontSize: "13px",
//                 margin: 0,
//               }}
//             >
//               &copy; {new Date().getFullYear()} ClassNotes. All rights reserved.
//             </p>

//             {/* Developer Credits */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 color: isDarkMode ? "#94a3b8" : "#64748b",
//                 fontSize: "13px",
//                 margin: 0,
//               }}
//             >
//               <span>Designed & Developed by</span>
//               <span
//                 style={{
//                   color: "#6366f1",
//                   fontWeight: 600,
//                 }}
//               >
//                 Muhammad Ibrahim
//               </span>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </footer>
//   );
// };

// export default FrontFooter;







// import { Col, Row, Grid } from "antd";
// import { useTheme } from "../../context/ThemeContext";

// const { useBreakpoint } = Grid;

// const FrontFooter = () => {
//   const screens = useBreakpoint();
//   const isMobile = !screens.sm;
//   const { isDarkMode } = useTheme();

//   return (
//     <footer
//       className="front-footer"
//       style={{
//         width: "100%",
//         borderTop: isDarkMode
//           ? "1px solid rgba(255, 255, 255, 0.08)"
//           : "1px solid #e2e8f0",
//         backgroundColor: isDarkMode ? "#03030d" : "#ffffff",
//         padding: isMobile ? "16px 12px" : "20px 24px",
//         marginTop: "auto",
//         transition: "all 0.3s ease",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           width: "100%",
//         }}
//       >
//         <Row align="middle" justify="space-between">
//           <Col
//             span={24}
//             style={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//               justifyContent: isMobile ? "center" : "space-between",
//               gap: isMobile ? "8px" : "16px",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             <p
//               style={{
//                 color: isDarkMode ? "#94a3b8" : "#64748b",
//                 fontSize: "13px",
//                 margin: 0,
//                 transition: "color 0.3s ease",
//               }}
//             >
//               &copy; {new Date().getFullYear()} ClassNotes. All rights reserved.
//             </p>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 color: isDarkMode ? "#94a3b8" : "#64748b",
//                 fontSize: "13px",
//                 margin: 0,
//                 transition: "color 0.3s ease",
//               }}
//             >
//               <span>Designed & Developed by</span>
//               <span
//                 style={{
//                   color: isDarkMode ? "#818cf8" : "#4f46e5",
//                   fontWeight: 600,
//                   transition: "color 0.3s ease",
//                 }}
//               >
//                 Muhammad Ibrahim
//               </span>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </footer>
//   );
// };

// export default FrontFooter;





import { Col, Row, Grid } from "antd";
import { useTheme } from "../../context/ThemeContext";

const { useBreakpoint } = Grid;

const FrontFooter = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const { isDarkMode } = useTheme();

  return (
    <footer
      className="front-footer"
      style={{
        width: "100%",
        borderTop: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid #e2e8f0",
        backgroundColor: isDarkMode ? "#03030d" : "#ffffff",
        padding: isMobile ? "16px 12px" : "20px 24px",
        marginTop: "auto",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col
            span={24}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "space-between",
              gap: isMobile ? "8px" : "16px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            {/* Copyright Statement */}
            <p
              style={{
                color: isDarkMode ? "#94a3b8" : "#334155", // 👈 Light mode mein dark & readable
                fontSize: "13.5px",
                fontWeight: 500,
                margin: 0,
                transition: "color 0.3s ease",
              }}
            >
              &copy; {new Date().getFullYear()} ClassNotes. All rights reserved.
            </p>

            {/* Developer Credits */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13.5px",
                margin: 0,
              }}
            >
              <span
                style={{
                  color: isDarkMode ? "#94a3b8" : "#334155", // 👈 Ab light mode mein gayab nahi hoga
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
              >
                Designed & Developed by
              </span>
              <span
                style={{
                  color: isDarkMode ? "#818cf8" : "#4338ca", // 👈 Light mode mein prominent deep indigo
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                  transition: "color 0.3s ease",
                }}
              >
                Muhammad Ibrahim
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default FrontFooter;