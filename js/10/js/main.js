/**
 * @param url {string}
 * @param data {{}}
 * @returns {Promise}
 */
async function jsonPostFetch (url, data) {
    let dataInit = {
        method: 'POST', //('addMessage' === data.func ? 'POST' ": 'addMessage' === data.func ? 'GET' ": '0')
        body: JSON.stringify(data)
    };
    const response = await fetch(url, dataInit);
    if (!response.ok) {
        throw new Error('status is not ok.');
    }
    return await response.json();
}

/**
 * @param ms {number}
 * @returns {Promise}
 */
const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));

/**
 * clear the last timeout id and start new setTimeout
 * @param fn {function}
 * @param ms {number}
 * @returns {function(...[*]=)}
 */
function debounce(fn, ms) {
    let intervalId = null;
    return function(...rest) {
        clearTimeout(intervalId);
        intervalId = setTimeout(fn, ms, ...rest);
    };
}

/**
 * abstract function for create an element, where handler is current function for content and attributes for the element
 * @param handler {function}
 * @returns {function(*=, ...[*]): HTMLElement | HTMLElement}
 */
function createElCreator(handler = function (el) {return el}) {
    return function (elTag = "div", ...content) {
        let el = document.createElement(elTag);
        el = handler (el, ...content);
        return el
    }
}

/**
 * @type {(function(*=, ...[*]): HTMLElement)|HTMLElement}
 */
const createElWithTextAndClass = createElCreator((el, text = "", cl = "") => {
    el.innerHTML = text;
    el.setAttribute("class", cl);
    return el
});

class MyChat {
    /**
     * @return {null}
     */
    constructor(wrapper) {
        if (this.constructor.instance) {
            console.warn("It's a singleton. You can't create one more instance of this class");
            return null
        }
        this.constructor.instance = this;
        this.wrapper = wrapper;
        this.currentUser = {
            nick: "",
            avatar: "",
        };
        this.nextMessageId = 0;
        this.messageInput = null;
        this.sendMsgBtn = null;
        this.isSendPict = false;
        this.historyWrapper = null;
        this.numberForShortHistory = null;
        this.shortHistoryCheck = null;
        this.spinnerWrapper = null;
        this.clearCanvasBtn = null;

        this.canvas = null;
        this.canvasCurrentTool = "select";
        this.canvasActiveTool = null;
        this.canvasCurrentFill = true;
        this.canvasCurrentColor = "000000";
        this.canvasCurrentSize = 10;
        
        this.initChat.call(this, this.wrapper);
    }

    async initChat(wrapper, name = "My chat") {
        wrapper.innerHTML = "";
        let fragment = document.createDocumentFragment();
        let h2 = createElWithTextAndClass ("h2", name, "mb-5");
        this.spinnerWrapper = createElWithTextAndClass ("div", "", "invisible d-flex justify-content-center");
        this.spinnerWrapper.innerHTML = MyChat.spinnerHTML;
        let historyBackground = createElWithTextAndClass ("div", "", "mb-5 h-50 bg-light p-3");
        // historyBackground.style.height = "60%";
        let historyWrapper = createElWithTextAndClass ("div", "", "overflow-auto mh-100 d-flex flex-wrap p-3");
        this.historyWrapper = historyWrapper;
        historyBackground.append(historyWrapper);
        fragment.append(h2, this.drawControlPanel.call(this), this.spinnerWrapper, historyBackground, this.drawMessagePanel.call(this));
        wrapper.append(fragment);
        await this.getMessages.call(this, this.historyWrapper, this.currentUser);
        this.checkLoop.call(this, this.historyWrapper);
    }

    drawControlPanel () {
        let fragment = document.createDocumentFragment();
        let controlPanel = createElWithTextAndClass ("div", "", "form-row align-items-center");
        let nickWrapper = createElWithTextAndClass("div", "", "col-sm-3 my-1");
        nickWrapper.append(this.drawNickInput.call(this));
        let avatarWrapper = createElWithTextAndClass("div", "", "col-sm-3 my-1");
        avatarWrapper.append(this.drawAvatarInput.call(this));
        controlPanel.append (nickWrapper, avatarWrapper, this.drawShortHistory.call(this));
        fragment.append(controlPanel);
        return fragment
    }

    drawNickInput () {
        let fragment = document.createDocumentFragment();
        let nickLabel = createElWithTextAndClass ("label", "Nickname", "sr-only");
        nickLabel.setAttribute("for", "nickName");
        let nickGroup = createElWithTextAndClass ("div", "", "input-group");
        let nickPrepend = createElWithTextAndClass ("div", "<div class=\"input-group-text\">@</div>","input-group-prepend");
        let nickInput = createElWithTextAndClass ("input", "", "form-control");
        nickInput.id = "nickName";
        nickInput.type = "text";
        nickInput.placeholder = "Nickname";
        /**
         * callback for type nickname
         * @param event {Event}
         */
        async function typeNick(event) {
            if (this.currentUser.nick !== nickInput.value) {
                this.currentUser.nick = nickInput.value;
                this.nextMessageId = 0;
                this.historyWrapper.innerHTML = "";
                await this.getMessages.call(this, this.historyWrapper, this.currentUser);
            }
        }
        nickInput.addEventListener("input", debounce(typeNick.bind(this), 500));
        nickGroup.append(nickPrepend,nickInput);
        fragment.append(nickLabel,nickGroup);
        return fragment
    }

    drawAvatarInput () {
        let fragment = document.createDocumentFragment();
        let avatarLabel = createElWithTextAndClass ("label", "Avatar", "sr-only");
        avatarLabel.setAttribute("for", "avatar");
        let avatarGroup = createElWithTextAndClass ("div", "", "input-group");
        let avatarPrepend = createElWithTextAndClass ("div", "<div class=\"input-group-text\">Avatar link</div>","input-group-prepend");
        let avatarInput = createElWithTextAndClass ("input", "", "form-control");
        avatarInput.id = "avatar";
        avatarInput.type = "text";
        avatarInput.placeholder = "http://";
        avatarInput.oninput = function ( ) {
            this.currentUser.avatar = `<img class="avatar" src="${avatarInput.value}" alt="${this.currentUser.nick}" width="50" height="50">`;
        }.bind ( this );
        avatarGroup.append(avatarPrepend,avatarInput);
        fragment.append(avatarLabel,avatarGroup);
        return fragment
    }

