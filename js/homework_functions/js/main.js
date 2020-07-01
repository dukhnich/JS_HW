const attachEvent = (event, handler, node = document) => {
    node.addEventListener(event, handler);
    return () => {
    node.removeEventListener(event, handler);
    }
};

document.addEventListener("start", function(event) { // (1)
    console.log( "Timer started:  " + Object.values(event.detail)); // Привет от H1
})
document.addEventListener("done", function(event) { // (1)
    console.log( "Timer done: " + Object.values(event.detail)); // Привет от H1
});

function Countdown(callback, time = 5000, interval = 1000, name = "Some Countdown"){
    Countdown.instances.add(this);
    let timeoutId = null;
    let currentTime = time;
    let startTime = time;
    let currentInterval = interval;
    let res = true;
    function timeTick () {
        return new Promise(resolve => {
            timeoutId = setTimeout(
                () => {
                    resolve (callback(currentTime));
                },
                currentInterval);
        })
    }
    async function startCount() {
        if (false !== res && currentTime >= 0) {
            res = await timeTick ();
            currentTime -= currentInterval;
            startCount();
            return
        }
        let doneEvent = new CustomEvent("done", {bubbles: true, detail: {name, startTime, currentInterval}});
        document.dispatchEvent(doneEvent);
     }


    this.start = function () {
        if (startTime === currentTime) {
            let startEvent = new CustomEvent("start", {bubbles: true, detail: {name, startTime, currentInterval}});
            document.dispatchEvent(startEvent);
        }
        startCount();
    };
    this.stop = function () {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    this.restart = function () {
        this.stop();
        currentTime = startTime;
        this.start();
    }
    this.setNewStartTime = function (newStartTime) {
        if (Number.isInteger(newStartTime) && newStartTime > 0) {
            startTime = newStartTime;
        }
    }
    this.setNewInterval = function (newInterval) {
        if (Number.isInteger(newInterval) && newInterval > 0) {
            currentInterval = newInterval;
        }
    }
}
Countdown.instances = new Set();
Countdown.getInstanceLength = function () {
    return this.instances.size;
};
Countdown.stopAll = function () {
    for (let countdown of this.instances) {
        countdown.stop();
    }
};

// let countdownMS = new Countdown(ms => console.log(ms), timeCount0.value*1000, interval0.value*1000, "ms Countdown");
// start.addEventListener("click", countdownMS.start);
// stopCount.onclick = () => countdownMS.stop();
// restart.onclick = () => countdownMS.restart();
// timeCount0.oninput = () => countdownMS.setNewStartTime(+timeCount0.value*1000);
// interval0.oninput = () => countdownMS.setNewInterval(+interval0.value*1000);
//
//
// let countdownConsoleS = new Countdown(ms => console.log(ms/1000), timeCount1.value*1000, interval1.value*1000);
// start1.onclick = () => countdownConsoleS.start();
// stopCount1.onclick = () => countdownConsoleS.stop();
// restart1.onclick = () => countdownConsoleS.restart();
// timeCount1.oninput = () => countdownMS.setNewStartTime(+timeCount1.value*1000);
// interval1.oninput = () => countdownMS.setNewInterval(+interval1.value*1000);
//
// stopAll.onclick = () => Countdown.stopAll();

const CountdownСomponent = (function(container) {
    let wrapperClicksList = [];
    let wrapperInputsList = [];
    let remove = function (el, num) {
        wrapperClicksList[num]();
        wrapperInputsList[num]();
        el.remove();
    };
    function createInputNumber(value, min = 1, step = 1) {
        let input = document.createElement("input");
        input.classList.add("form-control");
        input.type = "number";
        input.min = min;
        input.step = step;
        input.value = value;
        return input;
    }
    function createBtn(value, ...classNames) {
        let btn = document.createElement("button");
        btn.classList.add("btn", "mr-4", ...classNames);
        btn.type = "button";
        btn.innerText = value;
        return btn;
    }
    function countdownClicks(event, countdown, container, num) {
        let place = event.target;
        if ("button" === place.tagName.toLowerCase()) {
            if ("Start" === place.innerText) {
                countdown.start();
                return
            }
            if ("Stop" === place.innerText) {
                countdown.stop();
                return
            }
            if ("Restart" === place.innerText) {
                countdown.restart();
                return
            }
            if ("Remove" === place.innerText) {
                remove(container, num);
                return
            }
        }
    }
    function countdownInputs(event, countdown, container) {
        let place = event.target;
        if ("input" === place.tagName.toLowerCase()) {
            let label = place.closest("label");
            if (label.innerText.indexOf("time") > -1 ) {
                countdown.setNewStartTime(place.value*1000);
                return
            }
            if (label.innerText.indexOf("interval") > -1 ) {
                countdown.setNewInterval(place.value*1000);
                return
            }
        }
    }

    return {
        create: function (time = 1000, interval = 100, name = "DOM Countdown") {
            let num = Countdown.getInstanceLength();
            let countdown = new Countdown(ms => console.log(ms), time, interval, name);
            let wrapper = document.createElement("div");
            wrapper.classList.add("mr-5", "mb-5");
            wrapperClicksList[num] = attachEvent("click", (event) => countdownClicks (event, countdown, wrapper, num), wrapper);
            wrapperInputsList[num] = attachEvent("input", (event) => countdownInputs (event, countdown), wrapper)
            console.log(wrapperInputsList, wrapperClicksList)
            let h2 = document.createElement("h2");
            h2.innerText = name;
            wrapper.appendChild(h2);
            let inputWrapper = document.createElement("div");
            inputWrapper.classList.add("input-group", "mb-4");
            let labelTime = document.createElement("label");
            labelTime.classList.add("mr-3");
            labelTime.innerText = "New start time, s";
            let inputTime = createInputNumber (time/1000, 0.1, 0.1);
            labelTime.appendChild(inputTime);
            let labelInterval = document.createElement("label");
            labelInterval.classList.add("mr-3");
            labelInterval.innerText = "New interval, s";
            let inputInterval = createInputNumber (interval/1000, 0.1, 0.1);
            labelInterval.appendChild(inputInterval);
            inputWrapper.append(labelTime, labelInterval);
            wrapper.appendChild(inputWrapper);
            let startBtn = createBtn ("Start", "btn-success");
            let stopBtn = createBtn ("Stop", "btn-info");
            let restartBtn = createBtn ("Restart", "btn-warning");
            let removeBtn = createBtn ("Remove", "btn-danger");
            wrapper.append(startBtn, stopBtn, restartBtn, removeBtn);
            container.appendChild(wrapper);
            return () => remove(wrapper, num);
        },
        removeAll: function () {
            for (let removeCountdown of this.instances) {
                removeCountdown();
            }
        }
    };
})(countdownsContainer);
CountdownСomponent.instances = new Set();
createCountdown.onclick = () =>
    CountdownСomponent.instances.add(
        CountdownСomponent.create(timeCount.value*1000, interval.value*1000, nameCount.value)
    );
removeAll.onclick = () => CountdownСomponent.removeAll();