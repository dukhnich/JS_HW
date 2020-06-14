#  Духнич Марина FEA19 JS HW Prototype
## Number prototype
```javascript
let b = Number(2).plus(1).plus(2);
console.log("b", b);
/**
 * prototype 1
 * @param num {number}
 * @returns {number}
 */
Number.prototype.plus = function (num) {
    return this + num
}
```
## String prototype
```javascript
"hello".reverse();
/**
 * prototype 2.1
 * @returns {string}
 */
String.prototype.reverse = function () {
    //    return str.split("").reverse().join("");
    //    return '\u202E' + str
    let reverseString = "";
    for (let i = this.length - 1; i >= 0; i--) {
        reverseString += this[i];
    }
    return reverseString
};
/**
 * prototype 2.2
 * @returns {boolean}
 */
String.prototype.isPalindrom = function () {
    let reverseString = this.reverse();
    return (reverseString === this.toString())
};
console.log("hello isPalindrom: ", "hello".isPalindrom(), "ollo isPalindrom: ","ollo".isPalindrom())
```
## Array prototype
```javascript
/**
 * prototype 3.1
 * @param filterCallback {function}
 * @returns {[]}
 */
Array.prototype.filter = function(filterCallback) {
    let resultArr = [];
    console.log(filterCallback);
    this.forEach((value, i, arr) => {
        if (true === filterCallback(value, i, arr)) {
            resultArr.push(value)
        }
        }
    );
    return resultArr
};
let arr1 = [7,"jhgh", 0, "8"];
let arr2 = arr1.filter((value) => value>0);
console.log(arr1.filter((value) => !!(value%2)), arr2);

/**
 * prototype 3.2
 * @param reduceCallback {function}
 * @param initialValue {*}
 * @returns {*}
 */
Array.prototype.reduce = function(reduceCallback, initialValue) {
    let result = false;
    for (let i = 0; i < this.length; i++) {
        if (0 === i) {
            result = (undefined !== initialValue) ? reduceCallback(initialValue, this[i], i, this) : reduceCallback(this[i], this[i], i, this)
        }
        else {
            result = reduceCallback(result, this[i], i, this)
        }
    }
    return result
};
let total = [0, 1, 2, 3].reduce(function(a, b) {
    return a + b;
});
let initialValue = 0;
let sum = [{x: 1}, {x:2}, {x:3}].reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.x;
}, initialValue);
console.log(total,sum)
```