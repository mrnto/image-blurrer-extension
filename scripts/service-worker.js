self.chrome = (() => { return self.msBrowser || self.browser || self.chrome; })();

const options = { };

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const defaultOptions = { blur: true, reveal: false };
        chrome.storage.local.set({ options: defaultOptions });
    }
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request && request.method === "optionsRequest") {
        chrome.storage.local.get(["options"]).then((result) => {
            Object.assign(options, result.options);
            
            sendResponse({
                path: request.path,
                method: "optionsResponse",
                options: options
            });
        });
    }
    return true;
});

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request && request.path === "popup" && request.method === "optionsChange") {
        Object.assign(options, request.options);
        chrome.storage.local.set({ options });
    }
});
