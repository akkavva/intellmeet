const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://ae9eba85ac5f26f3540d8b2fed0d6e3f@o4511460088545280.ingest.us.sentry.io/4511460102307840',
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: 1.0,
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

app.use(helmet());
const allowedOrigins = [
  "https://intellmeet-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("/*splat", cors());
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);

app.use(Sentry.expressErrorHandler());

app.get('/', (req, res) => {
  res.json({ message: 'IntellMeet API is running!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});