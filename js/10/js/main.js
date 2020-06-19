/**
 * @param url {string}
 * @param data {{}}
 * @returns {Promise<any>}
 */
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

/**
 * @param ms {number}
 * @returns {Promise<unknown>}
 */
const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

/**
 * @param handler {function}
 * @returns {function(*=, ...[*]): any | HTMLElement}
 */
function createElCreator(handler = function (el) {return el}) { //abstract function for create an element, where handler is current function for content and attributes for the element
    return function (elTag = "div", ...content) {
        let el = document.createElement(elTag);
        el = handler (el, ...content);
        return el
    }
}

/**
 * @type {(function(*=, ...[*]): any)|HTMLElement}
 */
const createElWithTextAndClass = createElCreator((el, text = "", cl = "") => {
    el.innerHTML = text;
    el.setAttribute("class", cl);
    return el
})

class MyChat {
    constructor() {
        if (this.constructor.instance) {
            console.warn("It's a singleton. You can't create one more instance of this class")
            return null
        }
        this.constructor.instance = this;
        this.nextMessageId = 0;
        this.currentUser = nickName.value;
        nickName.oninput = function ( ) {
            this.currentUser = nickName.value;
            this.nextMessageId = 0;
        }.bind ( this );
        this.messageInput = document.getElementById("newMsg")
        this.messageInput.oninput = function ( ) {
            if (this.messageInput.value && this.currentUser) {
                sendMsgBtn.disabled = false;
            }
            else {
                sendMsgBtn.disabled = true;
            }
            this.messageInput = this.removeClassError.call(this, this.messageInput, 'is-invalid')
        }.bind ( this )

        sendMsgBtn.onclick = async function () {
            sendMsgBtn.disabled = true;
            let num = await this.sendAndCheck(historyWrapper, this.currentUser, this.messageInput.value)
            //console.log(nextMessageId, num)
            if (num >= this.nextMessageId) {
                this.messageInput.value = '';
                return;
            }
            this.messageInput.setAttribute('class', this.messageInput.getAttribute('class') + ' is-invalid');
        }.bind ( this )

//check for short version of the history
        this.numberForShortHistory = document.getElementById("numberForShortHistory")
        shortHistoryCheck.onclick = async function () {
            if (this.numberForShortHistory.value < this.nextMessageId) {
                this.numberForShortHistory = this.removeClassError.call(this, this.numberForShortHistory, 'is-invalid')
            }
            if (shortHistoryCheck.checked) {
                this.numberForShortHistory.disabled = false;
                if (this.numberForShortHistory.value >= this.nextMessageId) {
                    this.numberForShortHistory.setAttribute('class', this.numberForShortHistory.getAttribute('class') + ' is-invalid');
                    return;
                }
                //numberForShortHistory.disabled = true;
                await this.getMessages.call(this, historyWrapper, this.currentUser);
                //numberForShortHistory.disabled = false;
                return;
            }
            this.numberForShortHistory.disabled = true;
            historyWrapper.innerHTML = "";
            this.nextMessageId = 0;
            await this.getMessages.call(this, historyWrapper, this.currentUser);
        }.bind ( this );

        this.numberForShortHistory.oninput = async function () {
            if (this.numberForShortHistory.value >= this.nextMessageId) {
                this.numberForShortHistory.setAttribute('class', this.numberForShortHistory.getAttribute('class') + ' is-invalid');
                return;
            }
            this.numberForShortHistory = this.removeClassError.call(this, this.numberForShortHistory, 'is-invalid');
            await this.getMessages.call(this, historyWrapper, this.currentUser);
        }.bind ( this );
        this.checkLoop.call(this, historyWrapper);
    }

    /**
     * @param nick {string}
     * @param message {string}
     * @returns {number}
     */
    async sendMessage(nick, message) {
        let obj = await jsonPostFetch("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nick, message: message})
        return obj.nextMessageId;
    }

    /**
     * @param place {HTMLElement}
     * @param user {string}
     * @returns {number}
     */
    async getMessages (place, user) {
        try {
            let historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
                func: "getMessages",
                messageId: this.nextMessageId
            })
            this.nextMessageId = historyMsg.nextMessageId; //Stage 3
            this.numberForShortHistory.setAttribute('max', String(this.nextMessageId))
            if (shortHistoryCheck.checked) {
                this.nextMessageId -= this.numberForShortHistory.value;
                historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
                    func: "getMessages",
                    messageId: this.nextMessageId
                })
                place.innerHTML = "";
                this.nextMessageId = historyMsg.nextMessageId;
            }
            for (let {nick, message, timestamp} of historyMsg.data) {
                place.prepend(this.createMsg.call(this, 'div', nick, message, timestamp, user))
            };
            return historyMsg.nextMessageId
        } catch (error) {
            console.error('jsonPost failed: ', error);
        }
    }

    /**
     * @param place {HTMLElement}
     * @param nick {string}
     * @param message {string}
     * @returns {number}
     */
    async sendAndCheck(place, nick, message) {
        let num = await this.sendMessage(nick, message);
        if (num > this.nextMessageId) {
            num = await this.getMessages.call(this, place, this.currentUser);
        }
        return num;
    }

    /**
     * @param place {HTMLElement}
     * @returns {Promise<void>}
     */
    async checkLoop(place) {
        while (true) {
            this.getMessages.call(this, place, this.currentUser);
            await delay(5000)
        }
    }

    /**
     * @type {(function(*=, ...[*]): any)|HTMLElement}
     */
    createTime = createElCreator((el, timestamp) => {
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
    /**
     * @type {(function(*=, ...[*]): any)|HTMLElement}
     */
    createMsgHeader = createElCreator((el, name = "", timestamp, user = "") => {
        let headerClass = "card-header bg-info text-white d-flex justify-content-between p-1"
        if (user === name) {
            el.setAttribute("class", headerClass + " bg-warning");
        }
        else {el.setAttribute("class", headerClass + " bg-info");}
        el.appendChild(createElWithTextAndClass ('strong', name, "mr-auto"));
        el.appendChild(this.createTime ('time', timestamp));
        return el
    })
    /**
     * @type {(function(*=, ...[*]): any)|HTMLElement}
     */
    createMsgContent = createElCreator((el, text) => {
        el.setAttribute("class", "card-body p-1");
        el.setAttribute("style", "white-space: pre-wrap;");
        el.innerHTML = text;
        return el
    })
    /**
     * @type {(function(*=, ...[*]): any)|HTMLElement}
     */
    createMsg = createElCreator((el, name = "", text = "", timestamp, user = "") => {
        if (user === name) {
            el.setAttribute("class", "card w-75 mb-3 ml-auto");
        }
        else {el.setAttribute("class", "card w-75 mb-3 ");}
        el.appendChild(this.createMsgHeader.call(this, 'div', name, timestamp, user));
        el.appendChild(this.createMsgContent ('div', text));
        return el
    })
    /**
     * @param el {HTMLElement}
     * @param errorClass {string}
     * @returns {HTMLElement}
     */
    removeClassError = function(el, errorClass = "") {
        let cl = el.getAttribute('class')
        let errorClassIndex = cl.indexOf(errorClass);
        if (errorClassIndex > -1) {
            let newCl = cl.slice(0,errorClassIndex) + cl.slice(errorClassIndex + errorClass.length, cl.length)
            this.numberForShortHistory.setAttribute('class', newCl)
        }
        return el
    }
}

/**
 * Init chat
 * @type {MyChat}
 */
const chat = new MyChat

