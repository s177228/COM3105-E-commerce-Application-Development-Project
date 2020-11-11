const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(cookieParser("123456789"));
// view engine
app.set("view engine", "ejs");
//middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// public view
// define the home page route
app.use(express.static(__dirname + "/public"));

// use ejs view engine render /
const index = require("./view/index");
app.use("/", index);
// use ejs view engine render /product/pid/:pid
const product = require("./view/product");
app.use("/product", product);
// use ejs view engine render /upload_product
const upload_product = require("./view/upload_product");
app.use("/upload_product", upload_product);
// use ejs view engine render /manage
const manage = require("./view/manage");
app.use("/manage", manage);

// router
// item
const item = require("./router/item");
app.use("/api", item);
// account
const account = require("./router/account");
app.use("/api", account);

// message
const messages = require("./router/messages");
const { Socket } = require("dgram");
app.use("/api", messages);

app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/public/test.html");
});

//socket.io
io.on("connection", (socket) => {
    console.log("some one is connected")
    socket.on("message", (message) => {
        console.log(message);
    });

    socket.on("sent", () => {
        console.log("someone sent something");
        setTimeout(() => {
            io.emit("refresh", "refresh");
        }, 100);
    });
});

// http listening on port
http.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});