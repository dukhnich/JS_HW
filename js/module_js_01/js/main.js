/**
 * Type Stats (1)
 * @param arr {[]}
 * @returns {{}}
 */
const typeStats = function (arr = []) {
    let resultObj = {}
    for (let i of arr) {
        let type = typeof i;
        type in resultObj ? resultObj[type]++ : resultObj[type] = 1;
    }
    return resultObj
}
var arr = ['1', 0, Math.random, alert, prompt, prompt(), null, undefined, "name", {}]
typeStats(arr); //вернет { string: 3 /* или два */, number: 1, function: 3, object: 2 /* или три */, undefined: 1}

/**
 * Intersect (2)
 * @param arr1 {[]}
 * @param arr2 {[]}
 * @returns {[]}
 */
const intersect = function (arr1 = [], arr2 = []) {
    let resultArr = [];
    for (let i of arr1) {
        arr2.includes(i) && resultArr.push(i)
    }
    return resultArr
}
var a = [1,2,3,4]
var b = [3,4,5,6]
intersect(a,b); //[3,4]

/**
 * function from homework about forms constructor
 * @param el {HTMLElement}
 * @param newClass {string}
 * @returns {HTMLElement}
 */
const addClass = function(el, newClass = "") {
    let cl = el.getAttribute('class')
    if (null === cl) {cl = ""}
    let classIndex = cl.indexOf(newClass);
    if (-1 === classIndex && newClass.length > 0) {
        el.setAttribute('class', cl ?  cl + ' ' + newClass : newClass);
    }
    return el
}
/**
 * oddEvenClass (3)
 * @param el {HTMLElement}
 * @param classOdd {string}
 * @param classEven {string}
 */
const oddEvenClass = function (el, classEven = '', classOdd = '') {
    let children = el.children
    for (let i = 0; i < children.length; i++) {
        i % 2 ? addClass(children[i], classEven) : addClass(children[i], classOdd);
    }
}
//oddEvenClass(tbody, 'light', 'dark') //установит всем детям tbody, т. е. tr, классы light и dark через один, сделав подсветку зеброй
oddEvenClass(ul, 'light', 'dark') // аналогично для всех li

/**
 * UpScroll (4)
 * но тут все плохо, не меньше половины времени от всех заданий + датасет сама не нашла, подсказали, полагаю, предполагался какой-то другой путь решения на основании изученного материала, но такого не нагуглилось
 * @param el {HTMLElement}
 */
const upScroll = function (el) {
    el.addEventListener('click', function () {
        if (undefined === el.dataset.sclollScreenY) {
            el.dataset.sclollScreenY = window.scrollY;
            window.location.hash = "#";
            return
        }
        window.scroll(0, el.dataset.sclollScreenY);
        delete el.dataset.sclollScreenY
    })
}
upScroll(scroll1)

/**
 * Tabs (5)
 * @param arrWithObjectsWithPairsBtnBlock {[]}
 */
const tabs = function (arrWithObjectsWithPairsBtnBlock = []) {
    let blocks = [];
    for (let pair of arrWithObjectsWithPairsBtnBlock) {
        let currentBlock = pair.block;
        null !== currentBlock && blocks.push(currentBlock);
    }
    for (let pair of arrWithObjectsWithPairsBtnBlock) {
        let currentBlock = pair.block;
        let currentButton = pair.button;
        if  (null !== currentButton) {
            currentButton.onclick = (event) => {
                for (let blockItem of blocks) {
                    blockItem === currentBlock ? blockItem.hidden = false : blockItem.hidden = true;
                }
            }
        }
    }
}
tabs([{button: tab1, block: div1},{button: tab2, block: div2},{button: tab3, block: div3}]) //при запуске всё прячется кроме div1, потом по клику на tabN включается divN


//Time:3h45min