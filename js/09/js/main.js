//myfetch
function fetchAndParseJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}
//fetchAndParseJSON('https://swapi.dev/api/people/1/')
//     .then(luke => console.log(luke))

//countries
function addListOfOpinion(list = [], el) {
    el.innerHTML = ''
    for (let name of list){
        let option   = document.createElement('option')
        option.value     = name
        option.innerText = name
        el.appendChild(option)
    };
    return el;
}

let countries;
downloadCountriesAndCities.onclick = () => {
    fetchAndParseJSON('https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json')
        .then(
            (value) => {
                selectCountryAndCity.innerHTML += `
                    <select class="custom-select" id='selectCountry'></select>
                    <select class="custom-select" id='selectCity'></select>
                    <div class="result mt-4" id='chooseCity'></div>    
                `
                countries = value;
                selectCountry = addListOfOpinion(Object.keys(countries), selectCountry)

                selectCountry.onchange = () =>
                    selectCity = addListOfOpinion(countries[selectCountry.value], selectCity)
                selectCity.onchange = () =>
                    chooseCity.insertAdjacentHTML('beforeend', `You chose ${selectCity.value} in ${selectCountry.value}. `)
            },
            (er) => (console.log(er))
        )
}

//fetch basic
const addObjToDOMLikeDivs = function (el, obj) {
    let head = Object.values(obj)[0]
    el = createElWithText ("h3", el, [head]);
    for (let [key, value] of Object.entries(obj)) {
        el = createRowSW ("div", el, [head,key,value]);
    }
    return el
}

const fetchSWInfoAndAddToDOM = function (url, el) {
    fetch(url)
        .then(
            res => res.json(),
            (er) => (console.log(er))
        )
        .then(
            info => addObjToDOMLikeDivs (el, info),
            (er) => (console.log(er))
        )
}

function createElCreator(handler = function (el, parent, content = []) {return el}) { //abstract function for create an element, where handler is current function for content and attributes for the element
    return function (elTag = "div", parent, content = []) {
        let el = document.createElement(elTag);
        el = handler (el, parent, content);
        //console.log(elTag, parent, content)
        parent.appendChild(el);
        return parent
    }
}

//race
const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

const timeOut = (ms) => delay(ms)
    .then (
        res => (timeOutMsg(res)),
        (er) => (console.log(er))
    )

const timeOutMsg = (ms) => `Time ${ms / 1000} s is out`


//fetch improved
const onclickBtnSW = function (url, place) {
    place.innerHTML = ""
    if (raceCheck.checked) {
        Promise.race([
            fetchAndParseJSON (url),
            timeOut(+timeForRace.value * 1000)
        ])
            .then((value) => {
                if ("string" === typeof value) {
                    place = createElWithText ("h3", place, [value]);
                }
                else {
                    place = addObjToDOMLikeDivs(place, value)
                }
            });
    }
    else {place = fetchSWInfoAndAddToDOM (url, place)}
}

const createBtnSW = createElCreator((el, parent, [url, place]) => { //current creator
    let ind = url.indexOf('/api/')
    let name = url.slice(ind + 5).split("/").join(" ")
    el.setAttribute("type", "button");
    el.setAttribute("class", "btn btn-primary m-2");
    el.setAttribute("id", `download${name.split(" ").join("")}Info`);
    el.innerHTML = `View info about ${name}`;
    el.onclick = () => onclickBtnSW (url, place)
    return el
})

const createRowHeadSW = createElCreator((el, parent, [id, header]) => { //current creator
    el.setAttribute("class", "input-group-prepend w-25 align-self-stretch flex-shrink-0");
    el.innerHTML = `<span class="input-group-text w-100 h-100 text-uppercase" id=${id.split(" ").join("")}>${header}</span>`;
    return el
})

const createRowContentSW = createElCreator((el, parent, text) => { //current creator
    el.setAttribute("class", "input-group-prepend align-items-center flex-wrap p-2");
    if ('object' === typeof text) {
        for (let item of text) {
            if (-1 === item.indexOf('/api/')) {
                el.innerHTML += item + " "
            }
            else {
                el = createBtnSW ('button', el, [item, swInfo])
            };
        }
        return el
    }

    if (-1 === String(text).indexOf('/api/')) {
        el.innerHTML = text
        return el
    }
    el = createBtnSW ('button', el, [text, swInfo]);
    return el

})

const createRowSW = createElCreator((el, parent, [id,header,text]) => { //current creator
    el.setAttribute("class", "input-group mb-3 border flex-nowrap");
    el = createRowHeadSW ('div', el, [id, header]);
    el = createRowContentSW ('div', el, text);
    return el
})

const createElWithText = createElCreator((el, parent, [text]) => { //current creator
    el.innerText = text;
    return el
})


downloadLSInfo.onclick = () => {
    onclickBtnSW('http://swapi.dev/api/people/1/', swInfo)
}
