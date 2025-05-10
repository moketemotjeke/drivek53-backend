// backend/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Simple root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("DriveK53 API is running.");
});

// K53 compliance check route
app.post("/check", (req, res) => {
  const { gps_data, speed } = req.body;
  const speedLimit = 60; // Speed limit in km/h

  // Convert speed from m/s to km/h
  const currentSpeed = speed * 3.6;

  // Check if speed exceeds the speed limit
  if (currentSpeed > speedLimit) {
    return res.status(200).json({
      violation: true,
      rule: "Speed Limit Exceeded",
      message: `Speed limit of ${speedLimit} km/h exceeded. Your speed: ${currentSpeed.toFixed(1)} km/h`,
    });
  }

  // If no violation
  res.status(200).json({ violation: false });
});

app.listen(PORT, () => {
  console.log(`K53 Compliance API running on port ${PORT}`);
});
