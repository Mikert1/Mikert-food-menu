async function getData() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));
        console.log(data);
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

async function setItems() {
    let data;
    if (localStorage.getItem("data")) {
        console.log("Using local data");
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await getData();
    }
    const items = document.getElementById("items");
    items.innerHTML = `
    <div class="adminProduct item">
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
        console.log(data[i]);
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
    setItems();
}, 5000);

setItems();