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
      const section = document.getElementById("products-section");
      items = res.body;

      section.innerHTML = "";
      items.forEach((element) => {
        section.innerHTML += `
      <div class="product-cell">
          <p class="product-name">${element.name}</p>
          <img class="product-img" src="./img/${element.img}"></img>
          <p class="product-price">$${element.price}</p>
          <p class="product-desc">${element.desc}</p>
          <button onclick="buy(${element.id})" class="btn btn-success"><i class='fas fa-shopping-cart'></i></button>
      </div>
      `;
      });
    });
};

var cart = {};
const buy = (id) => {
  //not fully functional
  cart[id] = cart[id] == null ? 1 : cart[id] + 1;
  alert(`Added one "${items.find((x) => x.id === id).name}" to shopping cart!`);
};
