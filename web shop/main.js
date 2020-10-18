const express = require("express");
const { get } = require("./router/api/all_items");
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));

const all_items = require('./router/api/all_items');
app.use("/api", all_items);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get('/product', (req, res) => {
    res.sendFile(__dirname + "/public/product.html");
})

app.listen(port, function() {
    console.log("Express app started on " + port);
});