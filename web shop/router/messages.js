const mongoose = require('mongoose');
const { send } = require('process');
const keys = require('./keys');
const express = require('express');
const router = express.Router();

// router.route("/messages/sendMessage").post((req, res) => {
//     if (req.signedCookies.id && req.signedCookies.account && req.signedCookies.password) {

//     }
// });

// router.route("/messages/getAllMessage").post(
//     (req, res) => {
//         if (req.signedCookies.id && req.signedCookies.account && req.signedCookies.password) {
//             const id = req.signedCookies.id;
//             res.send.getAllMessage(id);
//         }
//     }
// );
router.route("/messages/getAllMessage").get((req, res) => {
    getAllMessages(1, (docs) => {
        res.send(docs);
    });

});

const messagesSchema = new mongoose.Schema({
    "productId": Number,
    "sellerId": Number,
    "buyerId": Number,
    "senderId": Number,
    "content": String,
}, {
    timestamps: true
});

const messages = mongoose.model('messages', messagesSchema);

const sendMessage = (productId, sellerId, buyerId, senderId, content) => {
    mongoose.connect(keys.mongoURL);

    messages.create({
        "productId": productId,
        "sellerId": sellerId,
        "buyerId": buyerId,
        "senderId": senderId,
        "content": content,
    }, () => {
        mongoose.connection.close();
    });
}

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

// sendMessage(10, 1, 2, 1, "hello from 1")
// sendMessage(10, 1, 2, 2, "hello from 2")
// sendMessage(10, 3, 4, 4, "hellofrom 4")
// getAllMessage(3);

module.exports = router;