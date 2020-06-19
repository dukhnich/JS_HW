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
        console.log(this, region)
    }
    getClimate () {
        return this.climates[this.region]
    }
}
climateBtn.onclick = () => climateText.innerText = new ClimaticZones(climatesSelection.value).getClimate()
let afr = new ClimaticZones("Северная Африкал");
console.log(afr.getClimate())
