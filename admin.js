async function getData() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Failed to fetch heroes');
        }
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching heroes:', error);
        throw error;
    }
}

function setItems() {
    let data = getData();
    const items = document.getElementById("items");
    const item = document.createElement('div');
    item.classList.add('item');
    for (let i = 0; i < data.length; i++) {
        item.innerHTML = `
            <div class="product">
                <h1>${data[i].name}</h1>
                <img src="${data[i].image}" alt="burger">
            </div>
            <div class="product-price">
                <h3>${data[i].price},-</h3>
                <button onclick="addToCard(${data[i].id})">Add to card</button>
            </div>
            <div class="product-info">
                <h2>ingredienten</h2>
                <div class="ingredients">
                </div>
            </div>
        `;
        items.appendChild(item);
        console.log("vjsjbviasbfibv");
    }
}

setInterval(function() {
    setItems();
}, 5000);

setItems();