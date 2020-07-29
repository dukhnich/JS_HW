const months = Symbol("months");
const days = Symbol("days");
const name = Symbol("name");
const start = Symbol("start");
const end = Symbol("end");
const isLeap = Symbol("leap year");

class CalendarIterator {
    static [isLeap] = false; // in real case this is a parameter from the current year
    /**
     * @param startMonth {number}
     * @param endMonth {number}
     */
    constructor(startMonth, endMonth) {
        this[start] = startMonth;
        this[end] = endMonth;
    }

    /**
     * add iterator
     * @returns {CalendarIterator}
     */
    [Symbol.iterator] () {
        return this
    }

    /**
     * next
     * @returns {{done: boolean, value: MonthIterator}|{done: boolean, value: undefined}}
     */
    next () {
        let currentMonth = this[start] - 1;
        class MonthIterator {
            /**
             * @param monthData {{}}
             */
            constructor(monthData) {
                this[name] = monthData[name];
                this[days] = monthData[days];
                this[start] = 1;
            }

            /**
             * add iterator
             * @returns {MonthIterator}
             */
            [Symbol.iterator] () {
                return this
            }

            /**
             * next
             * @returns {{done: boolean, value: number}|{done: boolean, value: undefined}}
             */
            next () {
                let currentDay = this[start];
                if (currentDay <= this[days]) {
                    this[start]++;
                    return {done: false, value: currentDay}
                }
                return {done: true, value: undefined}
            }

            /**
             * get month name
             * @returns {string}
             */
            toString (){
                return this[name]
            }

            /**
             * get month number
             * @returns {number}
             */
            getMonthNumber (){
                return this[days]
            }
        }
        if (currentMonth < this[end]) {
            this[start]++;
            return {done: false, value: new MonthIterator(CalendarIterator[months][currentMonth])}
        }
        return {done: true, value: undefined}
    }

    /**
     * get string with all months
     * @returns {string}
     */
    toString (){
        return CalendarIterator[months].reduce((prev, current) => prev + current[name] + " ", "")
    }

    /**
     * @param container {HTMLElement}
     */
    drawCalendar(container) {
        let month = this.next().value;
        if (undefined === month) {
            container.innerHTML = "<h3>The term is finished, create new one</h3>";
            return
        }
        container.innerHTML = "";
        let card = document.createElement("div");
        card.classList.add("card", "text-center");
        let header = document.createElement("div");
        header.classList.add("card-header");
        header.innerText = month.toString();
        let body = document.createElement("div");
        body.classList.add("card-body");
        let day = document.createElement("div");
        day.classList.add("alert", "alert-primary");
        day.innerText = month.next().value;
        body.appendChild(day);
        let footer = document.createElement("div");
        footer.classList.add("card-footer", "text-muted");
        let nextDay = document.createElement("button");
        nextDay.type = "button";
        nextDay.classList.add("btn", "btn-secondary", "mr-5");
        nextDay.innerText = "Next day";
        let nextMonth = document.createElement("button");
        nextMonth.type = "button";
        nextMonth.classList.add("btn", "btn-primary");
        nextMonth.innerText = "Next month";
        footer.append(nextDay,nextMonth);
        card.append(header,body,footer);
        container.appendChild(card);

        nextDay.onclick = () => goToNextDay.call(this, container, day, month);
        nextMonth.onclick = () => this.drawCalendar(container);

        /**
         * @param container {HTMLElement}
         * @param dayContainer {HTMLElement}
         * @param month {MonthIterator}
         */
        function goToNextDay(container, dayContainer, month) {
            let currentDay = month.next().value;
            if (undefined === currentDay) {
                this.drawCalendar(container);
                return
            }
            dayContainer.innerText = currentDay;
        }
    }
}
CalendarIterator[months] = [
    {
        [name]: "January",
        [days]: 31
    },
    {
        [name]: "February",
        [days]: CalendarIterator[isLeap] ? 29 : 28
    },
    {
        [name]: "March",
        [days]: 31
    },
    {
        [name]: "April",
        [days]: 30
    },
    {
        [name]: "May",
        [days]: 31
    },
    {
        [name]: "June",
        [days]: 30
    },
    {
        [name]: "July",
        [days]: 31
    },
    {
        [name]: "August",
        [days]: 31
    },
    {
        [name]: "September",
        [days]: 30
    },
    {
        [name]: "October",
        [days]: 31
    },
    {
        [name]: "November",
        [days]: 30
    },
    {
        [name]: "December",
        [days]: 31
    }
];

displayCalendar.onclick = () => {
    if (leap.checked) {
        CalendarIterator[months][1][days] = 29;
    }
    else {
        CalendarIterator[months][1][days] = 28;
    }
    let currentCalendar = new CalendarIterator(firstMonth.value, lastMonth.value);
    currentCalendar.drawCalendar(calendar);
};

firstMonth.oninput = () => {
    lastMonth.min = firstMonth.value;
};

