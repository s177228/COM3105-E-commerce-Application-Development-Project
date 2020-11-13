window.addEventListener("DOMContentLoaded", (evt) => {
  setTimeout(() => {
    loadAllMessages();
  }, 100);
  socket.on("refresh", () => {
    setTimeout(() => {
      loadAllMessages();
    }, 100);
    console.log("refresh");
  });
});

var current_room = null;

const loadAllMessages = () => {
  const inboxMenuList = document.querySelector("#inbox-menu ul");
  const inboxRoomList = document.querySelector("#inbox-rooms");

  fetch("/api/messages/getAllMessage")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // console.log(res[0].productId);
      console.log(res);

      const messagesResult = res;

      if (messagesResult != null) {
        fetch("/api/account/whoAmI")
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            const userId = res;
            const chatrooms = new Map();

            // console.log(userId);

            messagesResult.forEach((message) => {
              if (!chatrooms.has(message.chatroomId)) {
                const chatroomMessages = new Map();
                chatrooms.set(message.chatroomId, chatroomMessages);
              }

              const chatroomMessages = chatrooms.get(message.chatroomId);

              const chatroomMessage = new Map();

              chatroomMessage.set("chatroomId", message.chatroomId);
              chatroomMessage.set("productId", message.productId);
              chatroomMessage.set("productName", message.productName[0].name);
              chatroomMessage.set("senderId", message.senderId);
              chatroomMessage.set("sellerId", message.sellerId);
              chatroomMessage.set("sellerName", message.sellerName[0].account);
              chatroomMessage.set("buyerId", message.buyerId);
              chatroomMessage.set("buyerName", message.buyerName[0].account);
              chatroomMessage.set("content", message.content);
              chatroomMessage.set("dateTime", message.createdAt);
              chatroomMessage.set("isItemSold", message.productName[0].buyerId != null);

              chatroomMessages.set(chatroomMessages.size, chatroomMessage);
            });

            //print the chatroom
            inboxMenuList.innerHTML = "";
            inboxRoomList.innerHTML = "";

            console.log(chatrooms);
            chatrooms.forEach((chatroom) => {
              const productId = chatroom.get(0).get("productId");
              const chatroomId = chatroom.get(0).get("chatroomId");
              const senderId = chatroom.get(0).get("senderId");
              const sellerId = chatroom.get(0).get("sellerId");
              const buyerId = chatroom.get(0).get("buyerId");
              const isItemSold = chatroom.get(0).get("isItemSold");

              // print the message inside room
              let div = document.createElement("div");
              let header = document.createElement("header");
              let opponentId = sellerId;
              let opponentName = chatroom.get(0).get("sellerName");
              let productName = chatroom.get(0).get("productName");
              console.log(chatroom.get(0));
              if (userId == sellerId) {
                opponentId = buyerId;
                opponentName = chatroom.get(0).get("buyerName");
              }

              let headerText = document.createElement("headerText");
              let headerTextRaw = `Product: ${productName} | Chat: ${opponentName}`;
              //check if the product is the owner
              if(sellerId == userId){
                headerTextRaw = ` *Product Owner* ${headerTextRaw}` ;
              }
              if(isItemSold == true){
                headerTextRaw += ` [SOLD]`;
              }else{
                headerTextRaw += ` [available]`;
              }
              headerText.appendChild(document.createTextNode(headerTextRaw));
              if(isItemSold == false && sellerId == userId){
                let sell_btn = document.createElement("button");
                sell_btn.innerHTML = "sell to this buyer";
                sell_btn.addEventListener("click", ()=>{
                  fetch("/api/item/setBuyer", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      productId: productId,
                      buyerId: buyerId,
                    }),
                  }).then(() => {
                    socket.emit("sent", "sent");
                  });
                });
                headerText.appendChild(sell_btn);
              }
              
              

              let ul = document.createElement("ul");
              let form = document.createElement("form");
              let input = document.createElement("input");
              let inputBtn = document.createElement("input");

              div.classList.add("inbox-room");
              div.setAttribute("id", `room${chatroomId}`);
              input.classList.add("inbox-input");
              input.setAttribute("type", "text");
              inputBtn.classList.add("inbox-btn");
              inputBtn.setAttribute("type", "submit");
              inputBtn.setAttribute("value", "send");
              input.setAttribute("id", `room${chatroomId}input`);
              inputBtn.addEventListener("click", (event) => {
                event.preventDefault();
                // console.log(`room${chatroomId}input`);
                // console.log(input.value);
                fetch("/api/messages/sendMessage", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    productId: productId,
                    senderId: senderId,
                    sellerId: sellerId,
                    buyerId: buyerId,
                    content: input.value,
                  }),
                }).then(() => {
                  socket.emit("sent", "sent");
                });
              });

              header.appendChild(headerText);

              chatroom.forEach((message) => {
                let li = document.createElement("li");
                let spanContent = document.createElement("span");
                let spanContentText = document.createTextNode(
                  message.get("content")
                );
                let spanDateTime = document.createElement("span");
                let spanDateTimeText = document.createTextNode(
                  message.get("dateTime")
                );

                //determine is sent or received message
                if (message.get("senderId") == userId) {
                  li.classList.add("sent-line");
                } else {
                  li.classList.add("received-line");
                }

                li.classList.add("inbox-line");
                spanContent.classList.add("line-content");
                spanContent.classList.add("line-dateTime");

                spanContent.appendChild(spanContentText);
                spanDateTime.appendChild(spanDateTimeText);
                li.appendChild(spanContent);
                li.appendChild(spanDateTime);
                ul.appendChild(li);
              });

              div.appendChild(header);
              div.appendChild(ul);
              form.appendChild(input);
              form.appendChild(inputBtn);
              div.appendChild(form);
              inboxRoomList.appendChild(div);

              // <div class="inbox-room">
              //                     <header>to product 1 owner</header>
              //                     <ul>
              //                         <li class="sent-line inbox-line">
              //                             <span class="line-content">hi I want this</span>
              //                             <span class="line-dateTime">00:00</span>
              //                         </li>
              //                         <li class="received-line inbox-line">
              //                             <span class="line-content">sold out la</span>
              //                             <span class="line-dateTime">00:01</span>
              //                         </li>
              //                     </ul>
              //                     <form>
              //                         <input class="inbox-input" type="text">
              //                         <input class="inbox-send-btn" type="submit" value="send"></input>
              //                     </form>
              //                 </div>

              //print the room btn
              let li = document.createElement("li");
              let span = document.createElement("span");
              let spanText = document.createTextNode(
                `Product: ${productName} | ${opponentName}`
              );
              span.appendChild(spanText);
              span.classList.add("inbox-title");
              li.appendChild(span);
              li.id = `menu${chatroomId}`;
              inboxMenuList.appendChild(li);

              li.addEventListener("click", (event) => {
                //display corresponding chatroom
                document.querySelectorAll(".inbox-room").forEach((room) => {
                  room.classList.remove("visible-room");
                });
                document
                  .querySelector(`#room${chatroomId}`)
                  .classList.add("visible-room");
                document
                  .querySelector(`#room${chatroomId}`)
                  .querySelector("ul")
                  .scrollTo(0, 10000);
                document.querySelector(`#room${chatroomId}input`).select();
                current_room = chatroomId;
              });

              if (current_room != null) {
                console.log(current_room);
                setTimeout(() => {
                  document.querySelector(`#menu${current_room}`).click();
                }, 10);
              }

              // inboxMenuList.innerHTML = `
              //     <li>
              //         <span class="inbox-title">${}</span>
              //     </li>
              // `;
            });

            // checkRoomStatus(res => {
            //     if (res.isRoomOpen == null && res.currentRoom == null) {
            //         document.querySelector(".inbox-room").classList.add("visible-room");
            //         updateRoomStatus();
            //     } else {
            //         console.log("room is open: " + res.isRoomOpen);
            //         if (res.isRoomOpen == "flase") {
            //             document.querySelector("#inbox-div").classList.add("visible-inbox-div");
            //         }

            //         console.log(res);
            //         // document.querySelector(`#${res.currentRoomId}`).classList.add("visible-room");
            //     }
            // });
          });
      }
    });
};

const updateRoomStatus = () => {
  //update room status
  let isRoomOpen = "false";
  let currentRoomId = null;

  if (
    document.querySelector("#inbox-div").classList.contains("visible-inbox-div")
  ) {
    isRoomOpen = "true";
  }
  const currentRoom = document.querySelector(".visible-room");
  if (currentRoom != null) {
    currentRoomId = currentRoom.id;
  }

  console.log(isRoomOpen);
  console.log(currentRoomId);

  fetch("/api/messages/inboxStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isRoomOpen: isRoomOpen,
      currentRoomId: currentRoomId,
    }),
  });
};

const checkRoomStatus = (callback) => {
  fetch("/api/messages/inboxStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isRoomOpen: null,
      currentRoomId: null,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // console.log(res);
      callback(res);
    });
};
