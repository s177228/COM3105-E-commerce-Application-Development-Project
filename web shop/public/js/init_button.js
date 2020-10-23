window.addEventListener("DOMContentLoaded", (evt) => {
    init_button();
});

const init_button = () => {
    const logo = document.querySelector("#logo");
    const login_button = document.getElementById("login-btn");
    const login_close = document.getElementById("login-close");
    const register_close = document.getElementById("register-close");
    const inbox_btn = document.querySelector("#inbox-btn");
    const register_ui_btn = document.querySelector("#register-ui-btn");
    const login_ui_btn = document.querySelector("#login-ui-btn");

    logo.addEventListener("click", () => {
        document.location.href = "/";
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



    const cart_button = document.getElementById("cart-btn");

    cart_button.addEventListener("click", () => {
        text = "";
        for (var key in cart) {
            if (cart.hasOwnProperty(key)) {
                text += `${cart[key]} ${items.find((x) => x.id == key).name}; `;
            }
        }
        alert(`You have: ${text}`);
    });

    const login_form = document.getElementById("login");

    login_form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        console.log({
            account: document.getElementById("account").value,
            password: document.getElementById("password").value,
        });
    });
};

const change_login = () => {
    document.getElementById("login-interface").style.visibility =
        getComputedStyle(document.getElementById("login-interface")).visibility ==
        "hidden" ?
        "visible" :
        "hidden";
};

const change_inbox = () => {
    document.getElementById("inbox-div").style.visibility =
        getComputedStyle(document.getElementById("inbox-div")).visibility ==
        "hidden" ?
        "visible" :
        "hidden";
};

const change_login_register = () => {
    document.querySelector("#login").style.display =
        getComputedStyle(document.getElementById("login")).display ==
        "flex" ?
        "none" :
        "flex";

    document.querySelector("#register").style.display =
        getComputedStyle(document.getElementById("register")).display ==
        "none" ?
        "flex" :
        "none";
}