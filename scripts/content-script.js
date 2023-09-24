window.chrome = (() => { return window.msBrowser || window.browser || window.chrome; })();

const options = { };

const addListenersToNode = (node) => {
    node.addEventListener("mouseover", () => {
        node.style.filter = "blur(0)";
    });

    node.addEventListener("mouseout", () => {
        node.style.filter = "blur(1.5rem)";
    });
};

const observer = new MutationObserver((records, _observer) => {
    records.forEach((record) => {
        record.addedNodes.forEach((addedNode) => {
            if (addedNode.nodeName.toLowerCase() === "img") {
                addedNode.style.filter = "blur(1.5rem)";

                if (options.reveal) addListenersToNode(addedNode);
            }

            if (addedNode.hasChildNodes()) {
                const images = addedNode.querySelectorAll("img");

                images.forEach((image) => {
                    image.style.filter = "blur(1.5rem)";

                    if (options.reveal) addListenersToNode(image);
                });
            }
        });
    });
});

chrome.runtime.sendMessage({ path: "page", method: "optionsRequest" }).then((response) => {
    if (response && response.path === "page" && response.method === "optionsResponse") {
        Object.assign(options, response.options);
        
        if (options.blur) {
            const target = document.documentElement || document.body;

            observer.observe(target, {
                childList: true,
                subtree: true
            });
        }
    }
});
