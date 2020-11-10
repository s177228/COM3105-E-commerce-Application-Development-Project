window.addEventListener("DOMContentLoaded", (evt) => {
    init_button();
    hideOrShow();
});

const init_button = () => {
    const logo = document.querySelector("#logo");
    const login_button = document.getElementById("login-btn");
    const logout_button = document.getElementById("logout-btn");
    const login_close = document.getElementById("login-close");
    const register_close = document.getElementById("register-close");
    const inbox_btn = document.querySelector("#inbox-btn");
    const register_ui_btn = document.querySelector("#register-ui-btn");
    const login_ui_btn = document.querySelector("#login-ui-btn");
    const init_inbox_btn = document.querySelector("#init-inbox-btn");

    logo.addEventListener("click", () => {
        document.location.href = "/";
    });

    logout_button.addEventListener("click", () => {
        logout();
    });

    login_button.addEventListener("click", () => {
        change_login();
    });
    login_close.addEventListener("click", () => {
        change_login();
    });
    register_close.addEventListener("click", () => {
        change_login();
    });
    inbox_btn.addEventListener("click", () => {
        change_inbox();
    });
    register_ui_btn.addEventListener("click", () => {
        change_login_register();
    });
    login_ui_btn.addEventListener("click", () => {
        change_login_register();
    });
    init_inbox_btn.addEventListener("click", () => {
        init_inbox();
    });

    const login_form = document.getElementById("login_form");
    const register_form = document.getElementById("register_form");

    const logout = () => {
        fetch("../../api/account/logout").then((res) => {
            res.status == 200 ? (document.location.href = "/") : null;
        });
    };

    login_form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        fetch("../../api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account: document.getElementById("login_account").value,
                    password: document.getElementById("login_password").value,
                }),
            })
            .then((res) => {
                if (res.status != 200) {
                    console.log("some error found");
                    return res.json();
                } else {
                    console.log("login done");
                    document.location.reload();
                }
            })
            .then((res) => {
                if (res) {
                    console.log(res);
                    document.getElementById("login_message").innerHTML = res.msg;
                } else {
                    document.getElementById("login_message").innerHTML = "Login Done";
                }
            });
    });

    register_form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        if (
            document.getElementById("register_password").value !=
            document.getElementById("register_confirm_password").value
        ) {
            document.getElementById("register_message").innerHTML =
                "2 password is not the same";
            console.log("2 password is not the same");
        } else {
            fetch("api/account/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        account: document.getElementById("register_account").value,
                        password: document.getElementById("register_password").value,
                        email: "foo@bar.com",
                    }),
                })
                .then((res) => {
                    if (res.status != 200) {
                        console.log("some error found");
                        return res.json();
                    } else {
                        console.log("register done");
                    }
                })
                .then((res) => {
                    if (res) {
                        console.log(res);
                        document.getElementById("register_message").innerHTML = res.msg;
                    } else {
                        document.getElementById("register_message").innerHTML =
                            "Register Done";
                    }
                });
        }
    });
};

const hideOrShow = () => {
    const login_button = document.getElementById("login-btn");
    const logout_button = document.getElementById("logout-btn");
    const inbox_btn = document.querySelector("#inbox-btn");
    const sell_btn = document.querySelector("#sell-btn");

    fetch("../../api/account/myAccount")
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            if (res === false) {
                //not logined
                sell_btn.parentNode.removeChild(sell_btn);
                inbox_btn.parentNode.removeChild(inbox_btn);
                logout_button.parentNode.removeChild(logout_button);
            } else {
                login_button.parentNode.removeChild(login_button);
                const accountSpan = document.createElement("span");
                const accountSpanText = document.createTextNode("Hi, " + res.account);
                accountSpan.appendChild(accountSpanText);
                document.querySelector("div.buttons").prepend(accountSpan);
            }
        });
    if (document.querySelector("#sellerId") != null) {
        fetch("../../api/account/whoAmI")
            .then((res) => {
                return res.json();
            })
            .then((res) => {

                const sellerId = parseInt(document.querySelector("#sellerId").innerHTML);

                if (res == sellerId) {
                    const init_inbox_btn = document.querySelector("#init-inbox-btn");
                    init_inbox_btn.parentNode.removeChild(init_inbox_btn);
                }
            });
    }


    ///
    // fetch("/api/account/myAccount")
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((res) => {
    //         console.log(res);
    //     });
    ///

};

const change_login = () => {
    document.getElementById("login-interface").style.visibility =
        getComputedStyle(document.getElementById("login-interface")).visibility ==
        "hidden" ?
        "visible" :
        "hidden";
};

const change_inbox = () => {
    // document.getElementById("inbox-div").style.visibility =
    //     getComputedStyle(document.getElementById("inbox-div")).visibility ==
    //     "hidden" ?
    //     "visible" :
    //     "hidden";
    const inboxDiv = document.getElementById("inbox-div");
    if (inboxDiv.classList.contains("visible-inbox-div")) {
        inboxDiv.classList.remove("visible-inbox-div");
    } else {
        inboxDiv.classList.add("visible-inbox-div");
    }
    // updateRoomStatus();
};

const change_login_register = () => {
    document.querySelector("#login_form").style.display =
        getComputedStyle(document.getElementById("login_form")).display == "flex" ?
        "none" :
        "flex";

    document.querySelector("#register_form").style.display =
        getComputedStyle(document.getElementById("register_form")).display == "none" ?
        "flex" :
        "none";
};

const init_inbox = () => {
    const pid = parseInt(document.querySelector("#pid").innerHTML);
    const sellerId = parseInt(document.querySelector("#sellerId").innerHTML);
    fetch("/api/account/whoAmI")
        .then(res => { return res.json() })
        .then(res => {
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
                    content: "hi"
                })
            }).then(() => {
                socket.emit("sent", "sent");
            });
        });
}