    drawShortHistory () {
        let fragment = document.createDocumentFragment();

        let shortHistoryCheckWrapper = createElWithTextAndClass("div", "", "col-auto my-1 ml-auto");
        let checkShortHistoryGroup = createElWithTextAndClass ("div", "", "form-check");
        this.shortHistoryCheck = createElWithTextAndClass ("input", "", "form-check-input");
        this.shortHistoryCheck.id = "shortHistoryCheck";
        this.shortHistoryCheck.type = "checkbox";
        this.shortHistoryCheck.onclick = async function () {
            if (this.numberForShortHistory.value < this.nextMessageId) {
                this.numberForShortHistory.classList.remove('is-invalid')
            }
            if (this.shortHistoryCheck.checked) {
                this.numberForShortHistory.disabled = false;
                if (this.numberForShortHistory.value >= this.nextMessageId) {
                    this.numberForShortHistory.classList.add('is-invalid');
                    return;
                }
                await this.getMessages.call(this, this.historyWrapper, this.currentUser);
                return;
            }
            this.numberForShortHistory.disabled = true;
            this.historyWrapper.innerHTML = "";
            this.nextMessageId = 0;
            await this.getMessages.call(this, this.historyWrapper, this.currentUser);
        }.bind ( this );
        let shortHistoryCheckLabel = createElWithTextAndClass ("label", "I want to see just part of history", "form-check-label");
        shortHistoryCheckLabel.setAttribute("for", "shortHistoryCheck");
        checkShortHistoryGroup.append(this.shortHistoryCheck,shortHistoryCheckLabel);
        shortHistoryCheckWrapper.append(checkShortHistoryGroup);

        let historyCountWrapper = createElWithTextAndClass("div", "", "col-sm-3 my-1");
        let historyCountLabel = createElWithTextAndClass ("label", "Number of displayed messanges", "sr-only");
        historyCountLabel.setAttribute("for", "numberForShortHistory");
        let historyCountGroup = createElWithTextAndClass ("div", "", "input-group");
        let historyCountPrepend = createElWithTextAndClass ("div", "<div class=\"input-group-text\">Number of displayed messanges</div>","input-group-prepend");
        this.numberForShortHistory = createElWithTextAndClass ("input", "", "form-control");
        this.numberForShortHistory.id = "numberForShortHistory";
        this.numberForShortHistory.type = "number";
        this.numberForShortHistory.min = 1;
        this.numberForShortHistory.step = 1;
        this.numberForShortHistory.disabled = true;
        this.numberForShortHistory.oninput = async function () {
            if (this.numberForShortHistory.value >= this.nextMessageId) {
                this.numberForShortHistory.classList.add('is-invalid');
                return;
            }
            this.numberForShortHistory.classList.remove('is-invalid');
            await this.getMessages.call(this, this.historyWrapper, this.currentUser);
        }.bind ( this );

        historyCountGroup.append(historyCountPrepend, this.numberForShortHistory);
        historyCountWrapper.append(historyCountGroup);
        fragment.append(shortHistoryCheckWrapper, historyCountWrapper);
        return fragment
    }
    drawMessagePanel () {
        let fragment = document.createDocumentFragment();
        let messageGroup = createElWithTextAndClass ("div", "", "input-group mb-3");
        let messagePrepend = createElWithTextAndClass ("div", "<div class=\"input-group-text\">Message</div>","input-group-prepend");
        let messageInput = createElWithTextAndClass ("textarea", "", "form-control");
        messageInput.id = "newMsg";
        messageInput.setAttribute("aria-label", "Message");
        this.messageInput = messageInput;
        this.messageInput.oninput = function ( ) {
            this.sendMsgBtn.disabled = !(this.messageInput.value && this.currentUser.nick);
            this.messageInput.classList.remove('is-invalid');
        }.bind ( this );

        this.messageInput = messageInput;
        messageGroup.append(messagePrepend,messageInput, this.drawSendBtnGroup.call(this));
        fragment.append(messageGroup, this.drawAttachPanel.call(this));
        return fragment
    }

    drawSendBtnGroup () {
        let sendWrapper = createElWithTextAndClass("div", "", "ml-2 d-flex flex-column justify-content-between")
        let sendPictCheckGroup = createElWithTextAndClass ("div", "", "form-check");
        let sendPictCheckbox = createElWithTextAndClass ("input", "", "form-check-input");
        sendPictCheckbox.id = "sendPictCheckbox";
        sendPictCheckbox.type = "checkbox";
        sendPictCheckbox.onclick = function () {
            this.isSendPict = !this.isSendPict
        }.bind ( this );
        let sendPictCheckLabel = createElWithTextAndClass ("label", "Send picture", "form-check-label");
        sendPictCheckLabel.setAttribute("for", "sendPictCheckbox");
        sendPictCheckGroup.append(sendPictCheckbox,sendPictCheckLabel);

        this.sendMsgBtn = createElWithTextAndClass ("button", "Send", "btn btn-primary");
        this.sendMsgBtn.disabled = true;
        // this.sendMsgBtn.id = "sendMsgBtn";
        this.sendMsgBtn.type = "button";
        this.sendMsgBtn.onclick = async function () {
            this.sendMsgBtn.disabled = true;
            let emoji = /:(.*?):/g;
            let input = this.messageInput.value;
            let msg = "<p>";
            let text = "";
            let result;
            let index = 0;
            while ((result = emoji.exec(input)) !== null) {
                if (!(Object.values(MyChat.emoji).flat().includes(result[0]))) {
                    text += input.slice(index, emoji.lastIndex);
                }
                else {
                    let currentEmoji = result[0].slice(1, result[0].length - 1);
                    text += input.slice(index, emoji.lastIndex - result[0].length);
                    text += "<img src=\"" + MyChat.emojiLink + currentEmoji + `.png" style="width: 20px; cursor=pointer;" alt="${currentEmoji}">`;
                }
                index = emoji.lastIndex;
            }
            text += input.slice(index);
            msg += text + "</p>";
            if (this.isSendPict) {
                msg += `<img src = ${this.canvas.toDataURL()} alt = "picture from canvas">`;
            }
            let num = await this.sendAndCheck(this.historyWrapper, this.currentUser, msg);
            if (num >= this.nextMessageId) {
                this.messageInput.value = '';
                return;
            }
            this.messageInput.classList.add('is-invalid');
        }.bind ( this );
        sendWrapper.append(sendPictCheckGroup, this.sendMsgBtn)
        return sendWrapper;
    }

    drawAttachPanel () {
        let wrapper = createElWithTextAndClass ("div", "", "d-flex justify-content-between align-items-start");
        wrapper.append(this.drawEmojiPanel.call(this), this.drawCanvasPanel.call(this));
        return wrapper
    };

