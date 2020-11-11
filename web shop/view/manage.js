const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  fetch(`http://localhost:3000/api/items/manage`, {
    method: "post",
    body: JSON.stringify({id: req.signedCookies.id}),
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.text())
    .then((body) => {
      res.render(__dirname + "/ejs/view_manage.ejs", { data: JSON.parse(body) });
    });
});

module.exports = router;
