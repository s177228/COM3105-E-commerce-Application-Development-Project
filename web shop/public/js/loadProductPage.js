window.addEventListener("DOMContentLoaded", (evt) => {
    loadProductPage();
});

var items = [];
const loadProductPage = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');

    fetch("/api/items/all")
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            const section = document.querySelector("#product-section");
            items = res.body;

            section.innerHTML = "";
            items.forEach((element) => {
                if (element.id == pid) {
                    section.innerHTML = `
                    <div class="product-cell">
                <h3 class="product-name">${element.name}</h3>
                <img class="product-img"></img>
                <div class="product-card">
                    <p class="product-price">Price: $${element.peice}</p>
                    <br>
                    <p class="product-desc">${element.desc}</p>
                    <br>
                    <p class="product-detail">${element.detail}
                    </p>
                </div>
            </div>
                    `;
                }
            });
        });



}