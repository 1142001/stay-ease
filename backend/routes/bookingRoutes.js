const router = require("express").Router();
const { createBooking, getBookings } = require("../controllers/bookingController");


router.post("/", createBooking);
router.get("/:userId", getBookings);

module.exports = router;