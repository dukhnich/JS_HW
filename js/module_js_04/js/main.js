/**
 * extend
 * @param obj {{}}
 * @param extendedObj {{}}
 * @returns {{}}
 */
const extend = function (obj = {}, extendedObj = {}) {
    let resultObj = Object.assign({}, obj)
    for (let [key, value] of Object.entries(extendedObj)) {
        resultObj[key] = value;
    }
    return resultObj
}
var person0 = {name: "Иван", age: 17};

var extendedPerson = extend(person0, {surname: "Иванов", fatherName: "Иванович"});
console.log(extendedPerson, person0); //{name: "Иван", age: 17, surname: "Иванов", fatherName: "Иванович"}

/**
 * copy
 * @param obj {{}}
 * @returns {{}}
 */
const copy = function (obj = {}) {
    let resultObj = {};
    for (let [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            resultObj[key] = [...value];
        }
        else {
            resultObj[key] = value
        };
    }
    return resultObj
}
let keys0 = ["name", "surname"];
let person = { name: "Donald", surname: "Trump" };
let copiedObj = copy({array: keys0, object: person, number: 78, string: "jg"});
console.log(copiedObj);
person.name = 34;
keys0[0] = "sdfsd";
console.log(copiedObj, keys0, person);


/**
 * menuBuilder
 * @param elementId {string}
 * @param content {[]}
 */
const menuBuilder = function (elementId, content = []) {
    let el = document.getElementById(elementId);
    let ul = document.createElement("ul");
    el.appendChild(ul);
    for (let liData of content) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        li.appendChild(a);
        ul.appendChild(li);
        a.setAttribute("href", liData.href);
        a.innerText = liData.text;

    }
}
var menu = [{text: "google", href: "http://google.com"},
    {text: "ebay", href: "http://ebay.com"},
    {text: "ya", href: "http://ya.ru"},
];
menuBuilder("menuContainer", menu); //построить меню в элементе с id "menuContainer".

/**
 * gallery
 * @param elementId {string}
 * @param imgSrcArray {[]}
 */
const gallery = function (elementId, imgSrcArray = []) {
    let el = document.getElementById(elementId);
    let img = document.createElement('img');
    img.setAttribute("alt", "0");
    img.setAttribute("src", imgSrcArray[0]);
    let left = document.createElement("button");
    left.innerText = "<—"
    left.addEventListener('click', function () {
        let currentNumber = +img.getAttribute("alt");
        if (0 === currentNumber) {
            img.setAttribute("alt", `${imgSrcArray.length - 1}`);
            img.setAttribute("src", imgSrcArray[imgSrcArray.length - 1]);
            return
        }
        img.setAttribute("alt", `${currentNumber - 1}`);
        img.setAttribute("src", imgSrcArray[currentNumber - 1]);
    })
    let right = document.createElement("button");
    right.innerText = "—>"
    const imgToRight = function () {
        let currentNumber = +img.getAttribute("alt");
        if ((imgSrcArray.length - 1) === currentNumber) {
            img.setAttribute("alt", `0`);
            img.setAttribute("src", imgSrcArray[0]);
            return
        }
        img.setAttribute("alt", `${currentNumber + 1}`);
        img.setAttribute("src", imgSrcArray[currentNumber + 1]);
    }
    right.addEventListener('click', imgToRight);
    img.addEventListener('click', imgToRight);
    el.parentElement.append (left, img, right)
}

gallery("galleryContainer",["https://static33.cmtt.ru/paper-media/fd/92/e5/0479e08f8e852d.png", "http://s00.yaplakal.com/pics/pics_original/1/9/4/3736491.jpg"])


//multiplyTable - это несколько видоизмененный блок из дз № 8
/**
 * multiTableMatrix
 * @param number {number}
 * @returns {[]}
 */
const multiTableMatrix = function (number = 10) {
    let multiplyMatrix = []; //current array for table
    for (let i = 0; i <= number; i++){
        multiplyMatrix[i] = [];
        if (0 === i) {
            for (let j = 0; j <= number; j++){
                multiplyMatrix[i][j] = j;
            }
        }
        else {
            for (let j = 0; j <= number; j++){
                if (0 === j) {multiplyMatrix[i][j] = i}
                else {multiplyMatrix[i][j] = i*j}
            }
        }
    }
    return multiplyMatrix
}

let currentMultiTableMatrix = multiTableMatrix(17);

/**
 * abstract function for create tr, where handler is current function for attributes for tr
 * @param handler {function}
 * @returns {function(*=, *=, *=, *=): HTMLTableRowElement}
 */
function createTrCreator(handler = function (i, tbl, tr) {return tr}) {
    return function (i, tbl, iMax, jMax) {
        let tr = document.createElement('tr');
        tr = handler (i, tbl, tr, iMax, jMax);
        tbl.appendChild(tr);
        return tr
    }
}

/**
 * abstract function for create td, where handler is current function for content and attributes for td
 * @param handler {function}
 * @returns {function(*=, *=, *=, *=, *=, *=): HTMLTableDataCellElement}
 */
