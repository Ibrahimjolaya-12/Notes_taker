// const ScreenLoader = () => {
//   return (
//     <div className="loading">
//       <span className="loader"></span>
//     </div>
//   );
// };

// export default ScreenLoader;
import { useTheme } from "../context/ThemeContext";

const ScreenLoader = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`loading ${isDarkMode ? "dark-theme" : "light-theme"}`}
      style={{
        background: isDarkMode
          ? "radial-gradient(circle at center, #0f0c29 0%, #08071a 50%, #030209 100%)"
          : "radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <span className="loader"></span>
    </div>
  );
};

export default ScreenLoader;