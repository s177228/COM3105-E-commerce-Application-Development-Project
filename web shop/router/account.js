const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");

router.route("/account/login").post((req, res) => {
  const db = low(adapter);
  if (db.get("account").find({ account: req.body.account }).value() == null) {
    res.status(201).send({ msg: "account not exist!" });
  } else {
    password = db.get("account").find({ account: req.body.account }).value()
      .password;
    if (!bcrypt.compareSync(req.body.password, password)) {
      res.status(201).send({ msg: "password is incorrect!" });
    } else {
      res.status(200).send({ msg: "login!" });
    }
  }
});

router.route("/account/register").post((req, res) => {
  account = req.body.account;
  password = bcrypt.hashSync(req.body.password, saltRounds);
  email = req.body.email;
  if (
    req.body.account == null ||
    req.body.password == null ||
    req.body.email == null
  ) {
    res.status(201).send({ msg: "some slot are empty." });
  } else {
    signUpDate = new Date();
    const db = low(adapter);

    if (db.get("account").find({ account: account }).value() != null) {
      res.status(201).send({ msg: "account exist!" });
    } else {
      // Add find max id + 1 function on db
      db._.mixin({
        new_id: function (array) {
          id = 0;
          array.forEach((element) => {
            id < element.id ? (id = element.id) : null;
          });
          return id + 1;
        },
      });
      db.get("account")
        .push({
          id: db.get("account").new_id().value(),
          account: account,
          password: password,
          email: email,
          signUpDate: signUpDate,
        })
        .write();
      res.status(200).send({ msg: "posted!" });
    }
  }
});

module.exports = router;
