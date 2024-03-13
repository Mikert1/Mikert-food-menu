async function getData() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        let data = await response.json();
        if (localStorage.getItem("data")) {
            data = JSON.parse(localStorage.getItem("data"));
        } else {
            data = localStorage.setItem("data", JSON.stringify(data));;
        }
        return data;
    } catch (error) {
        console.error('Error fetching:', error);
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
function create() {
    const data = JSON.parse(localStorage.getItem("data"));
    const item = {};
    for (let i = 0; i < data.length + 1; i++) {
        if (data.find(item => item.id === i) === undefined) {
            item.id = i;
            break;
        }
    }
    console.log(item.id);
    item.name = document.getElementById("name").value;
    item.price = document.getElementById("price").value;
    item.image = document.getElementById("image").value;
    item.ingredients = [];
    item.disabled = true;
    data.push(item);
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
    const item = data.find((items, index) => {
        if (items.id === id) {
            indexInData = index;
            return items;
        }
        if (id === null) {
            return null;
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
            <button class="editPreview" onclick="preview()">Preview</button>
        </div>
        </from>
        <img src="${item.image}" id="pre" alt="Foto Preview">
        <div>
            <button class="adminDisable" onclick="deleteItem(${item.id})">Delete</button>
            <button class="adminEdit" onclick="save(${item.id})">Save</button>
        </div>
        `;
    }
    if (item == null) {
        editElement.innerHTML = `
        <from>
        <div class="editProduct">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name">
            </div>
            <div>
                <label for="price">Price:</label>
                <input type="number" id="price">
            </div>
            <div>
            <label for="image">Image:</label>
            <input type="text" id="image" value="pictures/image.png">
            <button class="editPreview" onclick="preview()">Preview</button>
        </div>
        </from>
        <img src="pictures/image.png" id="pre" alt="Foto Preview">
        <div>
            <button class="adminEdit" onclick="create()">Create</button>
        </div>
        `;
    }
}

setItem();