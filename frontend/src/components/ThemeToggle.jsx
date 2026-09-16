// import React from "react";
// import { Button } from "antd";
// import { SunOutlined, MoonOutlined } from "@ant-design/icons";
// import { useTheme } from "../context/ThemeContext";

// const ThemeToggle = () => {
//   const { isDarkMode, toggleTheme } = useTheme();

//   return (
//     <Button
//       type="text"
//       shape="circle"
//       icon={
//         isDarkMode ? (
//           <SunOutlined style={{ color: "#facc15", fontSize: "18px" }} />
//         ) : (
//           <MoonOutlined style={{ color: "#475569", fontSize: "18px" }} />
//         )
//       }
//       onClick={toggleTheme}
//       title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     />
//   );
// };

// export default ThemeToggle;



import React from "react";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ size = "middle", style = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      type="default"
      shape="circle"
      size={size}
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      icon={
        isDarkMode ? (
          <SunOutlined
            style={{
              color: "#fbbf24",
              fontSize: "17px",
              transition: "transform 0.3s ease",
            }}
          />
        ) : (
          <MoonOutlined
            style={{
              color: "#6366f1",
              fontSize: "16px",
              transition: "transform 0.3s ease",
            }}
          />
        )
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDarkMode ? "#131528" : "#f1f5f9",
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.1)",
        boxShadow: isDarkMode
          ? "none"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        ...style,
      }}
    />
  );
};

export default ThemeToggle;