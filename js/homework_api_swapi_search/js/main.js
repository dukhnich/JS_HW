/**
 * Abstract function for create an element, where handler is current function for content and attributes for the element
 * @param handler{function(HTMLElement, ...[*]): HTMLElement}
 * @returns {function(*=, ...[*]): HTMLElement}
 */
function createElCreator(handler = function (el) {return el}) {
    return function (elTag = "div", ...context) {
        let el = document.createElement(elTag);
        el = handler (el, ...context);
        return el
    }
}

/**
 * @type {function(*=, ...[*]): HTMLElement}
 */
const createElWithTextAndAttributes = createElCreator((el, text = "", attr = {}) => {
    el.innerHTML = text;
    for (let [key, value] of Object.entries(attr)) {
        if ("boolean" === typeof value) {
            el[key] = value;
        }
        else {
            el.setAttribute(key, value);
        }
    };
    return el
})

/**
 *
 * @param el {HTMLElement}
 * @param oldClass {string}
 * @returns {HTMLElement}
 */
const removeClass = function(el, oldClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(oldClass);
    if (classIndex > -1 && oldClass.length > 0) {
        let newCl = cl.slice(0,classIndex) + cl.slice(classIndex + oldClass.length, cl.length)
        el.setAttribute('class', newCl)
    }
    return el
}

/**
 * @param el {HTMLElement}
 * @param newClass {string}
 * @returns {HTMLElement}
 */
const addClass = function(el, newClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(newClass);
    if (-1 === classIndex && newClass.length > 0) {
        el.setAttribute('class', el.getAttribute('class') + ' ' + newClass);
    }
    return el
}

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
 * add event when declarate and remove when void
 * @param event {string}
 * @param handler {function}
 * @param node {HTMLElement}
 * @returns {function(...[*]=)}
 */
const attachEvent = (event, handler, node = document) => {
    node.addEventListener(event, handler);
    return () => {
        node.removeEventListener(event, handler);
    };
};

/**
 * @param container {HTMLElement}
 */
function drawSpinner (container) {
    container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary m-3" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>`
}

/**
 * @param container {HTMLElement}
 * @param url {string}
 * @returns {{}}
 */
async function getResultsList (container, url) {
    try {
        let data = await myJsonFetch(url);
        container.innerHTML = "";
        let results = data.results;
        if (!Array.isArray(results) || 0 === results.length) {
             throw "The data is not found"
        }
        container.appendChild(createResultsList(results));
        return data
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

/**
 * @param container {HTMLElement}
 * @param paginationContainer {HTMLElement}
 * @param url {string}
 * @returns {Promise<void>}
 */
async function getSearchResult (container, paginationContainer, url) {
    drawSpinner (container);
    await wait(300);
    try {
        let data = await getResultsList (container, url);
        let count = data.count;
        if (count <= 10) {
            return
        }
        if (count <= 20) {
            paginationContainer.appendChild(new Pagination20(container, paginationContainer, data, url).fragment);
            return
        }
        if (count <= 30) {
            paginationContainer.appendChild(new Pagination30(container, paginationContainer, data, url).fragment);
            return
        }
        paginationContainer.appendChild(new PaginationMore30(container, paginationContainer, data, url).fragment);
    }
    catch (e) {
        console.log(e)
    }
}

/**
 * @param event
 */
inputSearchBtn.onclick = (event) => {
    event.preventDefault();

    pagination.innerHTML = ""
    let request = "https://swapi.dev/api/people/?search=" + inputSearch.value + "&page=1";
    try {
        getSearchResult(resultsList, pagination, request);
    }
    catch (err) {
        resultsList.innerHTML = `<h2>Something wrong: ${err}</h2>`
    }
}

/**
 * @param list {[]}
 * @returns {HTMLUListElement}
 */
function createResultsList(list = []) {
    let ul = createElWithTextAndAttributes ("ul", "", {"class": "list-group"});
    for (let result of list) {
        let li = createElWithTextAndAttributes ("li", "", {"class": "list-group-item list-group-item-action d-flex align-items-center"});
        li.setAttribute("class", "list-group-item list-group-item-action d-flex align-items-center");
        let name = createElWithTextAndAttributes ("div", result.name, {"class": "alert alert-info mb-0 mr-3"});
        let a = createElWithTextAndAttributes ("a", result.url, {"href": result.url, "target": "_blank"});
        li.append(name, a);
        ul.append (li);
    }
    return ul
}

class Pagination20 {
    constructor(resultsContainer, paginationContainer, data, url) {
        this.resultsContainer = resultsContainer;
        this.currentUrl = url;
        this.eventsArr = [];
        this.fragment = document.createDocumentFragment();
        this.nav = createElWithTextAndAttributes ("nav", "", {"aria-label": "Search results"});
        this.ul = createElWithTextAndAttributes ("ul", "", {"class": "pagination justify-content-center mt-3"});
        this.nav.appendChild(this.ul);
        this.fragment.appendChild(this.nav);
        this.page1 = this.drawLi("1", url);
        this.page2 = this.drawLi("2", data.next);
        this.ul.append(this.page1, this.page2);
        this.activePage = this.page1;
        this.data = data;
        /**
         * handler for MutationObserver
         * @param mutationsList {[]}
         * @param observer {{}}
         */
        const removeEvents = (mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.removedNodes && mutation.removedNodes.length > 0 && this.eventsArr.length > 0) {
                    for (let a of this.eventsArr) {
                        a()
                    }
                }
            }
        };
        const config = {
            childList: true
        };
        const observer = new MutationObserver(removeEvents)
        observer.observe(paginationContainer, config)
    }

    /**
     * @param text {string}
     * @param url {string}
     * @returns {HTMLElement}
     */
    drawLi (text = "1", url) {
        let classLi = "page-item";
        if (this.currentUrl === url && !isNaN(text)) {
            classLi += " active"
        }
        if (null === url || (this.currentUrl === url && isNaN(text))) {
            classLi += " disabled"
        }
        let page = createElWithTextAndAttributes ("li", "", {"class": classLi});
        let a = createElWithTextAndAttributes ("a", text, {"class": "page-link", "href": url});
        this.eventsArr.push(attachEvent("click", this.goToAnotherPage.bind(this), a));
        page.appendChild(a);
        return page
    }

    /**
     * @param event {event}
     * @returns {Promise<void>}
     */
    async goToAnotherPage (event) {
        event.preventDefault();
        let request = event.target.getAttribute("href");
        let data = await getResultsList(this.resultsContainer, request);
        this.currentUrl = request;
        if (!isNaN(event.target.innerText)){
        removeClass(this.activePage, "active");
        this.activePage = addClass(event.target.parentElement, "active");
        }
        this.data = data;
    }
}

