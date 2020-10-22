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
router.route("/item").post((req, res) => {
  if (
    req.body.sellerId == null ||
    req.body.name == null ||
    req.body.price == null ||
    req.body.img == null ||
    req.body.desc == null ||
    req.body.detail == null
  ) {
    res.status(400).send({ msg: "some slot are empty!" });
  } else {
    const db = low(adapter);
    // Add find max id + 1 function on db
    db._.mixin({
      new_id: function (array) {
        id = 0;
        array.forEach((element) => {
          id < element.id ? (id = element.id) : null;
        });
        return id + 1;
      },
    });
    db.get("items")
      .push({
        id: db.get("items").new_id().value(),
        sellerId: req.body.sellerId,
        name: req.body.name,
        price: req.body.price,
        img: req.body.img,
        desc: req.body.desc,
        detail: req.body.detail,
        buyerId: null,
      })
      .write();
    res.status(200).send({ msg: "posted!" });
  }
});

// api GET method (get item's image) - /api/image/123.jpg
router.get("/image/:img", (req, res) => {
  res.sendFile(__dirname + `/data/image/${req.params.img}`);
});

module.exports = router;
