import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sport: {
      type: String,
      required: true,
      trim: true,
    },
    teamA: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teamB: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "started", "ended"],
      default: "pending",
    },
    pin: {
      type: String, // 4-digit PIN (keep as string to preserve leading zeros)
      required: true,
    },
    scores: {
      teamA: { type: Number, default: 0 },
      teamB: { type: Number, default: 0 },
    },
    winner: {
      type: String,
      enum: ["A", "B", "draw", null],
      default: null,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
