/**
 * objectToPairs (1)
 * @param obj {{}}
 * @returns {[]}
 */
const objectToPairs = function (obj = {}) {
    let resultArray = []
    for (let [key,value] of Object.entries(obj)) {
        resultArray.push(key, value)
    }
    return resultArray
}
var obj = { foo: 1,
    bar: null,
    baz: undefined
}

objectToPairs(obj) // возвращает ['foo', 1, 'bar', null, 'baz', undefined]

/**
 * objectSplit (1)
 * @param obj {{}}
 * @returns {{}}
 */
const objectSplit = function (obj = {}) {
    let resultObj = {};
    let arrOfKeys = [];
    let arrOfValues = [];
    for (let [key,value] of Object.entries(obj)) {
        arrOfKeys.push(key);
        arrOfValues.push(value);
    }
    resultObj.keys = arrOfKeys;
    resultObj.values = arrOfValues;
    return resultObj
}

var obj = { foo: 1,
    bar: null,
    baz: undefined
}

objectSplit(obj) // {keys: ['foo', 'bar', 'baz'], values: [1, null, undefined]}

/**
 * setPropertyBySelector (2)
 * @param selector {string}
 * @param property {string}
 * @param propertyValue
 */
const setPropertyBySelector = function (selector = "div", property = 'class', propertyValue) {
    let elementsArray = document.querySelectorAll(selector);
    for (let element of elementsArray) {
        element[property] = propertyValue;
    }
}
setPropertyBySelector("td > li", 'onclick', function(){
    alert('click on td > li')
})

//setPropertyBySelector("td", 'innerHTML', 'испортим все td на странице')
//setPropertyBySelector("h2", 'innerText', 'испортим все заголовки на странице')

/**
 * scrollButtons (3)
 * @param el {HTMLElement}
 * @param scrollSize {number}
 */
const scrollButtons = function (el, scrollSize = 10) {
    let up = document.createElement("button");
    up.innerText = "Up";
    up.addEventListener('click', function () {
        el.scroll(0, el.scrollTop  -(+scrollSize));
    })
    let down = document.createElement("button");
    down.innerText = "Down"
    down.addEventListener('click', function () {
        el.scroll(0, el.scrollTop  +(+scrollSize));
    })
    let left = document.createElement("button");
    left.innerText = "Left"
    left.addEventListener('click', function () {
        el.scroll(el.scrollLeft  -(+scrollSize), 0);
    })
    let right = document.createElement("button");
    right.innerText = "Right"
    right.addEventListener('click', function () {
        el.scroll(el.scrollLeft + (+scrollSize), 0);
    })
    el.parentElement.append (left, up, down, right)
}

var element = document.getElementById('someId'); //у вас должен быть где-то элемент с id=someId и overflow: auto или hidden
scrollButtons(element, 50) // теперь element можно скроллить по кнопкам на 50 пикселей.


/**
 * table Editor (4)
 * @param container {HTMLElement}
 * @param content {[{}]}
 */
const tableEditor = function (container, content) {
    //create list of keys
    let headers = {}
    for (let i=0; i < content.length; i++){
        for (let key in content[i]) {
            headers[key] = key;
        }
    }
    console.log(headers)
    let table = document.createElement('table');
    table.setAttribute("border", 1);
    let headerTr = document.createElement("tr");
    table.appendChild(headerTr);
//draw table header
    for (let key in headers){
        let headerTh = document.createElement("th");
        headerTh.innerHTML = headers[key];
        headerTr.appendChild(headerTh);
    }
//draw table content
    for (let i=0; i < content.length; i++){
        let contentTr = document.createElement("tr");
        table.appendChild(contentTr);
        for (let key in headers) {
            let contentTd = document.createElement("td");
            if (headers[key] in content[i]) {
                contentTd.innerHTML = content[i][headers[key]];
            }
            contentTr.appendChild(contentTd);
            contentTd.ondblclick = () => {
                let value = ""
                let input = contentTd.querySelector("input")
                if (null !== input) {
                    value = input.value;
                    contentTd.innerText = value;
                    content[i][headers[key]] = value;
                    return;
                }
                value = contentTd.innerText;
                contentTd.innerText = "";
                input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("value", value);
                contentTd.appendChild(input);
            }
        }
    }
    container.innerHTML = "";
    container.appendChild(table)
}



var a = {
    name: "Alice",
    surname: "Ainik"
}
var b = {
    name: "Bob",
    surname: "Brown"
}
var c = {
    name: "Charlie",
    surname: "Clain"
}

//different fields
a.sex = false; //male - true, female - false
b.sex = true;
a.fathername = "Artemovna"
c.age = 0
b.age = 35

//array of persons
var persons = []
persons[0] = a
persons[1] = b
persons[2] = c
persons[3] = {
    name: "Dave",
    surname: "Darling",
    age: 10,
    sex: true
}

tableEditor(tableWrapper, persons)

//Time:2h15min