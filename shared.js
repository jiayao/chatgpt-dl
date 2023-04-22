// Code for storing a list of conversations in local storage
function storeItems(items) {
    localStorage.setItem("conversations", JSON.stringify(items));
}

function getItems() {
    return JSON.parse(localStorage.getItem("conversations")) || [];
}

function addItem(item) {
    const items = getItems();
    const itemExists = items.some(existingItem => existingItem.id === item.id);
    
    if (!itemExists && item.title != "New chat") {
        items.push(item);
        storeItems(items);
    }
}

function addItems(items) {
    items.forEach(item => {
        addItem(item);
    });
}

function searchItems(keyword) {
    const items = getItems();
    let results = items.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()));
    return results;
}
