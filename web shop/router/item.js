const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    pid: Number,
    sellerId: Number,
    name: String,
    price: Number,
    img: String,
    desc: String,
    detail: String,
    buyerId: Number,
  },
  {
    timestamps: true,
  }
);

const products = mongoose.model("products", productsSchema);

router.post("/items/manage", (req, res) => {
  mongoose.connect(process.env.mongoURL);
  products
    .aggregate([
      { $match: { sellerId: parseInt(req.body.id) } },
      {
        $lookup: {
          from: "accounts",
          localField: "buyerId",
          foreignField: "id",
          as: "buyerName",
        },
      },
    ])
    .then((docs) => {
      res.send(docs);
      mongoose.connection.close();
    });
});

// api GET method (get all items) - /api/items/all
router.get("/items/all", function (req, res) {
  mongoose.connect(process.env.mongoURL);
  products
    .aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "sellerId",
          foreignField: "id",
          as: "sellerName",
        },
      },
    ])
    .then((docs) => {
      res.send(docs);
      mongoose.connection.close();
    });
});

// api GET method (get single item) - /api/item/123
router.route("/item/:pid").get((req, res) => {
  mongoose.connect(process.env.mongoURL);
  products
    .aggregate([
      { $match: { pid: parseInt(req.params.pid) } },
      {
        $lookup: {
          from: "accounts",
          localField: "sellerId",
          foreignField: "id",
          as: "sellerName",
        },
      },
    ])
    .then((docs) => {
      res.send(docs);
      mongoose.connection.close();
    });
});

// api GET method delete (delete single item) - /api/item/delete/123
router.route("/item/delete/:pid").get((req, res) => {
  mongoose.connect(process.env.mongoURL);
  products.find({ pid: parseInt(req.params.pid) }).remove((err) => {
    if (err) {
      res.status(201).send();
      mongoose.connection.close();
      throw err;
    }
    res.status(200).send();
    mongoose.connection.close();
  });
});

// api POST method for set the buyerId in product - /api/item/setBuyer
router.post("/item/setBuyer", (req, res) => {
  mongoose.connect(process.env.mongoURL);
  products.findOneAndUpdate({pid: parseInt(req.body.productId)}, {buyerId: parseInt(req.body.buyerId)}).then(()=>{
    res.status(200).send();
    mongoose.connection.close();
  });
});

// api POST method (post single item) - /api/item/
const post_item = require("./post_item");
router.use("/item", post_item);

// api GET method (get item's image) - /api/image/123.jpg
router.get("/image/:img", (req, res) => {
  res.sendFile(__dirname + `/data/image/${req.params.img}`);
});

module.exports = router;
