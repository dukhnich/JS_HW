// nickName.oninput = () => {
//     if (nickName.value) {
//         historyBtn.disabled = false;
//     }
//     else {
//         historyBtn.disabled = true;
//     }
// }

//historyBtn.onclick = () => {
//nextMessageId = getHistory (historyWrapper)

// jsonPost("http://students.a-level.com.ua:10012", {func: "getMessages", messageId: nextMessageId})
//     .then (
//         (history) => {
//             for (let item of history.data) {
//                 historyWrapper = createMsg ('div', historyWrapper, [item.nick, item.message, item.timestamp, nickName.value], true)
//             }
//             nextMessageId = history.nextMessageId;
//             //console.log(nextMessageId)
//             historyBtn.disabled = false;
//         },
//         (er) => {
//             console.log(er);
//             historyBtn.disabled = false;
//         }
//     )
// historyBtn.disabled = true;
//}

// function jsonPost(url, data)
// {
//     return new Promise((resolve, reject) => {
//         var x = new XMLHttpRequest();
//         x.onerror = () => reject(new Error('jsonPost failed'))
//         //x.setRequestHeader('Content-Type', 'application/json');
//         x.open("POST", url, true);
//         x.send(JSON.stringify(data))
//
//         x.onreadystatechange = () => {
//             if (x.readyState == XMLHttpRequest.DONE && x.status == 200){
//                 resolve(JSON.parse(x.responseText))
//             }
//             else if (x.status != 200){
//                 reject(new Error('status is not 200'))
//             }
//         }
//     })
// }

// const getHistory = function (place) {
//     jsonPost("http://students.a-level.com.ua:10012", {func: "getMessages", messageId: nextMessageId})
//         .then (
//             (history) => {
//                 for (let item of history.data) {
//                     place = createMsg ('div', place, [item.nick, item.message, item.timestamp, nickName.value], true)
//                 }
//                 nextMessageId = history.nextMessageId;
//                 // console.log(nextMessageId)
//             },
//             (er) => {
//                 console.log(er);
//             }
//         )
// }

// sendMsgBtn.onclick = () => {
//     sendMsgBtn.disabled = true;
//     // let currentNum = nextMessageId
//     jsonPost("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nickName.value, message: newMsg.value})
//         .then ((num) => {
//             if (num.nextMessageId > nextMessageId) {
//                 newMsg.value = '';
//             }
//             else {
//                 newMsg.setAttribute('class', 'form-control is-invalid')
//             }
//             //console.log(num.nextMessageId)
//             },
//             (er) => console.log(er))
// }

// sendMsgBtn.onclick = async function () {
//     sendMsgBtn.disabled = true;
//     let num = await jsonPostFetch("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nickName.value, message: newMsg.value})
//     if (num.nextMessageId > nextMessageId) {
//         newMsg.value = '';
//     }
//     else {
//         newMsg.setAttribute('class', 'form-control is-invalid')
//     }
// }

//Stage 4
// const getHistoryWithInterval = (place, ms) => new Promise(
//     resolve => window.setInterval(() => resolve(getMessages(place)), ms),
//     er => console.log(er)
// )
//
// const getHistoryWithInterval2S = getHistoryWithInterval(historyWrapper, 2000)

//Stage 6

async function jsonPostFetch (url, data) {
    let dataInit = {
        method: 'POST', //('addMessage' === data.func ? 'POST' : 'addMessage' === data.func ? 'GET' : '0')
        body: JSON.stringify(data)
    }
    const response = await fetch(url, dataInit)
    if (!response.ok) {
        throw new Error('status is not ok.');
    }
    let result =  await response.json()
    return result;
}

let nextMessageId = 0;
let currentUser = nickName.value;

//Stage 5

async function sendMessage(nick, message) {
    let obj = await jsonPostFetch("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nick, message: message})
    return obj.nextMessageId;
}

const getMessages = async function (place, user) {
    try {
        //console.log(nextMessageId)
        let historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
            func: "getMessages",
            messageId: nextMessageId
        })
        nextMessageId = historyMsg.nextMessageId; //Stage 3
        numberForShortHistory.setAttribute('max', String(nextMessageId))
        if (shortHistoryCheck.checked) {
            nextMessageId -= numberForShortHistory.value;
            historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
                func: "getMessages",
                messageId: nextMessageId
            })
            place.innerHTML = "";
            nextMessageId = historyMsg.nextMessageId;
        }
        //console.log(user)
        for (let {nick, message, timestamp} of historyMsg.data) {
            place.prepend(createMsg ('div', nick, message, timestamp, user))
        };
        return historyMsg.nextMessageId
    } catch (error) {
        console.error('jsonPost failed: ', error);
    }
}

async function sendAndCheck(place, nick, message) {
    let num = await sendMessage(nick, message);
    if (num > nextMessageId) {
        num = await getMessages(place, currentUser);
    }
    //console.log(nextMessageId, num)
    return num;
}