lastMonth.oninput = () => {
    firstMonth.max = lastMonth.value;
};

const timeoutId = Symbol ("timeout id");
const currentTimesNumber = Symbol ("current times number");
const status = Symbol("timer status")
class Timer {
    /**
     * @param times {number}
     * @param callback {function}
     * @param interval {number}
     */
    constructor (times = 5, callback, interval = 1000) {
        this.callback = callback;
        this._interval = interval;
        this[timeoutId] = null;
        this[currentTimesNumber] = times;
        this.startTimes = times;
        this[status] = false;
    }

    /**
     * @param value {number}
     */
    set interval(value) {
        if (!Number.isInteger(+value) || value < 0) throw new Error("This is not a correct value for the interval: " + value);
        this._interval = +value;
    }

    /**
     * @returns {number}
     */
    get interval() {
        return this._interval;
    }

    /**
     * @returns {Promise<unknown>}
     */
    async start() {

        this[status] = true;
        async function cb() {
            console.log(this[currentTimesNumber]);``
            await this.callback(this[currentTimesNumber]);
            if (this[currentTimesNumber]-- === 0) {
                this.stop();
            }
        };
        await cb.call(this);
        if (this[currentTimesNumber] !== 0) {
            this[timeoutId] = setInterval(cb.bind(this), this.interval);
        }
    };

    stop () {
        clearInterval(this[timeoutId]);
        this[currentTimesNumber] = this.startTimes;
        this[status] = false;
    }

    pause () {
        clearInterval(this[timeoutId]);
    }
    get status () {
        return this[status];
    }
}

const images = Symbol("images");
const interval = Symbol ("interval");
const animationID = Symbol("animation ID")
class Stories {
    /**
     * @param imgSrcArray {[]}
     * @param time {number}
     * @param container {HTMLElement}
     */
    constructor(imgSrcArray, time, container) {
        this[images] = imgSrcArray;
        this[interval] = time;
        this.container = container;
        this.timer = new Timer(this[images].length - 1, this.nextImg.bind(this), this[interval]);
        this[status] = false;
        this[animationID] = null;
    }

    nextImg (imgNum) {
        cancelAnimationFrame(this[animationID]);
        if (this[status] === false) {
            for (let i = 0; i < this[images].length; i++) {
                let pbar = document.getElementById(`progressBar${i}`);
                pbar.style.width = "0%";
            }
        }
        let currentNumber = this[images].length - 1 - imgNum;

        let start = performance.now();
        this.progressLoop(start, currentNumber);

        let img = document.getElementById("storyImg");
        if (null === img) {
            img = document.createElement('img');
            img.id = "storyImg"
        }


        img.alt = currentNumber.toString();
        img.classList.add("img-fluid", "w-100", "mw-100");
        img.style = "height: auto; background-size: cover";
        img.src = this[images][currentNumber];
        img.onclick = this.enter.bind(this);
        img.ondblclick = this.leave.bind(this);
        if (currentNumber === this[images].length - 1) {
            this[status] = false;
        }
        this.container.append (img);
    }

    get status () {
        return this[status];
    }

    enter () {
        this.timer.pause();
        // this[status] = false;
        cancelAnimationFrame(this[animationID]);
    }

    leave () {
        this.timer.start();
        this[status] = true;
    }

    async drawGallery () {
        this.container.innerHTML = "";
        let progressWrapper = document.createElement("div");
        progressWrapper.classList.add("d-flex");
        for (let i = 0; i < this[images].length; i++) {
            progressWrapper.appendChild(this.drawProgress(i));
        }
        this.container.append( progressWrapper);
        this[status] = true;
        this.timer.start();
    }

    drawProgress(num) {
        let progress = document.createElement("div");
        progress.classList.add("progress", "mb-3");
        progress.style.width = 100 / this[images].length + "%";
        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "progress-bar-striped", "bg-info");
        progressBar.setAttribute("role", "progressbar");
        progressBar.id = `progressBar${num}`;
        progressBar.style.width = "0%";
        progress.appendChild(progressBar);
        return progress;
    }

    progressLoop(start, num) {
        let pbar = document.getElementById(`progressBar${num}`);
        let now = performance.now();
        let percent = +pbar.style.width.slice(0, pbar.style.width.length - 2) ;
        if (pbar && percent <= 100) {
            pbar.style.width = `${(now - start) * 100     
            / (this[interval]* this[images].length ) + percent}%`;
            this[animationID] = requestAnimationFrame(this.progressLoop.bind(this, start, num));
            return
        }
        cancelAnimationFrame(this[animationID]);
    }
}

const pics = ["https://static33.cmtt.ru/paper-media/fd/92/e5/0479e08f8e852d.png", "https://img.devrant.com/devrant/rant/r_1233263_3Gfg9.jpg", "http://s00.yaplakal.com/pics/pics_original/1/9/4/3736491.jpg"];
displayStories.onclick = () => {
    let stories = new Stories(pics,time.value*1000, storiesWrapper);
    stories.drawGallery();
};
