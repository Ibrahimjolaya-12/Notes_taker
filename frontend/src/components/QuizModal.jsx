import { useState } from "react";
import { Modal, Button, Progress, Spin, message, ConfigProvider, theme, Grid } from "antd";
import {
  ExperimentOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { useBreakpoint } = Grid;

const QuizModal = ({ open, onCancel, subjectId, subjectName }) => {
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [currentStep, setCurrentStep] = useState("setup");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const startQuiz = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://class-notes-backend.vercel.app/api/quiz/generate/${subjectId}`,
        { count: questionCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && res.data.quiz?.length > 0) {
        setQuizList(res.data.quiz);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setCurrentStep("playing");
      } else {
        message.warning("Is subject ke notes se questions generate nahi ho sake.");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Quiz generate karne mein masla hua.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quizList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const resetModal = () => {
    setCurrentStep("setup");
    setQuizList([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
    onCancel();
  };

  const restartQuiz = () => {
    setCurrentStep("setup");
    setQuizList([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
  };

  const score = calculateScore();
  const percentage = quizList.length > 0 ? Math.round((score / quizList.length) * 100) : 0;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#0f121d",
          colorText: "#f8fafc",
          colorPrimary: "#6366f1",
          borderRadiusLG: 16,
        },
      }}
    >
      <Modal
        open={open}
        onCancel={resetModal}
        footer={null}
        centered
        width={isMobile ? "94%" : 680}
        destroyOnClose
        className="quiz-dark-modal"
        styles={{
          mask: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.75)" },
          content: {
            backgroundColor: "#0f121d",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: isMobile ? "16px" : "24px",
          },
          header: { backgroundColor: "transparent", borderBottom: "none" },
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div
              style={{
                width: isMobile ? "32px" : "38px",
                height: isMobile ? "32px" : "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: isMobile ? "15px" : "18px",
                flexShrink: 0,
              }}
            >
              <ExperimentOutlined />
            </div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: isMobile ? "14.5px" : "16px", color: "#f8fafc", fontWeight: 600 }}>
                Practice Assessment
              </h4>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {subjectName || "Subject Material"}
              </span>
            </div>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: isMobile ? "40px 10px" : "60px 20px" }}>
            <Spin size="large" />
            <h5 style={{ color: "#f8fafc", marginTop: "20px", fontSize: "15px" }}>
              Generating Quiz from Notes...
            </h5>
            <p style={{ color: "#94a3b8", fontSize: "12.5px" }}>
              AI is analyzing your PDFs and generating multiple choice questions.
            </p>
          </div>
        ) : currentStep === "setup" ? (
          <div style={{ paddingTop: "6px" }}>
            {/* Banner */}
            <div
              style={{
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "12px",
                padding: isMobile ? "12px" : "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <FileTextOutlined style={{ fontSize: "20px", color: "#818cf8", marginTop: "2px" }} />
              <div>
                <h6 style={{ margin: "0 0 3px", fontSize: "13.5px", color: "#ffffff", fontWeight: 600 }}>
                  Test Your Knowledge
                </h6>
                <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", lineHeight: 1.4 }}>
                  Questions are dynamically crafted using your uploaded subject notes and PDFs.
                </p>
              </div>
            </div>

            {/* Chips Count */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Select Number of Questions
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    style={{
                      background: questionCount === cnt ? "rgba(99, 102, 241, 0.2)" : "#161b2b",
                      border: questionCount === cnt ? "1.5px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      padding: isMobile ? "10px 14px" : "16px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: "center",
                      justifyContent: isMobile ? "space-between" : "center",
                      gap: "4px",
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: isMobile ? "18px" : "22px",
                        fontWeight: 700,
                        color: questionCount === cnt ? "#818cf8" : "#ffffff",
                      }}
                    >
                      {cnt}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {cnt === 5 ? "Quick Check" : cnt === 10 ? "Standard Test" : "Deep Review"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column-reverse" : "row",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                onClick={resetModal}
                block={isMobile}
                style={{
                  background: "transparent",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "#cbd5e1",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size={isMobile ? "middle" : "large"}
                icon={<ArrowRightOutlined />}
                onClick={startQuiz}
                block={isMobile}
                style={{ background: "#6366f1", borderColor: "#6366f1", fontWeight: 600 }}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        ) : currentStep === "playing" ? (
          <div style={{ paddingTop: "4px" }}>
            {/* Meta bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                Q: <strong style={{ color: "#ffffff" }}>{currentIndex + 1}</strong> / {quizList.length}
              </span>
              <div style={{ flex: 1 }}>
                <Progress
                  percent={Math.round(((currentIndex + 1) / quizList.length) * 100)}
                  strokeColor="#6366f1"
                  trailColor="#1f2538"
                  showInfo={false}
                />
              </div>
            </div>

            {/* Question Text Box */}
            <div
              style={{
                background: "#161b2b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: isMobile ? "14px" : "18px 20px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? "14px" : "15.5px",
                  fontWeight: 600,
                  color: "#ffffff",
                  lineHeight: 1.5,
                }}
              >
                {quizList[currentIndex]?.question}
              </p>
            </div>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "20px" }}>
              {quizList[currentIndex]?.options?.map((opt, i) => {
                const isSelected = selectedAnswers[currentIndex] === opt;
                return (
                  <div
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    style={{
                      background: isSelected ? "rgba(99, 102, 241, 0.16)" : "#161b2b",
                      border: isSelected ? "1.5px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      padding: isMobile ? "10px 12px" : "14px 16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: isSelected ? "#6366f1" : "#242a3d",
                        color: isSelected ? "#ffffff" : "#94a3b8",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span
                      style={{
                        fontSize: isMobile ? "13px" : "14.5px",
                        color: isSelected ? "#ffffff" : "#cbd5e1",
                        fontWeight: isSelected ? 600 : 400,
                        wordBreak: "break-word",
                      }}
                    >
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <Button
                icon={<ArrowLeftOutlined />}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                style={{
                  background: "transparent",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "#cbd5e1",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                Back
              </Button>

              {currentIndex < quizList.length - 1 ? (
                <Button
                  type="primary"
                  disabled={!selectedAnswers[currentIndex]}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  style={{
                    background: "#6366f1",
                    borderColor: "#6366f1",
                    fontWeight: 600,
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  Next <ArrowRightOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  disabled={!selectedAnswers[currentIndex]}
                  onClick={() => setCurrentStep("result")}
                  style={{
                    background: "#10b981",
                    borderColor: "#10b981",
                    fontWeight: 600,
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Results Breakdown */
          <div>
            <div
              style={{
                background: "#161b2b",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                textAlign: "center",
                padding: isMobile ? "14px" : "20px",
                marginBottom: "16px",
              }}
            >
              <TrophyOutlined style={{ fontSize: isMobile ? "28px" : "36px", color: "#f59e0b", marginBottom: "6px" }} />
              <h4 style={{ color: "#ffffff", margin: "0 0 4px 0", fontSize: isMobile ? "16px" : "18px" }}>
                Quiz Finished!
              </h4>
              <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                {score} <span style={{ fontSize: "14px", color: "#94a3b8" }}>/ {quizList.length}</span>
                <span style={{ fontSize: isMobile ? "14px" : "16px", color: "#818cf8", marginLeft: "8px" }}>
                  ({percentage}%)
                </span>
              </div>
              <Progress
                percent={percentage}
                strokeColor={percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"}
                trailColor="#1f2538"
                showInfo={false}
              />
            </div>

            <div style={{ maxHeight: isMobile ? "220px" : "280px", overflowY: "auto", paddingRight: "4px" }}>
              <h5 style={{ color: "#cbd5e1", fontSize: "12.5px", marginBottom: "10px" }}>
                Answers & Explanations:
              </h5>
              {quizList.map((item, idx) => {
                const isCorrect = selectedAnswers[idx] === item.correctAnswer;
                return (
                  <div
                    key={idx}
                    style={{
                      background: isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                      border: isCorrect ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      marginBottom: "8px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: isCorrect ? "#10b981" : "#ef4444", marginTop: "2px" }}>
                      {isCorrect ? <CheckCircleFilled /> : <CloseCircleFilled />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: "0 0 4px 0", lineHeight: 1.4 }}>
                        {idx + 1}. {item.question}
                      </p>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "4px" }}>
                        Your Choice:{" "}
                        <strong style={{ color: isCorrect ? "#10b981" : "#ef4444" }}>
                          {selectedAnswers[idx] || "Unanswered"}
                        </strong>
                        {!isCorrect && (
                          <span style={{ display: isMobile ? "block" : "inline", marginLeft: isMobile ? "0" : "10px" }}>
                            Correct: <strong style={{ color: "#10b981" }}>{item.correctAnswer}</strong>
                          </span>
                        )}
                      </div>
                      {item.explanation && (
                        <div
                          style={{
                            background: "rgba(0,0,0,0.2)",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            color: "#94a3b8",
                            lineHeight: 1.4,
                          }}
                        >
                          <strong style={{ color: "#818cf8" }}>Reason:</strong> {item.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column-reverse" : "row",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={restartQuiz}
                block={isMobile}
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#cbd5e1" }}
              >
                Retry
              </Button>
              <Button
                type="primary"
                onClick={resetModal}
                block={isMobile}
                style={{ background: "#6366f1", borderColor: "#6366f1" }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default QuizModal;