//Stage 4

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

async function checkLoop(place) {
    while (true) {
         getMessages(place, currentUser);
         await delay(20000)
        //console.log(nextMessageId)
    }
}

checkLoop(historyWrapper)

//Stage 1

nickName.oninput = () => {
    currentUser = nickName.value;
    nextMessageId = 0;
    //console.log(currentUser)
}

newMsg.oninput = () => {
    if (newMsg.value && nickName.value) {
        sendMsgBtn.disabled = false;
    }
    else {
        sendMsgBtn.disabled = true;
    }
    newMsg = removeClassError (newMsg, 'is-invalid')
}

sendMsgBtn.onclick = async function () {
    sendMsgBtn.disabled = true;
    let num = await sendAndCheck(historyWrapper, nickName.value, newMsg.value)
    //console.log(nextMessageId, num)
    if (num >= nextMessageId) {
        newMsg.value = '';
        return;
    }
    newMsg.setAttribute('class', newMsg.getAttribute('class') + ' is-invalid');
}

//check for short version of the histoty
shortHistoryCheck.onclick = async function () {
    if (numberForShortHistory.value < nextMessageId) {
        numberForShortHistory = removeClassError (numberForShortHistory, 'is-invalid')
    }
    if (shortHistoryCheck.checked) {
        numberForShortHistory.disabled = false;
        if (numberForShortHistory.value >= nextMessageId) {
            numberForShortHistory.setAttribute('class', numberForShortHistory.getAttribute('class') + ' is-invalid');
            return;
        }
        //numberForShortHistory.disabled = true;
        await getMessages(historyWrapper, currentUser);
        //numberForShortHistory.disabled = false;
        return;
    }
    numberForShortHistory.disabled = true;
    historyWrapper.innerHTML = "";
    nextMessageId = 0;
    await getMessages(historyWrapper, currentUser)
}

numberForShortHistory.oninput = async function () {
    if (numberForShortHistory.value >= nextMessageId) {
        numberForShortHistory.setAttribute('class', numberForShortHistory.getAttribute('class') + ' is-invalid');
        return;
    }
    numberForShortHistory = removeClassError (numberForShortHistory, 'is-invalid')
    //numberForShortHistory.disabled = true;
    await getMessages(historyWrapper, currentUser);
    //numberForShortHistory.disabled = false;
}

//Stage 2

function createElCreator(handler = function (el) {return el}) { //abstract function for create an element, where handler is current function for content and attributes for the element
    return function (elTag = "div", ...content) {
        let el = document.createElement(elTag);
        el = handler (el, ...content);
        return el
    }
}

const createElWithTextAndClass = createElCreator((el, text = "", cl = "") => {
    el.innerHTML = text;
    el.setAttribute("class", cl);
    return el
})

const createTime = createElCreator((el, timestamp) => {
    let time = new Date(timestamp);
    let today = new Date;
    let timeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"};
    let timeMsg = "";
    if (time.getDate() === today.getDate()) {
        timeMsg = time.toLocaleTimeString()
    }
   else {
        timeMsg = time.toLocaleDateString("ru", timeOptions)
    }
    el.setAttribute("datetime", time);//`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
    el.appendChild(createElWithTextAndClass ('small', timeMsg));
    return el
})

const createMsgHeader = createElCreator((el, name = "", timestamp, user = "") => {
    let headerClass = "card-header bg-info text-white d-flex justify-content-between p-1"
    if (user === name) {
        el.setAttribute("class", headerClass + " bg-warning");
    }
    else {el.setAttribute("class", headerClass + " bg-info");}
    el.appendChild(createElWithTextAndClass ('strong', name, "mr-auto"));
    el.appendChild(createTime ('time', timestamp));
    return el
})

const createMsgContent = createElCreator((el, text) => {
    el.setAttribute("class", "card-body p-1");
    el.setAttribute("style", "white-space: pre-wrap;");
    el.innerHTML = text;
    return el
})

const createMsg = createElCreator((el, name = "", text = "", timestamp, user = "") => {
    if (user === name) {
        el.setAttribute("class", "card w-75 mb-3 ml-auto");
    }
    else {el.setAttribute("class", "card w-75 mb-3 ");}
    el.appendChild(createMsgHeader ('div', name, timestamp, user));
    el.appendChild(createMsgContent ('div', text));
    return el
})

const removeClassError = function(el, errorClass = "") {
    let cl = el.getAttribute('class')
    let errorClassIndex = cl.indexOf(errorClass);
    if (errorClassIndex > -1) {
        let newCl = cl.slice(0,errorClassIndex) + cl.slice(errorClassIndex + errorClass.length, cl.length)
        numberForShortHistory.setAttribute('class', newCl)
    }
    return el
}


