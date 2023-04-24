var express = require("express");
var Network = require("../models/network");
var router = express.Router();

router.get("/", async (req, res) => {
  const { country } = req.query;
  try {
    const networks = await Network.find({ country }).select("stations");
    const stationCount = networks.reduce(
      (count, network) => count + network.stations.length,
      0
    );
    res.status(200).json({ stationCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching station count." });
  }
});


module.exports = router;
