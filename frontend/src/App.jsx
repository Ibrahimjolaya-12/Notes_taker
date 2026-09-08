import { useState, useEffect } from "react";
import { App as AntdApp } from "antd";
import "./App.scss";
import Routes from "./pages/Routes";
import ScreenLoader from "./Config/ScreenLoader";

const App = () => {
  // FIX 1: Initial state true taake shuru mein loader dikhe
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AntdApp>
      {loading ? <ScreenLoader /> : <Routes />}
    </AntdApp>
  );
};

export default App;