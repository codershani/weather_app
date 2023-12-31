// API KEY
const API_KEY = "cd308a6853798d1a3d66b8029911b46a";


const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');

const weatherContainer = document.querySelector('.weather-container');

const grantAccess = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');

const notFound = document.querySelector('.error-container');
const errorMsg = document.querySelector('.error-text');
const errorBtn = document.querySelector('[data-errorBtn');

// Initial Variables
let currentTab = userTab;
currentTab.classList.add("current-tab");

getFromSessionStorage();

// Function to switch tabs
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            // if search form container is invisible then make it visible
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // currently we are in search form tab now switch to your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now i am in your weather tab, so make your weather info visible, so let's check local storage first 
            // for coordinates, if we have saved them there.
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// Function to check current position coordinates are stored in localStorage or not. if not then store
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // if local coordinates not found
        grantAccess.classList.add("active");
    } else {
        // if found
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// fetch user weather info
async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // first make gran access container invisible
    grantAccess.classList.remove('active');
    // then make loading screen visible
    loadingScreen.classList.add('active');
    notFound.classList.remove('active');

    // make API Call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } 
    catch (err) {
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorMsg.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener('click', fetchUserWeatherInfo);
    }
}

// Rendering User Current Position Weather Info 
function renderWeatherInfo(weatherInfo) {
    // firstly we have fetch elements from UI

    const cityName = document.querySelector('[data-cityName]');
    const countryFlag = document.querySelector('[data-countryFlag]');

    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temperature = document.querySelector('[data-temperature]');

    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-clouds]');

    // Fetch values from weatherInfo object
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)}%`;

}

// Grant Access Location
const grantAccessBtn = document.querySelector('[data-grantAccess]');

// Find Geo Location
function geoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        grantAccessButton.style.display = 'none';
    }
} 

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


grantAccessBtn.addEventListener("click", geoLocation);


const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (searchInput.value === "")
        return;
        
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = '';
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccess.classList.remove('active');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorMsg.innerText = `${err?.message}`;
        errorBtn.style.display = 'none';
    } 
}


// function renderWeatherInfo(data) {
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`; // todo learn
//     document.body.appendChild(newPara);
// }


// async function showWeather() {
//     let lat = '';
//     let long = '';
//     let city = "Goa";

//     // Most important Lines
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//     const data = await response.json();

//     console.log("Weather data: --> " , data);

//     renderWeatherInfo(data);
// }

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("geoLocation is not supported");
//     }
// }

// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;

//     console.log(lat);
//     console.log(lon);
// }