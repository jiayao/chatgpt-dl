chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === 'downloadConversation') {
    window.postMessage({ type: 'downloadConversation' }, '*');
}
});

function injectScriptFile(filePath) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(filePath);
    (document.head || document.documentElement).appendChild(script);
}

injectScriptFile('shared.js');
injectScriptFile('inject.js');

document.onreadystatechange = () => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Save';
        downloadButton.className = 'download-button';
        const icon = document.createElement('i');
        downloadButton.appendChild(icon);

        document.body.appendChild(downloadButton);

        downloadButton.addEventListener('click', () => {
            window.postMessage({ type: 'downloadConversation' }, '*');
        });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.action);
    if (request.action === "searchLocalStorage") {
      const searchTerm = request.searchTerm;
      const searchResults = searchItems(searchTerm);
      sendResponse(searchResults);
    }
  });