const router = require("express").Router();
const { createRoom, updateRoom } = require("../controllers/roomController");
console.log("updateRoom:", updateRoom); // 👈 ADD HERE

const auth = require("../middleware/authMiddleware");
const Room = require("../models/Room");

// ✅ Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// ✅ Create room (protected)
router.post("/", auth, createRoom);

module.exports = router;