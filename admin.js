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

function disable(id) {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = data.find(item => item.id === id);
    item.disabled = true;
    localStorage.setItem("data", JSON.stringify(data));
    setItems();
}

async function setItems() {
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await getData();
    }
    const items = document.getElementById("items");
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        const item = data[i];
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
        <div class="adminProduct">
            <h1>${item.name}</h1>
            <img src="${item.image}" alt="burger">
        </div>
        <div>
            <h3>${item.price},-</h3>
            <button onclick="disable(${item.id})">Add to card</button>
        </div>
        <div>
            <h2>ingredienten</h2>
            <div class="ingredients">

            </div>
        </div>
        `;
        items.appendChild(itemElement);
    }
}

// setInterval(function() {
//     setItems();
// }, 5000);

setItems();