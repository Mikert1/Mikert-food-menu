async function getHeroes() {
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

async function leaderboard() {
    let data;
    if (localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
    } else {
        data = await getHeroes();
    }
    console.log(data);
    const leaderboardElement = document.getElementById('burgers');
    leaderboardElement.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
        <div class="item">
        <div class="product">
            <h1>${item.name}</h1>
            <img src="${item.image}" alt="burger">
        </div>
        <div class="product-price">
            <h3>${item.price},-</h3>
            <button>Add to card</button>
        </div>
        <div class="product-info">
            <h2>ingredienten</h2>
            <div class="ingredients">

            </div>
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
        leaderboardElement.appendChild(itemElement);
    }
}


document.addEventListener("keydown", function (event) {
    if (event.key === "c") {
        console.log("clear");
        localStorage.clear();
        leaderboard();
    }
});

leaderboard()