    drawEmojiPanel () {
        let wrapper = createElWithTextAndClass("div", "", "w-50 pr-5");
        let nav = createElWithTextAndClass ("nav", "", "d-flex justify-content-between");
        let comment = createElWithTextAndClass ("div", "To send the emoji paste its name to your message","alert alert-secondary small m-0");
        comment.role = "alert";
        let tabs = createElWithTextAndClass ("div", "", "nav nav-tabs");
        tabs.role = "tablist";
        tabs.id = "emojiTabs";
        nav.append(tabs, comment);
        let content = createElWithTextAndClass ("div", "", "tab-content mt-2");
        content.id = "emojiContent";
        for (let [group, emojis] of Object.entries(MyChat.emoji)) {
            let a = createElWithTextAndClass ("a", group, "nav-item nav-link");
            a.setAttribute("data-toggle", "tab");
            a.role = "tab";
            a.id = group + "NavTab";
            a.href = "#" + group + "Nav";
            a.setAttribute("aria-controls", group + "Nav");
            a.setAttribute("aria-selected", "false");
            let emojiGroup = createElWithTextAndClass ("div", "", "tab-pane fade");
            emojiGroup.append(this.drawEmojiGroup.call(this, emojis));
            emojiGroup.id = group + "Nav";
            emojiGroup.role = "tabpanel";
            emojiGroup.setAttribute("aria-labelledby", group + "NavTab");
            tabs.append(a);
            content.append(emojiGroup);
        }
        content.querySelector("div").classList.add("show", "active");
        tabs.querySelector("a").classList.add("active");
        tabs.querySelector("a").setAttribute("aria-selected", "true");

        wrapper.append(nav, content);
        return wrapper
    }

    drawEmojiGroup(emojiGroup){
        let container = createElWithTextAndClass ("div", "", "container m-0");
        // container.style.maxWidth = "100%";
        let columnsNumber = 3;
        for (let i = 0; i < Math.ceil(emojiGroup.length/columnsNumber); i++) {
            let row = createElWithTextAndClass ("div", "", "row");
            for (let j = 0; (j < columnsNumber) && ((i*columnsNumber + j) < emojiGroup.length); j++) {
                let item = createElWithTextAndClass ("div", "", "col");
                let pic = createElWithTextAndClass ("img", "", "mr-2");
                pic.src = MyChat.emojiLink + emojiGroup[i*columnsNumber + j].slice(1, emojiGroup[i*columnsNumber + j].length - 1) + ".png";
                pic.style.width = "20px";
                pic.style.height = "20px";
                let text = createElWithTextAndClass ("span", emojiGroup[i*columnsNumber + j], "small");
                item.append(pic,text);
                row.appendChild(item);
            }
            container.appendChild(row);
        }
        return container
    }
    drawCanvasPanel () {
        let panel = createElWithTextAndClass ("div", "", "card text-center w-50");
        let header = createElWithTextAndClass ("div", "", "card-header d-flex justify-content-between align-items-center");
        header.append(this.drawCanvasControls(), this.drawBrushSize(), this.drawCanvasColour());
        let body = createElWithTextAndClass ("div", "", "card-body bg-dark");
        body.append(this.drawCanvas.call(this));
        let footer = createElWithTextAndClass ("div", "", "card-footer d-flex justify-content-between");
        footer.append(this.drawCanvasFooter());
        panel.append(header, body, footer);
        return panel
    }

    drawCanvasFooter = () => {
        let fragment = document.createDocumentFragment();
        this.clearAllBtn = this.drawBtnWithIcon(
            "Clear all",
            {
                currentClass: "bi-trash-fill",
                content: `<path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>`
            }
        );
        this.clearSelectionBtn = this.drawBtnWithIcon(
            "Clear selection",
            {
                currentClass: "bi-trash",
                content: `<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>`
            }
        );
        fragment.append(this.clearAllBtn, this.clearSelectionBtn);
        return fragment
    };

    drawCanvasControlGroup = createElCreator(function (div, label) {
        div.classList.add("d-flex", "align-items-center");
        div.innerHTML = `<span class = "text-muted small mr-2">${label}</span>`;
        return div
    });

    drawBrushSize = () => {
        let wrapper = this.drawCanvasControlGroup("div", "Size", "mr-2");
        let input = createElWithTextAndClass ("input", "", "form-control");
        input.type = "number";
        input.value = 5;
        input.max = 400;
        input.min = 1;
        input.style.width = "70px";
        input.oninput = () => {
            this.canvasCurrentSize = input.value
        };
        wrapper.append(input);
        return wrapper
    };

    drawCanvasColour = () => {
        let wrapper = this.drawCanvasControlGroup("div", "Color", "mr-2");
        let input = createElWithTextAndClass ("input", "", "form-control");
        input.type = "color";
        input.value = "#000000";
        input.style.width = "50px";
        input.oninput = () => {
            this.canvasCurrentColor = input.value
        };
        wrapper.append(input);
        return wrapper
    };

    drawCanvasControls = () => {
        let fragment = document.createDocumentFragment();
        for (let [controlGroupName, controlGroup] of Object.entries(MyChat.canvasControlElements)) {
            let wrapper = this.drawCanvasControlGroup("div", controlGroupName, "mr-2");
            let radioGroup = createElWithTextAndClass("div", "", "");
            let {current, active, values} = controlGroup;
            for (let i = 0; i < values.length; i++) {
                let {name, currentClass, content} = values [i];
                let radioWrapper = this.drawCanvasControlElement(name, currentClass, content, current, active);
                if (i === 0) {
                    this[active] = radioWrapper;
                    this[active].classList.toggle("border");
                }
                radioGroup.append(radioWrapper)
            }
            wrapper.append(radioGroup);
            fragment.append(wrapper)
        }
        return fragment
    };

    drawCanvasControlElement = (name, currentClass, content,  current, active) => {
        let tool = createElWithTextAndClass ("div", "", "form-check form-check-inline mr-1 p-1");
        let label = document.createElement("label");
        label.classList.add("mb-0");
        label.setAttribute("aria-label", "tool " + name);
        let radioBtn = createElWithTextAndClass ("input", "","d-none");
        radioBtn.name = "tool";
        radioBtn.value = name;
        let svg = this.drawIcon(currentClass, content);
        label.append(radioBtn,svg);
        tool.append(label);
        tool.onclick = () => this.changeTool(tool, name, current, active);
        return tool
    };

    changeTool = (el, newTool, current, active) => {
        this[active].classList.toggle("border");
        this[active] = el;
        this[current] = newTool;
        this[active].classList.toggle("border")
    };

    drawCanvas () {
        this.canvas = createElWithTextAndClass ("canvas", "", "bg-white");
        this.canvas.width = "400";
        this.canvas.height = "400";
        return this.canvas
    }

    drawBtnWithIcon = (text = "Button", {currentClass, content} = {}) => {
        let svg = this.drawIcon(currentClass, content);
        svg.classList.add("mr-2");
        let button = createElWithTextAndClass ("button", text, "btn btn-primary");
        button.type = "button";
        button.prepend(svg);
        return button
};

    drawClearCanvasSelectionBtn () {
        let trash = this.drawIcon("bi-trash-fill",
            `<path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>`
        );
        trash.classList.add("mr-2");
        this.clearCanvasBtn = createElWithTextAndClass ("button", "Clear canvas", "btn btn-primary");
        this.clearCanvasBtn.type = "button";
        this.clearCanvasBtn.prepend(trash);
        this.clearCanvasBtn.onclick = function () {
            Drawable.clearAll();
        };
        return this.clearCanvasBtn
    }

