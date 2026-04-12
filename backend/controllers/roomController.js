const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");


// Add Room
exports.createRoom = async (req, res) => {
  try {
    console.log("Incoming:", req.body); // 👈 ADD THIS

    const room = await Room.create(req.body);

    console.log("Saved:", room); // 👈 ADD THIS

    res.json(room);

  } catch (error) {
    console.log("Room Error:", error.message); // 👈 IMPORTANT
    res.status(500).json(error.message);
  }
};

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
    res.status(500).json(err.message);
  }
};