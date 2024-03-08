async function getData() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Failed to fetch heroes');
        }
        let data = await response.json();
        if (localStorage.getItem("data")) {
            data = JSON.parse(localStorage.getItem("data"));
        } else {
            data = localStorage.setItem("data", JSON.stringify(data));;
        }
        return data;
    } catch (error) {
        console.error('Error fetching heroes:', error);
        throw error;
    }
}

async function getCart() {
    let cart;
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    } else {
        cart = [];
    }
    return cart;
}

function removeFromCard(id) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] === id) {
            cart.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length <= 0) {
        localStorage.removeItem("cart");
    }
    showCart();
}

async function showCart() {
    let total = 0;
    const cart = await getCart();
    let data = await getData();
    const cartElement = document.getElementById('cart');
    cartElement.innerHTML = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        for (let j = 0; j < data.length; j++) {
            if (data[j].id === item) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cartItem');
                itemElement.innerHTML = `
                    <div class="cart">
                        <div class="cartInfo">
                            <h3>${data[j].name}</h3>
                            <img src="${data[j].image}" alt="burger">
                        </div>
                        <div class="cartInfo">
                            <button onclick="removeFromCard(${data[j].id})">Remove from card</button>
                            <h2>${data[j].price},-</h3>
                        </div>
                    </div>
                        <div class="ingredients">
                    
                        </div>
                    </div>
                `;
                cartElement.appendChild(itemElement);
                total += data[j].price;
            }
        }
    }
    document.getElementById('total').innerHTML = `
        <h1>Total: € ${total},-</h1>
        <h3>Item amount: ${cart.length}</h3>
    `;
    checkForCart()
}

function checkForCart() {
    const dot = document.getElementById("redDot");
    if (localStorage.getItem("cart")) {
        console.log(localStorage.getItem("cart").length);
        dot.innerHTML = `
        <img src="cart.png" alt="cart">
        <h1 class="dot"> ${JSON.parse(localStorage.getItem("cart")).length > 9 ? '9+' : JSON.parse(localStorage.getItem("cart")).length} </h1>
        `;
    }
    else {
        console.log("");
        dot.innerHTML = `    
        <img src="cart.png" alt="cart">
        `;
    }
}

function purchase() {
    const data = localStorage.getItem("cart");
    if (data === null) {
        confirm("You have no items in your cart");
        return;
    } else {
        if (localStorage.getItem("purchased")) {
            localStorage.setItem("purchased", localStorage.getItem("purchased") + data);
        } else {
            localStorage.setItem("purchased", data);
        }
        localStorage.removeItem("cart");
        window.location.href = "confirm.html";
    }
}
showCart();