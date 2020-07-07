function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function drawSpinner (container) {
    container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary m-3" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>`
}

function uploadFile(file, ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(file)
            },
            ms);
    });
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms);
    });
}

async function addInfo(event) {
    let promiseArr = [];
    filesNames.innerHTML = "";
    let ul = document.createElement("ul");
    filesNames.appendChild(ul);
    ul.setAttribute("class","list-group");
    for (let i = 0; i < [...event.target.files].length; i++) {
        let li = document.createElement("li");
        ul.appendChild(li);
        drawSpinner (li);
        let newLi = document.createElement("li");
        promiseArr.push(fillLi(newLi, [...event.target.files][i]))
    }
    let promisesResults = await Promise.all(promiseArr);
    ul.innerHTML = "";
    for (let i = 0; i < [...event.target.files].length; i++) {
        ul.appendChild(promisesResults[i]);
    }
}

async function fillLi(li, file) {
    let ms = getRandomInt (300, 1000);
    let newFile = await uploadFile(file, ms);
    li.innerText = newFile.name;
    li.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center");
    let size = document.createElement("span");
    size.innerText = `${Math.round((file.size / 1024 /1024) * 100) / 100} Mb`;
    size.classList.add("alert", "alert-secondary", "ml-3", "mb-0");
    li.appendChild(size);
    return li
}

async function longAddInfo(event) {
    filesNames.innerHTML = "";
    let ul = document.createElement("ul");
    filesNames.appendChild(ul);
    ul.setAttribute("class","list-group");
    for (let i = 0; i < [...event.target.files].length; i++) {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        ul.appendChild(li);
        drawSpinner (li);
    }
    for (let i = 0; i < [...event.target.files].length; i++) {
        let li = ul.childNodes[i];
        li = await fillLi(li, [...event.target.files][i]);
    }
}

let fileInput = document.getElementById("file")

fileInput.addEventListener("change", longAddInfo);


class ClickRace {
    constructor(container, clickCount, s) {
        this.clickCount = clickCount;
        this.time = s*1000;
        this.container = container;
        this.raceInit.call(this);
        let progress = this.drawProgress.call(this);
        this.container.prepend(progress);
        this.start = performance.now();
        this.progressLoop.call(this);
        Promise.race([wait(this.time), this.raceClick(this.container, this.clickCount, this.time, this.start)])
            .then((res) => {
                let result = document.createElement("div");
                result.classList.add("alert", "alert-success");
                if (true === res) {
                    result.classList.add("alert-success");
                    result.innerText = "You win";
                } else {
                    result.classList.add("alert-danger");
                    result.innerText = "You fail";
                }
                this.container.appendChild(result)
                clickPlace.remove();
                progress.remove();
            })
    }
    raceInit () {
        this.container.innerHTML = "";
        let clickPlace = document.createElement("div");
        clickPlace.innerText = `Click here ${this.clickCount} times`;
        clickPlace.classList.add("alert", "alert-warning");
        clickPlace.id = "clickPlace";
        clickPlace.setAttribute("role", "alert");
        this.container.appendChild(clickPlace);
    }
    drawProgress() {
        let progress = document.createElement("div");
        progress.classList.add("progress", "mb-3");
        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "progress-bar-striped", "bg-warning");
        progressBar.setAttribute("role", "progressbar");
        progressBar.id = "progressBar";
        progressBar.style.width = "100%";
        progress.appendChild(progressBar);
        return progress;
    }
    raceClick(container, count, time, start) {
        return new Promise(function (resolve) {
            function clickOnRaceEl (event) {
                let clickPlace = event.target.closest('#clickPlace');
                if (!clickPlace) return;
                if (!container.contains(clickPlace)) return;
                count--;
                if (count === 0) {
                    resolve(true)
                }
                clickPlace.innerText = `Click here ${count} times, left ${(time - (performance.now() - start)) / 1000} s`;
            }
            container.removeEventListener("click", clickOnRaceEl);
            container.addEventListener("click", clickOnRaceEl)
        })
    }

    progressLoop() {
        let pbar = document.getElementById("progressBar")
        if (pbar) {
            pbar.style.width = `${(this.time - (performance.now() - this.start)) * 100 / this.time}%`;
            requestAnimationFrame(this.progressLoop.bind(this));
        }
    }
}

play.addEventListener("click", () => new ClickRace(gameContainer, countOfClick.value, time.value));