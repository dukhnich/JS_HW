//     Сформируйте объект с массивами и массив с объектами с осмысленными данными.
var pupilReportCard = {name: 'Milligan Billi', modules: [8, 5, 10], exam: 8}; // объект с массивами для оценок ученика
var pupilYearGrade = Math.round(((+pupilReportCard['modules'][0]+(+pupilReportCard['modules'][1])+(+pupilReportCard['modules'][2]))/pupilReportCard['modules'].length+(+pupilReportCard['exam']))/2) //годовая оценка
var listOfOrders = [{dish: 'tea', cost: '20'}, {dish: 'soup', cost: '35'}]; //массив с объектами для списка заказов
var totalCost = +listOfOrders[0].cost+(+listOfOrders[1].cost) //цена всех заказов

//     Перепишите пример выше, используя if-else
var color = prompt("Введите цвет","");
if (color == 'red')
{
    document.write("<div style='background-color: red;'>красный</div>");
}
else
{
    if (color == 'black') 
    {
        document.write("<div style='background-color: black; color: white;'>черный</div>");
    }
    else
    {
        if (color == 'blue')
        {
            document.write("<div style='background-color: blue;'>синий</div>");
        }
        else
        {
            if (color == 'green')
            {
                document.write("<div style='background-color: green;'>зеленый</div>");
            }
            else
            {
                document.write("<div style='background-color: gray;'>Я не понял</div>");
            }
        }
    }
}

// Напишите бессмысленное выражение, используя максимум усвоенных на текущий момент знаний.
var a = +prompt("Введите число", "")
var long = ((a < Math.random() && a != 0) || a == 500) ? (--a + '0') : (confirm (a.toString(2) + "?")) ? typeof (a++ % `${a}`.length) :  (++a, a - 10, a + 100)
alert(long);

//assign: evaluation
var a = 5;
var b, c;
b = (a * 5); //a, 5, (a*5), (b=(a*5)) are evaluations; 1-a=5, 2-5, 3-5*5=25, 4-b=25
b = (c = b/2) //b, 2, b/2, (c = b/2), (b = (c = b/2)) are evaluations; 1-b=25, 2-2, 3-25/2=12.5, 4-c=12.5, 5-12.5

// Расставьте скобки так, что бы код не изменил своего поведения (работал так же как и сейчас).
var a = 5;
var b, c;
(b = (a) * 5);
b = c = b/(2)

// semicolon: error
var a = 5 alert (a = a * 5)
var str = "it's a spring;" alert (str)

//semicolon: mistake
var color = prompt("Введите цвет","");
if (color == 'green'){
    document.write("<div style='background-color: green;'>зеленый</div>");}
else; {
    document.write("<div style='background-color: gray;'>Я не понял</div>");}

var a, b;
b = prompt("Введите число", "");
a = 5 +b < 10 ? "little" : "big" //a = 5; +b < 10 ? "little" : "big"

//Number: age
var age = +prompt("Сколько вам лет?","");
if (age > -1)
{
    alert("Ваш год рождения: "+ (2020 - age));
}
else
{
    alert("Ошибка");
}

//Number: temperature
var tF = +prompt("Сколько градусов по Фаренгейту?","");
if (tF > -459)
{
    alert("Градусов по Цельсию: "+ Math.round(tF*5/9 - 17.778));
}
else
{
    alert("Ошибка");
}

//Number: divide
var a = +prompt("Введите делимое","");
var b = +prompt("Введите делитель","");

if (a > -Infinity && b > -Infinity)
{
    alert("Частное до запятой: "+ Math.floor(a/b));
}
else
{
    alert("Ошибка");
}

//Number: odd
var a = +prompt("Введите число","");
if (a > -Infinity)
{ if (a%2) {
        alert("Нечетное");
    }
    else {
        alert("Четное");
    }
}
else{
    alert("Ошибка");
}

//String: greeting
var str = prompt("Как вас зовут?","");
alert("Доброго времени суток, "+ str +"!");

//String: lexics
var str = prompt("Как поздороваться с индийским слоном?","");
if (str.includes("Салям") || str.includes("салям") || str.includes("سلام"))
{ alert("Слон вас растоптал!");
}
else{
    if (str.indexOf("намасте") > -1 || str.indexOf("Намасте") > -1 || str.indexOf("नमस्ते") > -1) {
        alert("Слон вам поклонился!");
    }
    else {
        alert("Слон вас проигнорировал...");
    }
}

//confirm
q0 = confirm("В вашем городе бывает рассвет раньше 04:00?")
alert(q0 + " " + typeof q0 + " " + typeof +q0 + " " + typeof "q0");

//Boolean
q1 = confirm("Ваше жилье естественного происхождения?")
q2 = confirm("В вашем жилье живут люди, не являющиеся вашими родственниками, партнерами, друзьями?")
q3 = confirm("Есть ли у людей, не являющихся вашими родственниками, партнерами, друзьями, доступ к вашей кухне или санузлу?")
q4 = confirm("Есть ли у вас личное пространство?")
//Boolean: if
if (q1)
{ alert("Видимо, вы живете как минимум не в городе.");
}
else{
    if (q2) {
        if (q3) {
            if (q4) {
                alert("Вы живете в казарме, или тюрьме, или монастыре");
            }
            else {
                alert("Вы живете в коммунальной квартире, общежитии, хостеле или чем-то подобном");
            }
        }
        else {
            alert("Вы живете в изолированной квартире или части дома.");
        }
    }
    else {
        alert("Вы живете в индивидуальном жиье: доме, фургоне, яхте, палатке, ...");
    }
}
//Array: booleans
var homeAnswers = [q1, q2, q3, q4];

