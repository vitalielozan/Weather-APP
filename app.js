// Iti recomand sa folosesti id-uri in loc de clase ca selectori
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

// exemplu de folosire cu async-await
formInput.addEventListener("submit", async (event) => {
    event.preventDefault();
    displayLoading();
    await getWeatherDataForCity(cityInput.value);
    cityInput.value = "";
});

//Aici am folosit async-await
window.addEventListener("load", async () => {
    displayLoading();
    try {
        const cityName = await getLocation();
        if (cityName) {
            await getWeatherDataForCity(cityName);
        } else {
            showError("Nu s-a putut obține locația implicită.");
        }
    } catch (error) {
        showError("Eroare la obținerea locației.");
    }
});


// Exemplu de folosire a functiei cu async-await
async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const cityName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
                    resolve(cityName);
                } catch (error) {
                    reject(error);
                }
            }, (error) => {
                reject(error);
            });
        } else {
            reject("Geolocația nu este suportată de acest browser.");
        }
    });
}

// Aici ai putea sa ai 2 parametrii - latitudine si longitudine si atunci
async function showPosition(position) {
    try {
        const response = await fetch(
            `https://api.api-ninjas.com/v1/reversegeocoding?lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            {
                method: "GET",
                headers: {
                    // Iti recomand sa scoti intr-o constanta acest key - mai tarziu sa putem sa ascundem
                    "X-Api-Key": "lUYW1Wu896E7NTbZXKpiHw==H5x1D9Z79nme4g2l",
                },
            });
        const result = await response.json();
        // Aceasta functie poate sa returneze direct result[0].name;
        
        if (result.length > 0) {
            const cityName = result[0].name;
            // iti recomand sa scoti acest console log
            console.log(cityName, result);
            return cityName;
            // Si atunci nu ai mai avea nevoie de cauza else
        } else {
            throw new Error("Nu sa gasit nici o locatie.");
        }

    } catch (error) {
        console.error("Eroare", error);
        // throw new Error("mesaj custom", error)
        throw error;
    }

}


async function geWeatherDataForCity(cityName) {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/weather?city=" + cityName, {
            method: "GET",
            headers: {
                //La fel si aici - sa scoti intr-o constanta
                "X-Api-Key": "lUYW1Wu896E7NTbZXKpiHw==H5x1D9Z79nme4g2l",
            },
        });

        const result = await response.json();
        updateUiInfo(result, cityName);
        hideLoading();
        // Ai putea sa scotui acest console.log
        console.log(cityName, result);
    } catch (error) {
        hideLoading();
        console.error("Error", error);
    }
}


function updateUiInfo(info, cityName) {
    city.innerHTML = cityName;
    temperature.innerHTML = info.temp;

    // Iti recomand sa creezi o functie pentru toate acestea care sa aiba parametrul tot ce ai nevoie
    // De obicei cand ai mai multa logica care se repeta si se bazeaza pe un parametrul este ok sa o scoti in functise separata
    // Vezi te rog functia `updateWeatherUI`
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

// aici este un exemplu functia recomandata mai sus
function updateWeatherUI(temp) {
    const weatherConditions = [
        { class: "bi-cloud-snow-fill", bg: "winter.jpg", textColor: "white", min: -Infinity, max: 0 },
        { class: "bi-cloud-drizzle-fill", bg: "rain.jpg", textColor: "white", min: 0, max: 10 },
        { class: "bi-cloud-sun-fill", bg: "bewolkt.jpg", textColor: "black", min: 10, max: 20 },
        { class: "bi-brightness-high-fill", bg: "sommer.jpg", textColor: "black", min: 20, max: Infinity }
    ];

    const condition = weatherConditions.find(cond => temp >= cond.min && temp < cond.max);

    if (condition) {
        weatherIcon.className = `weather-icon ${condition.class}`;
        bgBody.style.backgroundImage = `url('./Assets/Images/${condition.bg}')`;
        bgBody.style.color = condition.textColor;
    }
}

function displayLoading() {
    const pageContent = document.querySelector(".page-content");
    // Un extra check ai putea sa verifici daca exista 'loading' - si daca nu exista atunci sa faci inserarea acestuia
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
