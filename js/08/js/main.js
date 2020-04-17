//multiply table to DOM
function changeBgColor(element){
    let parentColor = element.parentElement.getAttribute ("bgcolor");
    let columnNumber = element.cellIndex;
    element.onmouseover = function (event){
        for (let i of element.parentElement.parentElement.children) {
            i.children[columnNumber].setAttribute("bgcolor", "lightblue");
        }
        this.parentElement.setAttribute("bgcolor", "lightblue");
        this.setAttribute("bgcolor", "yellow");
    }
    element.onmouseout = function (event){
        for (let i of element.parentElement.parentElement.children) {
            (i % 2) ?
                i.children[columnNumber].setAttribute("bgcolor", parentColor) :
                i.children[columnNumber].removeAttribute("bgcolor");
        }
        parentColor ?
            this.parentElement.setAttribute("bgcolor", parentColor) :
            this.parentElement.removeAttribute("bgcolor");
        this.removeAttribute("bgcolor");
    }
}

const matrixToDOMTable = function (userMatrix=[]) {
    let table= document.createElement('table')
    table.setAttribute("class", "table ");
    for (let i = 0; i < userMatrix.length; i++){
        let tr= document.createElement('tr')
        if (i%2) {
            tr.setAttribute("bgcolor", "lightgrey");
        }
        for (let j = 0; j < userMatrix[i].length; j++){
            if (0 === i || 0 === j) {
                let th= document.createElement('th');
                th.setAttribute("class", "table-dark");
                th.innerText = userMatrix[i][j];
                tr.appendChild(th);
            }
            else {
                let td = document.createElement('td')
                td.innerText = userMatrix[i][j];
                tr.appendChild(td);
                changeBgColor(td)
            }
        }
        table.appendChild(tr);
    }
    return table
}

let multiplyMatrix = [];
for (let i = 0; i <= 10; i++){
    multiplyMatrix[i] = [];
    if (0 === i) {
        for (let j = 0; j <= 10; j++){
            multiplyMatrix[i][j] = j;
        }
    }
    else {
        for (let j = 0; j <= 10; j++){
            if (0 === j) {multiplyMatrix[i][j] = i}
            else {multiplyMatrix[i][j] = i*j}
        }
    }
}

const wrapperMultiplyTable = document.querySelector("#DrawMultiplyTable .result")
drawTable.onclick = () => {
    wrapperMultiplyTable.innerHTML = ""
    wrapperMultiplyTable.appendChild(matrixToDOMTable(multiplyMatrix))
}
//var MultiplyTableTd = document.querySelectorAll("#DrawMultiplyTable .result td")
//MultiplyTableTd.forEach(function(element){
//    element.addEventListener('mouseover',changeBgColor)
//})

const calcMultiplicityOfPages = function (numberOfPages=2, numberOfPagesInSection=2) {
    return numberOfPages % numberOfPagesInSection;
}
const calcConditionalPrintedSheets = function (sheetWidth = 1, sheetHeight = 1, numberOfPages=2, numberOfPagesInSection=2) {
    let standartSheetSize = 60 * 90; //Один условный печатный лист, стандарт
    let sheetSize    = sheetWidth * sheetHeight //размер печатного листа
    return Math.round((numberOfPages / numberOfPagesInSection * (sheetSize / standartSheetSize))*1000)/1000;
}

function Book(bookName, sheetWidth, sheetHeight, numberOfPagesInSection, numberOfPages){
    this.bookName    = bookName,
    this.sheetWidth = sheetWidth, //ширина печатного листа
    this.sheetHeight    = sheetHeight, //высота печатного листа
    this.numberOfPagesInSection = numberOfPagesInSection, //доля листа
    this.numberOfPages = numberOfPages,
    this.multiplicityOfPages = calcMultiplicityOfPages (this.numberOfPages,this.numberOfPagesInSection); //количество страниц сверх кратности - например, для вывода предупреждения о нечетном количестве и некратности доле листа
    this.conditionalPrintedSheets = calcConditionalPrintedSheets (this.sheetWidth, this.sheetHeight, this.numberOfPages, this.numberOfPagesInSection)  //количество условных печатных листов
}

const wrapperConditionalPrintedSheets = document.querySelector("#calcConditionalPrintedSheets .result")
calcConditionalPrintedSheetsBtn.onclick = () => {
    let book = new Book(bookName.value, sheetWidth.value, sheetHeight.value, numberOfPagesInSection.value, numberOfPages.value)
    let p = document.createElement('p')
    p.innerText = `The book "${book.bookName}" has ${book.conditionalPrintedSheets} conditional printed sheets, ${book.multiplicityOfPages} pages is beyond number of pages in the section — ${book.numberOfPagesInSection}`
    wrapperConditionalPrintedSheets.innerHTML = ""
    wrapperConditionalPrintedSheets.appendChild(p)
}

//calc live
sheetWidth.oninput = sheetWidth.oninput = sheetHeight.oninput = numberOfPagesInSection.oninput = numberOfPages.oninput =  () => { //work when change one of inputs
    multiplicityOfPages.placeholder = calcMultiplicityOfPages (numberOfPages.value, numberOfPagesInSection.value);
    conditionalPrintedSheets.placeholder = calcConditionalPrintedSheets (sheetWidth.value, sheetHeight.value, numberOfPages.value, numberOfPagesInSection.value);
}


//socket
const socket = io("http://socketchat.fs.a-level.com.ua/")
let messangerHistory = document.querySelector("#messanger .result")
socket.on('msg', data => messangerHistory.prepend(addMsgToHistory (data.nick, data.message)))
sendMsgBtn.onclick = () => {
    socket.emit('msg', {nick: nickName.value, message: newMsg.value})
}

const addMsgToHistory = function (nick, msg) {
    let p = document.createElement('p')
    p.innerHTML = `<b>${nick}:</b> ${msg}`
    return p
}

