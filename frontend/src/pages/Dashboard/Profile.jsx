import { useState, useEffect } from "react";
import {
  Upload,
  Select,
  Input,
  Button,
  message,
  Spin,
  ConfigProvider,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");

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

        // LocalStorage se data load
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setName(storedUser.name || "");
        setEmail(storedUser.email || "");
        setSemester(storedUser.semester || "Semester 1");

        // Avatar API
        const res = await axios.get("http://localhost:5000/api/avatar/me", {
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

  // 3. Save Changes (Image + Semester Backend Call)
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/login");

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Step A: Agar image select hui hai to upload karo
      if (selectedFile) {
        const data = new FormData();
        data.append("avatar", selectedFile);
        await axios.post("http://localhost:5000/api/avatar/upload", data, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Step B: Backend par Semester update karo
      const semRes = await axios.put(
        "http://localhost:5000/api/avatar/sem",
        { semester },
        { headers },
      );

      // 👈 YAHAN USE KARNA HAI semRes KO
      if (semRes.data?.success) {
        // Step C: Sirf tab LocalStorage update karo jab backend ne success bola ho
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name,
            semester: semRes.data.semester, // Backend se confirmed semester uthaya
          }),
        );
      }

      // Step C: LocalStorage update karo taake refresh par save rahe
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name, semester }),
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
      <div className="profile-loader">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>

        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" />
              ) : (
                <UserOutlined style={{ fontSize: 32, color: "#6b7280" }} />
              )}
            </div>

            <div className="avatar-info">
              <h4>{name || "User Name"}</h4>
              <span>Student</span>
              <Upload
                showUploadList={false}
                beforeUpload={handleImageSelect}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} className="btn-upload">
                  {imageUrl ? "Change picture" : "Upload picture"}
                </Button>
              </Upload>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <Input
              value={email}
              disabled
              className="dark-input disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark-input"
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Current semester</label>
            <ConfigProvider
              theme={{
                token: {
                  colorBgContainer: "#080816",
                  colorBgElevated: "#080816",
                  colorBorder: "#1e1e38",
                  colorText: "#ffffff",
                  colorTextPlaceholder: "#474a6b",
                  controlItemBgActive: "#1c234a",
                  controlItemBgHover: "#11263c",
                },
              }}
            >
              <Select
                value={semester}
                onChange={(val) => setSemester(val)}
                className="dark-select"
                popupClassName="dark-select-dropdown"
                options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                  label: `Semester ${n}`,
                  value: `Semester ${n}`,
                }))}
              />
            </ConfigProvider>
          </div>

          <div className="profile-badges">
            <div>
              <CalendarOutlined /> Active Member
            </div>
            <div>
              <UserOutlined /> Role: Student
            </div>
            <div>
              <BookOutlined /> {semester}
            </div>
          </div>

          <Button
            type="primary"
            loading={loading}
            onClick={handleSaveChanges}
            className="btn-save-profile"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
