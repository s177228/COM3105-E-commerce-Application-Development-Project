const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./router/data/db.json");

var upload_error = false;
// setting the multer for upload image and handle ext
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./router/data/image/");
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    upload_error = false;
    var ext = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    if (!ext.includes(file.mimetype)) {
      upload_error = true;
    }

    console.log(`upload error: ${upload_error}`);
    return upload_error ? cb(null, false) : cb(null, true);
  },
});

// api POST method (post single item) - /api/item/
router.post("/", upload.single("fileToUpload"), (req, res) => {
  data = JSON.parse(JSON.stringify(req.body, null, 2));
  console.log(data, req.file);
  if (req.file == null || upload_error) {
    if (upload_error) {
      res.status(201).send({ msg: "not this file type" });
    } else {
      res.status(201).send({ msg: "no image" });
    }
  } else {
    if (
      data.sellerId == null ||
      data.name == null ||
      data.price == null ||
      data.desc == null ||
      data.detail == null
    ) {
      res.status(201).send({ msg: "some slot are empty!" });
    } else {
      const db = low(adapter);
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
      fs.rename(
        `./router/data/image/${req.file.filename}`,
        `./router/data/image/POST${db.get("items").new_id().value()}-${
          req.file.filename
        }`,
        (err) => console.log(err)
      );
      db.get("items")
        .push({
          id: db.get("items").new_id().value(),
          sellerId: req.body.sellerId,
          name: req.body.name,
          price: req.body.price,
          img: `POST${db.get("items").new_id().value()}-${req.file.filename}`,
          desc: req.body.desc,
          detail: req.body.detail,
          buyerId: null,
        })
        .write();
      res.status(200).send({ msg: "posted!" });
    }
  }
});

module.exports = router;
