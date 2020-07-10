const months = Symbol("months");
const days = Symbol("days");
const name = Symbol("name");
const start = Symbol("start");
const end = Symbol("end");
const isLeap = Symbol("leap year");
class CalendarIterator {
    static [isLeap] = false; // in real case this is a parameter from the current year
    constructor(startMonth, endMonth) {
        this[start] = startMonth;
        this[end] = endMonth;
    }
    [Symbol.iterator] () {
        return this
    }
    next () {
        let currentMonth = this[start] - 1;
        class MonthIterator {
            constructor(monthData) {
                this[name] = monthData[name];
                this[days] = monthData[days];
                this[start] = 1;
            }
            [Symbol.iterator] () {
                return this
            }
            next () {
                let currentDay = this[start];
                if (currentDay <= this[days]) {
                    this[start]++;
                    return {done: false, value: currentDay}
                }
                return {done: true, value: undefined}
            }
            toString (){
                return this[name]
            }
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
    toString (){
        return CalendarIterator[months].reduce((prev, current) => prev + current[name] + " ", "")
    }

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





