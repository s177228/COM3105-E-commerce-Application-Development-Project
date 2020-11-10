const mongoose = require("mongoose");
const { send } = require("process");
const express = require("express");
const router = express.Router();

router.route("/messages/inboxStatus").post((req, res) => {
  if (
    req.signedCookies.isRoomOpen == null &&
    req.signedCookies.curentRoomId == null
  ) {
    res.cookie("isRoomOpen", req.body.isRoomOpen, { signed: true });
    res.cookie("curentRoomId", req.body.currentRoomId, { signed: true });
  }
  // console.log(req.body);
  if (req.body.isRoomOpen == null && req.body.currentRoomId == null) {
    res.send(
      JSON.stringify({
        isRoomOpen: req.signedCookies.isRoomOpen,
        currentRoomId: req.signedCookies.currentRoomId,
      })
    );
    console.log(req.signedCookies.isRoomOpen);
    console.log(req.signedCookies.currentRoomId);
  } else {
    res.cookie("isRoomOpen", req.body.isRoomOpen, { signed: true });
    res.cookie("curentRoomId", req.body.currentRoomId, { signed: true });
    res.send(
      JSON.stringify({
        isRoomOpen: req.body.isRoomOpen,
        currentRoomId: req.body.currentRoomId,
      })
    );
  }
});

router.route("/messages/sendMessage").post((req, res) => {
  if (
    req.signedCookies.id &&
    req.signedCookies.account &&
    req.signedCookies.password
  ) {
    const productId = req.body.productId;
    const sellerId = req.body.sellerId;
    const buyerId = req.body.buyerId;
    const senderId = req.signedCookies.id;
    const content = req.body.content;

    console.log(`${sellerId} sell to ${buyerId}, messages from ${senderId}`);

    if (sellerId != senderId && buyerId != senderId) {
      res.status(201).send({ msg: "it seems you are a hacker" });
    } else {
      sendMessage(productId, sellerId, buyerId, senderId, content, res);
      res.status(200).send({ msg: "message sent" });
    }
  }
});

router.route("/messages/getAllMessage").get((req, res) => {
  // console.log(req.signedCookies.id);
  if (
    req.signedCookies.id != null &&
    req.signedCookies.account != null &&
    req.signedCookies.password != null
  ) {
    getAllMessages(req.signedCookies.id, (docs) => {
      // console.log("fetching");
      // console.log(docs);
      res.send(docs);
    });
  }
});

const messagesSchema = new mongoose.Schema(
  {
    chatroomId: Number,
    productId: Number,
    sellerId: Number,
    buyerId: Number,
    senderId: Number,
    content: String,
  },
  {
    timestamps: true,
  }
);

const messages = mongoose.model("messages", messagesSchema);

const sendMessage = (productId, sellerId, buyerId, senderId, content, res) => {
  mongoose.connect(process.env.mongoURL);

  let chatroomId = 0;

  messages.exists(
    {
      $and: [
        { productId: productId },
        { sellerId: sellerId },
        { buyerId: buyerId },
      ],
    },
    (err, result) => {
      if (err) {
        res.status(201).send({ msg: "db error" });
      } else {
        if (!result) {
          messages
            .findOne({})
            .sort("-chatroomId")
            .exec((err, docs) => {
              if (err) {
                res.status(201).send({ msg: "id incurement error" });
              } else {
                if (docs != null) {
                  chatroomId = docs.chatroomId + 1;
                }
                messages.create(
                  {
                    chatroomId: chatroomId,
                    productId: productId,
                    sellerId: sellerId,
                    buyerId: buyerId,
                    senderId: senderId,
                    content: content,
                  },
                  () => {
                    mongoose.connection.close();
                  }
                );
              }
            });
        } else {
          messages.findOne(
            {
              $and: [
                { productId: productId },
                { sellerId: sellerId },
                { buyerId: buyerId },
              ],
            },
            (err, docs) => {
              if (err) {
                res.status(201).send({ msg: "id incurement error" });
              } else {
                chatroomId = docs.chatroomId;
                messages.create(
                  {
                    chatroomId: chatroomId,
                    productId: productId,
                    sellerId: sellerId,
                    buyerId: buyerId,
                    senderId: senderId,
                    content: content,
                  },
                  () => {
                    mongoose.connection.close();
                  }
                );
              }
            }
          );
        }
      }
    }
  );
};

const getAllMessages = (userId, callback) => {
  mongoose.connect(process.env.mongoURL);
  userId = parseInt(userId);
  messages.aggregate(
    [
      {
        $match: {
          $or: [{ sellerId: userId }, { buyerId: userId }],
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "sellerId",
          foreignField: "id",
          as: "sellerName",
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "buyerId",
          foreignField: "id",
          as: "buyerName",
        },
      },
    ],
    (err, docs) => {
      console.log(docs);

      mongoose.connection.close();
      callback(docs);
      // return docs;
    }
  );
};

// sendMessage(1, 1, 2, 1, "hello from 1");
// sendMessage(1, 1, 2, 2, "hello from 2");
// sendMessage(1, 1, 2, 1, "hello from 1");
// sendMessage(10, 3, 4, 4, "10 hello from 4");
// sendMessage(10, 3, 4, 3, "10 hello from 3");
// sendMessage(10, 3, 4, 3, "10 hello from 3");
// sendMessage(10, 3, 4, 4, "10 hello from 4");
// sendMessage(1, 1, 5, 1, "hello from 1");
// sendMessage(1, 1, 5, 5, "hello from 5");
// sendMessage(1, 1, 5, 1, "hello from 1");
// sendMessage(100, 1, 6, 6, "hello from 6");
// sendMessage(100, 1, 6, 1, "hello from 1");
// sendMessage(100, 1, 6, 1, "hello from 1");

module.exports = router;
