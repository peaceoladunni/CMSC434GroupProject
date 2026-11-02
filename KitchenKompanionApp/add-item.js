
const ITEMS_KEY = "kk-items";
const UNITS = ["Count", "Gallon", "Quart", "Cup", "lb", "oz", "Dozen", "Bag", "Box", "Can", "Bottle", "Stick", "Clove"];

const HOUSEHOLD = ["Everyone", "Alex", "Jordan", "Sam"];

const $ = sel => document.querySelector(sel);

function loadItems() {
    try {
        return JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveItems(items) {
    try { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
}

$("#unit").innerHTML = UNITS.map(u => `<option>${u}</option>`).join("");
$("#owner").innerHTML = HOUSEHOLD.map(h => `<option>${h}</option>`).join("");

$("#name").addEventListener("input", () => ($("#nameError").hidden = true));
$("#qty").addEventListener("input", () => ($("#qtyError").hidden = true));

$("#addForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#name").value.trim();
    const qty = Number($("#qty").value);
    $("#nameError").hidden = !!name;
    $("#qtyError").hidden = qty >= 1;
    if (!name) return $("#name").focus();
    if (!(qty >= 1)) return $("#qty").focus();

    const items = loadItems();
    items.push({
        id: Date.now().toString(36),
        name,
        location: document.querySelector("input[name=location]:checked").value,
        qty,
        unit: $("#unit").value,
        exp: $("#exp").value,
        owner: $("#owner").value,
        notes: $("#notes").value.trim(),
    });
    saveItems(items);
    window.location.href = "home.html";
});
