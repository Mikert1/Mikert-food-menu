let selectedDashboard = false;
async function getData() {
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

function restore() {
    localStorage.removeItem("data");
    setItems();
}

function disable(id) {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = data.find(item => item.id === id);
    item.disabled = true;
    localStorage.setItem("data", JSON.stringify(data));
    setItems();
}

function enable(id) {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = data.find(item => item.id === id);
    item.disabled = false;
    localStorage.setItem("data", JSON.stringify(data));
    setItems();
}
function edit(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function setOrders() {
    selectedDashboard = false;
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await getData();
    }
    let orders = JSON.parse(localStorage.getItem("purchased"));
    const items = document.getElementById("items");
    items.innerHTML = ``;
    if (orders == null) {
        items.innerHTML = `<h1>No orders</h1>`;
    } else {
        for (const order of orders) {
            listItemsOfOrder(order, data);
        }
    }
}

// Goes through all items of an order and finds the corresponding data for each item
// Gives the data back

function listItemsOfOrder(order, data) {
    const items = document.getElementById("items");
    const orderElement = document.createElement('div');
    orderElement.classList.add('orders');
    orderElement.innerHTML = `<h1>Table: ${order.id}</h1>`;
    for (let item of data) {
        for (let i = 0; i < order.item.length; i++) {
            element = order.item[i];
            console.log(element.removeIngredients);
            if (item.id === element.item) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.innerHTML = `
                <div class="adminProduct">
                    <div>
                        <p>${item.name}</p>
                    </div>
                    <div>
                        <img src="${item.image}" alt="burger">
                    </div>
                    <div class="tooltip">
                        ${element.removeIngredients.length < 1 ? `<p>Ingredienten</p>` : `<p class="ingredientChanged">Ingredienten</p>`}
                        <span class="tooltiptext">${item.ingredients.map(ingredient => ingredient.name).join(', ')}</span>
                    </div>
                    <div class="container">
                        <label for="done">Done:</label>
                        <input type="checkbox" id="done"></input>
                    </div>
                </div>
                `;
                orderElement.appendChild(itemElement);
                items.appendChild(orderElement);
            }
        }
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('container');
    const buttonElemnt = document.createElement('button');
    buttonElemnt.innerHTML = "Order Done";
    buttonElemnt.classList.add('addButton');
    buttonElemnt.onclick = function() {
        const orders = JSON.parse(localStorage.getItem("purchased"));
        orders.splice(orders.findIndex(item => item.id === order.id), 1);
        localStorage.setItem("purchased", JSON.stringify(orders));
        setOrders();
    }
    buttonContainer.appendChild(buttonElemnt);
    orderElement.appendChild(buttonContainer);
    items.appendChild(orderElement);
}


async function setItems() {
    let data;
    selectedDashboard = true;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await getData();
    }
    const items = document.getElementById("items");
    items.innerHTML = `
    <div class="itemInfo adminProduct item">
        <div>
            <p><strong>Name</strong></p>
        </div>
        <div>
            <p><strong>Image</strong></p>
        </div>
        <div>
            <p><strong>Price</strong></p>
        </div>
        <div>
            <p><strong>Actions</strong></p>
        </div>
    </div>`;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
        <div class="adminProduct">
            <div>
                <p>${item.name}</p>
            </div>
            <div>
                <img src="${item.image}" alt="burger">
            </div>
            <div>
                <p>${item.price},-</p>
            </div>
            <div>
                ${item.disabled == true ? `<button onclick="enable(${item.id})" class="adminEnable">Enable</button>` : `<button onclick="disable(${item.id})" class="adminDisable">Disable</button>`}
                <button class="adminEdit" onclick="edit(${item.id})">Edit</button>
            </div>
        </div>
        `;
        items.appendChild(itemElement);
    }
}

setInterval(function() {
    if (selectedDashboard == true) {
        setItems();
    } else {
        setOrders();
    }
}, 5000);

setOrders();