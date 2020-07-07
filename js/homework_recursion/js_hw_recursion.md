#  Духнич Марина FEA19 JS HW Recursion
## Events
### fireEventTimes
```javascript
/**
 * @param eventTimes {number}
 * @returns {function(...[*]=)}
 */
function fireEventsTimes(eventTimes = 1) {
    let count = 0;
    /**
     * @param event {string}
     * @param handler {function}
     * @param node {HTMLElement}
     */
    return function (event, handler, node = document) {
        const eventHandler = e => {
            count++;
            handler(e);
            if (count === eventTimes) {
                node.removeEventListener(event, eventHandler);
            }
        };
        node.addEventListener(event, eventHandler);
    }
}

const twoTimesEvent = fireEventsTimes(2);
twoTimesEvent('click', () => console.log('hello'), document)
```
## Recursion
### Search name in directories
```javascript
const directories = [
    {
        dir: {
            name: "root"
        }
    },
    {
        dir: { name: "child" }
    },
    {
        dir: [
            {
              dir: { name: "John" }
            },
            {
                dir: { name: "hello" }
            },
            {
                dir: [
                    {
                        dir: { name: "nested" }
                    },
                    {
                        dir: [
                            {
                                dir: { name: "nested" }
                            },
                            {
                                dir: { name: "one" }
                            },
                            {
                                dir: { name: "John" }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        dir: { name: "John" }
    }
];

/**
 * Search in the thee (context {}) key "dir" with value object that includes pair key "name" and value - request, returns this value and level in the tree
 * @param request {string}
 * @param context {{}}
 * @param level {number}
 * @returns {[]}
 */
function search(request, context = directories, level = 0) {
    let result = [];
    for (let item of context) {
        if (Array.isArray(item.dir)) {
            let innerResult = search(request, item.dir, level + 1);
            if (innerResult.length > 0) {
                result.push(...innerResult);
            }
        }
        else {
            if (request.toLowerCase() === item.dir.name.toLowerCase()) {
                result.push({name: item.dir.name, level: level});
            }
        }
    }
    return result
}
search("john");
```
### Timer
```javascript
let timeoutId = Symbol ("timeout id");
let currentTimesNumber = Symbol ("current times number");
let startTimes = Symbol ("count of times at start");

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
        this[startTimes] = times;
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
        await new Promise (resolve => this[timeoutId] = setTimeout(() => resolve (this.callback(this[currentTimesNumber])), this.interval));
        if (this[currentTimesNumber]-- > 0) {
            this.start();
            return 
        }
        this[currentTimesNumber] = this[startTimes];
    };

    stop () {
        clearTimeout(this[timeoutId]);
        this[timeoutId] = null;
    }
}

/**
 * @type {Timer}
 */
let timer = new Timer(5,ms => console.log(ms), 1000);
console.log("start");
timer.start();
setTimeout(() => {
    console.log("pause");
    timer.stop()
}, 3000);
setTimeout(() => {
    console.log("continue");
    timer.start()
}, 6000);
```
### flatMap
```javascript
const directories = [
    {
        value: 1
    },
    {
        value: "heello"
    },
    {
        value: [
            {
                value: 7
            },
            {
                value: "hi"
            },
            {
                value: [
                    {
                        value: 2
                    },
                    {
                        value: [
                            {
                                value: 5
                            },
                            {
                                value: {
                                    hi: 0
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

/**
 * FlatMap && prototype
 * @param flatMapCallback {function}
 * @param thisArg {{}}
 * @returns {[]}
 */
Array.prototype.flatMap = function (flatMapCallback, thisArg) {
    let currentThis = thisArg || undefined;
    let resultArr = [];
    for (let i = 0; i < this.length; i++) {
        let res = flatMapCallback.call(currentThis, this[i], i, this);
        if (Array.isArray(res)) {
            let innerRes = res.flatMap(flatMapCallback, currentThis);
            resultArr.push(...innerRes);
        }
        else {
            resultArr.push(res);
        }
    }
    return resultArr
};

const myFlatDirectories = directories.flatMap((dir) => (dir.value)); //[1,'hello',7,'hi',2,5,{hi:0}]
console.log("directories", myFlatDirectories);
```