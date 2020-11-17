const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
    res.render(__dirname + "/ejs/view_donate");
});

module.exports = router;