//Array: real
var theWall = ["In the Flesh?", "The Thin Ice", "Another Brick in the Wall (Part 1)", "The Happiest Days of Our Lives", "Another Brick in the Wall (Part 2)", "Mother"]; //список песен в альбоме
var turnsToDoctor = ["Homer", "Marge", "Bart", "Lisa", "Maggie", "Abraham"]; //очередь к врачу

//Array: plus
var fibonacciBeginning = [1, 1];
fibonacciBeginning[2] = fibonacciBeginning[0] + fibonacciBeginning[1];
alert(fibonacciBeginning)

//Array: plus string
var snowball = []; //нарастающий список участников в игре на знакомство
var i=0;
var snowballItem = prompt("Имя участника №" + (i + 1), "")
while (snowballItem) {
    if (i++ > 0) {
        snowball[i - 1] = snowball[i - 2] + ", " + snowballItem;
        snowballItem = prompt("Имя участника №" + i, "")
    }
    else {
        snowball[i - 1] = snowballItem;
        snowballItem = prompt("Имя участника №" + i, "")
    }
}
alert("Список участников: " + snowball[snowball.length - 1]);

// Object: real
var bookPassport = {
    name: "Манускрипт Войнича",
    author: "",
    pages: 240,
    paper: "пергамент",
    colors: 4
}

var ticket = {
    departurePoint: "Париж",
    arrivalPoint: "Константинополь",
    departureTime: "1933.02.20 18:00",
    arrivalTime: "1933.02.23 22:00",
    seatNumber: 2
}

//Object: change
var msg = confirm("Паспорт книги: " + Object.values(bookPassport) + ". Количество страниц изменилось?") ? "Новое количество страниц: " + (bookPassport.pages = prompt("Сколько теперь страниц?", "")) : "Ок!";
alert(msg)
alert("Новое значение: " + (ticket[prompt("Проблемы в пути? Что изменилось? " + Object.keys(ticket), "")] = prompt("Введите новое значение.", "")))

//Comparison if
var age = +prompt("Сколько вам лет?","");
if (age < 0)
{
    alert("нерождённый");
}
else
{
    if (age < 18)
    {
        alert("школьник");
    }
    else {
        if (age < 30)
        {
            alert("молодежь");
        }
        else
        {
            if (age < 45)
            {
                alert("зрелость");
            }
            else
            {
                if (age < 60)
                {
                    alert("закат");
                }
                else
                {
                    if (age > 59)
                    {
                        alert("как пенсия?");
                    }
                    else
                    {
                        alert("то ли киборг, то ли ошибка");
                    }
                }
            }
        }
    }
}

//Comparison: sizes
sizeUSA = +prompt("Введите американский размер одежды.", "")
if ((sizeUSA + 1) % 2 && sizeUSA > 5 && sizeUSA < 21)
{
    var sizeRussia = 34 + sizeUSA;
    alert("Российский размер одежды: " + sizeRussia);
}
else
{
    alert("Мне неизвестен этот размер.");
}

// Comparison: object
var sizes = {
    Russia: [40,42,44,46,48,50,52,54],
    EuropeGeneral: [34,36,38,40,42,44,46,48],
    FranceSwitherland: [36,38,40,42,44,46,48,50],
    Italy: [38,40,42,44,46,48,50,52],
    Britain: [8,10,12,14,16,18,20,22],
    USA: [6,8,10,12,14,16,18,20]
}
var sizeStartSystem = prompt("В какой системе у вас размер одежды? " + Object.keys(sizes), "")
var sizeCurrentIndex = sizes[sizeStartSystem].indexOf(+prompt("Какой ближайший размер из этих? " + Object.values(sizes[sizeStartSystem]), ""))
var sizeFinishSystem = prompt("В какую систему пересчитать? " + Object.keys(sizes), "")
var finishSize = sizes[sizeFinishSystem][sizeCurrentIndex]
if (finishSize)
{
    alert("Размер в нужной системе: " + finishSize)
}
else
{
    alert("Что-то пошло не так...");
}

//Ternary
var sex = confirm("Ваш пол мужской?") ? "Вы мужчина" : "Вы женщина";
alert(sex)

//Number: flats
var floorsNumber = +prompt("Сколько этажей в доме?", "")
var flatsAtFloorNumber = +prompt("Сколько квартир на этаже?", "")
var flatNumber = +prompt("Какой номер квартиры?", "")
var flatFloor = Math.ceil((flatNumber % (floorsNumber*flatsAtFloorNumber)) / flatsAtFloorNumber)
var flatEntrance = Math.ceil(flatNumber / (floorsNumber*flatsAtFloorNumber))
if (flatFloor && flatEntrance)
{
    alert("Квартира №" + flatNumber + " находится в подъезде №" + flatEntrance + ", на этаже №" + flatFloor)
}
else
{
    alert("Что-то пошло не так...");
}