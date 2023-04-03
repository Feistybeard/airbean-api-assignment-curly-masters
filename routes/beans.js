const { Router } = require("express");
const router = Router();
const uuid = require("uuid-random");
const coffeeMenuJson = require("../menu.json");

const menu = coffeeMenuJson.menu;
router.get("/", (req, res) => {
  res.json({ success: true, menu });
});

module.exports = router;
