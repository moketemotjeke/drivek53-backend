// © 2025 Mokete Peter Motjeke. All Rights Reserved.
// backend/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const checkK53Compliance = ({ gps_data, speed }) => {
  const speedLimit = 60;

  if (speed * 3.6 > speedLimit) {
    return {
      violation: true,
      rule: "Speed Limit Exceeded",
      message: `Speed limit of ${speedLimit}km/h exceeded. Your speed: ${(speed * 3.6).toFixed(1)}km/h`,
    };
  }
  return { violation: false };
};

app.post("/check", (req, res) => {
  const { driver_id, gps_data, speed, time } = req.body;

  const result = checkK53Compliance({ gps_data, speed });
  if (result.violation) {
    res.status(200).json(result);
  } else {
    res.status(200).json({ violation: false });
  }
});

app.listen(PORT, () => {
  console.log(`K53 Compliance API running on port ${PORT}`);
});
