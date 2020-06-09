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
            reject ("Tne data is not a number")
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