eventDone = new CustomEvent("done", {bubbles: true});
document.addEventListener("start", function(event) { // (1)
    alert("Привет от " + event.target.tagName); // Привет от H1
})
document.addEventListener("done", function(event) { // (1)
    alert("Пока от " + event.target.tagName); // Привет от H1
})

function Countdown(callback, time = 5000, interval = 1000){
    Countdown.count++;
    Countdown.instances.add(this);
    let timeoutId = [];
    function startCount(ms) {

        return function () {
            let eventStart = new CustomEvent("start", {bubbles: true});
            document.dispatchEvent(eventStart);

            timeoutId.push(setTimeout(
                () => {
                    let res = callback(ms);
                    if (false !== res && ms > 0) {
                        ms -= interval;
                        this.start(ms);
                        return
                    }
                },
                interval));
        }
    }
    function restartCount() {
        return function () {
            this.stop();
            this.start = startCount(time);
            this.start();
        }
    }
    this.start = startCount(time);
    this.stop = function () {
        for (let id of timeoutId) {
            clearTimeout(id);
        }
        timeoutId = [];
    }
    this.restart = restartCount()
}
Countdown.count = 0;
Countdown.instances = new Set();
Countdown.getInstanceLength = function () {
    return this.count
};
Countdown.stopAll = function () {
    for (let countdown of this.instances) {
        countdown.stop();
    }
};

let countdownConsole = new Countdown(ms => console.log(ms), timeCount.value*1000, interval.value*1000);
start.onclick = () => {
    this.dispatchEvent(eventStart);
    this.dispatchEvent(eventDone);
    countdownConsole.start()

};
stopCount.onclick = () => countdownConsole.stop();
restart.onclick = () => countdownConsole.restart();





let countdownConsoleS = new Countdown(ms => console.log(ms/1000), timeCount1.value*1000, interval1.value*1000);
start1.onclick = () => countdownConsoleS.start();
stopCount1.onclick = () => countdownConsoleS.stop();
restart1.onclick = () => countdownConsoleS.restart();

stopAll.onclick = () => Countdown.stopAll();

console.log(Countdown.getInstanceLength())
