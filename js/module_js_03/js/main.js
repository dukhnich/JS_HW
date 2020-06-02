/**
 * objectValues (1)
 * @param obj {{}}
 * @returns {[]}
 */
const objectValues = function (obj = {}) {
    let resultArray = []
    for (let value of Object.values(obj)) {
        resultArray.push(value)
    }
    return resultArray
}
var notebook = {
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

objectValues(notebook) //возвращает ["HP", "440 G4", "Y7Z75EA", 4, "14", 1.8, { width: 1920, height: 1080 } ]


/**
 * objectCombine (1)
 * @param keysArray {[]}
 * @param valuesArray {[]}
 * @returns {{}|null}
 */
const objectCombine = function (keysArray = [], valuesArray = []) {
    let resultObj = {};
    if (keysArray.length !== valuesArray.length) {
        return null
    }
    for (let i = 0; i < keysArray.length; i++) {
        resultObj[keysArray[i]] = valuesArray[i];
    }
    return resultObj
}

objectCombine(['name', 'surname'], ['Donald', 'Trump']) // { name: "Donald", surname: "Trump" }
objectCombine(['name', 'surname'], ['Ivan', 'Petrovich', 'Cherezzabornoguzadirischenko']) // null


/**
 * choiceBuilder (2)
 * @param elementId {string}
 * @param content {{}}
 */
const choiceBuilder = function (elementId, content = {}) {
    let el = document.getElementById(elementId)
    if ("select" === el.tagName.toLowerCase()) {
        for (let [key, value] of Object.entries(content)) {
            let option = document.createElement("option");
            option.setAttribute("value", key);
            option.innerText = value;
            el.appendChild(option);
        }
        return
    }
    for (let [key, value] of Object.entries(content)) {
        let label = document.createElement("label");
        let radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", elementId);
        radio.setAttribute("value", key);
        label.append(radio, value);
        el.appendChild(label);

    }
}
choiceBuilder('someId0', {default: 'Не указан', male: "Мужской", female: 'Женский'})
choiceBuilder('someId', {default: 'Не указан', male: "Мужской", female: 'Женский'})

/**
 * table Editor (3)
 * @param containerId {string}
 * @param content {[[],[]]}
 */
const tableEditor = function (containerId, content) {
    let container = document.getElementById(containerId);
        let table = document.createElement('table');
    table.setAttribute("border", 1);
//draw table content
    for (let i=0; i < content.length; i++){
        let contentTr = document.createElement("tr");
        table.appendChild(contentTr);
        for (let j = 0; j < content[i].length; j++) {
            let contentTd = document.createElement("td");
            contentTd.innerHTML = content[i][j];
            contentTr.appendChild(contentTd);
            contentTd.ondblclick = () => {
                let value = ""
                let input = contentTd.querySelector("input")
                if (null !== input) {
                    value = input.value;
                    contentTd.innerText = value;
                    content[i][j] = value;
                    return;
                }
                value = contentTd.innerText;
                contentTd.innerText = "";
                input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("value", value);
                contentTd.appendChild(input);
            }
        }
    }
    container.innerHTML = "";
    container.appendChild(table)
}

var arr = [[1,2],[3,4]]
tableEditor('someId2', arr) //создает таблицу 2x2, каждую ячейку которой можно подредактировать. Изменения должны вноситься в arr

/**
 * formBuilder (4)
 * @param containerID {string}
 * @param data {{}}
 * @param resultFunction {function}
 */
const formBuilder = function (containerID, data = {}, resultFunction) {
    let me = this;
    let container = document.getElementById(containerID);
    let form = document.createElement("form");
    container.appendChild(form);
    for (let [key, value] of Object.entries(data)) {
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.setAttribute("type", value["type"]);
        input.setAttribute("id", containerID + key);
        input.setAttribute("placeholder", value["placeholder"]);
        label.append(key, input);
        form.appendChild(label);
    }
    let btn = document.createElement("button");
    btn.innerText = "Save new values";
    btn.setAttribute("type", "button");

    btn.onclick = () => {
        let result = {};
        let validateAll = true;
        for (let key in data) {
            result[key] = document.getElementById(containerID + key).value;
        }
        for (let [key, inputData] of Object.entries(data)) {
            let input = document.getElementById(containerID + key);
            if ("function" === typeof inputData["validator"]) {
                let inputValidate = inputData["validator"](input, result);
                if (!inputValidate) {
                    validateAll = false;
                    input.setAttribute("style", "background-color: red;")
                } else {
                    let style = (input.getAttribute("style")) || "";
                    let redStyleIndex = style.indexOf("background-color: red;");
                    let newStyle = style.slice(0, redStyleIndex) + style.slice(redStyleIndex + "background-color: red;".length, style.length);
                    if (redStyleIndex > -1) {
                        input.setAttribute("style", newStyle)
                    }
                }
            }
        }
        if (validateAll) {
            resultFunction (result);
        }
    }
    form.appendChild(btn)
}

formBuilder('someId3', {
    login: {type: 'text',
        placeholder: 'Логин',
        validator: function(element){
            return element.value.length > 2;
        }},
    email: {type: 'email',
        placeholder: 'Мыло',
        validator: function(element){
            return element.value.indexOf('@') > -1;
        }},
    password1 : {type: 'password',
        placeholder: 'Пароль',
        validator: function(element, obj){
            return element.value == obj.password2;
        }},
    password2 : {type: 'password',
        placeholder: 'Пароль еще раз',
        validator: function(element, obj){
            return element.value == obj.password1;
        }},
}, function(result){
    console.log(result)
    alert('спасибо за заполнение');
})

//Time:2h00min