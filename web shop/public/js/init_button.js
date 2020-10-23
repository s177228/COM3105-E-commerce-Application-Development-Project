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

  const login_form = document.getElementById("login_form");
  const register_form = document.getElementById("register_form");

  login_form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    fetch("api/account/login", {
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
        }
      })
      .then((res) => {
        res ? console.log(res) : null;
      });
  });

  register_form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    if (
      document.getElementById("register_password").value !=
      document.getElementById("register_confirm_password").value
    ) {
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
          res ? console.log(res) : null;
        });
    }
  });
};

const change_login = () => {
  document.getElementById("login-interface").style.visibility =
    getComputedStyle(document.getElementById("login-interface")).visibility ==
    "hidden"
      ? "visible"
      : "hidden";
};

const change_inbox = () => {
  document.getElementById("inbox-div").style.visibility =
    getComputedStyle(document.getElementById("inbox-div")).visibility ==
    "hidden"
      ? "visible"
      : "hidden";
};

const change_login_register = () => {
  document.querySelector("#login_form").style.display =
    getComputedStyle(document.getElementById("login_form")).display == "flex"
      ? "none"
      : "flex";

  document.querySelector("#register_form").style.display =
    getComputedStyle(document.getElementById("register_form")).display == "none"
      ? "flex"
      : "none";
};
