const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

// view engine
app.set("view engine", "ejs");
//middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// database (lowdb)
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");
const db = low(adapter);
db.defaults({ items: [], account: [], chat: [] }).write();


// public view
// define the home page route
app.use(express.static(__dirname + "/public"));

// use ejs view engine render /
const index = require("./view/index");
app.use("/", index)
// use ejs view engine render /product/pid/:pid
const product = require("./view/product");
app.use("/product", product)

// router
// item
const item = require("./router/item");
app.use("/api", item);
// account
const account = require("./router/account");
app.use("/api", account);

// app listening on port
app.listen(port, function() {
    console.log("Express app started on " + port);
});