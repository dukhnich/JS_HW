/**
 * Abstract function for create an element, where handler is current function for content and attributes for the element
 * @param handler{function(HTMLElement, ...[*]): HTMLElement}
 * @returns {function(*=, ...[*]): HTMLElement}
 */
function createElCreator(handler = function (el) {return el}) {
    return function (elTag = "div", ...context) {
        let el = document.createElement(elTag);
        el = handler (el, ...context);
        return el
    }
}

/**
 *
 * @type {function(*=, ...[*]): HTMLElement}
 */
const createElWithTextAndAttributes = createElCreator((el, text = "", attr = {}) => {
    el.innerHTML = text;
    for (let [key, value] of Object.entries(attr)) {
        if ("boolean" === typeof value) {
            el[key] = value;
        }
        else {
            el.setAttribute(key, value);
        }
    };
    return el
})

/**
 *
 * @param el {HTMLElement}
 * @param oldClass {string}
 * @returns {HTMLElement}
 */
const removeClass = function(el, oldClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(oldClass);
    if (classIndex > -1 && oldClass.length > 0) {
        let newCl = cl.slice(0,classIndex) + cl.slice(classIndex + oldClass.length, cl.length)
        el.setAttribute('class', newCl)
    }
    return el
}

/**
 *
 * @param el {HTMLElement}
 * @param newClass {string}
 * @returns {HTMLElement}
 */
const addClass = function(el, newClass = "") {
    let cl = el.getAttribute('class')
    let classIndex = cl.indexOf(newClass);
    if (-1 === classIndex && newClass.length > 0) {
        el.setAttribute('class', el.getAttribute('class') + ' ' + newClass);
    }
    return el
}

/**
 * The constructor for change a class of an element
 * @param element {HTMLElement}
 * @constructor
 * @this {ClassHelper}
 */
function ClassHelper(element) {
    this.getElement = function () {
        return element;
    }
    this.removeClass = function (oldClass="") {
        removeClass(element, oldClass);
        return this;
    }
    this.addClass = function (newClass="") {
        addClass(element, newClass);
        return this;
    }
}
//Form
/**
 * The constructor that creates a form in the el
 * @param el {HTMLElement}
 * @param data {Object}
 * @param okCallback {function({Object})}
 * @param cancelCallback {function({Object})}
 * @param header {string}
 * @returns {HTMLElement}
 * @constructor
 */
