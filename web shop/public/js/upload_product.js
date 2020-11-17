window.addEventListener("DOMContentLoaded", (evt) => {
    init_button();
    hideOrShow();
  });
  
  const init_button = () => {
    const logo = document.querySelector("#logo");
    const logout_button = document.getElementById("logout-btn");
    const inbox_btn = document.querySelector("#inbox-btn");
  
    logo.addEventListener("click", () => {
      document.location.href = "/";
    });
  
    logout_button.addEventListener("click", () => {
      logout();
    });
    inbox_btn.addEventListener("click", () => {
      change_inbox();
    });
  
    const logout = () => {
      fetch("../../api/account/logout").then((res) => {
        res.status == 200 ? (document.location.href = "/") : null;
      });
    };
  };
  
  const hideOrShow = () => {
    fetch("../../api/account/myAccount")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const accountSpan = document.createElement("span");
        const accountSpanText = document.createTextNode("Hi, " + res.account);
        accountSpan.appendChild(accountSpanText);
        document.querySelector("div.buttons").prepend(accountSpan);
      });
    if (document.querySelector("#sellerId") != null) {
      fetch("../../api/account/whoAmI")
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          document.querySelector("#sellerId").value = res;
          const sellerId = parseInt(
            document.querySelector("#sellerId").innerHTML
          );
  
          if (res == sellerId) {
            const init_inbox_btn = document.querySelector("#init-inbox-btn");
            init_inbox_btn.parentNode.removeChild(init_inbox_btn);
          }
        });
    }
  };
  
  const change_inbox = () => {
    const inboxDiv = document.getElementById("inbox-div");
    if (inboxDiv.classList.contains("visible-inbox-div")) {
      inboxDiv.classList.remove("visible-inbox-div");
    } else {
      inboxDiv.classList.add("visible-inbox-div");
    }
  };
  
  const init_inbox = () => {
    const pid = parseInt(document.querySelector("#pid").innerHTML);
    const sellerId = parseInt(document.querySelector("#sellerId").innerHTML);
    fetch("/api/account/whoAmI")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        fetch("../../api/messages/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: pid,
            senderId: res,
            sellerId: sellerId,
            buyerId: res,
            content: "hi",
          }),
        }).then(() => {
          socket.emit("sent", "sent");
        });
      });
  };
  