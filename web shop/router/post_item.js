const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
var mkdirp = require("mkdirp");

const products = mongoose.model("products");

var dir = "./router/data/image/";

if (!fs.existsSync(dir)) {
  mkdirp(dir);
}

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
  mongoose.connect(process.env.mongoURL);

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
      products
        .findOne({})
        .sort("-pid")
        .exec((err, docs) => {
          if (err) {
            res.status(201).send({ msg: "id incurement error" });
          } else {
            if (docs != null) {
              id = docs.pid + 1;
            } else {
              id = 1;
            }

            fs.rename(
              `./router/data/image/${req.file.filename}`,
              `./router/data/image/POST${id}-${req.file.filename}`,
              (err) => console.log(err)
            );

            products.create(
              {
                pid: id,
                sellerId: req.body.sellerId,
                name: req.body.name,
                price: req.body.price,
                img: `POST${id}-${req.file.filename}`,
                desc: req.body.desc,
                detail: req.body.detail,
                buyerId: null,
              },
              (err) => {
                err ? console.log(err) : null;
                res.status(200).send({ msg: "posted!" });
              }
            );
          }
        });
    }
  }
});

module.exports = router;
