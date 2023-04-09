function extractMessages(data) {
    const messages = [];
    for (const key in data.mapping) {
        if (data.mapping[key].message) {
            const message = data.mapping[key].message;
            messages.push({
                id: message.id,
                role: message.author.role,
                text: message.content.parts.join(' '),
                createTime: message.create_time,
            });
        }
    }
    return messages;
}

function createMarkdown(messages) {
    let markdownText = '';
    messages
        .sort((a, b) => a.createTime - b.createTime)
        .forEach((message) => {
            const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);
            markdownText += `${role}: ${message.text}\n\n`;
        });
    return markdownText;
}

function getConversationId(pageUrl) {
    const parts = pageUrl.split('/');
    return parts[parts.length - 1];
}

function downloadConversation(data, pageUrl) {
    const fileName = `chatgpt_${getConversationId(pageUrl)}.md`;
    const messages = extractMessages(data);
    const markdownText = createMarkdown(messages);

    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

(function () {
    document.onreadystatechange = () => {
        let conversationData = null;
        let interceptedUrl = null;
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            window.addEventListener('message', (event) => {
                if (event.source !== window) return;
                if (event.data.type && event.data.type === 'downloadConversation') {
                    if (conversationData) {
                        downloadConversation(conversationData, interceptedUrl);
                    } else {
                        console.warn('Conversation data not available yet.');
                    }
                }
            });

            const interceptFetch = (urlRegex, callback) => {
                const originalFetch = window.fetch;
                window.fetch = async (input, init) => {
                    const response = await originalFetch(input, init);
                    if (typeof input === 'string' && urlRegex.test(input)) {
                        interceptedUrl = input;
                        const clonedResponse = response.clone();
                        callback(await clonedResponse.json());
                    }
                    return response;
                };
            };

            interceptFetch(/\/backend-api\/conversation\//, (data) => {
                conversationData = data;
            });
        }
    };
})();

  
  