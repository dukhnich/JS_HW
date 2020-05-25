#  Духнич Марина FEA19 JS HW 11  
## ООП: база.
### Initialize
```javascript
const Person = function (name = "Ivan", surname = "Ivanov", age = 18, sex = "male", salary = 100, married = false){
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.sex = sex;
    this.salary = salary;
    this.married = married;
};
console.log (new Person("Vasiliy"))
```
### Closure getters and setters
```javascript
const Person = function (name = "Ivan", surname = "Ivanov", age = 18, sex = "male", salary = 100, married = false){
    let father = null;
    let children = [];
    this.getName = function(){
        return name;
    };
    this.setName = function(newName){
        if (("string" === typeof  newName) && (newName.length > 1) && (newName[0].toUpperCase() === newName[0])) {
            name = newName;
        }
        return name;
    };
    this.getSurname = function(){
            return surname;
    };
    this.setSurname = function(newSurname){
        if (("string" === typeof  newSurname) && (newSurname.length > 1) && (newSurname[0].toUpperCase() === newSurname[0])) {
            surname = newSurname;
        }
        return surname;
    };
    this.getAge = function(){
            return age;
    };
    this.setAge = function(newAge){
        if ((Number.isInteger(newAge) || ("string" === typeof  newAge)) && (-1 < newAge) && (200 > newAge)) {
            age = +newAge;
        }
        return age;
    };
    this.getSex = function(){
            return sex;
    };
    this.setSex = function(newSex){
        if (("string" === typeof  newSex) && (("male" === newSex.toLowerCase()) || ("female" === newSex.toLowerCase()))) {
            sex = newSex.toLowerCase();
        }
        return sex;
    };
    this.getSalary = function(){
            return salary;
    };
    this.setSalary = function(newSalary){
        if ((Number.isInteger(newSalary) || ("string" === typeof  newSalary)) && (-1 < newSalary)) {
            salary = +newSalary;
        }
        return salary;
    };
    this.getMarried = function(){
        return married;
    };
    this.setMarried = function(newMarried){
        if (("boolean" === typeof  newMarried)) {
            married = newMarried;
        }
        return married;
    };
    this.setFather = function(newFather){
        if (Person === newFather.constructor) {
            father = newFather;
        }
        return father;
    };
    this.getFatherName = function(){
    if (null !== father) {
        if ("male" === sex) {
            return father.getName() + 'ovich'
        };
        if ("female" === sex) {
            return father.getName() + 'ovna'
        };
    }
        return "The fathername is unknown";
    };
    this.addChild = function(newChild){
        if ((Person === newChild.constructor) && ((age - newChild.getAge()) > 14)) {
            children.push(newChild);
            newChild.setFather(this);
        }
        return children.length;
    };
};
var father   = new Person("Ivan", "Petrov", 50, "male", 100500, true)
var daughter = new Person("Maria", "Petrova", 25, "female", 500, false)


var father2  = new Person("iPhone", "Sedmoy", 45, "male", 500, true)
var son      = new Person("Ivan", "Sedmoy", 20, "male", 200, false)

father.addChild(daughter)
console.log(daughter.getFatherName()) // => "Ivanovna"

son.setFather(father2)
console.log(son.getFatherName())
```

## Замыкания
### makeProfileTimer
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

### makeSaver
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

### Final Countdown
```javascript
var finalCountdown = (num) => setTimeout(
    () => {
        console.log(num);
        num > 1 ? finalCountdown (--num) : setTimeout(() => console.log("поехали!"), 1000)
    }, 
1000)
finalCountdown (5)
```

### Self-Invoked Final Countdown 
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

### myBind
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