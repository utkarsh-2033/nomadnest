// backend/routes/itinerary.js
const express = require("express");
const router = express.Router();
const generateItinerary = require("../controllers/generateItinerary");

router.post("/", generateItinerary);

module.exports = router;