function Form(el, data = {}, okCallback, cancelCallback, header = "Form"){
    let me = this
    let formBody = document.createElement('form')
    let btnGroup = createElWithTextAndAttributes('div', "",{class: 'input-group'} )
    let okButton = createElWithTextAndAttributes('button', 'OK', {class: "btn btn-success"})
    let cancelButton = createElWithTextAndAttributes('button', 'Cancel', {class: "btn btn-danger ml-3", type: "button"})
    formBody.appendChild(createElWithTextAndAttributes('h2', header))

    /**
     * Some transformations for display keys for users
     * @param key {string}
     * @returns {string}
     */
    const getInputNameByDataKey = function (key) {
        return ("*" === key[0] && " " === key[1]) ? "*" + key.slice(2) : key;
    }

    /**
     * Some transformations for prepare keys use like ID
     * @param key {string}
     * @returns {string}
     */
    const getInputIDByDataKey = function (key) {
        return ("*" === key[0]) ? key.slice(1) : key;
    }

    /**
     * Return boolean, if the el is checkbox or value of input/textarea
     * @param el {HTMLElement}
     * @returns {string|number|boolean}
     */
    const getInputValue = function (el) {
        if ("input" === (el.tagName).toLowerCase() || "textarea" === (el.tagName).toLowerCase()) {
            if ("checkbox" === el.getAttribute("type")) {
            return el.checked;
            }
            return el.value;
        }
        return ""
    }

    /**
     * Set boolean, if the el is checkbox or value of input/textarea
     * @param el {HTMLElement}
     * @param value {string|number|boolean}
     */
    const setInputValue = function (el, value) {
        if ("input" === (el.tagName).toLowerCase() || "textarea" === (el.tagName).toLowerCase()) {
            if ("checkbox" === el.getAttribute("type")) {
                el.checked = value;
            }
            el.value = value;
        }
    }

    /**
     * It finds the closest element with class 'alert', it works correctly only if the comment is the last element in the group
     * @param input {HTMLElement}
     * @returns {null|HTMLElement}
     */
    const findCommentForInput = function (input) {
        let comment = null;
        let el = input;
        while (null === comment) {
            if ("form" === el.tagName) {
                return null
            }
            let wrapper = el.parentElement;
            let lastElInWrapper = wrapper.children[wrapper.children.length - 1];
            if (lastElInWrapper.getAttribute("class").indexOf("alert") > -1) {
                comment = lastElInWrapper;
            };
            el = wrapper;
        }
        return comment;
    }

    /**
     * This is the data for the cancel button
     * @type {{}}
     */
    let formStartData = {};

    //Validators messages

    /**
     * This is the public object for validators
     * @type {{}}
     */
    this.validators     = {}

    /**
     * This is the private object for validators
     * @type {{}}
     */
    let innerValidators     = {}

    //Password
    /**
     * The callback function for create validators for passwords
     * @param pLength {number}
     * @returns {function(*): boolean|string}
     */
    const passwordValidator = function (pLength) {
        return function (value) {
            return value.length >= pLength ? true : `The password length must be more than ${pLength - 1} symbols`
        }
    }

    /**
     * Is the required field empty?
     * @param value
     * @param key {string}
     * @returns {boolean|string}
     */
    const emptyRequiredField = function (value, key) {
        return ((getInputIDByDataKey(key) !== key) && "" !== value && null !== value && undefined !== value) ? true : "empty required field"
    }

    /**
     * Abstract function for getting a result of validate an element and run handler with this result
     * @param handler {function(boolean|string, HTMLElement, *, string, {}, ...[*])}
     * @returns {function(HTMLElement, *, string, {}, ...[*])}
     */
    function validate(handler = ()=>{}) {
        return function (el, value, key = "", data, ...context) {
            if ('function' === typeof innerValidators[key]) {
                let result = innerValidators[key](value, key, data, el)
                if (true !== result ) {
                    handler (result, el, value, key, data, ...context);
                    return false;
                }
            }
            if ('function' === typeof me.validators[key]) {
                let result = me.validators[key](value, key, data, el)
                if (true !== result ) {
                    handler (result, el, value, key, data, ...context);
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * @param input {HTMLElement}
     * @param oldClassInput {string}
     * @param newClassInput {string}
     * @param oldClassComment {string}
     * @param newClassComment {string}
     * @param commentText {string}
     */
    const changeClassInputAndComment = function(input, oldClassInput = "", newClassInput = "", oldClassComment = "", newClassComment = "", commentText = "") {
        let comment = findCommentForInput(input);
        (new ClassHelper(input)).removeClass(oldClassInput).addClass(newClassInput);
        (new ClassHelper(comment)).removeClass(oldClassComment).addClass(newClassComment);
        comment.innerHTML = commentText;
    }

    /**
     *
     * @param input {HTMLElement}
     * @param key {string}
     * @param data {Object}
     * @returns {boolean}
     */
    const inputValidateAndChangeClass = function (input, key, data) {
        let validatorsResult = (validate((result, input, value, key, data) =>{
            changeClassInputAndComment(input, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', result);
        }))(input, getInputValue(input), key, data)
        if (validatorsResult) {
            changeClassInputAndComment(input, 'is-invalid', 'is-ok', 'alert-danger', 'alert-success', "&#10003;");
        }
        return validatorsResult;
    }

    //Отображение

    /**
     * Create a label, an input and a comment for this input, run validate for it
     * @type {function(*=, ...[*]): HTMLElement}
     */
    const createInputGroup = createElCreator((el, key = "", value = "") => {
        //Mandatory
        el.setAttribute("class", "input-group mb-3");

        let label ="";
        if (getInputIDByDataKey(key) !== key) {
            innerValidators[key] = (value, key, data, el) => emptyRequiredField(value, key);
            label = `<span class="text-danger font-weight-bold mr-1">*</span> ${getInputNameByDataKey(key).slice(1)}`;
        }
        else {
            label = getInputNameByDataKey(key);
        }
        el.appendChild(createElWithTextAndAttributes('div', `<div class="input-group-text w-100 text-uppercase">${label}</div>`, {class: "input-group-prepend w-25"}))

        let currentInput = inputCreators[typeOfInput(value)](key, value);

        //Validators messages
        let comment = createElWithTextAndAttributes('div', ``, {class: "alert pt-2 pb-2 m-0 input-group-text"})
        el.appendChild(currentInput)
        el.appendChild(comment)
        inputValidateAndChangeClass (currentInput, key, data)
        return el
    })

    /**
     * @param key {string}
     * @param value
     * @param type {string}
     * @returns {HTMLElement}
     */
    const createInput = function(key = "", value, type = "text") {
        let input = createElWithTextAndAttributes('input', "", {
            class: "form-control h-auto is-ok",
            type: type,
            id: `${getInputIDByDataKey(key).split(" ").join("")}Input`,
            required: getInputIDByDataKey(key) !== key
        })
        setInputValue (input, value);
        //save start values for cancel button
        formStartData[key] = getInputValue(input);
        return input
    }

    /**
     * Validate new value and, if ok, save it in data
     * @param el {HTMLElement}
     * @param key {string}
     * @param thisOfForm {Object}
     */
    const dataOnInput = function (el, key = "", thisOfForm) {
        el.oninput = () => {
            //Validators
            let validatorsResult = inputValidateAndChangeClass (el, key, thisOfForm.data)
            //Sync
            if (validatorsResult) {
                thisOfForm.data[key] = getInputValue(el);
            }
        };
    }

//Many Inputs
    /**
     *
     * @type {{number(*=, *=): HTMLElement, password(*=, *=): HTMLElement, boolean(*=, *=): HTMLElement, string(*=, *=): HTMLElement, textarea(*=, *=): HTMLElement, Date(*=, *=): HTMLElement}}
     */
    let inputCreators = {
        string(key = "", value = ""){
            let input = createInput(key, value, "text")
            dataOnInput (input, key, me);
            return input
        },
        password(key = "", value = "", ){
            let input = createInput(key, "", "text")
            dataOnInput (input, key, me);
            me.validators[key] = passwordValidator(value.length)
            return input
        },
        textarea(key = "", value = ""){
            let input = createElWithTextAndAttributes('textarea', value, {
                class: "form-control",
                id: `${getInputIDByDataKey(key).split(" ").join("")}Input`,
                required: getInputIDByDataKey(key) !== key
            });
            dataOnInput (input, key, me);
            formStartData[key] = getInputValue(input);
            return input
        },
        number(key = "", value = 0){
            let input = createInput(key, value, "number")
            dataOnInput (input, key, me)
            return input
        },
        boolean(key = "", value = true){
            let checkGroup = createElWithTextAndAttributes('div', "", {class: "form-check ml-3 flex-grow-1"})
            let input = createInput(key, value, "checkbox")
            input.setAttribute("class", "form-check-input position-static align-middle");
            input.setAttribute("aria-label", `${key} Input`);
            checkGroup.appendChild(input)
            dataOnInput (input, key, me)
            return checkGroup
        },
        Date(key = "", value = new  Date()){
            let ten = (num) => (num > 9 ? '' : "0") + num;
            let datetime = `${value.getFullYear()}-${ten(value.getMonth()+1)}-${ten(value.getDate())}T${ten(value.getHours())}:${ten(value.getMinutes())}`;
            let input = createInput(key, datetime, "datetime-local");
            dataOnInput (input, key, me);
            return input;
        }
    }

    /**
     * What type of data in this input?
     * @param value
     * @returns {string}
     */
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


    //Display
    for (let [key, value] of Object.entries(data)) {
        formBody.appendChild(createInputGroup('input-group', key, value, me));
    }

    formBody.appendChild(btnGroup);

    //OkButton
    if (typeof okCallback === 'function'){
        let commentForBtn = createElWithTextAndAttributes('div', "Some data was not validated", {class: "invisible alert alert-danger pt-2 pb-2 m-0 ml-3 order-3 input-group-text"})
        btnGroup.appendChild(commentForBtn);
        btnGroup.appendChild(okButton);

        okButton.onclick = (e) => {
            let allValidatorsResult = true;
            for (let i=0; i<Object.keys(me.data).length && allValidatorsResult; i++) {
                let key = Object.keys(me.data)[i]
                let input = document.getElementById(`${getInputIDByDataKey(key).split(" ").join("")}Input`);
                //Validators
                allValidatorsResult = inputValidateAndChangeClass (input, key, me.data);
            };

            if (allValidatorsResult) {
                (new ClassHelper(commentForBtn)).removeClass("visible").addClass("invisible");
                this.okCallback(data)
            }
            else {
                (new ClassHelper(commentForBtn)).removeClass("invisible").addClass("visible");
            }
            e.preventDefault();
        }
    }

    //CancelButton
    if (typeof cancelCallback === 'function'){
        btnGroup.appendChild(cancelButton);

        cancelButton.onclick = (e) => {
            for (let key in formStartData) {
                let input = document.getElementById(`${getInputIDByDataKey(key).split(" ").join("")}Input`);
                setInputValue (input, formStartData[key])
                //Validators
                inputValidateAndChangeClass (input, key, formStartData)
            };
            this.cancelCallback(me.data);
        }
    }

    el.appendChild(formBody)

    /**
     * @type {function({Object})}
     */
    this.okCallback     = okCallback
    /**
     *
     * @type {function({Object})}
     */
    this.cancelCallback = cancelCallback
    /**
     *
     * @type {Object}
     */
    this.data           = data
}

let form = new Form(formContainer, {
    name: 'Anakin',
    "surname": 'Sk',
    married: true,
    "*long text": "jkschkajsh dijas hajksd hakjsd hlak haskljdhalkdhlak DHksjadh kj hljks Hlasjk hsjk HAJKA HjlAFH ljf hSKLJ FSHkjSF  DBJKSH DSFKJJV HFJKDjkh fejk ksfj",
    "number of legs": 2,
    "*mystery": "******",
    birthday: new Date((new Date).getTime() - 86400000 * 30*365)
}, () => console.log('ok'),
    () => console.log('cancel'),
    "Test form")

form.okCallback = function (data) {
    console.log(data)
}

form.validators["surname"] = (value, key, data, input) => value.length > 2 &&
                                                        value[0].toUpperCase() == value[0] &&
                                                        !value.includes(' ') ? true : 'Wrong name'

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




