import express from "express";
import {
  createMatch,
  joinMatch,
  startMatch,
  updateScore,
  endMatch,
  listMatches,
  getMatchById,
  getUserMatches,
} from "../controllers/matchController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, createMatch);
router.post("/:id/join", protect, joinMatch);
router.post("/:id/start", protect, startMatch);
router.put("/:id/score", protect, updateScore);
router.post("/:id/end", protect, endMatch);
router.get("/", protect, listMatches);
router.get("/:id", protect, getMatchById);
router.get("/user/:userId", protect, getUserMatches);

export default router;
