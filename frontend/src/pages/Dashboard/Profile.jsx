import { useState, useEffect } from "react";
import {
  Upload,
  Select,
  Input,
  Button,
  message,
  Spin,
  ConfigProvider,
  Image,
  Grid,
  theme,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  SaveOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { useBreakpoint } = Grid;

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // 1. Initial Load
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first!");
        return navigate("/auth/login");
      }

      try {
        setFetching(true);

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setName(storedUser.name || "");
        setEmail(storedUser.email || "");
        setSemester(storedUser.semester || "Semester 1");

        const res = await axios.get("https://class-notes-backend.vercel.app/api/avatar/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && res.data?.avatar) {
          setImageUrl(res.data.avatar);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 2. File Selection
  const handleImageSelect = (file) => {
    if (file.size / 1024 / 1024 >= 2) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
    return false;
  };

  // 3. Save Changes
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/login");

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Step A: Upload Image
      if (selectedFile) {
        const data = new FormData();
        data.append("avatar", selectedFile);
        await axios.post("https://class-notes-backend.vercel.app/api/avatar/upload", data, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Step B: Update Semester
      const semRes = await axios.put(
        "https://class-notes-backend.vercel.app/api/avatar/sem",
        { semester },
        { headers }
      );

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name,
          semester: semRes.data?.semester || semester,
        })
      );

      message.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#080816",
          colorBgElevated: "#0d1026",
          colorBorder: "#1e1e38",
          colorText: "#ffffff",
          colorTextPlaceholder: "#64748b",
          colorPrimary: "#6366f1",
          borderRadiusLG: 14,
        },
      }}
    >
      {/* Outer wrapper: Full-width column taake heading aur card upar-neeche center align hon */}
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: isMobile ? "16px 12px" : "32px 20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: "620px" }}>
          {/* Header Section */}
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <h2
              style={{
                color: "#ffffff",
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Profile Settings
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>
              Manage your personal academic identity and avatar
            </p>
          </div>

          {/* Main Card Container */}
          <div
            style={{
              background: "#0c0d1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: isMobile ? "20px 16px" : "28px 26px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Avatar Section */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "24px",
                marginBottom: "24px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {/* Ant Design Image with Built-in Zoom Controls */}
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #6366f1",
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#14182b",
                  flexShrink: 0,
                }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Profile"
                    width={96}
                    height={96}
                    style={{ objectFit: "cover", cursor: "pointer" }}
                    preview={{
                      mask: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                          }}
                        >
                          <EyeOutlined /> preview
                        </div>
                      ),
                    }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: "36px", color: "#64748b" }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 2px",
                    color: "#f8fafc",
                    fontSize: "17px",
                    fontWeight: 600,
                  }}
                >
                  {name || "User Name"}
                </h4>
                <span
                  style={{
                    color: "#818cf8",
                    fontSize: "12.5px",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  Academic Student
                </span>

                <Upload
                  showUploadList={false}
                  beforeUpload={handleImageSelect}
                  accept="image/*"
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                    style={{
                      background: "rgba(99, 102, 241, 0.12)",
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      color: "#a5b4fc",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    {imageUrl ? "Change Picture" : "Upload Picture"}
                  </Button>
                </Upload>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Email Address (Permanent)
                </label>
                <Input
                  value={email}
                  disabled
                  size="large"
                  style={{
                    background: "#060712",
                    color: "#64748b",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="large"
                  placeholder="Enter full name"
                  style={{
                    background: "#080816",
                    color: "#ffffff",
                    borderColor: "#1e1e38",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Current Semester
                </label>
                <Select
                  value={semester}
                  onChange={(val) => setSemester(val)}
                  size="large"
                  style={{ width: "100%" }}
                  popupClassName="dark-select-dropdown"
                  options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                    label: `Semester ${n}`,
                    value: `Semester ${n}`,
                  }))}
                />
              </div>
            </div>

            {/* Badges Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "10px",
                margin: "24px 0",
              }}
            >
              <div
                style={{
                  background: "#14182b",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12.5px",
                  color: "#cbd5e1",
                  justifyContent: isMobile ? "flex-start" : "center",
                }}
              >
                <CalendarOutlined style={{ color: "#818cf8" }} /> Active Member
              </div>

              <div
                style={{
                  background: "#14182b",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12.5px",
                  color: "#cbd5e1",
                  justifyContent: isMobile ? "flex-start" : "center",
                }}
              >
                <UserOutlined style={{ color: "#818cf8" }} /> Role: Student
              </div>

              <div
                style={{
                  background: "#14182b",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12.5px",
                  color: "#cbd5e1",
                  justifyContent: isMobile ? "flex-start" : "center",
                }}
              >
                <BookOutlined style={{ color: "#818cf8" }} /> {semester}
              </div>
            </div>

            {/* Action Button */}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSaveChanges}
              block
              size="large"
              style={{
                background: "#6366f1",
                borderColor: "#6366f1",
                fontWeight: 600,
                height: isMobile ? "44px" : "48px",
                borderRadius: "10px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Profile;