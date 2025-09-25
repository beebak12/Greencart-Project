const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "OK", message: "Greencart backend is running 🚀" });
});

module.exports = router;
