// import React, { createContext, useContext, useState, useEffect } from "react";
// import { ConfigProvider, theme } from "antd";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // LocalStorage se theme uthao, default 'dark' rakho kyunke tumhara app dark-first tha
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const savedTheme = localStorage.getItem("app_theme");
//     return savedTheme ? savedTheme === "dark" : true;
//   });

//   useEffect(() => {
//     localStorage.setItem("app_theme", isDarkMode ? "dark" : "light");
//     // HTML root par class toggle karo taake Tailwind ya custom CSS ko bhi handle kar sako
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//       document.documentElement.classList.remove("light");
//     } else {
//       document.documentElement.classList.add("light");
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   const toggleTheme = () => {
//     setIsDarkMode((prev) => !prev);
//   };

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
//       <ConfigProvider
//         theme={{
//           algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
//           token: {
//             colorPrimary: "#6366f1", // Indigo primary color
//             borderRadius: 8,
//             fontFamily: "Inter, sans-serif",
//           },
//         }}
//       >
//         {children}
//       </ConfigProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("app_theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const themeName = isDarkMode ? "dark" : "light";
    localStorage.setItem("app_theme", themeName);

    // 1. HTML Root classes (Tailwind / Frameworks ke liye)
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeName);

    // 2. Body classes (Bootstrap, Custom SCSS aur global variables ke liye)
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(isDarkMode ? "dark-theme" : "light-theme");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#6366f1",
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
            ...(isDarkMode
              ? {
                  colorBgBase: "#060713",
                  colorBgContainer: "#0c0d1e",
                  colorBgElevated: "#121124",
                  colorBorder: "rgba(255, 255, 255, 0.08)",
                  colorText: "#f8fafc",
                  colorTextSecondary: "#94a3b8",
                }
              : {
                  colorBgBase: "#f8fafc",
                  colorBgContainer: "#ffffff",
                  colorBgElevated: "#ffffff",
                  colorBorder: "#e2e8f0",
                  colorText: "#0f172a",
                  colorTextSecondary: "#64748b",
                }),
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);