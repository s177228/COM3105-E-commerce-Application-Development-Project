const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const mongoose = require("mongoose");
const adapter = new FileSync("./router/data/db.json");

const productsSchema = new mongoose.Schema({
    "pid": Number,
    "sellerId": Number,
    "name": String,
    "price": Number,
    "img": String,
    "desc": String,
    "detail": String,
    "buyerId": Number
}, {
    timestamps: true
});

const products = mongoose.model('products', productsSchema);

// api GET method (get all items) - /api/items/all
router.get("/items/all", function(req, res) {
    // const db = low(adapter);
    // res.send({
    //   body: db.get("items").value(),
    // });
    products.find({}, (err, docs) => {
        res.send(docs);
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