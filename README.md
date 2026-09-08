# ClassNotes – AI-Powered Student Dashboard & Study Hub

**ClassNotes** is a full-stack MERN application designed to streamline academic workflows for students. It combines course and notes management, assignment and exam tracking, inline document previews, and a multimodal AI academic mentor powered by Google Gemini.

---

## 🌟 Key Features

* **AI Study Assistant (Multimodal)**
  * Powered by Google Gemini (`gemini-3.6-flash`).
  * Strict academic tutoring system instruction (focuses on coursework, assignments, and exam preparation).
  * **Multimodal input:** Upload notebook photos, screenshots, and diagrams for AI analysis.
  * **Voice-to-Text:** Integrated Web Speech API for voice prompt dictation.
  * **Persistent Chat History:** MongoDB-backed chat sessions per user.
  * Markdown rendering (`react-markdown`) and one-click message copy.

* **Notes & Document Management**
  * Organize notes by Subject, Topic, Chapter, and Tag badges (`mid`, `imp`, `final`, `general`).
  * File uploads (PDF, images) via Multer, plus direct Google Drive embed support.
  * Inline document preview modal supporting native PDF streaming and full-page viewing.
  * Quick AI Summarizer button on note cards for rapid exam revision.

* **Subject & Todo Tracking**
  * Subject folders with code tags (e.g., `CS-101`).
  * Integrated todo board to manage study milestones and submission deadlines.

* **User Profile & Persistence**
  * Custom avatar uploads stored locally and served via Express static middleware.
  * Dynamic semester tracking and persistent user session management via JWT.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React.js, Vite, React Router v6
* **UI Framework:** Ant Design (AntD), Bootstrap Utilities, SCSS
* **Icons:** `@ant-design/icons`
* **Markdown:** `react-markdown`
* **HTTP Client:** Axios

### Backend
* **Runtime:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **File Handling:** Multer, Node `fs` & `path`
* **AI Engine:** `@google/genai` (Google Generative AI SDK)

---

## 📁 Project Structure

```text
Notes_collect/
├── backend/
│   ├── public/
│   │   └── temp/              # Uploaded files, avatars, and attachments
│   ├── src/
│   │   ├── Config/            # Database connection setup (db.js)
│   │   ├── Controller/        # AI, Notes, Subject, Avatar, Todo controllers
│   │   ├── Middlewares/       # Auth (JWT) & Multer file upload middlewares
│   │   ├── Models/            # Mongoose Schemas (User, Note, Subject, Chat, Todo)
│   │   └── Routes/            # API Route definitions
│   ├── .env                   # Backend environment variables
│   ├── index.js               # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/            # Static assets and logos
    │   ├── components/        # Modals (AddNoteModal, PreviewModal)
    │   ├── pages/
    │   │   └── Dashboard/     # Dashboard, IndividualCards, AIChat, Profile, Todos
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
