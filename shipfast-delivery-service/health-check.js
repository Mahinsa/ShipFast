const express = require("express");
const router = express.Router();
router.use(express.json());

// health check
router.get("/", async (req, res) => {
  try {
    res.status(200).json("Healthy!");
  } catch (error) {
    console.error(error);
    res.status(503).json(error);
  }
});

module.exports = router;
