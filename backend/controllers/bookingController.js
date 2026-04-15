const Booking = require("../models/Booking");

exports.bookRoom = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.create({
      userId,
      roomId,
      checkIn,
      checkOut
    });

    res.status(201).json({
      message: "Room booked successfully",
      booking
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, roomId, date } = req.body;

    if (!userId || !roomId || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.create({ userId, roomId, date });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Bookings
exports.getBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.userId })
    .populate("roomId");

  res.json(bookings);
};

// Get ALL bookings (admin)
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("roomId")
    .populate("userId");

  res.json(bookings);
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};