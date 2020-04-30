#  Духнич Марина FEA19 JS HW 11  
## makeProfileTimer
```javascript
function makeProfileTimer () {
    var timerStart = performance.now();

    return function(){
        var timerFinish = performance.now();
        return timerFinish - timerStart;
    }    
}

function doSomething(url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.onload = () => console.log(JSON.parse(xhr.responseText));
        xhr.onerror = () => console.log(xhr.statusText);
        xhr.send();
}

var timer = makeProfileTimer();
doSomething('https://swapi.dev/api/people/1/');  //некий код, время выполнения которого мы хотим измерить с высокой точностью
alert("Call to doSomething took " + timer () + " milliseconds.");
```

## makeSaver
```javascript
function makeSaver (func) {
    let res =  func();
    return function(){
        return res;
    }    
}

var saver = makeSaver(Math.random) //создает функцию-хранилище результата переданной в качестве параметра функции (Math.random 
                                      // в примере). На этом этапе Math.random НЕ вызывается
    var value1 = saver()              //saver вызывает переданную в makeSaver функцию, запоминает результат и возвращает его
    var value2 = saver()              //saver в дальнейшем просто хранит результат функции, и более НЕ вызывает переданную 
                                      //в makeSaver функцию;
    value1 === value2                 // всегда true

    var saver2 = makeSaver(() => console.log('saved function called') || [null, undefined, false, '', 0, Math.random()][Math.ceil(Math.random()*6)])
    var value3 = saver2()
    var value4 = saver2()

    value3 === value4 // тоже должно быть true

```

## Final Countdown
```javascript
var finalCountdown = (num) => setTimeout(
    () => {
        console.log(num);
        num > 1 ? sT (--num) : setTimeout(() => console.log("поехали!"), 1000)
    }, 
1000)
finalCountdown (5)
```

## Self-Invoked Final Countdown 
```javascript
(function(num){
    setTimeout(
        () => {
            console.log(num);
            num > 1 ? arguments.callee (--num) : setTimeout(() => console.log("поехали!"), 1000)
        }, 
    1000)
})(5)

```

## myBind
```javascript
function myBind(func, currentThis, context) {
  return function() {
    let currentArgs = [];
    let i = 0;
    for (let j = 0; j < context.length; j++) {
        if (undefined === context[j]) {
            currentArgs[j] = arguments[i++];
        }
        else {
            currentArgs[j] = context[j];
        }   
    }  
    return func.call(currentThis, ...currentArgs) 
  }
}

var pow5 = myBind(Math.pow, Math, [undefined, 5]) // первый параметр - функция для биндинга значений по умолчанию, 
                                                  // второй - this для этой функции, третий - массив, в котором undefined означает
                                                  // параметры, которые должны передаваться при вызове,
                                                  // а другие значения являются значениями по умолчанию:
var cube = myBind(Math.pow, Math, [undefined, 3]) // cube возводит число в куб

pow5(2) // => 32, вызывает Math.pow(2,5), соотнесите с [undefined, 5]
cube(3) // => 27


var chessMin = myBind(Math.min, Math, [undefined, 4, undefined, 5,undefined, 8,undefined, 9])
chessMin(-1,-5,3,15) // вызывает Math.min(-1, 4, -5, 5, 3, 8, 15, 9), результат -5



var zeroPrompt = myBind(prompt, window, [undefined, "0"]) // аналогично, только теперь задается "0" как текст по умолчанию в prompt, 
                                                          // а текст приглашения пользователя задается при вызове zeroPrompt
var someNumber = zeroPrompt("Введите число")              // вызывает prompt("Введите число","0")
```