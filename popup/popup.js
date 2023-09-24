window.chrome = (() => { return window.msBrowser || window.browser || window.chrome; })();

const toggleIds = ["blur", "reveal"];

chrome.runtime.sendMessage({ path: "popup", method: "optionsRequest" }).then((response) => {
    if (response && response.path === "popup" && response.method === "optionsResponse") {
        for (const id of toggleIds) {
            const toggle = document.getElementById(id);
            toggle.checked = Boolean(response.options[id]);
        }
    }
});

for (const id of toggleIds) {
    const toggle = document.getElementById(id);
    
    toggle.addEventListener("change", (event) => {
        const options = { };

        if (id === "blur" && event.target.checked === false) {
            document.getElementById("reveal").checked = false;
            options.reveal = false;
        }

        if (id === "reveal" && event.target.checked === true) {
            document.getElementById("blur").checked = true;
            options.blur = true;
        }

        Object.assign(options, { [id]: event.target.checked });

        chrome.runtime.sendMessage({
            path: "popup",
            method: "optionsChange",
            options: options
        });
    });
}
