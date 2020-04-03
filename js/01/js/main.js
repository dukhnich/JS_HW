var credentials = { //верные логин и пароль
    login: 'admin',
    password: 'qwerty',
};
var user = {}; //объект для конкретного юзера, например, для передачи в БД

var StandartSheetSize = 60*90; //Один условный печатный лист, стандарт
var book = {}; //объект для конкретной книги, например, для передачи в БД

user.login = prompt('Введите имя пользователя:', ''); //спросить логин
user.password = prompt('Введите пароль:', ''); //спросить пароль

if (user.login !== credentials.login || user.password !== credentials.password){ //Авторизация не пройдена
    document.write("<div style='background-color: red; color: white; padding: 50px'><h1>Вы не прошли авторизацию, перезагрузите страницу и попробуйте еще раз.</h1></div>");
}
else {
    document.write("<div style='background-color: green;'>Успех, можно и посчитать!</div>"); //Авторизация пройдена

alert("Посчитаем количество условных печатных листов"); //Объяснение происходящего для пользователя
book.Name = prompt("Введите название книги","Книга1"); //название книги
book.SheetWidth = prompt("Введите ширину печатного листа, например 60 для 60*84","60"); //ширина печатного листа
book.SheetHeight = prompt("Введите высоту печатного листа, например 84 для 60*84","84"); //высота печатного листа
book.NumberOfLeaves = prompt("Введите долю листа, например 16 для 1/16","16"); //доля листа
book.NumberOfPages = prompt("Введите количество страниц","128"); //количество страниц в книге
book.SheetSize = book.SheetWidth*book.SheetHeight; //размер печатного листа
book.MultiplicityOfPages = book.NumberOfPages % book.NumberOfLeaves; //количество страниц сверх кратности - например, для вывода предупреждения о нечетном количестве и некратности доле листа
book.ConditionalPrintedSheets = book.NumberOfPages / book.NumberOfLeaves * (book.SheetSize/StandartSheetSize); //количество условных печатных листов

document.write(book.Name + ": количество условных печатных листов — " + book.ConditionalPrintedSheets + ", количество страниц сверх кратности — " + book.MultiplicityOfPages); //вывод результатов
}