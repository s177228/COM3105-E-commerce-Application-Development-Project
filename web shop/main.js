const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

const all_items = require('./router/api/all_items');
app.use("/api", all_items);

app.listen(port, function () {
  console.log("Express app started on " + port);
});
