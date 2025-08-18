import bcrypt from "bcryptjs";
import Match from "../models/Matches.js";
import User from "../models/User.js";
import Message from "../models/Messages.js";

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private (host only)
export const createMatch = async (req, res) => {
  try {
    const { name, sport } = req.body;
    if (!name || !sport) {
      return res.status(400).json({ message: "Match name and sport required" });
    }

    // Generate random 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    const match = await Match.create({
      host: req.user._id,
      name,
      sport,
      pin: pinHash, // store hash
    });

    // Return the PIN only to the host
    res.status(201).json({ ...match.toObject(), pin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a match (choose team A or B)
// @route   POST /api/matches/:id/join
// @access  Private
export const joinMatch = async (req, res) => {
  try {
    const { team } = req.body; // "A" or "B"
    const match = await Match.findById(req.params.id);

    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "pending")
      return res
        .status(400)
        .json({ message: "Cannot join, match already started or ended" });

    // prevent duplicate join
    if (
      match.teamA.includes(req.user._id) ||
      match.teamB.includes(req.user._id)
    ) {
      return res.status(400).json({ message: "You already joined this match" });
    }

    if (team === "A") match.teamA.push(req.user._id);
    else if (team === "B") match.teamB.push(req.user._id);
    else return res.status(400).json({ message: "Invalid team" });

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start match (host with correct PIN)
// @route   POST /api/matches/:id/start
// @access  Private (host only)
export const startMatch = async (req, res) => {
  try {
    const { pin } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) return res.status(404).json({ message: "Match not found" });
    if (String(match.host) !== String(req.user._id))
      return res.status(403).json({ message: "Only host can start the match" });

    // Verify PIN using bcrypt
    const isMatch = await bcrypt.compare(pin, match.pin);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid PIN" });

    match.status = "started";
    match.startedAt = new Date();
    await match.save();

    res.json({ message: "Match started", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team score
// @route   PUT /api/matches/:id/score
// @access  Private (any participant)
export const updateScore = async (req, res) => {
  try {
    const { team, points } = req.body; // team = "A" or "B"

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "started")
      return res.status(400).json({ message: "Match not active" });

    // Check if player belongs to this match
    const isParticipant =
      match.teamA.includes(req.user._id) || match.teamB.includes(req.user._id);
    if (!isParticipant)
      return res.status(403).json({ message: "Not a participant" });

    if (team === "A") match.scores.teamA += points;
    else if (team === "B") match.scores.teamB += points;
    else return res.status(400).json({ message: "Invalid team" });

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End match and update stats
// @route   POST /api/matches/:id/end
// @access  Private (host only)
export const endMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "teamA teamB",
      "username"
    );

    if (!match) return res.status(404).json({ message: "Match not found" });
    if (String(match.host) !== String(req.user._id))
      return res.status(403).json({ message: "Only host can end the match" });

    match.status = "ended";
    match.endedAt = new Date();

    // Determine winner
    if (match.scores.teamA > match.scores.teamB) match.winner = "A";
    else if (match.scores.teamB > match.scores.teamA) match.winner = "B";
    else match.winner = "draw";

    // Update player stats
    const updateStats = async (players, result) => {
      for (let player of players) {
        const user = await User.findById(player._id);
        user.matchesPlayed += 1;
        if (result === "win") user.wins += 1;
        if (result === "loss") user.losses += 1;
        await user.save();
      }
    };

    if (match.winner === "A") {
      await updateStats(match.teamA, "win");
      await updateStats(match.teamB, "loss");
    } else if (match.winner === "B") {
      await updateStats(match.teamB, "win");
      await updateStats(match.teamA, "loss");
    } else {
      await updateStats(match.teamA, "draw");
      await updateStats(match.teamB, "draw");
    }

    await match.save();
    await Message.deleteMany({ match: req.params.id });
    res.json({ message: "Match ended", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List matches (pending + started by default)
// @route   GET /api/matches
// @access  Private
export const listMatches = async (req, res) => {
  try {
    const status = req.query.status?.split(",") || ["pending", "started"];
    const matches = await Match.find({ status: { $in: status } })
      .populate("host", "username")
      .select("-messages")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single match (with usernames)
// @route   GET /api/matches/:id
// @access  Private
export const getMatchById = async (req, res) => {
  const match = await Match.findById(req.params.id)
    .populate("host", "username")
    .populate("teamA", "username")
    .populate("teamB", "username");
  if (!match) return res.status(404).json({ message: "Match not found" });

  // Do NOT send the hashed pin
  const matchObj = match.toObject();
  delete matchObj.pin;

  res.json(matchObj);
};

// @desc    Get matches played by a user
// @route   GET /api/matches/user/:userId
// @access  Private
export const getUserMatches = async (req, res) => {
  try {
    const userId = req.params.userId;
    const matches = await Match.find({
      $or: [
        { teamA: userId },
        { teamB: userId }
      ],
      status: "ended"
    })
      .populate("host", "username")
      .populate("teamA", "username")
      .populate("teamB", "username")
      .sort({ endedAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get match messages
// @route   GET /api/matches/:id/messages
// @access  Private
export const getMatchMessages = async (req, res) => {
  try {
    const matchId = req.params.id;
    const messages = await Message.find({ match: matchId })
      .sort({ time: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private (host only)
export const deleteMatch = async (req, res) => {
  const match = await Match.findById(req.params.id);
  if (!match) return res.status(404).json({ message: "Match not found" });
  if (String(match.host) !== String(req.user._id))
    return res.status(403).json({ message: "Only host can delete the match" });

  await match.deleteOne();
  await Message.deleteMany({ match: match._id }); // cleanup messages
  res.json({ message: "Match deleted" });
};
