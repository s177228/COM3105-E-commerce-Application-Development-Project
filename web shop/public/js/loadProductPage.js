window.addEventListener("DOMContentLoaded", (evt) => {
    loadProductPage();
});

var items = [];
const loadProductPage = () => {
    let urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');

    fetch(`api/item/${pid}`)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            const section = document.querySelector("#product-section");
            item = res.body;

            section.innerHTML = "";
            section.innerHTML = `
            <div class="product-cell">
                <h3 class="product-name">${item.name}</h3>
                <img class="product-img" src="/api/image/${item.img}"></img>
                <div class="product-card">
                    <p class="product-price">Price: $${item.price}</p>
                    <br>
                    <p class="product-desc">${item.desc}</p>
                    <br>
                    <p class="product-detail">${item.detail}
                    </p>
                </div>
            </div>
            `;
        });



}