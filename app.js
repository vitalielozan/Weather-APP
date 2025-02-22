const bgBody = document.querySelector("body");
const formInput = document.querySelector("#formInput");
const cityInput = document.querySelector("#cityInput");
const city = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const weatherIcon = document.querySelector(".weather-icon");
const dateNow = document.querySelector(".date");
const tempFeel = document.querySelector(".temp-feel");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind");
const windDeeg = document.querySelector(".wind-deeg");

formInput.addEventListener("submit", (event) => {
    event.preventDefault();
    clearContent();
    displayLoading();
    geWeatherDataForCity(cityInput.value);
    cityInput.value = "";
});

window.addEventListener("load", () => {
    clearContent();
    displayLoading();
    const cityDefoult = getLocation();
    cityDefoult.then(cityName => {
        if (cityName) {
            geWeatherDataForCity(cityName);
        } else {
            console.error("Nu sa putut obtine locatia implicita.");
        }
    }).catch(error => {
        console.error("Eroare la obtinerea locatiei", error);
    });
});


async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    showPosition(position).then(resolve).catch(reject);
                },
                (error) => {
                    console.error("Eroare le obtinerea geolocatiei:", error);
                    reject(error);
                });
        } else {
            alert("Geolocatia nu este suportata de acest browser");
            reject("Geolocatia nu este suportata");
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
                    "X-Api-Key": "lUYW1Wu896E7NTbZXKpiHw==H5x1D9Z79nme4g2l",
                },
            });
        const result = await response.json();
        if (result.length > 0) {
            const cityName = result[0].name;
            console.log(cityName, result);
            return cityName;
        } else {
            throw new Error("Nu sa gasit nici o locatie.");
        }

    } catch (error) {
        console.error("Eroare", error);
        throw error;
    }

}


async function geWeatherDataForCity(cityName) {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/weather?city=" + cityName, {
            method: "GET",
            headers: {
                "X-Api-Key": "lUYW1Wu896E7NTbZXKpiHw==H5x1D9Z79nme4g2l",
            },
        });

        const result = await response.json();
        updateUiInfo(result, cityName);
        hideLoading();
        console.log(cityName, result);
    } catch (error) {
        hideLoading();
        console.error("Error", error);
    }
}


function updateUiInfo(info, cityName) {
    city.innerHTML = cityName;
    temperature.innerHTML = info.temp;

    if (info.temp < 0) {
        weatherIcon.classList.remove("bi-cloud-snow-fill", "bi-brightness-high-fill", "bi-cloud-sun-fill", "bi-cloud-drizzle-fill");
        weatherIcon.classList.add("bi-cloud-snow-fill");
        bgBody.style.backgroundImage = "url('./Assets/Images/winter.jpg')";
        bgBody.style.color = "white";
    } else if (info.temp >= 0 && info.temp < 10) {
        weatherIcon.classList.remove("bi-cloud-snow-fill", "bi-brightness-high-fill", "bi-cloud-sun-fill", "bi-cloud-drizzle-fill");
        weatherIcon.classList.add("bi-cloud-drizzle-fill");
        bgBody.style.backgroundImage = "url('./Assets/Images/rain.jpg')";
        bgBody.style.color = "white";
    } else if (info.temp >= 10 && info.temp < 20) {
        weatherIcon.classList.remove("bi-cloud-snow-fill", "bi-brightness-high-fill", "bi-cloud-sun-fill", "bi-cloud-drizzle-fill");
        weatherIcon.classList.add("bi-cloud-sun-fill");
        bgBody.style.backgroundImage = "url('./Assets/Images/bewolkt.jpg')";
    } else {
        weatherIcon.classList.remove("bi-cloud-snow-fill", "bi-brightness-high-fill", "bi-cloud-sun-fill", "bi-cloud-drizzle-fill");
        weatherIcon.classList.add("bi-brightness-high-fill");
        bgBody.style.backgroundImage = "url('./Assets/Images/sommer.jpg')";

    }

    dateNow.innerHTML = new Date().toDateString();
    tempFeel.innerHTML = info.feels_like;
    humidity.innerHTML = info.humidity;
    windSpeed.innerHTML = info.wind_speed;
    windDeeg.innerHTML = info.wind_degrees;
}

function clearContent() {
    const pageContent = document.querySelector('.page-content');
    pageContent.innerHTML = '';
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
