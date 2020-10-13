var items = []

window.addEventListener("DOMContentLoaded", (evt) => {
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
            <button onclick="buy(${element.id})">BUY!</button>
        </div>
        `;
      });
    });
});

const buy = (id) =>{
    //not fully functional
    alert(`You want to buy ${items[id-1].name}?`)
}