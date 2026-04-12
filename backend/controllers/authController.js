const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); // 👈 ADD THIS

    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    console.log("Saved User:", user); // 👈 ADD THIS

    res.json(user);
  } catch (error) {
    console.log("Error:", error.message); // 👈 ADD THIS
    res.status(500).json(error.message);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Data:", req.body); // debug

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch); // debug

    if (!isMatch) {
      return res.status(400).json("Wrong password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ user, token });

  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json(error.message);
  }
};
// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};