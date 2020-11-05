const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/pid/:pid", (req, res) => {
  fetch(`http://localhost:3000/api/item/${req.params.pid}`)
    .then((data) => data.text())
    .then((body) => {
      res.render(__dirname + "/ejs/view_product", { data: JSON.parse(body) });
    });
});

module.exports = router;
