import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { handleSocketConnection } from "./sockets/socket.js";
import { Server } from "socket.io";

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    method: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  },
});
// WebSocket
handleSocketConnection(io);
