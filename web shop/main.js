const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = require("http").Server(app);
const io = require("socket.io")(server);

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

// router
// item
const item = require("./router/item");
app.use("/api", item);
// account
app.use(cookieParser("123456789"));
const account = require("./router/account");
app.use("/api", account);

// message
const messages = require("./router/messages");
const { Socket } = require("dgram");
app.use("/api", messages);

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/test.html");
});

// app listening on port
app.listen(port, function () {
  console.log("Express app started on " + port);
});

//socket.io
io.on("connection", (socket) => {
  socket.on("sent", () => {
    console.log("someone sent something");
    setTimeout(() => {
      io.emit("refresh", "refresh");
    }, 100);
  });
});

server.listen(3001);