    drawClearCanvasBtn () {
        let trash = this.drawIcon("bi-trash-fill",
    `<path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>`
        );
        trash.classList.add("mr-2")
        this.clearCanvasBtn = createElWithTextAndClass ("button", "Clear canvas", "btn btn-primary");
        this.clearCanvasBtn.type = "button";
        this.clearCanvasBtn.prepend(trash);
        this.clearCanvasBtn.onclick = function () {
            Drawable.clearAll();
        };
        return this.clearCanvasBtn
    }

    drawIcon (currentClass, content, {size = "1em", sizeBox = 16, color = "currentColor", classes = ["bi", "mb-1"]} = {}) {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add(currentClass, ...classes);
        svg.setAttribute("width",size);
        svg.setAttribute("height", size);
        svg.setAttribute("viewBox", `0 0 ${sizeBox} ${sizeBox}`);
        svg.setAttribute("fill", color);
        svg.innerHTML = content;
        return svg
    };

    /**
     * @param user {{}}
     * @param message {string}
     * @returns {number}
     */
    async sendMessage(user, message) {
        let nick = user.avatar + user.nick;
        let obj = await jsonPostFetch("http://students.a-level.com.ua:10012", {func: 'addMessage', nick: nick, message: message});
        return obj.nextMessageId;
    }
    /**
     * @param place {HTMLElement}
     * @param user {{}}
     * @returns {number}
     */
    async getMessages (place, user) {
        try {
            this.spinnerWrapper.classList.remove("invisible");
            let historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
                func: "getMessages",
                messageId: this.nextMessageId
            });
            this.nextMessageId = historyMsg.nextMessageId; //Stage 3
            // console.log(historyMsg.nextMessageId, this.nextMessageId)

            this.numberForShortHistory.setAttribute('max', String(this.nextMessageId));
            if (this.shortHistoryCheck.checked) {
                this.nextMessageId -= this.numberForShortHistory.value;
                historyMsg = await jsonPostFetch("http://students.a-level.com.ua:10012", {
                    func: "getMessages",
                    messageId: this.nextMessageId
                });
                place.innerHTML = "";
                this.nextMessageId = historyMsg.nextMessageId;
            }
            for (let {nick, message, timestamp} of historyMsg.data) {
                let author = {nick: "", avatar: ""};
                if ("string" === typeof nick) {
                    let avatarIndex = nick.indexOf("<img");
                    if (avatarIndex > -1) {
                        author.nick = nick.slice(0, avatarIndex);
                        author.avatar = nick.slice(avatarIndex, nick.indexOf(">") + 1);
                        author.nick += nick.slice(nick.indexOf(">") + 1);
                    } else {
                        author.nick = nick;
                    }
                }
                place.prepend(this.createMsg.call(this, 'div', author, message, timestamp, user))
            }
            this.spinnerWrapper.classList.add("invisible");
            return historyMsg.nextMessageId
        } catch (error) {
            console.error('jsonPost failed: ', error);
        }
    }
    /**
     * @param place {HTMLElement}
     * @param user {{}}
     * @param message {string}
     * @returns {number}
     */
    async sendAndCheck(place, user, message) {
        let num = await this.sendMessage(user, message);
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
     * @type {(function(*=, ...[*]): HTMLElement)|HTMLElement}
     */
    createTime = createElCreator((el, timestamp) => {
        let time = new Date(timestamp);
        let today = new Date;
        let timeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"};
        let timeMsg;
        if (time.getDate() === today.getDate()) {
            timeMsg = time.toLocaleTimeString()
        }
        else {
            timeMsg = time.toLocaleDateString("ru", timeOptions)
        }
        el.setAttribute("datetime", time);
        el.appendChild(createElWithTextAndClass ('small', timeMsg));
        return el
    });
    /**
     * @type {(function(*=, ...[*]): HTMLElement)|HTMLElement}
     */
    createMsgHeader = createElCreator((el, author = {}, timestamp, user = {}) => {
        let headerClass = "card-header bg-info text-white d-flex justify-content-between align-items-center p-1";
        if (user.nick === author.nick) {
            el.setAttribute("class", headerClass + " bg-warning");
        }
        else {el.setAttribute("class", headerClass + " bg-info");}
        if (author.avatar !== "") {
            let avatar = createElWithTextAndClass ('div', author.avatar, "rounded-circle border border-white mr-3");
            avatar.width = "50px";
            avatar.height = "50px";
            avatar.querySelector("img").classList.add("rounded-circle")
            el.appendChild(avatar);
        }
        el.appendChild(createElWithTextAndClass ('strong', author.nick, "mr-auto"));
        el.appendChild(this.createTime ('time', timestamp));
        return el
    });
    /**
     * @type {(function(*=, ...[*]): HTMLElement)|HTMLElement}
     */
    createMsgContent = createElCreator((el, text) => {
        el.setAttribute("class", "card-body p-1");
        el.setAttribute("style", "white-space: pre-wrap;");
        el.innerHTML = text;
        return el
    });
    /**
     * @type {(function(*=, ...[*]): HTMLElement)|HTMLElement}
     */
    createMsg = createElCreator((el, author = {}, text = "", timestamp, user = {}) => {
        if (user.nick === author.nick) {
            el.setAttribute("class", "card w-75 mb-3 ml-auto");
        }
        else {el.setAttribute("class", "card w-75 mb-3 ");}
        el.appendChild(this.createMsgHeader.call(this, 'div', author, timestamp, user));
        el.appendChild(this.createMsgContent ('div', text));
        return el
    });
}

MyChat.spinnerHTML =
    `<div class="spinner-border text-primary m-3" role="status">
        <span class="sr-only d-block">Loading...</span>
    </div>`;

