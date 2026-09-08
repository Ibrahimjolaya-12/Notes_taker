import { Col, Row, Grid } from "antd";

const { useBreakpoint } = Grid;

const FrontFooter = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <footer
      className="front-footer"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "#03030d",
        padding: isMobile ? "16px 12px" : "20px 24px",
        marginTop: "auto",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
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
                color: "#94a3b8",
                fontSize: "13px",
                margin: 0,
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
                color: "#94a3b8",
                fontSize: "13px",
                margin: 0,
              }}
            >
              <span>Designed & Developed by</span>
              <span
                style={{
                  color: "#818cf8",
                  fontWeight: 600,
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