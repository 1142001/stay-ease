const express = require("express");
const router = express.Router();
const Room = require("../models/Room");




// GET rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// ADD room
router.post("/", async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
});


module.exports = router;