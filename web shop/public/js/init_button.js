window.addEventListener("DOMContentLoaded", (evt) => {
    init_button();
});

const init_button = () => {
    const logo = document.querySelector("#logo");
    const login_button = document.getElementById("login-btn");
    const login_close = document.getElementById("login-close");

    logo.addEventListener("click", () => {
        document.location.href = "/";
    });

    login_button.addEventListener("click", () => {
        change_login();
    });
    login_close.addEventListener("click", () => {
        change_login();
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