class Pagination30 extends Pagination20 {
    constructor(container, paginationContainer, data, url) {
        super(container, paginationContainer, data, url);
        let url3 = url.slice(0, url.indexOf("&page=") + 6) + "3";
        this.page3 = this.drawLi("3", url3);
        this.ul.appendChild(this.page3)
    }
}

class PaginationMore30 extends Pagination30 {
    constructor(container, paginationContainer, data, url) {
        super(container, paginationContainer, data, url);
        this.liFirst = this.drawLi("First", url);
        this.liPrevious = this.drawLi("«", data.previous);
        this.ul.prepend(this.liFirst, this.liPrevious);
        this.liNext = this.drawLi("»", data.next);
        let urlLast = url.slice(0, url.indexOf("&page=") + 6) + Math.ceil(data.count / 10);
        this.liLast = this.drawLi("Last", urlLast);
        this.ul.append(this.liNext, this.liLast);
    }

    /**
     * @param event {event}
     * @returns {Promise<void>}
     */
    async goToAnotherPage (event) {
        await super.goToAnotherPage(event);
        this.liPrevious.querySelector("a").setAttribute("href", this.data.previous);
        if (null === this.data.previous) {
            addClass(this.liPrevious, "disabled");
            addClass(this.liFirst, "disabled");
        }
        else {
            removeClass(this.liPrevious, "disabled");
            removeClass(this.liFirst, "disabled");
        }
        this.liNext.querySelector("a").setAttribute("href", this.data.next);
        if (null === this.data.next) {
            addClass(this.liNext, "disabled");
            addClass(this.liLast, "disabled");
        }
        else {
            removeClass(this.liNext, "disabled");
            removeClass(this.liLast, "disabled");
        }
        if (!isNaN(event.target.innerText)) {
            return
        }
        if ("«" === event.target.innerText) {
            this.goPrevious.call(this);
            return
        }
        if ("»" === event.target.innerText) {
            this.goNext.call(this);
            return;
        }
        if ("First" === event.target.innerText) {
            this.goFirst.call(this);
            return
        }
        if ("Last" === event.target.innerText) {
            this.goLast.call(this);
            return;
        }
    }

    goFirst () {
        for (let i = 1; i < 4; i++) {
            let a = this[`page${i}`].querySelector("a");
            a.innerText = i
            a.setAttribute("href", a.href.slice(0, a.href.indexOf("&page=") + 6) + i)
        }
        removeClass(this.activePage, "active");
        this.activePage = addClass(this.page1, "active");
    }

    goLast () {
        for (let i = 3; i > 0; i--) {
            let num = Math.ceil(this.data.count / 10) + i - 3;
            let a = this[`page${i}`].querySelector("a");
            a.innerText = num;
            a.setAttribute("href", a.href.slice(0, a.href.indexOf("&page=") + 6) + num);
        }
        removeClass(this.activePage, "active");
        this.activePage = addClass(this.page3, "active");
    }

    goPrevious () {
        if (this.activePage === this.page1) {
            for (let i = 1; i < 4; i++) {
                this.changeNumber.call(this, this[`page${i}`], -1);
            }
            return
        }
        removeClass(this.activePage, "active");
        if (this.activePage === this.page2) {
            this.activePage = addClass(this.page1, "active");
            return;
        }
        this.activePage = addClass(this.page2, "active");
    }
    goNext () {
        if (this.activePage === this.page3) {
            for (let i = 1; i < 4; i++) {
                this.changeNumber.call(this, this[`page${i}`], 1);
            }
            return
        }
        removeClass(this.activePage, "active");
        if (this.activePage === this.page2) {
            this.activePage = addClass(this.page3, "active");
            return;
        }
        this.activePage = addClass(this.page2, "active");
    }

    /**
     * @param li {HTMLLIElement}
     * @param change {number}
     */
    changeNumber (li, change) {
        let a = li.querySelector("a");
        let aNum = +a.href.slice(a.href.indexOf("&page=") + 6) + change;
        a.innerText = aNum
        a.setAttribute("href", a.href.slice(0, a.href.indexOf("&page=") + 6) + aNum)
    }

}
