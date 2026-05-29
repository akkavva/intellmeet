# 🤖 IntellMeet – AI-Powered Enterprise Meeting & Collaboration Platform

> Production-Grade Full-Stack MERN Application with Real-Time Video, AI Meeting Intelligence & Team Collaboration

![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🌐 Live Demo
- **Frontend:** https://intellmeet-frontend.onrender.com
- **Backend API:** https://intellmeet-backend-s9nd.onrender.com
- **Demo Login:** test@gmail.com / 123456

## 📌 Project Overview
IntellMeet transforms unproductive meetings into actionable, trackable events using AI-powered summaries, real-time video, and smart task management — reducing meeting follow-up time by 40–60%.

## ✨ Key Features
| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based secure login/signup with bcrypt |
| 📹 Video Meetings | Real-time WebRTC video conferencing |
| 🤖 AI Summaries | Auto-generated meeting summaries & action items |
| 💬 Real-Time Chat | Socket.io powered in-meeting chat |
| 📋 Task Management | Kanban-style project boards |
| 📊 Analytics | Meeting frequency & productivity metrics |
| 🔔 Notifications | Real-time alerts for mentions & action items |

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-Time | Socket.io + WebRTC |
| AI | OpenAI API |
| Auth | JWT + bcrypt |
| Monitoring | Sentry + Prometheus |
| Deployment | Render (Frontend + Backend) |

## 🚀 Local Setup
```bash
# Clone the repo
git clone https://github.com/akkavva/intellmeet.git
cd intellmeet

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Add environment variables
# Create .env in server/ with:
# MONGO_URI, JWT_SECRET, OPENAI_API_KEY, CLOUDINARY keys

# Run backend
cd server && npm start

# Run frontend
cd client && npm run dev
```

## 🔐 Environment Variables

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=production
FRONTEND_URL=https://intellmeet-frontend.onrender.com

## 📈 Monitoring
- **Error Tracking:** Sentry (https://zidio.sentry.io)
- **Metrics:** Prometheus endpoint at `/metrics`
- **Security Scan:** OWASP ZAP — 3 low/medium alerts found and documented

## 🏗️ Project Structure

intellmeet/
├── server/          # Express backend
│   ├── config/      # DB & Socket config
│   ├── controllers/ # Route handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   └── middleware/  # Auth middleware
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/
│   │   └── lib/     # API utilities

## 👨‍💻 Author
Built for **Zidio Development** Web Development (MERN) Internship
March–May 2026