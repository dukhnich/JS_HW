const validatedNumber = (value) => (!isNaN(+value) && ("boolean" !== typeof value) && (null !== value))
function validatedNumbersInArray(...arr){
    for (let i of arr) {
        if (!validatedNumber(i)) {
            return false
        }
    }
    return true
}

function convertToNumberInArray(){
    return [...arguments].map((a) => +a)
}

function prepareArrayWithNumbers (){ //Are there only numbers && convert to the type Numbers
    if (!validatedNumbersInArray(...arguments)) {return}
    return convertToNumberInArray(...arguments)
}

const validatorTypeOfNumbers = (value) => //Is this a number?
    ("number" === typeof value) && (NaN !== value) ? value : false

const validatorTypeOfStrings = (value) => //Is this a string?
    "string" === typeof value ?  value : false

const validatorStringsAndNumbers = (value) => //Is this number or string?
    validatorTypeOfNumbers (value) || validatorTypeOfStrings (value) ?
        value : false


//sort
var persons = [
    {name: "Иван", age: 17},
    {name: "Мария", age: 35},
    {name: "Алексей", age: 73},
    {name: "Яков", age: 12},
]

function arrayOfObjectsSort(arr = [],key = '', order = true){
    let orderSort = order ? 1 : -1
    let result = arr.sort(function(a,b){
        let firstValue = validatorStringsAndNumbers(a[key]);
        let secondValue = validatorStringsAndNumbers(b[key]);
        let result = !firstValue && !secondValue ? 0 :
            !firstValue && secondValue ? 1 :
            firstValue && !secondValue ? -1 :
            firstValue > secondValue ? 1 : -1
        return result * orderSort;
    })
    return result
};
//sort(persons, "age"); //сортирует по возрасту по возрастанию
//sort(persons, "name", false); //сортирует по имени по убыванию

//array map
function convertJustNumbersInArray(arr=[]){
    return arr.map((a) => (validatedNumber(a) ? +a : a))
}
//convertJustNumbersInArray(["1", {}, null, undefined, "500", 700])

//array reduce
function multiplyJustNumbersInArray(arr=[]){
    return arr.reduce((a,b) => (!validatorTypeOfNumbers(a) ? b :
        validatorTypeOfNumbers(a) && !validatorTypeOfNumbers(b) ? a : a * b))
}
//multiplyJustNumbersInArray(["0", 5, 3, "string", null])

//object filter
function filterForObject(obj={},f){
    let result = {}
    for (let key in obj) {
        f(key,obj[key]) &&
        result[key] = obj[key]
    }
    return result
}
var phone = {
    brand: "meizu",
    model: "m2",
    ram: 2,
    color: "black",
};
//filterForObject(phone,(key,value) => key == "color" || value == 2);

//object map
function mapForObject(obj={},f){
    let result = {}
    for (let key in obj) {
        resultInner = f(key,obj[key])
        for (let key in resultInner) {
            result[key] = resultInner[key]
        }
    }
    return result
}
//mapForObject({name: "Иван", age: 17},function(key,value){
//     var result = {};
//     result[key+"_"] = value + "$";
//     return result;
// })

//Sum
function sumArithmProgr (a1=0,d=0,n=1) {
    [a1,d,n] = prepareArrayWithNumbers(a1,d,n)
    function f () {
        let sum = a1;
        if (n > 1) {
            sum += (--n) * d + sumArithmProgr(a1, d, n)
        }
        return sum
    }
    return f ()
}
//sumArithmProgr (1,2,100)

//HTML tree
var someTree = {
    tagName: "table", //html tag
    subTags: [ //вложенные тэги
        {
            tagName: "tr",
            subTags: [
                {
                    tagName: "td",
                    text: "some text",
                },
                {
                    tagName: "td",
                    text: "some text 2",
                }
            ]
        }
    ],
    attrs:
        {
            border: 1,
        },
}

const createHtmlTree = function (objectHtml, tag, attr, content, children) { //object and standart names of keys
    var strHtmlTree = "";
    strHtmlTree += `<${objectHtml[tag]}`
    if (attr in objectHtml) {
        for (let key in objectHtml[attr]) {
            strHtmlTree += ` ${key} = ${objectHtml[attr][key]}`
        }
    }
    strHtmlTree += `>`
    if (content in objectHtml) {
        strHtmlTree += objectHtml[content]
    }
    if (children in objectHtml) {
        for (let i=0; i < objectHtml[children].length; i++) {
            strHtmlTree += createHtmlTree(objectHtml[children][i], tag, attr, content, children)
        }
    }
    if (undefined !== objectHtml[content] || objectHtml[children].length > 0) {
        strHtmlTree += `</${objectHtml[tag]}>`
    }
    return strHtmlTree;
}

//document.write(createHtmlTree(someTree, "tagName", "attrs", "text", "subTags"))
