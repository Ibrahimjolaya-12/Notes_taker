# 📚 ClassNotes — Academic Study Hub & AI Assistant

A modern, full-stack academic productivity web application built with the **MERN Stack** and **Ant Design (v5)**. Designed for university students to organize course folders, track academic tasks, manage documents, and leverage AI for study assistance, automated summaries, and quiz assessments.

---

## 🌟 Key Features

### 📁 Subject & Notes Management
- **Course Folders:** Organize notes, chapters, topics, and assignments by subject code.
- **Multi-Format Uploads:** Support for PDFs, documents, images, and embedded Google Drive links.
- **In-Browser Document Previewer:** Direct interactive viewer for PDFs and image attachments without leaving the workspace.
- **Smart Filtering:** Filter course notes by tags (`mid`, `final`, `imp`, `general`) and instant search across chapters.

### 🤖 AI Academic Assistant
- **Context-Aware Study Mentor:** Chat with AI about uploaded notes, syllabus concepts, and assignment structuring.
- **Document & PDF Summarization:** Extract structured summaries and key revision takeaways from study materials in one click.
- **Voice Typing & Attachments:** Integrated Web Speech API for voice queries and direct document attachments in chat.
- **AI Practice Assessments:** Generate interactive quiz modules from course materials to test exam readiness.

### 📋 Task & Todo Scheduling
- **Academic Milestone Tracking:** Schedule tasks, assignment deadlines, and exam dates with location tags.
- **Dynamic View Modal:** Fast detail previewing without page reloads.
- **Adaptive Layout:** Responsive data table on desktop with auto-switching to compact cards on mobile viewports.

### 🎨 User Experience & Design
- **Deep-Dark Aesthetic:** Customized Ant Design dark algorithm (`#080816`, `#0c0d1e`) with clean indigo accents.
- **Responsive Architecture:** Mobile-first layout optimization powered by `Grid.useBreakpoint`.
- **Profile & Identity:** User avatar customization with interactive zoom/pan controls and semester tracking.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Ant Design (v5+)** (`ConfigProvider`, `Grid.useBreakpoint`, `Modal`, `Form`, `Image`)
- **Axios** (REST API Client)
- **React Router DOM**
- **React Markdown** (Formatted AI chat & summary output)
- **Sass / SCSS** (Custom dark utilities and layout animations)

### Backend
- **Node.js & Express.js** (REST API Architecture)
- **MongoDB & Mongoose** (Database schemas & relationships)
- **JWT (JSON Web Tokens)** (Protected route authorization)
- **Multer** (File and document upload handling)
- **Google Generative AI / Gemini API** (Document summarization and academic chat)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/classnotes.git](https://github.com/your-username/classnotes.git)
cd classnotes
