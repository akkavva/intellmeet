# IntellMeet - Backend API

Production-grade MERN backend for AI-powered meeting platform.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Socket.io + WebRTC
- JWT Authentication
- Redis (caching)

## Getting Started

### Install dependencies
cd server
npm install

### Set up environment variables
Create a .env file with:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379

### Run the server
npm run dev

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Users
- GET /api/users/profile
- PUT /api/users/profile

### Meetings
- POST /api/meetings
- GET /api/meetings
- GET /api/meetings/:id
- PUT /api/meetings/:id/join
- PUT /api/meetings/:id/end
- DELETE /api/meetings/:id

### Chat
- POST /api/chat/:meetingId
- GET /api/chat/:meetingId