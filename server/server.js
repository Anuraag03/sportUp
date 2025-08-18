import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./router/authRouter.js";
import matchRoutes from "./router/matchRouter.js"
import Message from "./models/Messages.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"]
  }
});

// Socket.IO logic
io.on("connection", (socket) => {
  socket.on("joinMatch", ({ matchId, user }) => {
    socket.join(matchId);
    socket.to(matchId).emit("userJoined", user);
  });

  socket.on("chatMessage", async ({ matchId, user, message }) => {
    // Save message to DB
    const msgDoc = await Message.create({
      match: matchId,
      user: user._id,
      username: user.username,
      message,
      time: new Date()
    });
    // Emit to room
    io.to(matchId).emit("chatMessage", {
      user: { username: user.username, _id: user._id },
      message,
      time: msgDoc.time
    });
  });

  socket.on("disconnect", () => {
    // handle disconnect if needed
  });
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/matches",matchRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
