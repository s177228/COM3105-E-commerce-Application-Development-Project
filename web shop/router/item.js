const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");

// api GET method (get all items) - /api/items/all
router.get("/items/all", function (req, res) {
  const db = low(adapter);
  res.send({
    body: db.get("items").value(),
  });
});

// api GET method (get single item) - /api/item/123
router.route("/item/:pid").get((req, res) => {
  const db = low(adapter);
  res.send({
    body: db
      .get("items")
      .find({ id: parseInt(req.params.pid) })
      .value(),
  });
});

// api POST method (post single item) - /api/item/
const post_item = require('./post_item');
router.use("/item", post_item);

// api GET method (get item's image) - /api/image/123.jpg
router.get("/image/:img", (req, res) => {
  res.sendFile(__dirname + `/data/image/${req.params.img}`);
});

module.exports = router;
