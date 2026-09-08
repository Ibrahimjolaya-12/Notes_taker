import { useState, useEffect } from "react";
import { App as AntdApp } from "antd";
import "./App.scss";
import Routes from "./pages/Routes";
import ScreenLoader from "./Config/ScreenLoader";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Agar page pehle hi poori tarah load ho chuka ho
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }

    // 2. Real-time window load event listener
    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener("load", handleLoad);

    // 3. Fallback safety timer (agar koi third-party asset slow ho to max 2.5s baad open ho jaye)
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <AntdApp>
      {loading ? <ScreenLoader /> : <Routes />}
    </AntdApp>
  );
};

export default App;