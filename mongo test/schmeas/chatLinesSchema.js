const { mongo, Mongoose } = require("mongoose");

const mongoose = require('mongoose');

const chatLinesSchema = new mongoose.Schema({
    "priductId": Number,
    "buyerId": Number,
    "senderId": Number,
    "content": String,
}, {
    timestamps: true
});

module.exports = chatLinesSchema;