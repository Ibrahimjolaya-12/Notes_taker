import { Col, Row, Grid } from "antd";

const { useBreakpoint } = Grid;

const FrontCard = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const items = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/></svg>
      ),
      title: "Subject folders",
      description: "CS, MATH, PHY, IS, ENG, STATS — and any custom course you add."
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
      ),
      title: "Upload anything",
      description: "PDFs, slides, documents, images, text notes — previewed directly in-browser."
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
      ),
      title: "Instant search",
      description: "Instantly find any study note, topic, or keyword across all semesters."
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
      ),
      title: "Tags & topics",
      description: "Filter notes effortlessly by chapter, midterm, final, or exam priority."
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>
      ),
      title: "AI summaries",
      description: "Generate structured exam-focused takeaways from attached PDFs in one click."
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M8 18v-1"/><path d="M12 18v-6"/><path d="M16 18v-3"/></svg>
      ),
      title: "Practice Assessments",
      description: "Interactive AI quizzes created directly from your course documents."
    }
  ];

  return (
    <div
      className="features-container"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "20px 12px" : "40px 20px",
      }}
    >
      <Row gutter={[16, 16]} justify="center">
        {items.map((card) => (
          <Col key={card.id} xs={24} sm={12} md={12} lg={8}>
            <div
              className="feature-card"
              style={{
                backgroundColor: "#0c0d1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: isMobile ? "20px 16px" : "26px 22px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: isMobile ? "auto" : "180px",
                boxSizing: "border-box",
                transition: "all 0.25s ease",
              }}
            >
              <div
                className="feature-icon"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              <h3
                className="feature-title"
                style={{
                  color: "#f8fafc",
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 8px 0",
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </h3>

              <p
                className="feature-desc"
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {card.description}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FrontCard;