/**
 * @param iterable {{}|*[]|Date}
 * @returns {{}|*[]|Date}
 */
function shallowCopy (iterable) {
    if (Array.isArray(iterable)) {
        return [...iterable]
    }
    if (iterable instanceof Date) {
        return new Date(iterable.toString())
    }
    if ("object" === typeof iterable) {
        return {...iterable}
    }
}

let a = { x: 1, y: 2, z: [1, 2, 3] };
let b = shallowCopy(a); // b — это отдельный объект
b.x = 10;
console.log(a.x);
b.z.push(4);
console.log(a.z);
let c = new Date(2020, 1, 1);
let d = shallowCopy(c);
d.setFullYear(2021);
console.log(c.getFullYear()); // 2020
let e = ["a", 1];
let f = shallowCopy(c);
f[0] = 0;
console.log (e);


/**
 * @param container {HTMLElement}
 */
function drawSpinner (container) {
    container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary m-3" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>`
}

/**
 * @param ms
 * @returns {Promise<unknown>}
 */
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms);
    });
}

function equalArrays(arr1, arr2, strongEqual = false) {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (strongEqual && arr1[i] !== arr2 [i]) {
            return false
        }
        if (!(arr1[i] in arr2)) {
            return false
        }
    }
    return true
}

function createAsyncButton(container,handler, {spinnerContainer = container, startClassList = [""], resolveClassList = startClassList, rejectClassList = startClassList, buttonText = "Button"} = {}){
    let button = document.createElement("button");
    button.type = "button";
    button.classList.add(...startClassList);
    button.innerText = buttonText;
    button.onclick = async () => {
        if (!equalArrays([...button.classList], startClassList)) {
            button.classList.remove(...button.classList);
            button.classList.add(...startClassList);
        }
        button.disabled = true;
        let spinner = document.createElement("div");
        spinnerContainer.appendChild(spinner);
        drawSpinner (spinner);
        try{
            await handler();
            if (!equalArrays([...button.classList], resolveClassList)) {
                button.classList.remove(...button.classList);
                button.classList.add(...resolveClassList);
            }
        }
        catch (err) {
            if (!equalArrays([...button.classList], rejectClassList)) {
                button.classList.remove(...button.classList);
                button.classList.add(...rejectClassList);
            }
        }

        spinner.remove();
        button.disabled = false;
    };
    container.appendChild(button);
    return button
}

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
});

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
    let innerValidators     = {};

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
        input.classList.remove(oldClassInput);
        input.classList.add(newClassInput);
        comment.classList.remove(oldClassComment);
        comment.classList.add(newClassComment);
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
        let comment = createElWithTextAndAttributes('div', ``, {class: "alert pt-2 pb-2 m-0 input-group-text d-block text-left text-wrap text-break"});
        el.appendChild(currentInput);
        el.appendChild(comment);
        inputValidateAndChangeClass (currentInput, key, data)
        return el
    });

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
        });
        if ("number" === type) {
            let numbersAfterDot = 0;
            if (value.toString().includes('.')) {
                numbersAfterDot = (value.toString().split('.').pop().length)
            }
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
            let validatorsResult = inputValidateAndChangeClass (el, key, thisOfForm.data);
            //Sync
            if (validatorsResult) {
                thisOfForm.data[key] = getInputValue(el);
            }
        };
    };

