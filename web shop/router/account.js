const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const mongoose = require('mongoose');
const mongoURL = `${process.env.mongoURL}`;

const accountsSchema = new mongoose.Schema({
    "id": Number,
    "account": String,
    "password": String,
    "email": String
}, {
    timestamps: true
});

const accounts = mongoose.model('accounts', accountsSchema);

router.route("/account/login").post((req, res) => {
    // const db = low(adapter);
    // if (db.get("account").find({ account: req.body.account }).value() == null) {
    //   res.status(201).send({ msg: "account not exist!" });
    // } else {
    //   password = db.get("account").find({ account: req.body.account }).value()
    //     .password;
    //   if (!bcrypt.compareSync(req.body.password, password)) {
    //     res.status(201).send({ msg: "password is incorrect!" });
    //   } else {
    //     res.status(200).send({ msg: "login!" });
    //   }
    // }
    mongoose.connect(mongoURL);

    const account = req.body.account;
    const password = req.body.password;

    accounts.exists({ account: account }, (err, result) => {
        if (err) {
            res.status(201).send({ msg: "db error" });
        } else {
            if (!result) {
                res.status(201).send({ msg: "account do not exist" });
            } else {
                accounts.findOne({ account: account }, (err, docs) => {
                    if (err) {
                        res.status(201).send({ msg: "db error" });
                    } else {
                        if (!bcrypt.compareSync(password, docs.password)) {
                            res.status(201).send({ msg: "incorrect password" });
                        } else {
                            res.status(200).send({ msg: "login" });
                        }
                    }
                });
            }
        }
    });
});

router.route("/account/register").post((req, res) => {
    const account = req.body.account;
    const password = bcrypt.hashSync(req.body.password, saltRounds);
    const email = req.body.email;
    var id = 0;

    if (
        req.body.account == null ||
        req.body.password == null ||
        req.body.email == null
    ) {
        res.status(201).send({ msg: "some slot are empty." });
    } else {
        accounts.exists({ account: account }, (err, result) => {
            if (err) {
                res.status(201).send({ msg: "db error" });
            } else {
                if (result) {
                    console.log("account already exists");
                } else {
                    accounts.findOne({}).sort('-id').exec((err, docs) => {
                        if (err) {
                            res.status(201).send({ msg: "id incurement error" });
                        } else {
                            if (docs != null) {
                                id = docs.id + 1;
                            }
                            accounts.create({
                                "id": id,
                                "account": account,
                                "password": password,
                                "email": email
                            }, () => {
                                res.status(200).send({ msg: "account created" });
                                mongoose.connection.close();
                            });
                        }
                    });
                }
            }
        });
    }

    // if (
    //     req.body.account == null ||
    //     req.body.password == null ||
    //     req.body.email == null
    // ) {
    //     res.status(201).send({ msg: "some slot are empty." });
    // } else {
    //     signUpDate = new Date();
    //     const db = low(adapter);

    //     if (db.get("account").find({ account: account }).value() != null) {
    //         res.status(201).send({ msg: "account exist!" });
    //     } else {
    //         // Add find max id + 1 function on db
    //         db._.mixin({
    //             new_id: function(array) {
    //                 id = 0;
    //                 array.forEach((element) => {
    //                     id < element.id ? (id = element.id) : null;
    //                 });
    //                 return id + 1;
    //             },
    //         });
    //         db.get("account")
    //             .push({
    //                 id: db.get("account").new_id().value(),
    //                 account: account,
    //                 password: password,
    //                 email: email,
    //                 signUpDate: signUpDate,
    //             })
    //             .write();
    //         res.status(200).send({ msg: "posted!" });
    //     }
    // }
});



// const test = (ac, pw, em) => {
//     mongoose.connect(keys.mongoURL);

//     const account = ac;
//     const password = bcrypt.hashSync(pw, saltRounds);
//     const email = em;
//     var id = 0;

//     accounts.exists({ account: account }, (err, result) => {
//         if (err) {} else {
//             if (result) {
//                 console.log("account already exists");
//             } else {
//                 accounts.findOne({}).sort('-id').exec((err, docs) => {
//                     if (err) {
//                         console.log("error of increment");
//                     } else {
//                         if (docs != null) {
//                             id = docs.id + 1;
//                         }
//                         accounts.create({
//                             "id": id,
//                             "account": account,
//                             "password": password,
//                             "email": email
//                         }, () => {
//                             console.log("success");
//                             mongoose.connection.close();
//                         });
//                     }
//                 });
//             }
//         }
//     });

// }

// test("abcde", "12345", "abc@gmail.com");

// const test2 = (ac, pw) => {
//     mongoose.connect(keys.mongoURL);

//     const account = ac;
//     const password = pw;

//     accounts.exists({ account: account }, (err, result) => {
//         if (err) {
//             console.log("db error");
//         } else {
//             if (!result) {
//                 console.log("account not exist!");
//             } else {
//                 accounts.findOne({ account: account }, (err, docs) => {
//                     if (err) {
//                         console.log("db error");
//                     } else {
//                         if (!bcrypt.compareSync(password, docs.password)) {
//                             console.log("incorrect password");
//                         } else {
//                             console.log("login!");
//                         }
//                     }
//                 });
//             }
//         }
//     });
// }

// test2("abcdedsds", "s");


module.exports = router;