const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");

// ✅ CREATE ROOM
exports.createRoom = async (req, res) => {
  try {
    const { title, price, location, image } = req.body;

    const uploaded = await cloudinary.uploader.upload(image);

    const room = await Room.create({
      title,
      price,
      location,
      image: uploaded.secure_url
    });

    res.json(room);
  } catch (err) {
    console.log("Room Error:", err.message);
    res.status(500).json(err.message);
  }
};

// ✅ UPDATE ROOM
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(room);
  } catch (error) {
    res.status(500).json(error.message);
  }
};