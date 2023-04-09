const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

function search(searchTerm) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "searchLocalStorage", searchTerm }, (searchResults) => {
          displayResults(searchResults);
        });
      });
}

searchInput.addEventListener("input", (event) => {
    search(event.target.value);
});

function displayResults(results) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        const noResults = document.createElement("li");
        noResults.textContent = "No results found.";
        resultsContainer.appendChild(noResults);
        return;
    }

    results.forEach((item) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = item.title;
        link.href = `https://chat.openai.com/chat/${item.id}`;
        link.target = "_blank"; 
        listItem.appendChild(link);
        resultsContainer.appendChild(listItem);
    });
}
// show all
search("");