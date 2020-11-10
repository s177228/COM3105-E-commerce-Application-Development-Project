const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
    fetch(`http://localhost:3000/api/items/all`)
        .then((data) => data.text())
        .then((body) => {
            res.render(__dirname + "/ejs/view_index", { data: JSON.parse(body) });
        });
});

module.exports = router;