#  Духнич Марина FEA19 JS HW 04  
## html to js
```javascript
let body = {
    name: 'body',
    atr: {},
    children: [
        {
            name: 'div',
            atr: {},
            children: [
                {
                    name: 'span',
                    atr: {},
                    children: [],
                    content: "Enter a data please:"
                }, 
                {
                    name: 'br',
                    atr: {},
                    children: [],                
                },
                {
                    name: "input",
                    atr: {
                        id: "name",
                        type: "text"
                    },
                    children: []               
                },
                {
                    name: "input",
                    atr: {
                        id: "surname",
                        type: "text"
                    },
                    children: []
                }                
            ]       
        },
        {
            name: 'div',
            atr: {},
            children: [
                {
                    name: "button",
                    atr: {
                        id: "ok"
                    },
                    children: [],
                    content: "OK"               
                },
                {
                    name: "button",
                    atr: {
                        id: "cancel"
                    },
                    children: [],
                    content: "Cancel" 
                }                
            ]       
        }
    ]
}
console.log (body.children[1].children[1].content)
console.log (body.children[0].children[3].atr.id)
```

## declarative fields
```javascript
var notebook0 = {
    brand: "HP",
    type:  "440 G4",
    model: "Y7Z75EA",
    ram: 4,
    size: "14",
    weight: 1.8,
    resolution: {
        width: 1920,
        height: 1080
    },
};

var phone0 = {
    brand: "meizu",
    model: "m2",
    ram: 2,
    color: "black",
};

var person0 = {
    name: "Donald",
    surname: "Trump",
    married: true,
}

const fillPropertyOfNewObject = function(idealObject, idealKey, newObject, parentObjectName){
    if ("object" === typeof idealObject[idealKey]){
        newObject[idealKey] = fillNewObject(idealObject[idealKey], `${idealKey} of ${parentObjectName}`)
        return;
    }
    else if ("boolean" === typeof idealObject[idealKey]){
            newObject[idealKey] = confirm(idealKey + "?")
            return;
        }
    var newValue = prompt(`Enter a ${idealKey} of ${parentObjectName}`)
    if ("string" === typeof idealObject[idealKey]){
        newObject[idealKey] = newValue
    }
    else if ("number" === typeof idealObject[idealKey]){
        newObject[idealKey] = +newValue
    }
}

const fillNewObject = function (IdealObject,name) {
    var newObject = {};
    for (let idealObjectKey in IdealObject) {
        fillPropertyOfNewObject (IdealObject, idealObjectKey, newObject, name)
    }
    return newObject;
}

var notebook = fillNewObject(notebook0,`notebook`)
var phone = fillNewObject(phone0,`phone`)
var person = fillNewObject(person0,`person`)
```

## объект или массив с единственным элементом со ссылкой на самого себя
```javascript
notebook["owner"] = person;
phone["owner"] = person;
person["laptop"] = notebook;
person["smartphone"] = phone;
console.log(person.smartphone.owner.laptop.owner.smartphone == person.smartphone)
```

## объект или массив с единственным элементом со ссылкой на самого себя
```javascript
var arr = []
arr.push(arr) 
```

## imperative array fill 3
```javascript
var arrayFill = []
for (let i=0; i<3; i++) {
    arrayFill.push(prompt("Enter an array element"))
}
alert("Your data: " + arrayFill.valueOf())
```

## Напишите аналогичный цикл while1
```javascript
var arrayFill = []
var i=0;
while (i<3) {
    arrayFill.push(prompt("Enter an array element"));
    i++;
}
alert("Your data: " + arrayFill.valueOf())
```

## Напишите аналогичный цикл while2
```javascript
var i=10, str="";
while (i>0) {
    console.log(i, str);
    i--;
    str+="#"
}
alert("Your data: " + arrayFill.valueOf())
```

## Выведите какую-либо строку побуквенно, используя цикл for. Длина массива или строки находится в свойстве length.
```javascript
var str = prompt("Enter some text");
if (null === str) {}
else if ("" === str) {
    alert("This is empty string")
}
else {
    for (i = 0; i < str.length; i++){
        console.log(str[i]);
    }
}
```

##  Перепишите так, что бы можно было сконкатенировать массив с любым количеством элементов, используя цикл for. 
```javascript
var arrayFill = []
while (confirm("Do you want to add a new element?")) {
    arrayFill[arrayFill.length] = prompt("Enter an array element")
}
var strFromArray = ''
for (let i = 0; i < arrayFill.length; i++) {
        strFromArray += String(arrayFill[i])
    }
alert("Your data: " + strFromArray)
```

## while confirm
```javascript
while (!confirm("Are you agree?")){}
```

## array fill
```javascript
var arrayFill = []
while (confirm("Do you want to add a new element?")) {
    arrayFill.push(prompt("Enter an array element"))
}
alert("Your data: " + arrayFill.valueOf())
```

