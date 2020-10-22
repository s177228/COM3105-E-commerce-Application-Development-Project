const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

//middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// public view
// define the home page route
app.use(express.static(__dirname + "/public"));
app.get("/product", (req, res) => {
  res.sendFile(__dirname + "/public/product.html");
});

// database (lowdb)
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");
const db = low(adapter);
db.defaults({ items: [] }).write();

// router
// item
const item = require("./router/item");
app.use("/api", item);
// account
const account = require("./router/account");
app.use("/api", account);

// app listening on port
app.listen(port, function () {
  console.log("Express app started on " + port);
});
