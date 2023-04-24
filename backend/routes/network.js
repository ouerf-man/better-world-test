var express = require("express");
var Network = require("../models/network");
var router = express.Router();

router
  .get("/", async (req, res, next) => {
    try {
      let networks;
      if (req.query.city) {
        // If city query parameter is provided, filter by city
        networks = await Network.find({ city: req.query.city });
      } else if (req.query.name) {
        // If name query parameter is provided, filter by name
        networks = await Network.find({ name: req.query.name });
      } else {
        // Otherwise, fetch all networks
        networks = await Network.find();
      }
      res.json(networks);
    } catch (error) {
      console.error("Error fetching networks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .post("/", async (req, res, next) => {
    try {
      const { name, company, city, country } = req.body;
      const network = await Network.create({ name, company, city, country });
      res.status(200).json(network);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
