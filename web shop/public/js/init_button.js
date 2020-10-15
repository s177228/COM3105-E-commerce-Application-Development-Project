window.addEventListener("DOMContentLoaded", (evt) => {
  init_button();
});

const init_button = () => {
  const login_button = document.getElementById("login-btn");

  login_button.addEventListener("click", () => {
    document.getElementById("login-interface").style.visibility =
      getComputedStyle(document.getElementById("login-interface")).visibility ==
      "hidden"
        ? "visible"
        : "hidden";
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
