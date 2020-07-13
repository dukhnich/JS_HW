const directories = [
    {
        dir: {
            name: "root"
        }
    },
    {
        dir: { name: "child" }
    },
    {
        dir: [
            {
                dir: { name: "John" }
            },
            {
                dir: { name: "hello" }
            },
            {
                dir: [
                    {
                        dir: { name: "nested" }
                    },
                    {
                        dir: [
                            {
                                dir: { name: "nested" }
                            },
                            {
                                dir: { name: "one" }
                            },
                            {
                                dir: { name: "John" }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        dir: { name: "John" }
    }
];

/**
 * @param container {HTMLElement}
 * @param data {{}}
 */
function drawContent(container, data = directories) {
    let ul = document.createElement("ul");
    for (let item of data) {
        if (Array.isArray(item.dir)) {
            (drawContent(ul,item.dir));
        }
        else {
            let li = document.createElement("li");
            li.innerHTML = item.dir.name;
            ul.appendChild(li);
        }
    }
    container.appendChild(ul);
}

/**
 * Search text in the HTML-container
 * @param request {string}
 * @param context {HTMLElement}
 */
function search(request, context) {
    clearSearch(context)
    for (let item of context.children) {
        if (item.children.length > 0) {
            search(request, item)
        } else {
            if (item.innerText && item.innerText.toLowerCase().indexOf(request.toLowerCase()) > -1) {
                let strWithoutRequest = item.innerText.toLowerCase().split(request.toLowerCase());
                let newText = "";
                let index = 0;
                for (let substr of strWithoutRequest) {
                    newText += item.innerText.slice(index, index + substr.length);
                    index += substr.length;
                    if (index < item.innerText.length) {
                        newText += "<span class = 'searchText bg-warning'>" + item.innerText.slice(index, index + request.length) + "</span>";
                        index += request.length;
                    }
                }
                item.innerHTML = newText;
            }
        }
    }
}

/**
 * @param context {HTMLElement}
 */
function clearSearch(context) {
    let searchResults = context.querySelectorAll(".searchText");
    for (let span of searchResults) {
        let text = document.createTextNode(span.innerText);
        span.parentElement.replaceChild(text, span);
    }
}

/**
 * clear the last timeout id and start new setTimeout
 * @param fn {function}
 * @param ms {number}
 * @returns {function(...[*]=)}
 */
function debounce(fn, ms) {
    let intervalId = null;
    return function(...rest) {
        clearTimeout(intervalId);
        intervalId = setTimeout(fn, ms, ...rest);
    };
}

/**
 * callback for search input
 * @param event {Event}
 */
function searchOninput(event) {
    event.preventDefault();
    search(event.target.value, content)
}

const content = document.getElementById("content");
drawContent(content);
const searchEl = document.getElementById("inputSearch");
searchEl.addEventListener("input", debounce(searchOninput, 300));