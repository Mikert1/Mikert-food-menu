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

async function removeIngredient(name, id, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            for (let j = 0; j < data[i].ingredients.length; j++) {
                const ingredient = data[i].ingredients[j];
                if (ingredient.name == name) {
                    ingredient.added = false;
                    localStorage.setItem("data", JSON.stringify(data));
                    showMenu();
                }
            }
        }
    }
}

function addIngredient(name, id, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            for (let j = 0; j < data[i].ingredients.length; j++) {
                const ingredient = data[i].ingredients[j];
                if (ingredient.name == name) {
                    ingredient.added = true;
                    localStorage.setItem("data", JSON.stringify(data));
                    showMenu();
                }
            }
        }
    }
}

async function showMenu() {
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await loadMenu();
    }
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
            ${item.disabled == true ?
        `<button class="disable">Not avalible</button>` :
        `<button onclick="addToCard(${item.id})">Add to card</button>`
}
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
            ingredientElement.classList.add('ingredient');
            const ingredientBody = document.createElement('div');
            const ingredientImage = document.createElement('img');
            ingredientImage.src = `img/ingredients/${ingredient.image}`;
            ingredientImage.alt = ingredient.name;
            ingredientBody.appendChild(ingredientImage);
            const ingredientName = document.createElement('h3');
            ingredientName.textContent = ingredient.name;
            const ingredientButton = document.createElement('button');
            if (ingredient.added) {
                ingredientButton.textContent = '-';
                ingredientButton.addEventListener('click', () => {
                    removeIngredient(ingredient.name, data[i].id, data);
                });
            } else {
                ingredientBody.classList.add('disabledIngredient');
                ingredientButton.textContent = '+';
                ingredientButton.addEventListener('click', () => {
                    addIngredient(ingredient.name, data[i].id, data);
                });
            }
            ingredientBody.appendChild(ingredientName);
            ingredientElement.appendChild(ingredientBody);
            ingredientElement.appendChild(ingredientButton);
            itemElement.querySelector('.ingredients').appendChild(ingredientElement);
        }
        burgerElement.appendChild(itemElement);
    }
    checkForCart();
}

function getCard() {
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    return cart;
}

async function addToCard(id) {
    let removeIngredients = [];
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await loadMenu();
    }
    for (let i = 0; i < data.length; i++) {
        const item = data[i].ingredients;
        if (data[i].id === id) {
            for (let j = 0; j < item.length; j++) {
                if (item[j].added === false) {
                    removeIngredients.push(item[j].name);
                }
                item[j].added = true;
            }
        }
    }
    localStorage.setItem("data", JSON.stringify(data));

    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push(
        {
            item: id,
            removeIngredients: removeIngredients,
        },
    );
    localStorage.setItem("cart", JSON.stringify(cart));
    checkForCart();
    showMenu();
}

function checkForCart() {
    if (localStorage.getItem("cart")) {
        let dot = document.getElementById("redDot");
        dot.innerHTML = `
        <img src="img/settings/cart.png" alt="cart">
        <h1 class="dot">
            ${JSON.parse(localStorage.getItem("cart")).length > 9
        ? '9+' : JSON.parse(localStorage.getItem("cart")).length
}
        </h1>
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

setInterval(function () {
    showMenu();
}, 5000);

showMenu();
getCard();
checkForCart();