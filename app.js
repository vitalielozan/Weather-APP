const api_key = "lUYW1Wu896E7NTbZXKpiHw==H5x1D9Z79nme4g2l";
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

formInput.addEventListener("submit", async (event) => {
    event.preventDefault();
    displayLoading();
    await geWeatherDataForCity(cityInput.value);
    cityInput.value = "";
});

window.addEventListener("load", async () => {
    displayLoading();
    try {
        const cityName = await getLocation();
        if (cityName) {
            await geWeatherDataForCity(cityName);

        } else {
            showError("Nu sa putut obtine locatia implicita.");
        }

    } catch (error) {
        showErrorrror("Eroare la obtinerea locatiei", error);
    }
});


async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    showPosition(position).then(resolve).catch(reject);
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
    temperature.innerHTML = info.temp;

    updateWeatherUI(info.temp);

    dateNow.innerHTML = new Date().toDateString();
    tempFeel.innerHTML = info.feels_like;
    humidity.innerHTML = info.humidity;
    windSpeed.innerHTML = info.wind_speed;
    windDeeg.innerHTML = info.wind_degrees;
}

function updateWeatherUI(temp) {
    const weatherConditions = [
        { class: "bi-cloud-snow-fill", bg: "winter.jpg", textColor: "white", min: -Infinity, max: 0 },
        { class: "bi-cloud-drizzle-fill", bg: "rainy.jpg", textColor: "white", min: 0, max: 10 },
        { class: "bi-cloud-sun-fill", bg: "bewolkt.jpg", textColor: "black", min: 10, max: 20 },
        { class: "bi-brightness-high-fill", bg: "sommer.jpg", textColor: "coral", min: 20, max: Infinity }
    ];

    const condition = weatherConditions.find(cond => temp >= cond.min && temp < cond.max);

    if (condition) {
        weatherIcon.className = `weather-icon ${condition.class}`;
        bgBody.style.backgroundImage = `url('./Assets/Images/${condition.bg}')`;
        bgBody.style.color = `${condition.textColor}`;
    }
}


function displayLoading() {
    const pageContent = document.querySelector(".page-content");
    const loading = document.createElement("p");
    loading.setAttribute("id", "loading");
    loading.innerHTML = "Se incarca datele.....";
    pageContent.append(loading);

}

function hideLoading() {
    const loading = document.querySelector("#loading");
    if (loading) {
        loading.remove();
    }
}
