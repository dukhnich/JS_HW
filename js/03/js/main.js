var tasks = {
    switchSizes: function(){
        var sizeRussia
        var sizeUSA = prompt("Введите американский размер одежды.", "")
        switch (sizeUSA)
        {
            case "6": sizeRussia = 40,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "8": sizeRussia = 42,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "10": sizeRussia = 44,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "12": sizeRussia = 46,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "14": sizeRussia = 48,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "16": sizeRussia = 50,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "18": sizeRussia = 52,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            case "20": sizeRussia = 54,
                alert("Российский размер одежды: " + sizeRussia);
                break;
            default: alert("Мне неизвестен этот размер.");
        }
    },

    switchIf: function(){
        tasksInformation.innerHTML = "";
        var color = prompt("Введите цвет","");
        if (color == 'red')
        {
            tasksInformation.innerHTML += "<div style='background-color: red;'>красный</div>";
        }
        if (color == 'red' || color == 'black')
        {
            tasksInformation.innerHTML += "<div style='background-color: black; color: white;'>черный</div>";
        }
        else
        {
            if (color == 'blue')
            {
                tasksInformation.innerHTML += "<div style='background-color: blue;'>синий</div>";
            }
            if (color == 'blue' || color == 'green')
            {
                tasksInformation.innerHTML += "<div style='background-color: green;'>зеленый</div>";
            }
            else
            {
                tasksInformation.innerHTML += "<div style='background-color: gray;'>Я не понял</div>";
            }
        }
    },

    promptOr: function(){
        var age = +prompt("Сколько вам лет?","");
        (age > -1) && !alert("Ваш год рождения: "+ (2020 - age)) ||
        alert("Ошибка");
    },

    confirmOrThisDays: function(){
        confirm("шопинг?") && !alert("Hooray!") ||
        alert("ты - бяка");
    },

    confirmIfThisDays: function(){
        if (confirm("шопинг?")) {
            alert("Hooray!")
        }
        else {
            alert("ты - бяка");
        }
    },

    triplePrompt: function(){
        var surname = prompt ("Введите свою фамилию:","");
        var name = prompt ("Введите свое имя:","");
        var fathername = prompt ("Введите свое отчество:","");
        var fio = surname + " " + name + " " + fathername;
        alert(fio);
    },

    defaultOr: function(){
        var surname = prompt ("Введите свою фамилию:","") || "Emptyman";
        var name = prompt ("Введите свое имя:","") || "Noname";
        var fathername = prompt ("Введите свое отчество:","") || "Dragonsborn";
        var fio = surname + " " + name + " " + fathername;
        alert(fio);
    },

    defaultIf: function(){
        var surname, name, fathername
        if (surname = prompt ("Введите свою фамилию:",""));
        else {surname = "Emptyman"}
        if (name = prompt ("Введите свое имя:",""));
        else {name = "Noname"}
        if (fathername = prompt ("Введите свое отчество:",""));
        else {fathername = "Dragonsborn"}
        var fio = surname + " " + name + " " + fathername;
        alert(fio);
    },

    loginAndPassword: function(){
        var credentials = { //верные логин и пароль
            login: 'admin',
            password: 'qwerty',
        };
        var user = {}; //объект для конкретного юзера, например, для передачи в БД

        if ((user.login = prompt('Введите имя пользователя:', '')) == credentials.login){
            if ((user.password = prompt('Введите пароль:', '')) == credentials.password){
                alert("Вы успешно вошли в систему");
            }
            else {
                alert("Пароль неверен");
            }
        }
        else {
            alert("Логин неверен");
        }
    },

    currencyCalc: function(){
        var rateEur = 30.52;
        var rateUsd = 28.33;
        var rateUser;
        var hrivnaUser;
        var userCurrency = prompt("Выберите валюту, в которую нужно переводить: usd или eur", "")
        switch (userCurrency)
        {
            case "usd": rateUser = rateUsd;
                break;
            case "eur": rateUser = rateEur;
                break;
            default: alert("Некорректная валюта");
        }
        if (rateUser) {
            hrivnaUser = +prompt("Сколько гривен будете менять?");
            if (hrivnaUser>-1) {
                alert(`За ${hrivnaUser} грн вы получите ${Math.floor(hrivnaUser/rateUser*100)/100} ${userCurrency}`);
                rateUser = 0;
            }
            else {
                alert("Что-то пошло не так...")
            }
        }
    },

    currencyCalcImproved: function(){
        var rateEur = 30.52;
        var rateUsd = 28.33;
        var rateUser;
        var hrivnaUser;
        var userCurrency = prompt("Выберите валюту, в которую нужно переводить: usd или eur", "").toLowerCase()
        switch (userCurrency)
        {
            case "usd": rateUser = rateUsd;
                break;
            case "eur": rateUser = rateEur;
                break;
            default: alert("Некорректная валюта");
        }
        if (rateUser) {
            hrivnaUser = +prompt("Сколько гривен будете менять?");
            if (hrivnaUser>-1) {
                alert(`За ${hrivnaUser} грн вы получите ${Math.floor(hrivnaUser/rateUser*100)/100} ${userCurrency}`);
            }
            else {
                alert("Что-то пошло не так...")
            }
            rateUser = 0;
        }
    },

    currencyCalcTwoRates: function(){
        var rateEur;
        var rateUsd;
        var rateUser;
        var moneyUser;
        var saleCurrency = confirm("Вы будете продавать валюту?") ?
            "1" && (rateEur = 29.61) && (rateUsd = 27.68) : "0" && (rateEur = 30.52) && (rateUsd = 28.33)
        var userCurrency = prompt("Выберите валюту: usd или eur", "").toLowerCase()
        switch (userCurrency)
        {
            case "usd": rateUser = rateUsd;
                break;
            case "eur": rateUser = rateEur;
                break;
            default: alert("Некорректная валюта");
        }
        if (rateUser) {
            if (+saleCurrency) {
                moneyUser = +prompt(`Сколько ${userCurrency} будете менять?`);
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} ${userCurrency} вы получите ${moneyUser*rateUser} грн`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            else {
                moneyUser = +prompt("Сколько гривен будете менять?");
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} грн вы получите ${Math.floor(moneyUser/rateUser*100)/100} ${userCurrency}`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            rateUser = 0;
        }
    },

    currencyCalcIf: function(){
        var rateEur;
        var rateUsd;
        var rateUser;
        var moneyUser;
        var saleCurrency;
        if (saleCurrency = confirm("Вы будете продавать валюту?")) {
            rateEur = 29.61;
            rateUsd = 27.68;
        }
        else {
            rateEur = 30.52;
            rateUsd = 28.33;
        }
        var userCurrency = prompt("Выберите валюту: usd или eur", "").toLowerCase()
        switch (userCurrency)
        {
            case "usd": rateUser = rateUsd;
                break;
            case "eur": rateUser = rateEur;
                break;
            default: alert("Некорректная валюта");
        }
        if (rateUser) {
            if (+saleCurrency) {
                moneyUser = +prompt(`Сколько ${userCurrency} будете менять?`);
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} ${userCurrency} вы получите ${moneyUser*rateUser} грн`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            else {
                moneyUser = +prompt("Сколько гривен будете менять?");
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} грн вы получите ${Math.floor(moneyUser/rateUser*100)/100} ${userCurrency}`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            rateUser = 0;
        }
    },

    currencyCalcObject: function(){
        var ratios = {
            usd: [27.68, 28.33],
            eur: [29.61, 30.52]
        }
        var saleCurrency;
        var moneyUser;
        saleCurrency = +confirm("Вы будете покупать валюту?") // вернет индекс, равный индексу покупки или продажи в массиве конкретной валюты
        var userCurrency = prompt(`Выберите валюту: ${Object.keys(ratios)}`, "").toLowerCase()
        if (Object.keys(ratios).indexOf(userCurrency) > -1) { // проверка по индексам используемых валют
            if (saleCurrency) {
                moneyUser = +prompt(`Сколько ${userCurrency} будете менять?`);
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} ${userCurrency} вы получите ${moneyUser*ratios[userCurrency][saleCurrency]} грн`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            else {
                moneyUser = +prompt("Сколько гривен будете менять?");
                if (moneyUser>-1) {
                    alert(`За ${moneyUser} грн вы получите ${Math.floor(moneyUser/ratios[userCurrency][saleCurrency]*100)/100} ${userCurrency}`);
                }
                else {
                    alert("Некорректная сумма")
                }
            }
            userCurrency = "";
        }
        else {
            alert("Некорректная валюта")
        }
    },

    scissors: function(){
        var turnsVariant = ["камень", "ножницы", "бумага"]
        var userTurn = prompt ("Камень, ножницы, бумага?","").toLowerCase()
        var botTurn = Math.floor(Math.random()*3)
        if (turnsVariant.indexOf(userTurn)>-1){
            if (turnsVariant.indexOf(userTurn) == botTurn){
                alert("Ничья.")
            }
            else {
                if ((turnsVariant.indexOf(userTurn) == 0 && botTurn == 1) ||
                    (turnsVariant.indexOf(userTurn) == 1 && botTurn == 2) ||
                    (turnsVariant.indexOf(userTurn) == 2 && botTurn == 0)){
                    alert("Вы победили!")
                }
                else {
                    alert("Вы проиграли...")
                }
            }
        }
        else {
            alert("Не знаю такого жеста...")
        }
    },

    scissorsOr: function(){
        var turnsVariant;
        var userTurn;
        var botTurn;
        ((turnsVariant = ["камень", "ножницы", "бумага"]).indexOf(userTurn = prompt ("Камень, ножницы, бумага?","").toLowerCase())>-1) &&
        ( //if correct user variant
            ( //if user and bot choose the same
                turnsVariant.indexOf(userTurn) == (botTurn = Math.floor(Math.random()*3))
                &&
                !alert("Ничья.")
            )
            || ( //else
                ( //if user win
                    (
                        ((turnsVariant.indexOf(userTurn) == 0 && botTurn == 1) ||
                            (turnsVariant.indexOf(userTurn) == 1 && botTurn == 2) ||
                            (turnsVariant.indexOf(userTurn) == 2 && botTurn == 0))
                    ) &&
                    !alert("Вы победили!")
                )
                || //else
                !alert("Вы проиграли...")
            )
        )
        || ( //else, if incorrect user variant
            alert("Не знаю такого жеста...")
        )
    },

}

btnDone.onclick = function(){
    tasks[tasksList.value]()
}

