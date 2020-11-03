const mongoose = require('mongoose');
const { send } = require('process');
const keys = require('./keys');
const express = require('express');
const router = express.Router();

// router.route("/messages/sendMessage").get((req, res) => {
//     if (req.signedCookies.id && req.signedCookies.account && req.signedCookies.password) {

//     }
// });

// router.route("/messages/getAllMessage").get((req, res) => {
//     getAllMessages(1, (docs) => {
//         res.send(docs);
//     });
// });

router.route("/messages/getAllMessage").get((req, res) => {
    console.log(req.signedCookies.id);
    if (req.signedCookies.id != null && req.signedCookies.account != null && req.signedCookies.password != null) {
        getAllMessages(req.signedCookies.id, (docs) => {
            // console.log("fetching");
            console.log(docs);
            res.send(docs);
        });
    }

});


const messagesSchema = new mongoose.Schema({
    "chatroomId": Number,
    "productId": Number,
    "sellerId": Number,
    "buyerId": Number,
    "senderId": Number,
    "content": String
}, {
    timestamps: true
});

const messages = mongoose.model('messages', messagesSchema);

const sendMessage = (productId, sellerId, buyerId, senderId, content) => {
    mongoose.connect(keys.mongoURL);

    let chatroomId = 0;

    messages.exists({ $and: [{ productId: productId }, { sellerId: sellerId }, { buyerId: buyerId }] }, (err, res) => {
        if (err) {
            res.status(201).send({ msg: "db error" });
        } else {
            if (!res) {
                messages.findOne({}).sort('-chatroomId').exec((err, docs) => {
                    if (err) {
                        res.status(201).send({ msg: "id incurement error" });
                    } else {
                        if (docs != null) {
                            chatroomId = docs.chatroomId + 1;
                        }
                        messages.create({
                            "chatroomId": chatroomId,
                            "productId": productId,
                            "sellerId": sellerId,
                            "buyerId": buyerId,
                            "senderId": senderId,
                            "content": content,
                        }, () => {
                            mongoose.connection.close();
                        });
                    }
                });
            } else {
                messages.findOne({ $and: [{ productId: productId }, { sellerId: sellerId }, { buyerId: buyerId }] }, (err, res) => {
                    if (err) {
                        res.status(201).send({ msg: "id incurement error" });
                    } else {
                        chatroomId = res.chatroomId;
                        messages.create({
                            "chatroomId": chatroomId,
                            "productId": productId,
                            "sellerId": sellerId,
                            "buyerId": buyerId,
                            "senderId": senderId,
                            "content": content,
                        }, () => {
                            mongoose.connection.close();
                        });
                    }
                });
            }

        }
    });



};

const getAllMessages = (userId, callback) => {
    mongoose.connect(keys.mongoURL);

    messages.find({
        $or: [{ sellerId: userId }, { buyerId: userId }]
    }).then((docs) => {
        // console.log(result);

        mongoose.connection.close();
        callback(docs);
        // return docs;
    });
}

// sendMessage(1, 1, 2, 1, "hello from 1");
// sendMessage(1, 1, 2, 2, "hello from 2");
// sendMessage(1, 1, 2, 1, "hello from 1");
// sendMessage(11, 3, 4, 4, "10 hello from 4");
// sendMessage(10, 3, 4, 3, "10 hello from 3");
// sendMessage(10, 3, 4, 3, "10 hello from 3");
// sendMessage(10, 3, 4, 4, "10 hello from 4");


module.exports = router;