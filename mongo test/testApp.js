// const mongoose = require('mongoose');
// const keys = require('./keys');

// mongoose.connect(keys.mongoURL);

// var Schema = mongoose.Schema;

// let testSchmea = new Schema({
//     a: Number,
//     b: String,
// }, { timestamps: true });

// const Test = mongoose.model('Test', testSchmea);

// const object1 = new Test({
//     a: 123,
//     b: "abc"
// });

// const object2 = new Test({
//     a: 456,
//     b: "def"
// });

// Test.insertMany([object1, object2]);

const messages = require('./messages');

// messages.sendMessage(1, 1, 2, 2, "from testApp.js");
messages.getAllMessage(2, (result) => { console.log(result[0].productId) });