## array fill nopush
```javascript
var arrayFill = []
while (confirm("Do you want to add a new element?")) {
    arrayFill[arrayFill.length] = prompt("Enter an array element")
}
alert("Your data: " + arrayFill.valueOf())
```

## infinite probability
```javascript
var i
for (i=1; i>0; i++) {
    if (Math.random() > 0.9) {
        break;
    }
}
alert("Number of iterations: " + i)
```

## empty loop
```javascript
while (null === prompt("Enter some information")){}
```

## progression sum
```javascript
var arr = []
var n = +prompt("Enter a number for progression sum with step 3")
if (!(n > 0)) {
    alert("This is not a number")
    }
else {
    for (let i = 0; i < n; i++) {
        arr [i] = 3*i + 1;
    }
    alert(`${n} step equal ${arr[arr.length - 1]}`)
}
```

## chess one line
```javascript
var str = ""
var n = +prompt("Enter a number for the chess line")
if (!(n > 0)) {
alert("This is not a number")
}
else {
for (let i = 0; i < n; i++) {
        if (i % 2) {
            str += "#";
        }
        else {
            str += " ";
        }
    }
    alert(str)
}
```

## numbers
```javascript
var str = "";
for (let i = 0; i < 10; i++){
    for (let j=0;j<10;j++){
        str += j;
    }
    str += "\n"
}
alert(str);
```

## chess
```javascript
var str = "";
var y = +prompt("Enter a number of vertical chess squares")
if (!(y > 0)) {
    alert("This is not a number")
}
else {
    var x = +prompt("Enter a number of horizontal chess squares")
    if (!(x > 0)) {
        alert("This is not a number")
    }
    else {
        for (let i = 0; i < y; i++){
            for (let j = 0; j < x; j++){
                if (i % 2) {
                    if (j % 2) {
                        str += " . ";
                    }
                    else {
                        str += "#";
                    }
                }
                else if (j % 2) {
                    str += "#";
                    }
                else {
                    str += " . ";
                }
            }
            str += "\n"
        }
        alert(str);
    }
}
```

## cubes
```javascript
var arr = [];
var n = +prompt("Enter a number")
if (!(n > 0)) {
    alert("This is not a number")
}
else {
    for (let i = 0; i < n; i++) {
        arr [i] = i**3;
    }
    alert(arr.valueOf())
}
```

## multiply table
```javascript
var arr = [];
for (let i = 0; i <= 10; i++){
    arr[i] = [];
    if (0 === i) {
        for (let j = 0; j <= 10; j++){
            arr[i][j] = j;
        }
    }
    else {
        for (let j = 0; j <= 10; j++){
            if (0 === j) {arr[i][j] = i}
            else {arr[i][j] = i*j}
        }
    }
}
alert(arr.valueOf())
```
## matrix to html table
```javascript
const matrixToHtmlTable = function (userMatrix) {
    document.write('<table>')
    for (let i = 0; i < userMatrix.length; i++){
        document.write('\n\t<tr>')
        for (let j = 0; j < userMatrix[i].length; j++){
            document.write(`\n\t\t<td>\n\t\t\t${userMatrix[i][j]}\n\t\t</td>`)
        }
        document.write('</tr>')
    }
    document.write('</table>')
}
matrixToHtmlTable(arr)
```

## triangle
```javascript
var str = "";
var n = +prompt("Enter a number of items in one line")
if (!(n > 0)) {
    alert("This is not a number")
}
else {
    for (let i = 0; i<(Math.floor(n/2)+1); i++){
        let j = 0
        for (; j < (n - (n % 2 + i*2))/2; j++){
            str += " . ";
        };
        for (; j < (n + (n % 2 + i*2))/2; j++){
            str += "#";
        };
        for (; j < n; j++){
            str += " . ";
        };
        str += "\n"
    }
    alert(str);
}
```

## predict
```javascript
var userHistory = [1,1,1,1];
var predictArray = [];
//fill the structure of predictArray
for (let i0 = 0; i0 < 2; i0++) {
    predictArray[i0] = [];
    for (let i1 = 0; i1 < 2; i1++) {
        predictArray[i0][i1] = [];
        for (let i2 = 0; i2 < 2; i2++) {
            predictArray[i0][i1][i2] = [];
            for (let i3 = 0; i3 < 2; i3++) {
                predictArray[i0][i1][i2][i3] = Math.floor(Math.random()*2);
            }           
        }
    }
}
while (confirm("Do you want to play 'heads or tails'?")) {
    let prediction = ((1 === predictArray[userHistory[0]][userHistory[1]][userHistory[2]][userHistory[3]]) ? 'head' : 'tail')
    console.log(prediction)
    userHistory.push(predictArray[userHistory[0]][userHistory[1]][userHistory[2]][userHistory[3]] = Number(confirm("Your prediction is ready. Do your choose the head?")))
    userHistory.shift()
    let userTurn = ((1 === userHistory[3]) ? 'head' : 'tail')
    alert (`Your prediction was ${prediction} and your turn was ${userTurn}`)
}
```