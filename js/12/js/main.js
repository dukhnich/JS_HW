//Form
function Form(el, data = {}, okCallback, cancelCallback){
    let me = this
    let formBody = document.createElement('form')
    let btnGroup = createElWithTextAndClass('div', "",'input-group' )
    let okButton = createElWithTextAndClass('button', 'OK', "btn btn-success")
    let cancelButton = createElWithTextAndClass('button', 'Cancel', "btn btn-danger ml-3")
    cancelButton.setAttribute('type', 'button')
    formBody.appendChild(createElWithTextAndClass('h2', 'Form creator'))

    //Отображение
    for (let [key, value] of Object.entries(data)) {
        formBody.appendChild(createInputGroup('input-group', key, value, data, me));
    };

    formBody.appendChild(btnGroup);
    if (typeof okCallback === 'function'){
        let commentForBtn = createElWithTextAndClass('div', "Some data was not validated", "invisible alert alert-danger pt-2 pb-2 m-0 ml-3 order-3 input-group-text")
        btnGroup.appendChild(commentForBtn);
        btnGroup.appendChild(okButton);
        okButton.onclick = (e) => {
            //console.log(this)
            //console.log(e)
            let allValidatorsResult = true;
            for (let [key, value] of Object.entries(data)) {
                if ('function' === typeof this.validators[key]) {
                    let id = "*" === key[0] ? `${(key.slice(1)).split(" ").join("")}Input` : `${key.split(" ").join("")}Input`;
                    let input = document.getElementById(id)
                    let res = this.validators[key](input.value, key, data, input)
                    if (true !== res ) {
                        allValidatorsResult = false;

                    }
                }
            };
            if (allValidatorsResult) {
                commentForBtn = removeClass (commentForBtn, "visible");
                commentForBtn = addClass (commentForBtn, "invisible");
                this.okCallback(data)
            }
            else {
                commentForBtn = removeClass (commentForBtn, "invisible");
                commentForBtn = addClass (commentForBtn, "visible");
            }
            //console.log(e)
            //e.stopPropagation();
            e.preventDefault();

            //return false;
        }
    }

    if (typeof cancelCallback === 'function'){
        btnGroup.appendChild(cancelButton);
        cancelButton.onclick = (e) => {
            this.cancelCallback(formStartData);
        }
    }

    el.appendChild(formBody)

    let formStartData = {};
    Object.assign(formStartData, data);
    this.formStartData = formStartData

    this.okCallback     = okCallback
    this.cancelCallback = cancelCallback

    this.data           = data
    this.validators     = {}
}

//Отображение
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