MyChat.canvasControlElements = {
    Tools: {
        current: "canvasCurrentTool",
        active: "canvasActiveTool",
        values: [
        {
            name: "select",
            currentClass: "bi-cursor-fill",
            content: `<path fill-rule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>`
        },
        {
            name: "graffity",
            currentClass: "bi-brush",
            content: `<path d="M15.213 1.018a.572.572 0 0 1 .756.05.57.57 0 0 1 .057.746C15.085 3.082 12.044 7.107 9.6 9.55c-.71.71-1.42 1.243-1.952 1.596-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.212-1.543.346-.542.887-1.273 1.642-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/>
                            <path d="M7 12a2 2 0 0 1-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 0 1 2 2z"/>
                            `
        },
        {
            name: "line",
            currentClass: "bi-slash",
            content: `<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>`
        },
        {
            name: "circle",
            currentClass: "bi-circle-fill",
            content: `<circle cx="8" cy="8" r="8"/>`
        },
        {
            name: "rectangle",
            currentClass: "bi-square-fill",
            content: `<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>`
        }
    ]
    },
    Fill: {
        current: "canvasCurrentFill",
        active: "canvasActiveFill",
        values: [
            {
                name: true,
                currentClass: "bi-square-fill",
                content: `<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>`
            },
            {
                name: false,
                currentClass: "bi-square",
                content: `<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>`
            }
        ]
    }
};
MyChat.emojiLink = "https://www.webfx.com/tools/emoji-cheat-sheet/graphics/emojis/";
MyChat.emoji = {
    people: [
        ":bowtie:",
        ":smile:",
        ":simple_smile:",
        ":laughing:",
        ":blush:",
        ":smiley:",
        ":relaxed:",
        ":smirk:",
        ":heart_eyes:",
        ":kissing_heart:",
        ":kissing_closed_eyes:",
        ":flushed:",
        ":relieved:",
        ":satisfied:",
        ":grin:",
        ":wink:",
        ":stuck_out_tongue_winking_eye:",
        ":stuck_out_tongue_closed_eyes:",
        ":grinning:",
        ":kissing:",
        ":kissing_smiling_eyes:",
        ":stuck_out_tongue:",
        ":sleeping:",
        ":worried:",
        ":frowning:",
        ":anguished:",
        ":open_mouth:",
        ":grimacing:",
        ":confused:",
        ":hushed:",
        ":expressionless:",
        ":unamused:",
        ":sweat_smile:",
        ":sweat:",
        ":disappointed_relieved:",
        ":weary:",
        ":pensive:",
        ":disappointed:",
        ":confounded:",
        ":fearful:",
        ":cold_sweat:",
        ":persevere:",
        ":cry:",
        ":sob:",
        ":joy:",
        ":astonished:",
        ":scream:",
        ":neckbeard:",
        ":tired_face:",
        ":angry:",
        ":rage:",
        ":triumph:",
        ":sleepy:",
        ":yum:",
        ":mask:",
        ":sunglasses:",
        ":dizzy_face:",
        ":imp:",
        ":smiling_imp:",
        ":neutral_face:",
        ":no_mouth:",
        ":innocent:",
        ":alien:",
        ":yellow_heart:",
        ":blue_heart:",
        ":purple_heart:",
        ":heart:",
        ":green_heart:",
        ":broken_heart:",
        ":heartbeat:",
        ":heartpulse:",
        ":two_hearts:",
        ":revolving_hearts:",
        ":cupid:",
        ":sparkling_heart:",
        ":sparkles:",
        ":star:",
        ":star2:",
        ":dizzy:",
        ":boom:",
        ":collision:",
        ":anger:",
        ":exclamation:",
        ":question:",
        ":grey_exclamation:",
        ":grey_question:",
        ":zzz:",
        ":dash:",
        ":sweat_drops:",
        ":notes:",
        ":musical_note:",
        ":fire:",
        ":hankey:",
        ":poop:",
        ":shit:",
        ":+1:",
        ":thumbsup:",
        ":-1:",
        ":thumbsdown:",
        ":ok_hand:",
        ":punch:",
        ":facepunch:",
        ":fist:",
        ":v:",
        ":wave:",
        ":hand:",
        ":raised_hand:",
        ":open_hands:",
        ":point_up:",
        ":point_down:",
        ":point_left:",
        ":point_right:",
        ":raised_hands:",
        ":pray:",
        ":point_up_2:",
        ":clap:",
        ":muscle:",
        ":metal:",
        ":fu:",
        ":runner:",
        ":running:",
        ":couple:",
        ":family:",
        ":two_men_holding_hands:",
        ":two_women_holding_hands:",
        ":dancer:",
        ":dancers:",
        ":ok_woman:",
        ":no_good:",
        ":information_desk_person:",
        ":raising_hand:",
        ":bride_with_veil:",
        ":person_with_pouting_face:",
        ":person_frowning:",
        ":bow:",
        ":couplekiss:",
        ":couple_with_heart:",
        ":massage:",
        ":haircut:",
        ":nail_care:",
        ":boy:",
        ":girl:",
        ":woman:",
        ":man:",
        ":baby:",
        ":older_woman:",
        ":older_man:",
        ":person_with_blond_hair:",
        ":man_with_gua_pi_mao:",
        ":man_with_turban:",
        ":construction_worker:",
        ":cop:",
        ":angel:",
        ":princess:",
        ":smiley_cat:",
        ":smile_cat:",
        ":heart_eyes_cat:",
        ":kissing_cat:",
        ":smirk_cat:",
        ":scream_cat:",
        ":crying_cat_face:",
        ":joy_cat:",
        ":pouting_cat:",
        ":japanese_ogre:",
        ":japanese_goblin:",
        ":see_no_evil:",
        ":hear_no_evil:",
        ":speak_no_evil:",
        ":guardsman:",
        ":skull:",
        ":feet:",
        ":lips:",
        ":kiss:",
        ":droplet:",
        ":ear:",
        ":eyes:",
        ":nose:",
        ":tongue:",
        ":love_letter:",
        ":bust_in_silhouette:",
        ":busts_in_silhouette:",
        ":speech_balloon:",
        ":thought_balloon:",
        ":feelsgood:",
        ":finnadie:",
        ":goberserk:",
        ":godmode:",
        ":hurtrealbad:",
        ":rage1:",
        ":rage2:",
        ":rage3:",
        ":rage4:",
        ":suspect:",
        ":trollface:"
    ],
    nature: [
        ":sunny:",
        ":umbrella:",
        ":cloud:",
        ":snowflake:",
        ":snowman:",
        ":zap:",
        ":cyclone:",
        ":foggy:",
        ":ocean:",
        ":cat:",
        ":dog:",
        ":mouse:",
        ":hamster:",
        ":rabbit:",
        ":wolf:",
        ":frog:",
        ":tiger:",
        ":koala:",
        ":bear:",
        ":pig:",
        ":pig_nose:",
        ":cow:",
        ":boar:",
        ":monkey_face:",
        ":monkey:",
        ":horse:",
        ":racehorse:",
        ":camel:",
        ":sheep:",
        ":elephant:",
        ":panda_face:",
        ":snake:",
        ":bird:",
        ":baby_chick:",
        ":hatched_chick:",
        ":hatching_chick:",
        ":chicken:",
        ":penguin:",
        ":turtle:",
        ":bug:",
        ":honeybee:",
        ":ant:",
        ":beetle:",
        ":snail:",
        ":octopus:",
        ":tropical_fish:",
        ":fish:",
        ":whale:",
        ":whale2:",
        ":dolphin:",
        ":cow2:",
        ":ram:",
        ":rat:",
        ":water_buffalo:",
        ":tiger2:",
        ":rabbit2:",
        ":dragon:",
        ":goat:",
        ":rooster:",
        ":dog2:",
        ":pig2:",
        ":mouse2:",
        ":ox:",
        ":dragon_face:",
        ":blowfish:",
        ":crocodile:",
        ":dromedary_camel:",
        ":leopard:",
        ":cat2:",
        ":poodle:",
        ":paw_prints:",
        ":bouquet:",
        ":cherry_blossom:",
        ":tulip:",
        ":four_leaf_clover:",
        ":rose:",
        ":sunflower:",
        ":hibiscus:",
        ":maple_leaf:",
        ":leaves:",
        ":fallen_leaf:",
        ":herb:",
        ":mushroom:",
        ":cactus:",
        ":palm_tree:",
        ":evergreen_tree:",
        ":deciduous_tree:",
        ":chestnut:",
        ":seedling:",
        ":blossom:",
        ":ear_of_rice:",
        ":shell:",
        ":globe_with_meridians:",
        ":sun_with_face:",
        ":full_moon_with_face:",
        ":new_moon_with_face:",
        ":new_moon:",
        ":waxing_crescent_moon:",
        ":first_quarter_moon:",
        ":waxing_gibbous_moon:",
        ":full_moon:",
        ":waning_gibbous_moon:",
        ":last_quarter_moon:",
        ":waning_crescent_moon:",
        ":last_quarter_moon_with_face:",
        ":first_quarter_moon_with_face:",
        ":crescent_moon:",
        ":earth_africa:",
        ":earth_americas:",
        ":earth_asia:",
        ":volcano:",
        ":milky_way:",
        ":partly_sunny:",
        ":octocat:",
        ":squirrel:"
    ],
    objects: [
        ":bamboo:",
        ":gift_heart:",
        ":dolls:",
        ":school_satchel:",
        ":mortar_board:",
        ":flags:",
        ":fireworks:",
        ":sparkler:",
        ":wind_chime:",
        ":rice_scene:",
        ":jack_o_lantern:",
        ":ghost:",
        ":santa:",
        ":christmas_tree:",
        ":gift:",
        ":bell:",
        ":no_bell:",
        ":tanabata_tree:",
        ":tada:",
        ":confetti_ball:",
        ":balloon:",
        ":crystal_ball:",
        ":cd:",
        ":dvd:",
        ":floppy_disk:",
        ":camera:",
        ":video_camera:",
        ":movie_camera:",
        ":computer:",
        ":tv:",
        ":iphone:",
        ":phone:",
        ":telephone:",
        ":telephone_receiver:",
        ":pager:",
        ":fax:",
        ":minidisc:",
        ":vhs:",
        ":sound:",
        ":speaker:",
        ":mute:",
        ":loudspeaker:",
        ":mega:",
        ":hourglass:",
        ":hourglass_flowing_sand:",
        ":alarm_clock:",
        ":watch:",
        ":radio:",
        ":satellite:",
        ":loop:",
        ":mag:",
        ":mag_right:",
        ":unlock:",
        ":lock:",
        ":lock_with_ink_pen:",
        ":closed_lock_with_key:",
        ":key:",
        ":bulb:",
        ":flashlight:",
        ":high_brightness:",
        ":low_brightness:",
        ":electric_plug:",
        ":battery:",
        ":calling:",
        ":email:",
        ":mailbox:",
        ":postbox:",
        ":bath:",
        ":bathtub:",
        ":shower:",
        ":toilet:",
        ":wrench:",
        ":nut_and_bolt:",
        ":hammer:",
        ":seat:",
        ":moneybag:",
        ":yen:",
        ":dollar:",
        ":pound:",
        ":euro:",
        ":credit_card:",
        ":money_with_wings:",
        ":e-mail:",
        ":inbox_tray:",
        ":outbox_tray:",
        ":envelope:",
        ":incoming_envelope:",
        ":postal_horn:",
        ":mailbox_closed:",
        ":mailbox_with_mail:",
        ":mailbox_with_no_mail:",
        ":package:",
        ":door:",
        ":smoking:",
        ":bomb:",
        ":gun:",
        ":hocho:",
        ":pill:",
        ":syringe:",
        ":page_facing_up:",
        ":page_with_curl:",
        ":bookmark_tabs:",
        ":bar_chart:",
        ":chart_with_upwards_trend:",
        ":chart_with_downwards_trend:",
        ":scroll:",
        ":clipboard:",
        ":calendar:",
        ":date:",
        ":card_index:",
        ":file_folder:",
        ":open_file_folder:",
        ":scissors:",
        ":pushpin:",
        ":paperclip:",
        ":black_nib:",
        ":pencil2:",
        ":straight_ruler:",
        ":triangular_ruler:",
        ":closed_book:",
        ":green_book:",
        ":blue_book:",
        ":orange_book:",
        ":notebook:",
        ":notebook_with_decorative_cover:",
        ":ledger:",
        ":books:",
        ":bookmark:",
        ":name_badge:",
        ":microscope:",
        ":telescope:",
        ":newspaper:",
        ":football:",
        ":basketball:",
        ":soccer:",
        ":baseball:",
        ":tennis:",
        ":8ball:",
        ":rugby_football:",
        ":bowling:",
        ":golf:",
        ":mountain_bicyclist:",
        ":bicyclist:",
        ":horse_racing:",
        ":snowboarder:",
        ":swimmer:",
        ":surfer:",
        ":ski:",
        ":spades:",
        ":hearts:",
        ":clubs:",
        ":diamonds:",
        ":gem:",
        ":ring:",
        ":trophy:",
        ":musical_score:",
        ":musical_keyboard:",
        ":violin:",
        ":space_invader:",
        ":video_game:",
        ":black_joker:",
        ":flower_playing_cards:",
        ":game_die:",
        ":dart:",
        ":mahjong:",
        ":clapper:",
        ":memo:",
        ":pencil:",
        ":book:",
        ":art:",
        ":microphone:",
        ":headphones:",
        ":trumpet:",
        ":saxophone:",
        ":guitar:",
        ":shoe:",
        ":sandal:",
        ":high_heel:",
        ":lipstick:",
        ":boot:",
        ":shirt:",
        ":tshirt:",
        ":necktie:",
        ":womans_clothes:",
        ":dress:",
        ":running_shirt_with_sash:",
        ":jeans:",
        ":kimono:",
        ":bikini:",
        ":ribbon:",
        ":tophat:",
        ":crown:",
        ":womans_hat:",
        ":mans_shoe:",
        ":closed_umbrella:",
        ":briefcase:",
        ":handbag:",
        ":pouch:",
        ":purse:",
        ":eyeglasses:",
        ":fishing_pole_and_fish:",
        ":coffee:",
        ":tea:",
        ":sake:",
        ":baby_bottle:",
        ":beer:",
        ":beers:",
        ":cocktail:",
        ":tropical_drink:",
        ":wine_glass:",
        ":fork_and_knife:",
        ":pizza:",
        ":hamburger:",
        ":fries:",
        ":poultry_leg:",
        ":meat_on_bone:",
        ":spaghetti:",
        ":curry:",
        ":fried_shrimp:",
        ":bento:",
        ":sushi:",
        ":fish_cake:",
        ":rice_ball:",
        ":rice_cracker:",
        ":rice:",
        ":ramen:",
        ":stew:",
        ":oden:",
        ":dango:",
        ":egg:",
        ":bread:",
        ":doughnut:",
        ":custard:",
        ":icecream:",
        ":ice_cream:",
        ":shaved_ice:",
        ":birthday:",
        ":cake:",
        ":cookie:",
        ":chocolate_bar:",
        ":candy:",
        ":lollipop:",
        ":honey_pot:",
        ":apple:",
        ":green_apple:",
        ":tangerine:",
        ":lemon:",
        ":cherries:",
        ":grapes:",
        ":watermelon:",
        ":strawberry:",
        ":peach:",
        ":melon:",
        ":banana:",
        ":pear:",
        ":pineapple:",
        ":sweet_potato:",
        ":eggplant:",
        ":tomato:",
        ":corn:"
    ],
    places: [
        ":house:",
        ":house_with_garden:",
        ":school:",
        ":office:",
        ":post_office:",
        ":hospital:",
        ":bank:",
        ":convenience_store:",
        ":love_hotel:",
        ":hotel:",
        ":wedding:",
        ":church:",
        ":department_store:",
        ":european_post_office:",
        ":city_sunrise:",
        ":city_sunset:",
        ":japanese_castle:",
        ":european_castle:",
        ":tent:",
        ":factory:",
        ":tokyo_tower:",
        ":japan:",
        ":mount_fuji:",
        ":sunrise_over_mountains:",
        ":sunrise:",
        ":stars:",
        ":statue_of_liberty:",
        ":bridge_at_night:",
        ":carousel_horse:",
        ":rainbow:",
        ":ferris_wheel:",
        ":fountain:",
        ":roller_coaster:",
        ":ship:",
        ":speedboat:",
        ":boat:",
        ":sailboat:",
        ":rowboat:",
        ":anchor:",
        ":rocket:",
        ":airplane:",
        ":helicopter:",
        ":steam_locomotive:",
        ":tram:",
        ":mountain_railway:",
        ":bike:",
        ":aerial_tramway:",
        ":suspension_railway:",
        ":mountain_cableway:",
        ":tractor:",
        ":blue_car:",
        ":oncoming_automobile:",
        ":car:",
        ":red_car:",
        ":taxi:",
        ":oncoming_taxi:",
        ":articulated_lorry:",
        ":bus:",
        ":oncoming_bus:",
        ":rotating_light:",
        ":police_car:",
        ":oncoming_police_car:",
        ":fire_engine:",
        ":ambulance:",
        ":minibus:",
        ":truck:",
        ":train:",
        ":station:",
        ":train2:",
        ":bullettrain_front:",
        ":bullettrain_side:",
        ":light_rail:",
        ":monorail:",
        ":railway_car:",
        ":trolleybus:",
        ":ticket:",
        ":fuelpump:",
        ":vertical_traffic_light:",
        ":traffic_light:",
        ":warning:",
        ":construction:",
        ":beginner:",
        ":atm:",
        ":slot_machine:",
        ":busstop:",
        ":barber:",
        ":hotsprings:",
        ":checkered_flag:",
        ":crossed_flags:",
        ":izakaya_lantern:",
        ":moyai:",
        ":circus_tent:",
        ":performing_arts:",
        ":round_pushpin:",
        ":triangular_flag_on_post:",
        ":jp:",
        ":kr:",
        ":cn:",
        ":us:",
        ":fr:",
        ":es:",
        ":it:",
        ":ru:",
        ":gb:",
        ":uk:",
        ":de:"
    ],
    symbols: [
        ":one:",
        ":two:",
        ":three:",
        ":four:",
        ":five:",
        ":six:",
        ":seven:",
        ":eight:",
        ":nine:",
        ":keycap_ten:",
        ":1234:",
        ":zero:",
        ":hash:",
        ":symbols:",
        ":arrow_backward:",
        ":arrow_down:",
        ":arrow_forward:",
        ":arrow_left:",
        ":capital_abcd:",
        ":abcd:",
        ":abc:",
        ":arrow_lower_left:",
        ":arrow_lower_right:",
        ":arrow_right:",
        ":arrow_up:",
        ":arrow_upper_left:",
        ":arrow_upper_right:",
        ":arrow_double_down:",
        ":arrow_double_up:",
        ":arrow_down_small:",
        ":arrow_heading_down:",
        ":arrow_heading_up:",
        ":leftwards_arrow_with_hook:",
        ":arrow_right_hook:",
        ":left_right_arrow:",
        ":arrow_up_down:",
        ":arrow_up_small:",
        ":arrows_clockwise:",
        ":arrows_counterclockwise:",
        ":rewind:",
        ":fast_forward:",
        ":information_source:",
        ":ok:",
        ":twisted_rightwards_arrows:",
        ":repeat:",
        ":repeat_one:",
        ":new:",
        ":top:",
        ":up:",
        ":cool:",
        ":free:",
        ":ng:",
        ":cinema:",
        ":koko:",
        ":signal_strength:",
        ":u5272:",
        ":u5408:",
        ":u55b6:",
        ":u6307:",
        ":u6708:",
        ":u6709:",
        ":u6e80:",
        ":u7121:",
        ":u7533:",
        ":u7a7a:",
        ":u7981:",
        ":sa:",
        ":restroom:",
        ":mens:",
        ":womens:",
        ":baby_symbol:",
        ":no_smoking:",
        ":parking:",
        ":wheelchair:",
        ":metro:",
        ":baggage_claim:",
        ":accept:",
        ":wc:",
        ":potable_water:",
        ":put_litter_in_its_place:",
        ":secret:",
        ":congratulations:",
        ":m:",
        ":passport_control:",
        ":left_luggage:",
        ":customs:",
        ":ideograph_advantage:",
        ":cl:",
        ":sos:",
        ":id:",
        ":no_entry_sign:",
        ":underage:",
        ":no_mobile_phones:",
        ":do_not_litter:",
        ":non-potable_water:",
        ":no_bicycles:",
        ":no_pedestrians:",
        ":children_crossing:",
        ":no_entry:",
        ":eight_spoked_asterisk:",
        ":sparkle:",
        ":eight_pointed_black_star:",
        ":heart_decoration:",
        ":vs:",
        ":vibration_mode:",
        ":mobile_phone_off:",
        ":chart:",
        ":currency_exchange:",
        ":aries:",
        ":taurus:",
        ":gemini:",
        ":cancer:",
        ":leo:",
        ":virgo:",
        ":libra:",
        ":scorpius:",
        ":sagittarius:",
        ":capricorn:",
        ":aquarius:",
        ":pisces:",
        ":ophiuchus:",
        ":six_pointed_star:",
        ":negative_squared_cross_mark:",
        ":a:",
        ":b:",
        ":ab:",
        ":o2:",
        ":diamond_shape_with_a_dot_inside:",
        ":recycle:",
        ":end:",
        ":back:",
        ":on:",
        ":soon:",
        ":clock1:",
        ":clock130:",
        ":clock10:",
        ":clock1030:",
        ":clock11:",
        ":clock1130:",
        ":clock12:",
        ":clock1230:",
        ":clock2:",
        ":clock230:",
        ":clock3:",
        ":clock330:",
        ":clock4:",
        ":clock430:",
        ":clock5:",
        ":clock530:",
        ":clock6:",
        ":clock630:",
        ":clock7:",
        ":clock730:",
        ":clock8:",
        ":clock830:",
        ":clock9:",
        ":clock930:",
        ":heavy_dollar_sign:",
        ":copyright:",
        ":registered:",
        ":tm:",
        ":x:",
        ":heavy_exclamation_mark:",
        ":bangbang:",
        ":interrobang:",
        ":o:",
        ":heavy_multiplication_x:",
        ":heavy_plus_sign:",
        ":heavy_minus_sign:",
        ":heavy_division_sign:",
        ":white_flower:",
        ":100:",
        ":heavy_check_mark:",
        ":ballot_box_with_check:",
        ":radio_button:",
        ":link:",
        ":curly_loop:",
        ":wavy_dash:",
        ":part_alternation_mark:",
        ":trident:",
        ":black_small_square:",
        ":white_small_square:",
        ":black_medium_small_square:",
        ":white_medium_small_square:",
        ":black_medium_square:",
        ":white_medium_square:",
        ":black_large_square:",
        ":white_large_square:",
        ":white_check_mark:",
        ":black_square_button:",
        ":white_square_button:",
        ":black_circle:",
        ":white_circle:",
        ":red_circle:",
        ":large_blue_circle:",
        ":large_blue_diamond:",
        ":large_orange_diamond:",
        ":small_blue_diamond:",
        ":small_orange_diamond:",
        ":small_red_triangle:",
        ":small_red_triangle_down:",
        ":shipit:"
    ]
};


