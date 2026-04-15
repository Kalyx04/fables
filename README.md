# Fables.ai 🖋️

**Fables.ai** is a premium, distraction-free web novel platform designed for both writers and readers. Built with a focus on elegant aesthetics and a seamless user experience, it allows creators to write, manage drafts, and publish their stories to a growing library of fables.

---

## ✨ Key Features

### ✍️ For Writers
- **Distraction-Free Editor**: A powerful rich-text editor powered by Tiptap with auto-save support.
- **Draft & Publish System**: Maintain a private working draft of your chapters while readers continue to see the live version. Only publish when you're ready.
- **Writing Desk**: A central dashboard to manage multiple fictions, track chapter progress, and view stats.
- **Fiction Management**: Detailed controls for synopses, genres, tags, and covers.

### 📖 For Readers
- **Elegant Reading Experience**: Clean typography and a minimalist interface focused on immersion.
- **Discovery & Search**: Real-time search across the entire library and genre-based filtering.
- **Dynamic TOC**: A smart Table of Contents that distinguishes between published chapters and upcoming content.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **Editor**: [Tiptap](https://tiptap.dev/) (Pro-grade headless editor)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: Custom JWT-based session management
- **Styling**: Vanilla CSS (Modern CSS Variables & Responsive Design)
- **Icons & Assets**: Custom SVG icons and CSS-driven UI tokens

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fables-ai.git
   cd fables-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the platform in action.

---

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Editor, Fiction Cards, Navbar).
- `src/lib/actions`: Server Actions for database operations (Auth, Chapter, Fiction).
- `src/lib/models`: Mongoose schemas for Users, Fictions, and Chapters.
- `src/lib/auth.js`: JWT signing and verification logic.

---

## 🛤️ Roadmap

- [x] Drafting & Publishing System
- [x] Search & Genre Filtering
- [ ] AI-Powered Writing Assistant
- [ ] User Comments & Reviews
- [ ] Novel Bookmarking/Library
- [ ] Dark Mode support

---

## 📄 License

This project is licensed under the MIT License.