const createInputGroup = createElCreator((el, key = "", value = "", syncObj = {}, thisOfForm) => {
    //Mandatory
    let id = "*" === key[0] ? key.slice(1) : key;
    let fieldIsRequired = (id !== key);
    let label = fieldIsRequired ? `<span class="text-danger font-weight-bold mr-1">*</span> ${id}` : id;

    el.setAttribute("class", "input-group mb-3");
    el.appendChild(createElWithTextAndClass('div', `<div class="input-group-text w-100 text-uppercase">${label}</div>`, "input-group-prepend w-25"))
    let currentInput = inputCreators[typeOfInput(value)](key, id, value, syncObj, thisOfForm, fieldIsRequired);

    //Validators messages
    let comment = createElWithTextAndClass('div', `&#10003;`, "alert alert-success pt-2 pb-2 m-0 input-group-text")
    if (fieldIsRequired && "" === currentInput.value) {
        changeClassInputAndComment(currentInput, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', "empty required field");
    }
    // if ('function' === typeof thisOfForm.validators[label]) {
    //     let res = thisOfForm.validators[label](currentInput.value, label, syncObj, currentInput)
    //     if (true !== res ) {
    //         changeClassInputAndComment(currentInput, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', res);
    //     }
    // }

    el.appendChild(currentInput)
    el.appendChild(comment)

    return el
})

const createInput = createElCreator((el, id = "", value = "", type = "text", fieldIsRequired) => {
    el.required = fieldIsRequired;
    el.setAttribute("class", "form-control h-auto is-ok");
    el.setAttribute("type", type);
    el.setAttribute("id", id);
    if ("checkbox" === type) {
        el.setAttribute("checked", value);
        return el
    }
    el.setAttribute("value", value);
    return el
})

const dataOnInput = function (el, label = "", value = "", syncObj = {}, thisOfForm, type = "text", fieldIsRequired) {
    el.oninput = () => {
        let currentValue;
        if ("checkbox" === type) {
            currentValue = el.checked;
        }
        else {
            currentValue = el.value;
        }
        //Validators
        let key = "*" === label[0] ? label.slice(1) : label;
        let comment = document.querySelector(`#${key.split(" ").join("")}Input + .alert`);
        let validator = thisOfForm.validators[label]

        if (fieldIsRequired && "" === currentValue) {
            changeClassInputAndComment(el, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', "empty required field");
            return;
        }
        if ('function' === typeof validator) {
            let res = validator(el.value, label, syncObj, el)
            if (true !== res ) {
                changeClassInputAndComment(el, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', res);
                return;
            }
        }

        changeClassInputAndComment(el, comment, 'is-invalid', 'is-ok', 'alert-danger', 'alert-success', "&#10003;")

        //Sync
        syncObj[label] = currentValue;

    };
}


//Validators messages
const removeClass = function(el, oldClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(oldClass);
    if (classIndex > -1) {
        let newCl = cl.slice(0,classIndex) + cl.slice(classIndex + oldClass.length, cl.length)
        el.setAttribute('class', newCl)
    }
    return el
}

const addClass = function(el, newClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(newClass);
    if (-1 === classIndex) {
        el.setAttribute('class', el.getAttribute('class') + ' ' + newClass);
    }
    return el
}

const changeClassInputAndComment = function(input, comment, oldClassInput = "", newClassInput = "", oldClassComment = "", newClassComment = "", commentText = "") {
    input = removeClass (input, oldClassInput);
    input = addClass (input, newClassInput);
    comment = removeClass (comment, oldClassComment);
    comment = addClass (comment, newClassComment);
    comment.innerHTML = commentText;
}

//Many Inputs
let inputCreators = {
    string(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        let input = createInput('input', `${id.split(" ").join("")}Input`, value, "text", fieldIsRequired)
        dataOnInput (input, label, value, syncObj, thisOfForm, "text", fieldIsRequired);
        return input
    },
    password(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        let input = createInput('input', `${id.split(" ").join("")}Input`, "", "text", fieldIsRequired)
        dataOnInput (input, label, value, syncObj, thisOfForm, "text", fieldIsRequired);
        return input
    },
    textarea(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        let input = createElWithTextAndClass('textarea', value, "form-control");
        input.required = fieldIsRequired;
        input.setAttribute("id", `${id.split(" ").join("")}Input`);
        dataOnInput (input, label, value, syncObj, thisOfForm, "", fieldIsRequired)
        return input
    },
    number(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        let input = createInput('input', `${id.split(" ").join("")}Input`, value, "number", fieldIsRequired)
        dataOnInput (input, label, value, syncObj, thisOfForm, "number", fieldIsRequired)
        return input
    },
    boolean(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        let checkGroup = createElWithTextAndClass('div', "", "form-check ml-3 flex-grow-1")
        let input = createInput('input', `${id.split(" ").join("")}Input`, value, "checkbox", fieldIsRequired)
        input.setAttribute("class", "form-check-input position-static align-middle");
        input.setAttribute("aria-label", `${label} Input`);
        checkGroup.appendChild(input)
        dataOnInput (input, label, value, syncObj, thisOfForm, "checkbox", fieldIsRequired)
        return checkGroup
    },
    Date(label = "", id = "", value = "", syncObj = {}, thisOfForm, fieldIsRequired){
        // let inputGroupDate = createElWithTextAndClass('div', "", "input-group date");
        // inputGroupDate.setAttribute("id", `${id}Datetimepicker`); "2020-04-16T15:16" 1990-5-14T16:58
        let ten = (num) => (num > 9 ? '' : "0") + num
        let datetime = `${value.getFullYear()}-${ten(value.getMonth()+1)}-${ten(value.getDate())}T${ten(value.getHours())}:${ten(value.getMinutes())}`
        let input = createInput('input', `${id.split(" ").join("")}Input`, datetime, "datetime-local", fieldIsRequired)
        dataOnInput (input, label, datetime, syncObj, thisOfForm, "datetime-local", fieldIsRequired)
        // inputGroupDate.appendChild(input);
        // let span = createElWithTextAndClass('span', `<span class="glyphicon glyphicon-calendar"></span>`, "input-group-addon");
        // inputGroupDate.appendChild(span);
        // let script = createElWithTextAndClass ('script', `
        // $(${id}Datetimepicker).datepicker({
        //     locale: 'ru'
        // });
        // `)
        // inputGroupDate.appendChild(script);
        // (function () {
        //     inputGroupDate.datetimepicker({
        //         locale: 'ru'
        //     });
        // });
        return input;
    }
}

const typeOfInput = function(value){
    if ("object" === typeof value){
        let constr = value.constructor.name;
        return constr;
    }
    if ("boolean" === typeof value){
        return "boolean";
    }
    if ("string" === typeof value){
        if ("" !== value) {
            let passw = true;
            for (let i = 0; i < value.length; i++) {
                if (!(passw && "*" === value[i])) {
                    passw = false;
                }
            }
            if (passw) {
                return "password"
            }
        }
        return value.length > 128 ? "textarea" : "string"
    }
    if ("number" === typeof value){
        return "number"
    }
}




let form = new Form(formContainer, {
    name: 'Anakin',
    "surname": 'Skywalker',
    married: true,
    "*long text": "jkschkajsh dijas hajksd hakjsd hlak haskljdhalkdhlak DHksjadh kj hljks Hlasjk hsjk HAJKA HjlAFH ljf hSKLJ FSHkjSF  DBJKSH DSFKJJV HFJKDjkh fejk ksfj",
    "number of legs": 2,
    "*mystery": "******",
    birthday: new Date((new Date).getTime() - 86400000 * 30*365)
}, () => console.log('ok'),
    () => console.log('cancel') )

form.okCallback = function (data) {
    console.log(data)
}

form.cancelCallback = function (data) {
    for (let [key, value] of Object.entries(data)) {
        let id = "*" === key[0] ? `${(key.slice(1)).split(" ").join("")}` : `${key.split(" ").join("")}`;
        let fieldIsRequired = (id === key) ? false : true;
        let input = document.getElementById(`${id}Input`);
        let currentValue, comment;
        if ("checkbox" === input.getAttribute("type")) {
            comment = input.parentElement.parentElement.children[2]
            //comment = document.querySelector(`#${id}.parentElement + .alert`);
            input.checked = value;
            currentValue = input.checked;
        } else {
            comment = document.querySelector(`#${id}Input + .alert`);
            input.value = value;
            currentValue = input.value;
        }
        if (fieldIsRequired && "" === currentValue) {
            changeClassInputAndComment(input, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', "empty required field");
            return;
        }
        if ('function' === typeof form.validators[key]) {
            let res = form.validators[key](input.value, key, data, input);
            if (true !== res) {
                changeClassInputAndComment(input, comment, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', res);
                return;
            }
        }
        changeClassInputAndComment(input, comment, 'is-invalid', 'is-ok', 'alert-danger', 'alert-success', "&#10003;")
    };
}

form.validators["surname"] = (value, key, data, input) => value.length > 2 &&
                                                        value[0].toUpperCase() == value[0] &&
                                                        !value.includes(' ') ? true : 'Wrong name'

const passwordValidator = function (pLength) {
    return function (currentLength) {
        return currentLength >= pLength ? true : `The password length must be more than ${pLength - 1} symbols`
    }
}

let mysteryLength = passwordValidator(form.data["*mystery"].length)

form.validators["*mystery"] = function (value, key, data, input) {
    return mysteryLength (value.length)
}

console.log(form)


// async function jsonPostFetch (url, data) {
//     let dataInit = {
//         method: 'POST', //('addMessage' === data.func ? 'POST' : 'addMessage' === data.func ? 'GET' : '0')
//         body: JSON.stringify(data)
//     }
//     const response = await fetch(url, dataInit)
//     if (!response.ok) {
//         throw new Error('status is not ok.');
//     }
//     let result =  await response.json()
//     return result;
// }
//
// let nextMessageId = 0;
// let currentUser = nickName.value;
//
// //Stage 5
//
// async function sendMessage(nick, message) {
//     let obj = await jsonPostFetch("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nick, message: message})
//     return obj.nextMessageId;
// }
//
// const getMessages = async function (place, user) {
//     try {
//         //console.log(nextMessageId)
//         let historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
//             func: "getMessages",
//             messageId: nextMessageId
//         })
//         nextMessageId = historyMsg.nextMessageId; //Stage 3
//         numberForShortHistory.setAttribute('max', String(nextMessageId))
//         if (shortHistoryCheck.checked) {
//             nextMessageId -= numberForShortHistory.value;
//             historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
//                 func: "getMessages",
//                 messageId: nextMessageId
//             })
//             place.innerHTML = "";
//             nextMessageId = historyMsg.nextMessageId;
//         }
//         //console.log(user)
//         for (let {nick, message, timestamp} of historyMsg.data) {
//             place.prepend(createMsg ('div', nick, message, timestamp, user))
//         };
//         return historyMsg.nextMessageId
//     } catch (error) {
//         console.error('jsonPost failed: ', error);
//     }
// }
//
// async function sendAndCheck(place, nick, message) {
//     let num = await sendMessage(nick, message);
//     if (num > nextMessageId) {
//         num = await getMessages(place, currentUser);
//     }
//     //console.log(nextMessageId, num)
//     return num;
// }
//
// //Stage 4
//
// const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))
//
// async function checkLoop(place) {
//     while (true) {
//          getMessages(place, currentUser);
//          await delay(20000)
//         //console.log(nextMessageId)
//     }
// }
//
// checkLoop(historyWrapper)
//
// //Stage 1
//
// nickName.oninput = () => {
//     currentUser = nickName.value;
//     nextMessageId = 0;
//     //console.log(currentUser)
// }
//
// newMsg.oninput = () => {
//     if (newMsg.value && nickName.value) {
//         sendMsgBtn.disabled = false;
//     }
//     else {
//         sendMsgBtn.disabled = true;
//     }
//     newMsg = removeClassError (newMsg, 'is-invalid')
// }
//
// sendMsgBtn.onclick = async function () {
//     sendMsgBtn.disabled = true;
//     let num = await sendAndCheck(historyWrapper, nickName.value, newMsg.value)
//     //console.log(nextMessageId, num)
//     if (num >= nextMessageId) {
//         newMsg.value = '';
//         return;
//     }
//     newMsg.setAttribute('class', newMsg.getAttribute('class') + ' is-invalid');
// }
//
// //check for short version of the histoty
// shortHistoryCheck.onclick = async function () {
//     if (numberForShortHistory.value < nextMessageId) {
//         numberForShortHistory = removeClassError (numberForShortHistory, 'is-invalid')
//     }
//     if (shortHistoryCheck.checked) {
//         numberForShortHistory.disabled = false;
//         if (numberForShortHistory.value >= nextMessageId) {
//             numberForShortHistory.setAttribute('class', numberForShortHistory.getAttribute('class') + ' is-invalid');
//             return;
//         }
//         //numberForShortHistory.disabled = true;
//         await getMessages(historyWrapper, currentUser);
//         //numberForShortHistory.disabled = false;
//         return;
//     }
//     numberForShortHistory.disabled = true;
//     historyWrapper.innerHTML = "";
//     nextMessageId = 0;
//     await getMessages(historyWrapper, currentUser)
// }
//
// numberForShortHistory.oninput = async function () {
//     if (numberForShortHistory.value >= nextMessageId) {
//         numberForShortHistory.setAttribute('class', numberForShortHistory.getAttribute('class') + ' is-invalid');
//         return;
//     }
//     numberForShortHistory = removeClassError (numberForShortHistory, 'is-invalid')
//     //numberForShortHistory.disabled = true;
//     await getMessages(historyWrapper, currentUser);
//     //numberForShortHistory.disabled = false;
// }
//
// //Stage 2
//
//
//
// const createTime = createElCreator((el, timestamp) => {
//     let time = new Date(timestamp);
//     let today = new Date;
//     let timeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"};
//     let timeMsg = "";
//     if (time.getDate() === today.getDate()) {
//         timeMsg = time.toLocaleTimeString()
//     }
//    else {
//         timeMsg = time.toLocaleDateString("ru", timeOptions)
//     }
//     el.setAttribute("datetime", time);//`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
//     el.appendChild(createElWithTextAndClass ('small', timeMsg));
//     return el
// })
//
// const createMsgHeader = createElCreator((el, name = "", timestamp, user = "") => {
//     let headerClass = "card-header bg-info text-white d-flex justify-content-between p-1"
//     if (user === name) {
//         el.setAttribute("class", headerClass + " bg-warning");
//     }
//     else {el.setAttribute("class", headerClass + " bg-info");}
//     el.appendChild(createElWithTextAndClass ('strong', name, "mr-auto"));
//     el.appendChild(createTime ('time', timestamp));
//     return el
// })
//
// const createMsgContent = createElCreator((el, text) => {
//     el.setAttribute("class", "card-body p-1");
//     el.setAttribute("style", "white-space: pre-wrap;");
//     el.innerHTML = text;
//     return el
// })
//
// const createMsg = createElCreator((el, name = "", text = "", timestamp, user = "") => {
//     if (user === name) {
//         el.setAttribute("class", "card w-75 mb-3 ml-auto");
//     }
//     else {el.setAttribute("class", "card w-75 mb-3 ");}
//     el.appendChild(createMsgHeader ('div', name, timestamp, user));
//     el.appendChild(createMsgContent ('div', text));
//     return el
// })




