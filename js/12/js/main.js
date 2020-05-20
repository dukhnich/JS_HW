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

let formsIdArray = []

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
    let me = this;

    //create form id
    let formID = 0;
    let isThisFormID = false;
    if (0 === formsIdArray.length) {
        isThisFormID = true;
    }
    while (!isThisFormID) {
        isThisFormIDinArray = false;
        for (let i in formsIdArray) {
            if (formID === formsIdArray[i]) {
                isThisFormIDinArray = true;
            }
        }
        if (!isThisFormIDinArray) {
            isThisFormID = true;
        }
        else {
            formID = Math.round(Math.random()*1000);
        }
    }
    formsIdArray.push(formID);

    let formBody = createElWithTextAndAttributes('form', "",{class: 'mb-5', id: formID} )
    let btnGroup = createElWithTextAndAttributes('div', "",{class: 'input-group'} )
    let okButton = createElWithTextAndAttributes('button', 'OK', {class: "btn btn-success", type: "button"})
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
        if ("form" === (el.tagName).toLowerCase()) {
            let arr = [];
            for (let i in el.children) {
                if ("input" === (el.tagName).toLowerCase() || "textarea" === (el.tagName).toLowerCase()) {
                    if ("checkbox" === el.getAttribute("type")) {
                        arr.push(el.checked);
                    }
                    else {arr.push(el.value)};
                }
            }
            return arr;
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
     * This is the public object for validators, it includes arrays of validators for each field
     * @type {{}}
     */
    this.validators     = {}

    /**
     * This is the private object for validators, it includes arrays of validators for each field
     * @type {{}}
     */
    let innerValidators     = {}

    for (let key in data) {
        this.validators[key] = [];
        innerValidators[key] = [];
    }

    //Password
    /**
     * The callback function for create validators for passwords
     * @param pLength {number}
     * @returns {function(*): boolean|string}
     */
    const passwordValidator = function (pLength) {
        return function (value) {
            if ("" !== value) {
                let asterix = true;
                for (let i = 0; i < value.length; i++) {
                    if (!(asterix && "*" === value[i])) {
                        asterix = false;
                    }
                }
                if (asterix) {
                    return "The password must include some symbols besides asterixes"
                }
            }
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
        return ((getInputIDByDataKey(key) !== key) && "" !== value && null !== value && undefined !== value) ? true : "Empty required field"
    }


    /**
     * Function that validates an element and returns an array with errors or an empty array, if all is ok
     * @param value
     * @param key {string}
     * @param data {Object}
     * @param el {HTMLElement}
     * @returns {[]}
     */
    function validate(value, key = "", data, el) {
        let errorsArray = [];
        for (let validator of innerValidators[key]) {
            if ('function' === typeof validator) {
                let result = validator(value, key, data, el)
                if (true !== result) {
                    errorsArray.push(result)
                }
            }
        }
        for (let validator of me.validators[key]) {
            if ('function' === typeof validator) {
                let result = validator(value, key, data, el);
                if (true !== result) {
                    errorsArray.push(result)
                }
            }
        }
        return errorsArray;
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
     * Function that validate input value, change it class and print text of errors in comment div
     * @param input {HTMLElement}
     * @param key {string}
     * @param data {Object}
     * @returns {boolean}
     */
    const inputValidateAndChangeClass = function (input, key, data) {
        let validatorsResult = validate(getInputValue(input), key, data, input);
        if (validatorsResult.length === 0) {
            changeClassInputAndComment(input, 'is-invalid', 'is-ok', 'alert-danger', 'alert-success', "&#10003;");
            return true;
        }
        let errorMsg = ""
        for (let error of validatorsResult) {
            errorMsg += `<p class = 'm-0'>${error}</p>`
        }
        changeClassInputAndComment(input, 'is-ok', 'is-invalid', 'alert-success', 'alert-danger', errorMsg);
        return false;
    };

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
            innerValidators[key].push((value, key, data, el) => emptyRequiredField(value, key));
            label = `<span class="text-danger font-weight-bold mr-1">*</span> ${getInputNameByDataKey(key).slice(1)}`;
        }
        else {
            label = getInputNameByDataKey(key);
        }
        el.appendChild(createElWithTextAndAttributes('div', `<div class="input-group-text w-100 text-uppercase text-wrap text-break text-left d-block ">${label}</div>`, {class: "input-group-prepend w-25"}))

        let currentInput = inputCreators[typeOfInput(value)](key, value);

        //Validators messages
        let comment = createElWithTextAndAttributes('div', ``, {class: "alert pt-2 pb-2 m-0 input-group-text d-block text-left text-wrap text-break"})
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
            class: "form-control h-auto w-25 flex-grow-1 flex-shrink-0",
            type: type,
            id: `${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`,
            required: getInputIDByDataKey(key) !== key
        })
        if ("number" === type) {
            let numbersAfterDot = 0;
            if (value.toString().includes('.')) {
                numbersAfterDot = (value.toString().split('.').pop().length)
            };
                // ((toString(value).includes(',')) ?
                //     (toString(value).split(',').pop().length) :
                //     0);
            input.setAttribute('step', Math.pow(10, -1*numbersAfterDot))
        }
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
        /**
         * stling < 128 symbols, not link, not password
         * @param key {string}
         * @param value {string}
         * @returns {HTMLInputElement}
         */
        string(key = "", value = ""){
            let input = createInput(key, value, "text");
            dataOnInput (input, key, me);
            return input
        },
        /**
         * string, consist of *
         * @param key {string}
         * @param value {string}
         * @returns {HTMLInputElement}
         */
        password(key = "", value = "", ){
            let input = createInput(key, "", "text");
            dataOnInput (input, key, me);
            me.validators[key].push(passwordValidator(value.length));
            return input
        },
        /**
         * long string
         * @param key {string}
         * @param value {string}
         * @returns {HTMLTextAreaElement}
         */
        textarea(key = "", value = ""){
            let input = createElWithTextAndAttributes('textarea', value, {
                class: "form-control w-50 flex-grow-1 flex-shrink-0",
                id: `${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`,
                required: getInputIDByDataKey(key) !== key
            });
            dataOnInput (input, key, me);
            formStartData[key] = getInputValue(input);
            return input
        },
        /**
         * number
         * @param key {string}
         * @param value {number}
         * @returns {HTMLInputElement}
         */
        number(key = "", value = 0){
            let input = createInput(key, value, "number")
            dataOnInput (input, key, me)
            return input
        },
        /**
         * boolean, create checkbox
         * @param key {string}
         * @param value {boolean}
         * @returns {HTMLDivElement}
         */
        boolean(key = "", value = true){
            let checkGroup = createElWithTextAndAttributes('div', "", {class: "form-check ml-3 flex-grow-1"})
            let input = createInput(key, value, "checkbox")
            input.setAttribute("class", "form-check-input position-static align-middle");
            input.setAttribute("aria-label", `${key} Input`);
            checkGroup.appendChild(input)
            dataOnInput (input, key, me)
            return checkGroup
        },
        /**
         * date, returns input datatime
         * @param key {number}
         * @param value {Date}
         * @returns {HTMLInputElement}
         * @constructor
         */
        Date(key = "", value = new  Date()){
            let ten = (num) => (num > 9 ? '' : "0") + num;
            let datetime = `${value.getFullYear()}-${ten(value.getMonth()+1)}-${ten(value.getDate())}T${ten(value.getHours())}:${ten(value.getMinutes())}`;
            let input = createInput(key, datetime, "datetime-local");
            dataOnInput (input, key, me);
            return input;
        },
        /**
         * Array is converted to inputs without comments
         * @param key {string}
         * @param value {Array}
         * @returns {HTMLDivElement}
         * @constructor
         */
        Array(key = "", value = []){
            let arrayInputGroup = createElWithTextAndAttributes('div', "", {class: "flex-grow-1 flex-shrink-0 w-50 h-100"})
            for (let i in value) {
                let input = inputCreators[typeOfInput(value[i])](i, value[i]);
                dataOnInput (input, i, me);
                arrayInputGroup.appendChild(input)
            }
            return arrayInputGroup
        },
        /**
         * returns button, that creates new Form in this container on click in div-wrapper
         * @param key {string}
         * @param value {string}
         * @returns {HTMLDivElement}
         */
        button(key = "", value = []){
            let btnGroup = createElWithTextAndAttributes('div', "", {class: "flex-grow-1 flex-shrink-0 w-50 h-100"})
            let ind = value.indexOf('/api/')
            let name = value.slice(ind + 5).split("/").join(" ")
            let btn = createElWithTextAndAttributes('form', `View info about ${name}`, {
                id: `download${name.split(" ").join("")}Info`,
                class: "btn btn-primary m-2",
                type: "button"});
            btn.onclick = () => {
                me.container.innerHTML = "";
                fetchAndParse(value, me.container)
            }
            btnGroup.appendChild(btn)
            return btnGroup
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
            if (-1 !== value.indexOf('/api/')) {
                return "button"
            }
            if (!isNaN(+value)) {
                return "number"
            }
            if ("" !== value) {
                let passw = true;
                for (let i = 0; (passw && i < value.length); i++) {
                    if ("*" !== value[i]) {
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
            for (let i=0; i < Object.keys(me.data).length && allValidatorsResult; i++) {
                let key = Object.keys(me.data)[i]
                let input = document.getElementById(`${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`);
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
                let input = document.getElementById(`${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`);
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
    this.container           = el;
}

/**
 * Create test form
 * @type {HTMLElement}
 */
let form = new Form(testFormContainer, {
    name: 'Anakin',
    "surname": 'Sk',
    married: true,
    "*long text": "jkschkajsh dijas hajksd hakjsd hlak haskljdhalkdhlak DHksjadh kj hljks Hlasjk hsjk HAJKA HjlAFH ljf hSKLJ FSHkjSF  DBJKSH DSFKJJV HFJKDjkh fejk ksfj",
    "number of legs": 2,
    "*mystery": "***",
    birthday: new Date((new Date).getTime() - 86400000 * 30*365)
}, () => console.log('ok'),
    () => console.log('cancel'),
    "Test form")

/**
 * Change okCallback of the test form
 * @param data
 */
form.okCallback = function (data) {
    console.log(data)
}

/**
 * Add a validator of surname to the test form
 * @param value {string}
 * @param key {string}
 * @param data {Object}
 * @param input {HTMLElement}
 * @returns {boolean|string}
 */
form.validators["surname"].push((value, key, data, input) => value.length > 2 &&
                                                        value[0].toUpperCase() == value[0] &&
                                                        !value.includes(' ') ? true : 'Wrong name');

console.log(form)

// Change Password
/**
 * The function that check ia there in the password uppercase, lowercase and number
 * @param value {string}
 * @param key {string}
 * @param data {Object}
 * @param input {HTMLElement}
 * @returns {boolean|string}
 */
const passwordValidate = function (value, key, data, input) {
    let lowerAlphabet = "abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    let upperAlphabet = lowerAlphabet.toUpperCase();
    let isUpperCaseinPassword = false;
    let isLowerCaseinPassword = false;
    let isNumberinPassword = false;
    for (let i = 0; i < value.length; i++) {
        if (!isUpperCaseinPassword && upperAlphabet.includes(value[i])) {
            isUpperCaseinPassword = true;
        }
        if (!isLowerCaseinPassword && lowerAlphabet.includes(value[i])) {
            isLowerCaseinPassword = true;
        }
        if (!isNumberinPassword && !isNaN(+value[i])) {
            isNumberinPassword = true;
        }
    }
    return  (isUpperCaseinPassword && isLowerCaseinPassword && isNumberinPassword) ? true : 'The password must include a number, a lowercase and an uppercase symbols'
}

/**
 * Create a password form
 * @type {HTMLElement}
 */
let passwordForm = new Form(passwordFormContainer, {
        "*password": "******",
    }, () => {
        let changePasswordSection = document.getElementById('changePasswordSection')
        if (null === changePasswordSection) {
            changePasswordSection = createElWithTextAndAttributes('section', "", {id: 'changePasswordSection'});
            passwordForm.container.appendChild(changePasswordSection);
        }
        else {
            changePasswordSection.innerHTML = "";
        }
        /**
         * Create a form for change the passwword
         * @type {HTMLElement}
         */
        let changePasswordForm = new Form(changePasswordSection, {
                "*current password": "******",
                "*new password": "******"
            }, (data) => {
                let formID = (document.querySelector('#passwordFormContainer form').getAttribute('id'))
                document.getElementById(formID + 'FormpasswordInput').value = data["*new password"];
                passwordForm.data["*password"] = data["*new password"];
            },
            () => console.log('cancel'),
            "Change password");
        /**
         * Add a validator: is the password the same that old password?
         * @param value {string}
         * @param key {string}
         * @param data {Object}
         * @param input {HTMLElement}
         * @returns {boolean|string}
         */
        changePasswordForm.validators["*current password"].push((value, key, data, input) => value === passwordForm.data["*password"] ? true : 'This is not your current password')
        /**
         * Add a validator of the new password
         */
        changePasswordForm.validators["*new password"].push(passwordValidate)
    },
    () => {
        let changePasswordSection = document.getElementById('changePasswordSection')
        if (null !== changePasswordSection) {
            changePasswordSection.innerHTML = "";
        }
    },
    "Create password")

/**
 * Add a validator of the password
 */
passwordForm.validators["*password"].push(passwordValidate)

//StarWars
/**
 * get data from url and create a form with it in el
 * @param url {string}
 * @param el {HTMLElement}
 */
const fetchAndParse = async function (url, el, header ) {
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Ой, мы не получили JSON!");
        }
        const json = await response.json();
        let SWForm = new Form(el,
            json,
            () => console.log('ok'),
            () => console.log('cancel'),
            json.name || json.title)
    } catch (error) {
        console.log(error);
    }
}
fetchAndParse('https://swapi.dev/api/people/1/', SWFormContainer)

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




