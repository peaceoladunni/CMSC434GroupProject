const ITEMS_KEY = "itemslist";
const $ = sel => document.querySelector(sel);

// Storage helpers (sessionStorage: survives page switches, cleared when the tab closes)
function loadItems() {
    try {
        const parsed = JSON.parse(sessionStorage.getItem(ITEMS_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveItems(items) {
    try {
        sessionStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (e) { /* storage unavailable */ }
}

// Render
function renderShoppingList() {
    const list = $("#shopping-list");
    list.innerHTML = "";

    const items = loadItems();

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "shopping-item";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-btn";
        remove.textContent = "✕";
        remove.setAttribute("aria-label", "Remove " + item.name);
        remove.addEventListener("click", () => removeItem(item.id));

        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        nameSpan.textContent = item.name;

        const qtySpan = document.createElement("span");
        qtySpan.className = "qty";
        qtySpan.textContent = item.qty;

        li.appendChild(remove);
        li.appendChild(nameSpan);
        li.appendChild(qtySpan);
        list.appendChild(li);
    });

    $("#shopping-empty").hidden = items.length > 0;
}

// Data actions
function removeItem(id) {
    saveItems(loadItems().filter(item => item.id !== id));
    renderShoppingList();
}

$("#addItem").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#itemname").value.trim();
    const qty = Number($("#itemqty").value);

    if (!name || !(qty >= 1)) return;

    const items = loadItems();
    items.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), // unique even if added in the same millisecond
        name: name,
        qty: qty
    });

    saveItems(items);
    $("#addItem").reset();
    closePopup();
    renderShoppingList();
});

// Popup
function openPopup() {
    $("#shoplistadd").showModal();
}

function closePopup() {
    $("#shoplistadd").close();
}

// Show saved items on load, and again when returning with the browser's back/forward buttons
renderShoppingList();
window.addEventListener("pageshow", e => { if (e.persisted) renderShoppingList(); });