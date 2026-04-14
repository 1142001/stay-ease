const router = require("express").Router();

const {
  createBooking,
  getBookings,
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create booking
router.post("/", authMiddleware, createBooking);

// ✅ Get logged-in user's bookings
router.get("/my-bookings", authMiddleware, (req, res, next) => {
  req.params.userId = req.user.id;
  next();
}, getBookings);

// ✅ Get all bookings (admin)
router.get("/all", authMiddleware, getAllBookings);

// ✅ Update booking status
router.put("/:id", authMiddleware, updateBookingStatus);

module.exports = router;