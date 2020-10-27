const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");

router.get("/", (req, res) => {
  const db = low(adapter);
  res.render(__dirname + "/ejs/view_index", { data: db.get("items").value() });
});

module.exports = router;
