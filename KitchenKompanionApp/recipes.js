const recipes = [
  {
    id: 1,
    name: "Avocado Toast",
    image: "./images/avocado.jpg",
    time: 5,
    ingredients: ["Bread", "Avocado"],
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

    ingredients: ["Bread", "Banana", "Peanut Butter"],
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
    ingredients: ["Tortilla", "Cheese"],
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
    ingredients: ["Strawberry", "Banana", "Milk"],
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