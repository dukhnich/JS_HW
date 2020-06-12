/**
 * @param ms
 * @returns {Promise<unknown>}
 */
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms);
    });
}

/**
 * @param url {string}
 * @returns {Promise<any>}
 */
async function myJsonFetch (url) {
    try {
        let data = await fetch(url);
        let json = await data.json();
        return json
    }
    catch (e) {
        console.log(e)
    }
}

/**
 * @param name {string}
 * @returns {*|string}
 */
function radioChecked (name = "") {
    let radios = document.getElementsByName(name);
    let value = "";
    for (let el of radios) {
        if (el.type === "radio" && el.checked) {
            value = el.value;
            return value;
        }
    }
}

/**
 * @param container {HTMLElement}
 * @param url {string}
 * @returns {Promise<void>}
 */
async function getRepositoriesList (container, url) {
    container.innerHTML = `<div class="spinner-border text-primary m-3" role="status">
  <span class="sr-only">Loading...</span>
</div>`;
    await wait(300);
    try {
        let data = await myJsonFetch(url);
        container.innerHTML = "";
        let repositories = data.items;
        if (!Array.isArray(repositories) || 0 === repositories.length) {
            throw "The data is not found"
        }
        container.appendChild(createRepositoriesList(repositories))
    }
    catch (err) {
        if (err === "The data is not found") {
            container.innerHTML = `<h2>${err}</h2>`
        }
        else {
            throw (err)
        }
    }
}

isOrderCheckbox.onchange = () => {
    if (isOrderCheckbox.checked) {
        orderCategories.disabled = false;
        orderAsc.disabled = false;
        orderDesc.disabled = false;
        return
    }
    orderCategories.disabled = true;
    orderAsc.disabled = true;
    orderDesc.disabled = true;
}

inputSearchBtn.onclick = () => {
    let request = "https://api.github.com/search/repositories?q=" + inputSearch.value;
    let radio = radioChecked("orderAscDesc");
    if (isOrderCheckbox.checked) {
        request += "&sort=" + orderCategories.value + "&order=" + radio
    }
    try {
        getRepositoriesList(repositoriesList, request)
    }
    catch (err) {
        repositoriesList.innerHTML = `<h2>Something wrong: ${err}</h2>`
    }
}

/**
 * @param list {[]}
 * @returns {HTMLUListElement}
 */
function createRepositoriesList(list = []) {
    let ul = document.createElement("ul");
    ul.setAttribute("class", "list-group")

    for (let repository of list) {
        let li = document.createElement("li");
        li.setAttribute("class", "list-group-item list-group-item-action d-flex align-items-center");
        let author = document.createElement("div");
        author.setAttribute("class", "alert alert-info mb-0 mr-3");
        author.innerText = repository.owner.login;
        let a = document.createElement("a");
        a.innerText = repository.name;
        a.setAttribute("href", repository.html_url);
        a.setAttribute("target", "_blank")
        li.append(author, a);
        ul.append (li);
    }
    return ul
}
