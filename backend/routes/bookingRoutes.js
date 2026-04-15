const router = require("express").Router();
const {
  createBooking,
  getBookings,
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// Create booking
router.post("/", authMiddleware, createBooking);

// My bookings
router.get("/my-bookings", authMiddleware, getBookings);

// All bookings (admin)
router.get("/all", authMiddleware, getAllBookings);

// Update status
router.put("/:id", authMiddleware, updateBookingStatus);

module.exports = router;