const mongoose = require('mongoose');
const { send } = require('process');
const keys = require('./keys');

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

const getAllMessage = (userId, callback) => {
    mongoose.connect(keys.mongoURL);

    messages.find({
        $or: [{ sellerId: userId }, { buyerId: userId }]
    }).then((result) => {
        // console.log(result);

        mongoose.connection.close();
        callback(result);
    });
}

// sendMessage(10, 1, 2, 1, "hello from 1")
// sendMessage(10, 1, 2, 2, "hello from 2")
// sendMessage(10, 3, 4, 4, "hellofrom 4")
// getAllMessage(3);

module.exports = { sendMessage, getAllMessage };