function createTdCreator(handler = function (i, j, tbl, tr, td) {return td}) {
    return function (i, j, tbl, tr, iMax, jMax) {
        let td = document.createElement('td');
        td = handler (i, j, tbl, tr, td, iMax, jMax);
        tr.appendChild(td);
        return td
    }
}

/**
 * abstract function-construction for functions for create table
 * @param createTr {function}
 * @param createTd {function}
 * @param tdEvents {{}}
 * @constructor
 */
function TableWorker (createTr = createTrCreator(), createTd = createTdCreator(), tdEvents = {}) {
    this.createTr = createTr,
        this.createTd = createTd,
        this.tdEvents = tdEvents // this is the object with items like "mousemove" : function (el) {console.log (el)},
}

/**
 * function for fill the table with current functions
 * @param container {HTMLElement}
 * @param iMax {number}
 * @param jMax {number}
 * @param createTr {function}
 * @param createTd {function}
 * @param tdEvents {{}}
 */
function fillTable (container, iMax, jMax, {createTr, createTd, tdEvents} = (tableWorker = new TableWorker ())) {
    let tbl = document.createElement("table");
    for (let i = 0; i < iMax; i++) {
        let tr = createTr (i, tbl, iMax, jMax);
        for (let j = 0; j < jMax; j++) {
            let td = createTd (i, j, tbl, tr, iMax, jMax);
            for (let event in tdEvents) {
                td.addEventListener(event,() => tdEvents[event](i, j, tbl, tr, td, iMax, jMax))
            }
        }
    }
    container.appendChild(tbl);
}

/**
 * current function for fill innerText for Td
 * @param i {number}
 * @param j {number}
 * @param td {HTMLTableDataCellElement}
 * @param userMatrix {[]}
 * @returns {HTMLTableDataCellElement}
 */
const fillTdText = (i,j, td, userMatrix) => {
    td.innerText = userMatrix[i][j];
    return td;
};

/**
 * current createTr
 * @type {function(*=, *=, *=, *=): HTMLTableRowElement}
 */
const createTrStripped = createTrCreator((i, tbl, tr, iMax, jMax) => {
    (i%2) && tr.setAttribute("bgcolor", "lightgrey");
    return tr;
})

/**
 * current createTd
 * @type {function(*=, *=, *=, *=, *=, *=): HTMLTableDataCellElement}
 */
const createTdMultiply = createTdCreator((i, j, tbl, tr, td, iMax, jMax) => {
    if (0 === i || 0 === j) {
        let th = document.createElement('th');
        th.setAttribute("bgcolor", "grey");
        th.setAttribute("style", "color: white;");
        td = th;
    }
    td.setAttribute("class", `${td.getAttribute('class')} row-${i} column-${j}`);
    td = fillTdText(i, j, td, currentMultiTableMatrix);
    return td;
})

/**
 * current tdOMOver
 * @param i {number}
 * @param j {number}
 * @param tbl {HTMLTableElement}
 * @param tr {HTMLTableRowElement}
 * @param td {HTMLTableDataCellElement}
 * @param iMax {number}
 * @param jMax {number}
 */
const tdOMOverTopLeftRectangle = function (i, j, tbl, tr, td, iMax, jMax) {
    let arrTdTopLeftRectangle = [];
    for (let m = 1; m <= i; m++) {
        for (let n = 1; n <= j; n++) {
            arrTdTopLeftRectangle.push(...tbl.querySelectorAll(`.row-${m}.column-${n}`))
        }
    }
    for (let item of arrTdTopLeftRectangle) {
        item.setAttribute("bgcolor", "lightblue");
    }
}

/**
 * current tdOMOut
 * @param i {number}
 * @param j {number}
 * @param tbl {HTMLTableElement}
 * @param tr {HTMLTableRowElement}
 * @param td {HTMLTableDataCellElement}
 * @param iMax {number}
 * @param jMax {number}
 */
const tdOMOutTopLeftRectangle = function (i, j, tbl, tr, td, iMax, jMax) {
    let arrTdTopLeftRectangle = [];
    for (let m = 1; m <= i; m++) {
        for (let n = 1; n <= j; n++) {
            arrTdTopLeftRectangle.push(...tbl.querySelectorAll(`.row-${m}.column-${n}`))
        }
    }
    for (let item of arrTdTopLeftRectangle) {
        item.removeAttribute("bgcolor");
    }
}

/**
 * current tdEvents
 * @type {{mouseover: tdOMOverTopLeftRectangle, mouseout: tdOMOutTopLeftRectangle}}
 */
const tdEventsTopLeftRectangle = {
    'mouseover' : tdOMOverTopLeftRectangle,
    'mouseout' : tdOMOutTopLeftRectangle,
}

let tableWorkerTopLeftRectangle = new TableWorker (createTrStripped, createTdMultiply, tdEventsTopLeftRectangle) //current tableWorker

let currentMultiplyTable = fillTable (multiplyTable, currentMultiTableMatrix.length, currentMultiTableMatrix[0].length, {createTr, createTd, tdEvents} = tableWorkerTopLeftRectangle) // fill table with current array and functions



//Time:2h10min