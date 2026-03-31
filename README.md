# 🧠 AI SaaS Application 

The **AI SaaS Platform**, a fully functional subscription-based web application built using the **PERN stack** (PostgreSQL, Express.js, React, Node.js). This app offers various AI-powered tools integrated with secure user authentication and premium feature billing.

---
## 🌐 Live Demo

🚀 **Frontend:**  
👉 https://ai-saas-platform-client-sepia.vercel.app/  

⚙️ **Backend API:**  
👉 https://ai-saas-platform-server-khaki.vercel.app/

---
## 🚀 Features

### 🔐 User Authentication
- Seamless and secure **Sign Up / Sign In**
- **Profile Management**
- Powered by **[Clerk](https://clerk.dev)** for authentication and user sessions

### 💳 Subscription Billing
- Premium access to AI tools via **subscription plans**
- Integrated with billing services for **secure payments**

### 🗃️ Database
- **Serverless PostgreSQL** powered by [Neon](https://neon.tech)
- Fast, scalable, and reliable data storage

---

## 🛠️ Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL (via Neon)  
- **Auth:** Clerk  
- **Deployment:** Vercel / Railway / Render *(optional)*  
- **AI Services:** Google Gemini, ClipDrop, Cloudinary

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (or a [Neon](https://neon.tech) account)
- **Clerk** account (for authentication)
- **Cloudinary** account (for image hosting)
- **Google Gemini API Key** (for text generation)
- **ClipDrop API Key** (for image generation)

### 🔧 Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ShreyaDevadigaK/Ai-Saas-Platform.git
cd Ai-Saas-Platform
```

#### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following:
```env
DATABASE_URL=your_postgresql_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLIENT_URL=http://localhost:5173
PORT=3000
```

#### 3. Client Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory and add:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 🏃 Running the Project

#### Start the Server
In the `server` directory:
```bash
npm run server
```

#### Start the Client
In the `client` directory:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🗃️ Database Schema

The application uses a `creations` table to store AI-generated content. You can use the following SQL to create it:

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  publish BOOLEAN DEFAULT FALSE,
  likes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

