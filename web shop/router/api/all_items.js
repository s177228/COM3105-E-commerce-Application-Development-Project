const express = require("express");
const router = express.Router();
const items = require("./data/items");

// define the home page route
router.get("/items/all", function (req, res) {
  res.send({
    body: items,
  });
});

// define the home page route
router.get("/item/:pid", function (req, res) {
  res.send({
    body: items.find((x) => x.id == req.params.pid),
  });
});

module.exports = router;
