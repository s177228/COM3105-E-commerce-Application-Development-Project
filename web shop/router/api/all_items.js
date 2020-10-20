const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/api/data/db.json");

// api method (get all items) - /api/items/all
router.get("/items/all", function (req, res) {
  const db = low(adapter);
  res.send({
    body: db.get("items").value(),
  });
});

// api method (get all items) - /api/item/123
router.get("/item/:pid", function (req, res) {
  const db = low(adapter);
  res.send({
    body: db.get("items").find({ id: parseInt(req.params.pid) }).value(),
  });
});

// api method (get item's image) - /api/image/123.jpg
router.get("/image/:img", function (req, res) {
  res.sendFile(__dirname + `/data/image/${req.params.img}`);
});

module.exports = router;