/**
 * Init chat
 * @type {MyChat}
 */
const chat = new MyChat(document.getElementById("messenger"));

const canvas = chat.canvas;
const ctx    = canvas.getContext('2d');

const width  = canvas.width;
const height = canvas.height;

let current;
let selection = [];

const tools = {
    graffity: {
        mousemove(e){ //e.buttons 0b00000x11 & 0b00000100 == x
            (e.buttons & 1) && new Circle(e.offsetX, e.offsetY, chat.canvasCurrentSize, chat.canvasCurrentColor, chat.canvasCurrentFill)
        }
    },
    circle: {
        mousedown(e){
            current = new Circle(e.offsetX,e.offsetY, 1, chat.canvasCurrentColor, chat.canvasCurrentFill)
        },
        mousemove(e){
            if (!current) return;

            current.radius = current.distanceTo(e.offsetX, e.offsetY);
            Drawable.drawAll()
        },

        mouseup(e){
            current = null
        }
    },
    line: {
        mousedown(e){
            current = new Line(e.offsetX, e.offsetY, 0, 0, chat.canvasCurrentColor, chat.canvasCurrentSize)
        },
        mousemove(e){
            if (!current) return;

            current.width = e.offsetX - current.x;
            current.height = e.offsetY - current.y;

            Drawable.drawAll();
        },

        mouseup(e){
            current = null
        }
    },
    select: {
        click(e){
            let found = Drawable.instances.filter(c => c.in && c.in(e.offsetX, e.offsetY))
            if (found.length){
                if (e.ctrlKey){
                    selection.push(found.pop())
                }
                else {
                    selection = [found.pop()]
                }
            }
            else {
                if (!e.ctrlKey) selection = []
            }

            Drawable.drawAll(selection)
        },
        mousedown(e){
            //
        },
        mousemove(e){

        },

        mouseup(e){
            //x,y, w, h прямоугольника
            //selection - только те элеменеты Drawable.instances которые в границах прямоугольника.
        },
    },
    rectangle: {
        mousedown(e){
            current = new Rectangle(e.offsetX, e.offsetY, 0, 0, chat.canvasCurrentColor, chat.canvasCurrentSize, chat.canvasCurrentFill)
        },
        mousemove(e){
            if (!current) return;

            current.width = e.offsetX - current.x;
            current.height = e.offsetY - current.y;

            Drawable.drawAll()
        },

        mouseup(e){
            current = null
        }
    },
};

