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
                dir: { name: "J<b>o</b>hn" }
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
const content = document.getElementById("content");


/**
 * @param container {HTMLElement}
 * @param data {{}}
 */
(function drawContent(container, data) {
    let ul = document.createElement("ul");
    container.onclick = (event) => {
        event.stopPropagation();
        ul.classList.toggle("d-none");
    };
    for (let item of data) {
        let li = document.createElement("li");
        if (Array.isArray(item.dir)) {
            li.innerText = ">>";
            (drawContent(li,item.dir));
        }
        else {
            li.innerHTML = item.dir.name;
        }
        ul.appendChild(li);
    }
    container.appendChild(ul);
})(content, directories);

/**
 * Search text in the HTML-container
 * @param request {string}
 * @param context {HTMLElement}
 */
function search(request, context) {
    nothing.classList.add("d-none");
    clearSearch(context);
    if ("" === request) {
        return
    }
    let result = 0;
    for (let item of context.children) {
        if (item.children.length > 0) {
            result += search(request, item);
        } else {
            if (item.innerText && item.innerText.toLowerCase().indexOf(request.toLowerCase()) > -1) {
                item.innerHTML = addSpan(item.innerText, request);
                result++
            }
        }
    }
    return result
}

function addSpan(str, spanText) {
    let strWithoutRequest = str.toLowerCase().split(spanText.toLowerCase());
    let newText = "";
    let index = 0;
    for (let substr of strWithoutRequest) {
        newText += str.slice(index, index + substr.length);
        index += substr.length;
        if (index < str.length) {
            newText += "<span class = 'searchText bg-warning'>" + str.slice(index, index + spanText.length) + "</span>";
            index += spanText.length;
        }
    }
    return newText;
}

/**
 * @param context {HTMLElement}
 */
function clearSearch(context) {
    let searchResults = context.querySelectorAll(".searchText");
    for (let span of searchResults) {
        let text = document.createTextNode(span.innerText);
        let parent = span.parentElement
        parent.replaceChild(text, span);
        let newChildren = [...parent.childNodes].reduce(
            (prev, current) => {
                if (prev.length > 0 && 3 === prev[prev.length - 1].nodeType && 3 === current.nodeType) {
                    prev[prev.length - 1].textContent += current.textContent;
                    return prev
                }
                prev.push(current);
                return prev
            },
            []);
        parent.innerHTML = "";
        parent.append(...newChildren)
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
    // let done = false;
    // let result = 0;
    // for (let i = 0; i <=10; i++) {
    //     let result0 = {};
    //     result0 = search(searchEl.value, content.querySelector("ul")).next();
    //     done = result0.done;
    //     result = result0.value;
    //     console.log (done, result, result0)
    // }
    if (search(searchEl.value, content.querySelector("ul")) === 0) {
        nothing.classList.remove("d-none");
    }
}

const searchEl = document.getElementById("inputSearch");
searchEl.addEventListener("input", debounce(searchOninput, 500));
searchBtn.onclick = searchOninput;