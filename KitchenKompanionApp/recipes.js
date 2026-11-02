const recipes = [
  {
    id: 1,
    name: "Avocado Toast",
    image: "./images/avocado.jpg",
    time: 5,
    vegetarian: true,
    glutenFree: false,
    ingredients: [
    "2 slices of bread",
    "1 ripe avocado"
],
    steps: [
      "Toast the bread",
      "Mash the avocado",
      "Spread avocado on the toast"
    ]
  },

  {
    id: 2,
    name: "Banana Toast",
    time: 5,
    image: "./images/bananaToast.jpg",
    vegetarian: true,
    glutenFree: false,


    ingredients: [
    "2 slices of bread",
    "1 banana",
    "2 tablespoons of peanut butter"
],
    steps: [
      "Toast the bread",
      "Spread peanut butter",
      "Add sliced banana"
    ]
  },
  {
    id: 3,
    name: "Cheese Quesadilla",
    time: 10,
    image: "./images/quesadilla.jpg",
    vegetarian: true,
    glutenFree: false,

    ingredients: [
    "1 large flour tortilla",
    "1/2 cup of shredded cheese"
],
    steps: [
      "Add cheese to a tortilla",
      "Fold the tortilla",
      "Cook both sides until cheese melts"
    ]
  },
  {
    id: 4,
    name: "Strawberry Smoothie",
    time: 5,
    image: "./images/banana.jpg",
    vegetarian: true,
    glutenFree: true,
    ingredients: [
    "1 cup of strawberries",
    "1 banana",
    "1 cup of milk"
],
    steps: [
      "Wash the strawberries",
      "Cut the fruit",
      "Blend everything with milk"
    ]
  }
  
];
function openRecipe(recipeId) {
    const recipe = recipes.find(item => item.id === recipeId);

    if (!recipe) return;

    document.getElementById("recipes-home").hidden = true;
    document.getElementById("recipe-details").hidden = false;

    document.getElementById("recipe-title").textContent = recipe.name;

    const image = document.getElementById("recipe-image");
    image.src = recipe.image;
    image.alt = recipe.name;

    document.getElementById("recipe-time").textContent =
        `${recipe.time} min`;

    document.getElementById("ingredients-list").innerHTML =
        recipe.ingredients.map(item => `<li>${item}</li>`).join("");

    document.getElementById("recipe-steps").innerHTML =
        recipe.steps.map(step => `<li>${step}</li>`).join("");
}

function goBack() {
    document.getElementById("recipe-details").hidden = true;
    document.getElementById("recipes-home").hidden = false;
}
let currentFilter = "all";
let favorites = [];

try {
    const saved = JSON.parse(
        localStorage.getItem("kitchenRecipeFavorites") || "[]"
    );

    if (Array.isArray(saved)) {
        favorites = saved;
    }
} catch {
    favorites = [];
}

let vegetarianOnly = false;
let glutenFreeOnly = false;

function toggleDietPanel() {
    const panel = document.getElementById("diet-panel");
    const button = document.getElementById("filters-toggle");

    if (panel.hidden) {
        // Show the currently applied choices.
        document.getElementById("vegetarian-filter").checked =
            vegetarianOnly;

        document.getElementById("gluten-free-filter").checked =
            glutenFreeOnly;
    }

    panel.hidden = !panel.hidden;
    button.setAttribute("aria-expanded", String(!panel.hidden));
}

function applyDietFilters() {
    vegetarianOnly =
        document.getElementById("vegetarian-filter").checked;

    glutenFreeOnly =
        document.getElementById("gluten-free-filter").checked;

    updateDietFilters();
}

function clearDietFilters() {
    vegetarianOnly = false;
    glutenFreeOnly = false;

    document.getElementById("vegetarian-filter").checked = false;
    document.getElementById("gluten-free-filter").checked = false;

    updateDietFilters();
}

function updateDietFilters() {
    const count = Number(vegetarianOnly) + Number(glutenFreeOnly);
    const button = document.getElementById("filters-toggle");

    button.textContent = count > 0 ? `Filters (${count})` : "Filters";

    document.getElementById("diet-panel").hidden = true;
    button.setAttribute("aria-expanded", "false");

    showRecipes();
    button.focus();
}
function showRecipes(filter = currentFilter) {
     currentFilter = filter;
     document.querySelector(".ingredients-section").hidden =
    filter === "favorites";
    const ingredientFavorite =
    document.getElementById("ingredient-favorite");

if (ingredientFavorite) {
    const selected = favorites.includes(4);

    ingredientFavorite.textContent = selected ? "♥" : "♡";
    ingredientFavorite.setAttribute(
        "aria-pressed",
        String(selected)
    );
}
    document.querySelectorAll(".filters button").forEach(button => {
    const selected =
        button.textContent.trim().toLowerCase() === filter;

    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
});

    const list = document.getElementById("recipe-list");
    list.innerHTML = "";

    const search = document.getElementById("search")
        .value.trim().toLowerCase();
   

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch =
            recipe.name.toLowerCase().includes(search) ||
            recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(search)
            );

        let matchesFilter = true;

        if (filter === "quick") {
            matchesFilter = recipe.time < 10;
        } else if (filter === "favorites") {
            matchesFilter = favorites.includes(recipe.id);
        }

        const matchesDiet =
    (!vegetarianOnly || recipe.vegetarian) &&
    (!glutenFreeOnly || recipe.glutenFree);

return matchesSearch && matchesFilter && matchesDiet;
    });

    if (filteredRecipes.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "No recipes found. Try another search or adjust your filters.";
        list.appendChild(message);
    }

    filteredRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        const imageContainer = document.createElement("div");
        imageContainer.className = "recipe-image-container";

        if (recipe.image) {
            const image = document.createElement("img");
            image.src = recipe.image;
            image.alt = recipe.name;
            imageContainer.appendChild(image);
        } else {
            const placeholder = document.createElement("span");
            placeholder.textContent = "Photo coming soon";
            imageContainer.appendChild(placeholder);
        }
        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.className = "favorite-btn";

        const isFavorite = favorites.includes(recipe.id);

        favoriteButton.textContent = isFavorite ? "♥" : "♡";
        favoriteButton.setAttribute("aria-pressed", String(isFavorite));
        favoriteButton.setAttribute(
    "aria-label",
    `${isFavorite ? "Remove" : "Save"} ${recipe.name} ${
        isFavorite ? "from" : "to"
    } favorites`
);

favoriteButton.addEventListener("click", function () {
    toggleFavorite(recipe.id);
});

imageContainer.appendChild(favoriteButton);

        const info = document.createElement("div");
        info.className = "recipe-info";

        const title = document.createElement("h3");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "recipe-open";
        button.textContent = recipe.name;

        button.addEventListener("click", function () {
            openRecipe(recipe.id);
        });

        title.appendChild(button);

        const details = document.createElement("p");
        details.textContent =
            `${recipe.time} min · ${recipe.ingredients.length} ingredients`;

        info.appendChild(title);
        info.appendChild(details);

        card.appendChild(imageContainer);
        card.appendChild(info);

        list.appendChild(card);
    });
}

document.getElementById("search").addEventListener("input", function () {
    showRecipes();
});

showRecipes();


function toggleFavorite(recipeId) {
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
    } else {
        favorites.push(recipeId);
    }

    try {
        localStorage.setItem(
            "kitchenRecipeFavorites",
            JSON.stringify(favorites)
        );
    } catch {
        
    }

    showRecipes();
}