function superHandler(evt){
    let t = tools[chat.canvasCurrentTool];
    if (typeof t[evt.type] === 'function')
        t[evt.type].call(this, evt)
}

canvas.onmousemove = superHandler;
canvas.onmouseup   = superHandler;
canvas.onmousedown = superHandler;
canvas.onclick = superHandler;

function Drawable(){
    Drawable.addInstance(this);
}

const distance = (x1,y1, x2, y2) => ((x1-x2)**2 + (y1-y2)**2)**0.5

Drawable.prototype.draw = function(){};
Drawable.prototype.distanceTo = function(x,y){
    if (typeof this.x !== 'number' ||
        typeof this.y !== 'number'){
        return NaN
    }
    return distance(this.x, this.y, x, y)
};
Drawable.instances = [];
Drawable.addInstance = function(item){
    Drawable.instances.push(item);
};

Drawable.clearAll = function(){
    ctx.clearRect(0,0,width,height);
    Drawable.instances = [];
    selection = [];
};

Drawable.clearSelection = function(){
    Drawable.instances = Drawable.instances.filter(item => !selection.includes(item));
    selection = [];
    Drawable.drawAll()
};

Drawable.drawAll = function(selection=[]){
    ctx.clearRect(0,0,width,height);
    Drawable.forAll(item => item.draw(selection.includes(item)));
};

