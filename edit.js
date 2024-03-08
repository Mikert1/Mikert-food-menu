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

function deleteItem(id) {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = data.find(item => item.id === id);
    data.splice(data.indexOf(item), 1);
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "admin.html";
}

function save(id) {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = data.find(item => item.id === id);
    item.name = document.getElementById("name").value;
    item.price = document.getElementById("price").value;
    item.image = document.getElementById("image").value;
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "admin.html";
}

function preview() {
    document.getElementById("pre").src = document.getElementById("image").value;
}

async function setItem() {
    let data = await getData();
    const editElement = document.getElementById("edit");
    const urlParams = new URLSearchParams(window.location.search);
    let id = Number(urlParams.get('id'));
    const item = data.find((item, index) => {
        if (item.id === id) {
            indexInData = index;
            return item;
        }
    });
    if (item) {
        editElement.innerHTML = `
        <from>
        <div class="editProduct">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" value="${item.name}">
            </div>
            <div>
                <label for="price">Price:</label>
                <input type="number" id="price" value="${item.price}">
            </div>
            <div>
            <label for="image">Image:</label>
            <input type="text" id="image" value="${item.image}">
        </div>
        </from>
            <button class="adminEdit" onclick="preview()">Preview</button>
        <img src="${item.image}" id="pre" alt="burger">
        <div>
            <button class="adminDisable" onclick="deleteItem(${item.id})">Delete</button>
            <button class="adminEdit" onclick="save(${item.id})">Save</button>
        </div>
        `;
    }
}

setItem();