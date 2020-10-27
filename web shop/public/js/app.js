window.addEventListener("DOMContentLoaded", (evt) => {
  fetch_items();
});

var items = [];
const fetch_items = () => {
  fetch("/api/items/all")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      items = res.body;
      items.forEach((element) => {
        document
          .querySelector(`#product${element.id}`)
          .addEventListener("click", function (event) {
            // prevent fir when click cart-btn
            if (
              !(event.target.tagName == "BUTTON" || event.target.tagName == "I")
            ) {
              click(element.id);
            }
          });
      });
    });
};

const click = (id) => {
  document.location.href = `/product/pid/${id}`;
};

var cart = {};
const buy = (id) => {
  //not fully functional
  cart[id] = cart[id] == null ? 1 : cart[id] + 1;
  alert(`Added one "${items.find((x) => x.id === id).name}" to shopping cart!`);
};
