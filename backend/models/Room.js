const router = require("express").Router();
const Room = require("../models/Room");

// GET rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// ADD room
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.json(room);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
  
});
module.exports = router;