import { Row, Col, Grid } from "antd";
import { ExportOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const aiCategories = [
  {
    category: "Study assistants",
    tools: [
      {
        name: "NotebookLM",
        desc: "Ground answers in your own notes.",
        url: "https://notebooklm.google.com/",
      },
      {
        name: "ChatGPT",
        desc: "General-purpose AI tutor.",
        url: "https://chatgpt.com/",
      },
      {
        name: "Claude",
        desc: "Long-context reasoning and writing.",
        url: "https://claude.ai/",
      },
      {
        name: "Gemini",
        desc: "Google's multimodal AI.",
        url: "https://gemini.google.com/",
      },
      {
        name: "Perplexity",
        desc: "AI search with citations.",
        url: "https://www.perplexity.ai/",
      },
    ],
  },
  {
    category: "Math & STEM",
    tools: [
      {
        name: "Wolfram Alpha",
        desc: "Computational engine for math/physics.",
        url: "https://www.wolframalpha.com/",
      },
      {
        name: "Symbolab",
        desc: "Step-by-step math solver.",
        url: "https://www.symbolab.com/",
      },
      {
        name: "Photomath",
        desc: "Snap and solve equations.",
        url: "https://photomath.com/",
      },
    ],
  },
  {
    category: "Writing & research",
    tools: [
      {
        name: "Grammarly",
        desc: "Writing assistant.",
        url: "https://www.grammarly.com/",
      },
      {
        name: "Quillbot",
        desc: "Paraphrase and summarize.",
        url: "https://quillbot.com/",
      },
      {
        name: "Scholar",
        desc: "Academic paper search.",
        url: "https://scholar.google.com/",
      },
    ],
  },
];

const AIToolsHub = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: isMobile ? "24px 14px" : "40px 24px",
      }}
    >
      {/* Top Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Sparkle Icon */}
          <span style={{ fontSize: isMobile ? "22px" : "26px", color: "#818cf8" }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>
          </span>
          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            AI Tools Hub
          </h2>
        </div>
        <p
          style={{
            margin: "6px 0 0",
            color: "#94a3b8",
            fontSize: isMobile ? "13px" : "14.5px",
          }}
        >
          Quick links to the AI study tools you use most.
        </p>
      </div>

      {/* Categories Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "34px" }}>
        {aiCategories.map((cat, catIdx) => (
          <div key={catIdx}>
            {/* Category Title */}
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              {cat.category}
            </h3>

            {/* Tools Grid */}
            <Row gutter={[14, 14]}>
              {cat.tools.map((tool, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      backgroundColor: "rgba(12, 14, 30, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      padding: "16px 18px",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(19, 23, 48, 0.9)";
                      e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(12, 14, 30, 0.7)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.transform = "translateY(0px)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          color: "#ffffff",
                          fontSize: "15px",
                          fontWeight: 600,
                        }}
                      >
                        {tool.name}
                      </span>
                      <ExportOutlined
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          transition: "color 0.2s ease",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#94a3b8",
                        fontSize: "12.5px",
                        lineHeight: 1.45,
                      }}
                    >
                      {tool.desc}
                    </p>
                  </a>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIToolsHub;