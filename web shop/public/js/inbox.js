window.addEventListener("DOMContentLoaded", (evt) => {
    loadAllMessages();
});


const loadAllMessages = () => {
    const inboxMenuList = document.querySelector("#inbox-menu ul");
    const inboxRoomList = document.querySelector("#inbox-room ul");

    fetch("/api/messages/getAllMessage")
        .then(res => { return res.json() })
        .then((res) => {
            // console.log(res[0].productId);
            console.log(res);

            const chatrooms = new Map();

            res.forEach(message => {
                if (!chatrooms.has(message.productId)) {
                    const chatroomMessages = new Map();
                    chatrooms.set(message.productId, chatroomMessages);
                }

                const chatroomMessages = chatrooms.get(message.productId)

                const chatroomMessage = new Map();
                chatroomMessage.set("senderId", message.senderId);
                chatroomMessage.set("sellerId", message.sellerId);
                chatroomMessage.set("buyerId", message.buyerId);
                chatroomMessage.set("content", message.content);
                chatroomMessage.set("time", message.createdAt);


                chatroomMessages.set(chatroomMessages.size, chatroomMessage);
            });
            console.log(chatrooms);






        });
}