let climates = {
    "Экваториальные области Африки": "Экваториальный",
    "Экваториальные области Южной Америки": "Экваториальный",
    "Экваториальные области Океании": "Экваториальный",
    "Южная и Юго-Восточная Азия": "Тропический муссонный",
    "Западная и Центральная Африка": "Тропический муссонный",
    "Северная Австралия": "Тропический муссонный",
    "Северная Африка": "Тропический сухой",
    "Центральная Австралия": "Тропический сухой",
    "Средиземноморье": "Средиземноморский",
    "Южный берег Крыма": "Средиземноморский",
    "Южная Африка": "Средиземноморский",
    "Юго-Западная Австралия": "Средиземноморский",
    "Западная Калифорния": "Средиземноморский",
    "Западные части Евразии": "Умеренный морской",
    "Западные части Северной Америки": "Умеренный морской",
    "Внутренние части материков": "Умеренный континентальный",
    "Восточная окраина Евразии": "Умеренный муссонный",
    "Северные окраины Евразии": "Субарктический",
    "Северные окраины Северной Америки": "Субарктический",
    "Акватория Северного Ледовитого океана": "Арктический"
};

for (let region in climates) {
    let opinion = document.createElement("option");
    opinion.value = region;
    opinion.innerText = region;
    climatesSelection.appendChild(opinion)
}
const ClimaticZones = class Climate{
    constructor (region) {
        Object.defineProperty(this, "climates", {value: climates});
        if (region in this.climates) {
            this.region = region
        }
        else {
            throw "This is not a region"
        }
    }
    getClimate () {
        return this.climates[this.region]
    }
}
climateBtn.onclick = () => climateText.innerText = new ClimaticZones(climatesSelection.value).getClimate()
let afr = new ClimaticZones("Северная Африка");


const colors = [
    {
        id: 1,
        name: "Blue"
    },
    {
        id: 2,
        name: "Red"
    },
    {
        id: 3,
        name: "Yellow"
    }
];

let colorSection = document.getElementById("colorSection");
let formCheck = document.createElement("div");
formCheck.setAttribute("class", "form-check p-0");
for (let color of colors) {
    let input = document.createElement("input");
    input.setAttribute("class","form-check-input m-2 position-static");
    input.type = "radio";
    input.name = "colors";
    input.id = `color${color.id}`
    input.value = color.name.toLowerCase();
    input.onchange = () => {
        if (input.checked) {
            colorSection.style = "background-color: " + input.value;
        }
    }
    let label = document.createElement("label");
    label.setAttribute("class", "form-check-label");
    label.for = `color${color.id}`;
    label.innerText = color.name;
    formCheck.append(input,label);
};
colorSection.appendChild(formCheck)

const config = {
    childList: true,
    subtree: true
}

const handler = (...rest) => {
    rest.forEach(mute => console.log("mutations", mute))

}

const observer = new MutationObserver(handler)

observer.observe(climatesSection, config)