import express from "express";
import {
  createMatch,
  joinMatch,
  startMatch,
  updateScore,
  endMatch,
} from "../controllers/matchController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { listMatches, getMatchById } from "../controllers/matchController.js";
const router = express.Router();

router.post("/", protect, createMatch);
router.post("/:id/join", protect, joinMatch);
router.post("/:id/start", protect, startMatch);
router.put("/:id/score", protect, updateScore);
router.post("/:id/end", protect, endMatch);
router.get("/", protect, listMatches);
router.get("/:id", protect, getMatchById);

export default router;
