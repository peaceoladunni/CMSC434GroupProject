const ITEMS_KEY = "itemslist";
const $ = sel => document.querySelector(sel);

// 1. Storage Helpers
function loadItems() {
    try {
        return JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveItems(items) {
    try { 
        localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); 
    } catch (e) { 
        /* storage full or private browsing active */ 
    }
}

// 2. UI Render Function
function renderShoppingList() {
    const shoppingList = $("#shopping-list");
    shoppingList.innerHTML = ""; // Clear existing elements before rebuilding
    
    const items = loadItems();
    
    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "shopping-item";
        if (item.done) li.classList.add("done");
        
        // Track the unique ID on the element
        li.dataset.id = item.id;

        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        nameSpan.textContent = item.name;

        const qtySpan = document.createElement("span");
        qtySpan.className = "qty";
        qtySpan.textContent = item.qty;

        // Visual controls layout
        const arrows = document.createElement("div");
        arrows.className = "arrows";
        
        const up = document.createElement("button");
        up.textContent = "↑";
        up.onclick = (e) => { e.stopPropagation(); adjustQuantity(item.id, 1); };

        const down = document.createElement("button");
        down.textContent = "↓";
        down.onclick = (e) => { e.stopPropagation(); adjustQuantity(item.id, -1); };

        arrows.appendChild(up);
        arrows.appendChild(down);

        li.appendChild(nameSpan);
        li.appendChild(qtySpan);
        li.appendChild(arrows);
        shoppingList.appendChild(li);
    });
}

// 3. Data Actions (Add, Delete, Update)
$("#addItem").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#itemname").value.trim();
    const qty = Number($("#itemqty").value);

    // Error UI safeguards
    if ($("#nameError")) $("#nameError").hidden = !!name;
    if ($("#qtyError")) $("#qtyError").hidden = qty >= 1;

    if (!name || qty < 1) return;

    const items = loadItems();
    
    // Fixed: Save the parsed string values correctly into structural keys
    items.push({
        id: Date.now().toString(36), 
        name: name,
        qty: qty,
        done: false
    });
    
    saveItems(items);
    $("#addItem").reset();
    closePopup();
    renderShoppingList(); // Update UI immediately
});

function adjustQuantity(id, amount) {
    let items = loadItems();
    items = items.map(item => {
        if (item.id === id) {
            const newQty = item.qty + amount;
            return { ...item, qty: newQty > 0 ? newQty : 1 }; 
        }
        return item;
    });
    saveItems(items);
    renderShoppingList();
}

$("#shopping-list").addEventListener('click', function(ev) {
    const targetLi = ev.target.closest('li');
    if (!targetLi) return;
    
    const itemId = targetLi.dataset.id;
    let items = loadItems();
    
    items = items.map(item => {
        if (item.id === itemId) {
            return { ...item, done: !item.done };
        }
        return item;
    });
    
    saveItems(items);
    renderShoppingList();
});


$("#itemname").addEventListener("input", () => { if($("#nameError")) $("#nameError").hidden = true; });
$("#itemqty").addEventListener("input", () => { if($("#qtyError")) $("#qtyError").hidden = true; });


function openPopup() {
    $('#shoplistadd').showModal();
}

function closePopup() {
    $('#shoplistadd').close();
}


document.addEventListener("DOMContentLoaded", renderShoppingList);