//Many Inputs
    /**
     *
     * @type {{number(*=, *=): HTMLElement, password(*=, *=): HTMLElement, boolean(*=, *=): HTMLElement, string(*=, *=): HTMLElement, textarea(*=, *=): HTMLElement, Date(*=, *=): HTMLElement}}
     */
    let inputCreators = {
        /**
         * string < 128 symbols, not link, not password
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
            let input = createInput(key, value, "number");
            dataOnInput (input, key, me);
            return input
        },
        /**
         * boolean, create checkbox
         * @param key {string}
         * @param value {boolean}
         * @returns {HTMLDivElement}
         */
        boolean(key = "", value = true){
            let checkGroup = createElWithTextAndAttributes('div', "", {class: "form-check ml-3 flex-grow-1"});
            let input = createInput(key, value, "checkbox");
            input.setAttribute("class", "form-check-input position-static align-middle");
            input.setAttribute("aria-label", `${key} Input`);
            checkGroup.appendChild(input);
            dataOnInput (input, key, me);
            return checkGroup
        },
        /**
         * date, returns input datatime
         * @param key {string}
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
            let arrayInputGroup = createElWithTextAndAttributes('div', "", {
                class: "flex-grow-1 flex-shrink-0 w-50 h-100",
                id: `${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`})
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
                id: `${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`,
                class: "btn btn-primary m-2",
                type: "button"});
            btn.onclick = () => {
                me.container.innerHTML = "";
                getSWInfo (value, me.container)
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
    };


    //Display
    for (let [key, value] of Object.entries(data)) {
        formBody.appendChild(createInputGroup('input-group', key, value, me));
    }

    formBody.appendChild(btnGroup);

    //OkButton
    function okOnClick(data, commentForBtn) {
        return new Promise(async function (resolve, reject) {
            await wait(1000);

            let allValidatorsResult = true;
            for (let i=0; i < Object.keys(data).length && allValidatorsResult; i++) {
                let key = Object.keys(data)[i];
                let input = document.getElementById(`${formID}Form${getInputIDByDataKey(key).replace(/\W/g,'_')}Input`);
                if ('button' === (input.tagName).toLowerCase()) {
                    allValidatorsResult = true;
                }
                //Validators
                allValidatorsResult = inputValidateAndChangeClass (input, key, me.data);
            }

            if (allValidatorsResult) {
                commentForBtn.classList.remove("visible");
                commentForBtn.classList.add("invisible");
                try {
                    await this.okCallback(data);
                    resolve("ok");
                }
                catch (e) {
                    reject(e)
                }
            }
            else {
                commentForBtn.classList.remove("invisible");
                commentForBtn.classList.add("visible");
                reject ("Some data was not validated")
            }
        }.bind(this))
    }

    if (typeof okCallback === 'function'){
        let commentForBtn = createElWithTextAndAttributes('div', "Some data was not validated", {class: "invisible alert alert-danger pt-2 pb-2 m-0 ml-3 order-3 input-group-text"});
        btnGroup.appendChild(commentForBtn);
        let okButton = createAsyncButton(btnGroup, () => okOnClick.call(this, data, commentForBtn), {
            spinnerContainer: el, startClassList: ["btn", "btn-primary"], resolveClassList: ["btn", "btn-success"], rejectClassList: ["btn", "btn-danger"], buttonText: "OK"
        });
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
            this.cancelCallback(data);
        }
    }

    el.appendChild(formBody)

    /**
     * @type {function({Object})}
     */
    this.okCallback     = okCallback;
    /**
     *
     * @type {function({Object})}
     */
    this.cancelCallback = cancelCallback;
    /**
     *
     * @type {Object}
     */
    this.data           = data;
    this.container           = el;
}


// Authorization
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



const users = [
    {
        login: "Luke",
        password: "mayThe4"
    },
    {
        login: "Anakin",
        password: "1Kenobi"
    }
];

/**
 * Create a password form
 * @type {Form}
 */
let authorizationForm = new Form(authorization, {
        "*login": "Anonimus",
        "*password": "******"
    },  () => {
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < users.length; i++) {
                let {login, password} = users [i];
                if (authorizationForm.data["*login"] === login) {
                    if (authorizationForm.data["*password"] === password) {
                        let success = document.createElement("div");
                        success.classList.add("alert", "alert-success");
                        success.innerText = "You are successfully authorized";
                        authorizationForm.container.innerHTML = "";
                        authorizationForm.container.appendChild(success);
                        resolve("ok");
                        return
                    }
                }
            }
            let fail = authorizationForm.container.querySelector("#fail");
            if (null === fail) {
                fail = document.createElement("div");
                fail.id = "fail";
                fail.classList.add("alert", "alert-danger");
                fail.innerText = "This user or password is not correct";
                authorizationForm.container.appendChild(fail);
                reject(fail);
            }
        })

    },
    () => {},
    "Authorization");

authorizationForm.validators["*login"].push((value, key, data, input) => value.length > 2 &&
value[0].toUpperCase() === value[0] &&
!value.includes(' ') ? true : 'The name must be more then 2 symbols and the first letter must be in the upper case');

/**
 * Add a validator of the password
 */
authorizationForm.validators["*password"].push(passwordValidate);
