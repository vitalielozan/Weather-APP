let api_key = "";
const bgBody = document.querySelector("body");
const formInput = document.querySelector("#formInput");
const cityInput = document.querySelector("#cityInput");
const city = document.querySelector("#city");
const temperature = document.querySelector("#temp");
const icon = document.querySelector("#weatherIcon");
const weatherIcon = document.querySelector(".weather-icon");
const dateNow = document.querySelector("#date");
const tempFeel = document.querySelector("#temp-feel");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind");
const windDeeg = document.querySelector("#wind-deeg");


const loadConfig = async () => {
    try {
        const resp = await fetch("config/config.json");
        const data = await resp.json();
        api_key = data.api_key;
    } catch (error) {
        console.log("Config error", error);
    }
}

loadConfig();

formInput.addEventListener("submit", async (event) => {
    event.preventDefault();
    displayLoading();
    await geWeatherDataForCity(cityInput.value);
    hideLoading();
    cityInput.value = "";
});

window.addEventListener("load", async () => {
    displayLoading();

    try {
        const cityName = await getLocation();
        if (cityName) {
            await geWeatherDataForCity(cityName);
            hideLoading();
        } else {
            showError("Nu sa putut obtine locatia implicita.");
        }

    } catch (error) {
        showError("Eroare la obtinerea locatiei", error);
    }
});


async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const sityName = await showPosition(position);
                    resolve(sityName);
                } catch (error) {
                    reject(error);
                }
            }, (error) => {
                reject(error);
            });
        } else {
            reject("Geolocatia nu este suportata de acest browser.");
        }
    });
}


async function showPosition(position) {
    try {
        const response = await fetch(
            `https://api.api-ninjas.com/v1/reversegeocoding?lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            {
                method: "GET",
                headers: {
                    "X-Api-Key": api_key,
                },
            });
        const result = await response.json();
        return result[0].name;
    } catch (error) {
        console.error("Eroare", error);
        throw new Error("Nu s-a putut prelua locatia.", error);
    }

}

async function geWeatherDataForCity(cityName) {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/weather?city=" + cityName, {
            method: "GET",
            headers: {
                "X-Api-Key": api_key,
            },
        });

        const result = await response.json();
        updateUiInfo(result, cityName);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error("Error", error);
    }
}


function updateUiInfo(info, cityName) {
    city.innerHTML = cityName;
    temperature.innerHTML = info.temp + "&deg";

    updateWeatherUI(info.temp);

    dateNow.innerHTML = new Date().toDateString();
    tempFeel.innerHTML = info.feels_like;
    humidity.innerHTML = info.humidity;
    windSpeed.innerHTML = info.wind_speed;
    windDeeg.innerHTML = info.wind_degrees;
}

function updateWeatherUI(temp) {
    const weatherConditions = [
        { class: "bi-cloud-snow-fill", bg: "winter.jpeg", textColor: "white", min: -Infinity, max: 0 },
        { class: "bi-cloud-drizzle-fill", bg: "rainy.jpg", textColor: "white", min: 0, max: 10 },
        { class: "bi-cloud-sun-fill", bg: "autumm.jpg", textColor: "darkgray", min: 10, max: 20 },
        { class: "bi-brightness-high-fill", bg: "sommer.jpeg", textColor: "coral", min: 20, max: Infinity }
    ];

    const condition = weatherConditions.find(cond => temp >= cond.min && temp < cond.max);

    if (condition) {
        weatherIcon.className = `weather-icon ${condition.class}`;
        bgBody.style.backgroundImage = `url('./Images/${condition.bg}')`;
        bgBody.style.color = `${condition.textColor}`;
    }
}


function displayLoading() {
    const pageContent = document.querySelector(".page-content");
    const loading = document.createElement("p");
    const main = document.querySelector('main');
    if (loading) {
        bgBody.style.backgroundImage = "none";
        loading.setAttribute("id", "loading");
        loading.innerHTML = "Se preiau datele.....";
        pageContent.append(loading);
        main.style.display = 'none';
    }
}

function hideLoading() {
    const loading = document.querySelector("#loading");
    if (loading) {
        loading.remove();
    }
    document.querySelector('main').style.display = 'block';
}