Drawable.forAll = function(callback){
    for(let i = 0; i<Drawable.instances.length;i++){
        callback(Drawable.instances[i])
    }
};

class Circle extends Drawable {
    constructor(x,y,radius, color, fill){
        super();
        this.x      = x;
        this.y      = y;
        this.radius = radius;
        this.color  = color;
        this.fill = fill;
        this.draw();
    }

    draw(selected){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        if (selected){
            ctx.setLineDash([5, 15])
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.setLineDash([]);
        }
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill()
        }
        else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }

    in(x,y){
        return this.distanceTo(x,y) < this.radius
    }

    inBounds(x,y,w,h){ // x = 100, this.x = 102, w = 5
        return this.x >= x && this.x <= x + w &&
            this.y >= y && this.y <= y + h
    }
}


class Line extends Drawable {
    constructor(x,y, width, height, color, lineWidth){
        super();
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.color  = color;
        this.lineWidth  = lineWidth;

        this.draw();
    }

    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth   = this.lineWidth
        ctx.stroke();
    }
}

class Rectangle extends Drawable {
    constructor(x,y, width, height, color, lineWidth, fill){
        super();
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.color  = color;
        this.lineWidth  = lineWidth;
        this.fill = fill;

        this.draw();
    }

    draw(selected){
        if (!selected) {
            ctx.setLineDash([]);
            if (this.fill) {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height)
            } else {
                ctx.beginPath();
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.color;
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.stroke();
            }
        } else {
            ctx.setLineDash([5,15]);
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    in(x,y){
        return x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)
    }
}

chat.clearAllBtn.addEventListener("click", Drawable.clearAll);
chat.clearSelectionBtn.addEventListener("click", Drawable.clearSelection);