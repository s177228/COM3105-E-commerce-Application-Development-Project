const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");

router.get("/pid/:pid", (req, res) => {
  const db = low(adapter);
  console.log(db
    .get("items")
    .find({ id: parseInt(req.params.pid) })
    .value());
  res.render(
    __dirname + "/ejs/view_product",
    db
      .get("items")
      .find({ id: parseInt(req.params.pid) })
      .value()
  );
});

module.exports = router;
