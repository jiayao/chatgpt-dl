chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === 'downloadConversation') {
    window.postMessage({ type: 'downloadConversation' }, '*');
}
});

const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);

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
