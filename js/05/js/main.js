// 3 persons
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


//loop of persons
for (let i = 0; i < persons.length; i++) {
    console.log(persons[i])
}

//loop of name and surname
for (let i = 0; i < persons.length; i++) {
    console.log(persons[i]["name"]);
    console.log(persons[i]["surname"]);
}

//fullName
for (let i = 0; i < persons.length; i++) {
    persons[i]["fullName"] = `${persons[i]["surname"]} ${persons[i]["name"]}`
    if (undefined !== persons[i]["fathername"]) {
        persons[i]["fullName"] += " "+persons[i]["fathername"]
    }
}


//fields check
//create list of keys
var personsKeys = {}
for (let i=0; i < persons.length; i++){
    for (let key in persons[i]) {
        personsKeys[key] = key
    }
}
//create list of additional keys
var additionalKeys = {}
for (let i=0; i < persons.length; i++){
    for (let key in personsKeys) {
        if ("undefined" === typeof (persons[i][key])) {
            additionalKeys[key] = key
        }
    }
}
//loop of additional keys of each person
for (let i = 0; i < persons.length; i++) {
    let str = persons[i].fullName + ": \n"
    for (let key in additionalKeys) {
        if (key in persons[i]) { //Is additional key in this person?
            if (key === "sex") { // add sex as string
                persons[i].sex ? str += "sex: male\n" : str += "sex: female\n"
            } else {
                str += `${key}: ${persons[i][key]}\n`
            }
        }
    }
    alert (str)
}

// serialize
var personsJson = JSON.stringify(persons)
console.log(personsJson)
console.log(typeof personsJson)

//deserialize
var e = JSON.parse('{"name": "Elvira", "surname": "Ende", "fathername": "Eduardovna", "age": 33, "sex": false}')
persons.push(e)
console.log(persons)

//HTML
var table = "";
table += '<table border = 1>'
table += '\n\t<tr>'
table += `\n\t\t<th>\n\t\t\tSurame\n\t\t</th>`
table += `\n\t\t<th>\n\t\t\tName\n\t\t</th>`
table += '</tr>'
for (let i=0; i < persons.length; i++){
    table += '\n\t<tr>'
    table += `\n\t\t<td>\n\t\t\t${persons[i]["surname"]}\n\t\t</td>`
    table += `\n\t\t<td>\n\t\t\t${persons[i]["name"]}\n\t\t</td>`
    table += '</tr>'
}
table += '</table>'
document.write(table)

//HTML optional fields
var table = "";
table += '<table border = 1>'
for (let i=0; i < persons.length; i++){
    table += '\n\t<tr>'
    for (let key in persons[i]) {
        table += `\n\t\t<td>\n\t\t\t${persons[i][key]}\n\t\t</td>`
    }
    table += '</tr>'
}
table += '</table>'
document.write(table)

//HTML tr color
var table = "";
table += '<table border = 1>'
for (let i=0; i < persons.length; i++){
    if (i%2) {
        table += '\n\t<tr bgcolor="lightgrey">'
    }
    else {table += '\n\t<tr>'}
    for (let key in persons[i]) {
        table += `\n\t\t<td>\n\t\t\t${persons[i][key]}\n\t\t</td>`
    }
    table += '</tr>'
}
table += '</table>'
document.write(table)

//HTML th optional
var table = "";
table += '<table border = 1>'
table += '\n\t<tr bgcolor="#90ee90">'
//draw table header
for (let key in personsKeys){ //list of keys from the task 'fields check'
    table += `\n\t\t<th>\n\t\t\t${personsKeys[key]}\n\t\t</th>`
}
table += '</tr>'
//draw table content
for (let i=0; i < persons.length; i++){
    if (i%2) {
        table += '\n\t<tr bgcolor="lightgrey">'
    }
    else {table += '\n\t<tr>'}
    for (let key in personsKeys) {
        if (personsKeys[key] in persons[i]) {
            table += `\n\t\t<td>\n\t\t\t${persons[i][personsKeys[key]]}\n\t\t</td>`
        }
        else {
            table += `\n\t\t<td></td>`
        }
    }
    table += '</tr>'
}
table += '</table>'
document.write(table)

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
    strHtmlTree += `</${objectHtml[tag]}>`
    return strHtmlTree;
}

document.write(createHtmlTree(someTree, "tagName", "attrs", "text", "subTags"))

var body = {
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

document.write(createHtmlTree(body, "name", "atr", "content", "children"))

//predict: object
var userHistory = "1111";
var predictObject = {};
//fill the structure of predictArray
for (let i = 0; i < 16; i++) {
    predictObject[i.toString(2)] = Math.floor(Math.random()*2);
}
while (confirm("Do you want to play 'heads or tails'?")) {
    let prediction = ((1 === predictObject[userHistory]) ? 'head' : 'tail')
    console.log(prediction)
    userHistory += (predictObject[userHistory] = Number(confirm("Your prediction is ready. Do your choose the head?")))
    userHistory = userHistory.substring(1)
    let userTurn = ((1 === +(userHistory[3])) ? 'head' : 'tail')
    alert (`Your prediction was ${prediction} and your turn was ${userTurn}`)
}
