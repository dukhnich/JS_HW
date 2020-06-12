#  Духнич Марина FEA19 JS HW Promise  
## the first level
```javascript
/**
 * @param text
 * @param s
 * @returns {Promise<unknown>}
 */
function writeTextAfterInterval(text, s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(text), s * 1000);
    });
}
writeTextAfterInterval("hello", 2)
    .then(console.log)
    .catch((err) => console.log("Error: ", err));

```
## the second level
```javascript
/**
 * @param data {number}
 * @returns {Promise<unknown>}
 */
function oddOrEven (data) {
    return new Promise((resolve, reject) => {
        if (isNaN(data)) {
            reject ("The data is not a number")
        }
        if (!Number.isInteger(data)) {
            reject ("Tne number is not integer")
        }
        (data % 2) ?
            setTimeout(() => resolve("odd"), 1000) :
            setTimeout(() => reject("even"), 2000)
    });
}
oddOrEven("hello")
    .then(console.log)
    .catch((err) => console.log("Error: ", err));
```
## the third level
```javascript
/**
 * the third level
 * @param arr {[]}
 * @returns {Promise<{}>}
 */
async function check(arr = []) {
    let resultObj = {};
    for (let [i, value] of Object.entries(arr)) {
        await oddOrEven(value)
            .then((res) => resultObj[arr[i]] = res)
            .catch((res) => resultObj[arr[i]] = res);
    }
    return resultObj
}
check([1,2,3,"hello"]).then(console.log)
```

## the third level with try|catch
```javascript
/**
 * the third level
 * @param arr {[]}
 * @returns {Promise<{}>}
 */
async function check(arr = []) {
    let resultObj = {};
    for (let [i, value] of Object.entries(arr)) {
        let res;
        try {
            res = await oddOrEven(value);
        } catch (error) {
            res = error
        }  finally {
          resultObj[arr[i]] = res;
        }
        
    }
    return resultObj
}
check([1,2,3,"hello", 5]).then(console.log)
```

## the third level with PromiseAll
```javascript
/**
 * @param data {number}
 * @returns {Promise<unknown>}
 */
function oddOrEvenWithoutErrors (data) {
    return new Promise((resolve) => {
        let ms;
        if (isNaN(data)) {
            resolve ("The data is not a number")
        }
        if (!Number.isInteger(data)) {
            resolve ("Tne number is not integer")
        }
        (data % 2) ?
                    setTimeout(() => resolve("odd"), 1000) :
                    setTimeout(() => resolve("even"), 2000)
    });
}

/**
 * @param arr {[]}
 * @returns {Promise<{}>}
 */
async function check(arr = []) {
    let resultObj = {};
    let promiseArr = [];
    let resArr = [];
    arr.forEach((value, i) => promiseArr[i] = oddOrEvenWithoutErrors(value))
    resArr.push(...await Promise.all(promiseArr))
    resArr.forEach((value, i) => resultObj[arr[i]] = value)
    return resultObj
}
check([1,2,3,"hello",-4]).then(console.log)
```

## rewrite async function from promise
```javascript
/**
 * @param result {function}
 * @param database {{}}
 * @param errorManager {function}
 * @returns {Promise<string>}
 */
async function job (result, database, errorManager) {
try {
    let id = await result;
    let info = database.get(+id);
    return info.name
}
catch (e) {
    errorManager.notify(e);
    throw e
}
}

let Database = function (arr) {
    this.get = (id) => (id in arr) ? {name: `name${id}`} : false
}

let currentDatabase = new Database(["sdfs", 1, 6, true])

job(writeTextAfterInterval(2, 1), currentDatabase, {notify: () => {}}).then(console.log)
```

## wait & promise all
```javascript
/**
 * @param ms
 * @returns {Promise<unknown>}
 */
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
let t0 = performance.now();
wait(2000).then(()=>wait(2000)).then(()=>wait(2000)).then(() => console.log("chain of then", performance.now() - t0))
let t1 = performance.now();
Promise.all([wait(2000), wait(2000), wait(2000)]).then(() => console.log("Promise.all", performance.now() - t1))
```