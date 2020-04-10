const validatedNumber = (value) => (!isNaN(+value) && ("boolean" !== typeof value))

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

function prepareArrayWithNumbers (){ //A there only numbers && convert to the type Numbers
    if (!validatedNumbersInArray(...arguments)) {return}
    return convertToNumberInArray(...arguments)
}

//es6 function to es5
function sqr(x=1){
    [x] = prepareArrayWithNumbers(x)
    return x*x
}
//alert(sqr(2))

function mul(x=1, y=1){
    [x,y] = prepareArrayWithNumbers(x,y)
    return x*y
}
//alert(mul(2,5))

function objectCreator(x,y){
    return {x,y}
}
//console.log(objectCreator(4,5))

function longFunc (x,y) {
    let result = prompt(x,y);
    return result;
}
//longFunc('check', 'text')

const a = (msg = 'Ok') => alert(msg)
//a("Привет!") // вызывает alert("Привет!")

function cube(num=1){
    [num] = prepareArrayWithNumbers(num)
    return num**3
}

function avg2(a=0, b=0){
    [a,b] = prepareArrayWithNumbers(a,b)
    return ((a + b)/2)
}
//avg2(1,2) // возвращает 1.5
//avg2(10,5) // возвращает 7.5

function sum3(a=0, b=0, c=0){
    [a,b,c] = prepareArrayWithNumbers(a,b,c)
    return (a + b + c)
}
//sum3(1,2,3) // => 6
//sum3(5,10,100500) // => 100515
//sum3(5,10) // => 15

function intRandom(lowerBound=0, upperBound){
    if (undefined === upperBound) {
        upperBound = lowerBound;
        lowerBound = 0
    }
    [lowerBound, upperBound] = prepareArrayWithNumbers(lowerBound, upperBound)
    return Math.floor(Math.random()*(upperBound - lowerBound + 1) +  lowerBound)
}
//intRandom(2,15) // возвращает целое случайное число от 2 до 15 (включительно)
//intRandom(-1,-1) // вернет -1
//intRandom(0,1) // вернет 0 или 1
//intRandom(10) // вернет 0 до 10 включительно

function greetAll(){
    let msgHello = "Hello"
    //if we want literally alert from the task:
    //for (let name of arguments) {
    //    msgHello += ' '+name+','
    //}
    //msgHello = msgHello.substring (0,msgHello.length - 1)
    for (let name of arguments) {
        msgHello += ", " +name
    }
    msgHello +="!"
    return msgHello
}
//greetAll("Superman") // выводит alert "Hello Superman"
//greetAll("Superman", "SpiderMan") // выводит alert "Hello Superman, SpiderMan"
//greetAll("Superman", "SpiderMan", "Captain Obvious") // выводит alert "Hello Superman, SpiderMan, Captain Obvious"

function sum(){
    let sum = 0
    let numbers = prepareArrayWithNumbers(...arguments)
    for (let i of numbers) {
        sum += i
    }
    return sum
}
//sum(1) // => 1
//sum(2) // => 2
//sum(10,20,40,100) // => 170

function union (name, ...param) {
    switch (name){
        case "sqr": return sqr(...param)
        case "mul": return mul(...param)
        case "objectCreator": return objectCreator(...param)
        case "longFunc": return longFunc(...param)
        case "a": return a(...param)
        case "cube": return cube(...param)
        case "avg2": return avg2(...param)
        case "sum3": return sum3(...param)
        case "intRandom": return intRandom(...param)
        case "greetAll": return greetAll(...param)
        case "sum": return sum(...param)
        default: alert("I don't know this function")
    }
}
//var functionName = prompt("Enter a function name")
//var functionParameters = []
//var iParam
//do {
//    iParam = prompt("Enter one function parameter")
//    functionParameters.push(iParam)
//} while (null !== iParam)
//union (functionName,...functionParameters)

var unionDeclarative = {
    sqr,
    mul,
    objectCreator,
    longFunc,
    a,
    cube,
    avg2,
    sum3,
    intRandom,
    greetAll,
    sum
}
btnDone.onclick = function(){
    let functionParameters = []
    let iParam = prompt("Enter one function parameter")
    while (null !== iParam) {
        functionParameters.push(iParam)
        iParam = prompt("Enter one function parameter")
    }
    console.log(functionParameters)
    tasksInformation.innerHTML += `<p>${unionDeclarative[tasksList.value](...functionParameters)}</p>`;
}

