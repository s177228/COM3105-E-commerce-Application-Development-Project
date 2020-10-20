const express = require("express");
const { get } = require("./router/api/all_items");
const app = express();
const port = 3000;

// public view
// define the home page route
app.use(express.static(__dirname + "/public"));
app.get("/product", (req, res) => {
  res.sendFile(__dirname + "/public/product.html");
});

// database (lowdb)
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/api/data/db.json");
const db = low(adapter);
db.defaults({ items: [] }).write();

// router
const all_items = require("./router/api/all_items");
app.use("/api", all_items);

// app listening on port
app.listen(port, function () {
  console.log("Express app started on " + port);
});
