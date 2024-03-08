async function loadMenu() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }
}

async function showMenu() {
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await loadMenu();
    }
    console.log(data);
    const burgerElement = document.getElementById('burgers');
    burgerElement.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
        <div class="product">
            <h1>${item.name}</h1>
            <img src="${item.image}" alt="burger">
        </div>
        <div class="product-price">
            <h3>${item.price},-</h3>
            ${item.disabled == true ? `<button class="disable">Not avalible</button>` : `<button onclick="addToCard(${item.id})">Add to card</button>`}
        </div>
        <div class="product-info">
            <h2>ingredienten</h2>
            <div class="ingredients">

            </div>
        </div>
        `;
        for (let j = 0; j < item.ingredients.length; j++) {
            const ingredient = item.ingredients[j];
            const ingredientElement = document.createElement('div');
            ingredientElement.innerHTML = `
            <div class="ingredient">
                <img src="ingredients/${ingredient.image}" alt="">
                <h3>${ingredient.name}</h3>
            </div>
            `;
            itemElement.querySelector('.ingredients').appendChild(ingredientElement);
        }
        burgerElement.appendChild(itemElement);
    }
    checkForCart()
}

function getCard() {
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    return cart;
}

function addToCard(id) {
    console.log("add to card");
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    checkForCart()

}

function checkForCart() {
    if (localStorage.getItem("cart")) {
        dot = document.getElementById("redDot");
        dot.innerHTML = `
        <img src="cart.png" alt="cart">
        <h1 class="dot"> ${JSON.parse(localStorage.getItem("cart")).length > 9 ? '9+' : JSON.parse(localStorage.getItem("cart")).length} </h1>
        `;
    }
}


document.addEventListener("keydown", function (event) {
    if (event.key === "c") {
        console.log("clear");
        localStorage.clear();
        showMenu();
    }
});

// setInterval(function() {
//     showMenu();
// }, 5000);

showMenu()
getCard()
checkForCart()
console.log("script.js");