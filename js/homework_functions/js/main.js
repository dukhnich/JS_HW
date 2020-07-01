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

let countdownMS = new Countdown(ms => console.log(ms), timeCount.value*1000, interval.value*1000, "ms Countdown");
start.addEventListener("click", countdownMS.start);
stopCount.onclick = () => countdownMS.stop();
restart.onclick = () => countdownMS.restart();
timeCount.oninput = () => countdownMS.setNewStartTime(+timeCount.value*1000);
interval.oninput = () => countdownMS.setNewInterval(+interval.value*1000);


let countdownConsoleS = new Countdown(ms => console.log(ms/1000), timeCount1.value*1000, interval1.value*1000);
start1.onclick = () => countdownConsoleS.start();
stopCount1.onclick = () => countdownConsoleS.stop();
restart1.onclick = () => countdownConsoleS.restart();
timeCount1.oninput = () => countdownMS.setNewStartTime(+timeCount1.value*1000);
interval1.oninput = () => countdownMS.setNewInterval(+interval1.value*1000);

stopAll.onclick = () => Countdown.stopAll();

console.log("Count of coundowns: ", Countdown.getInstanceLength())
