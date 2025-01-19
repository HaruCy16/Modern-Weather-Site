//VARIABLES AND API KEY
const apiKey = "31888860aa735911d9686859f1bb463b";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

//WEATHER ICON AND BACKGROUND
let icon = document.getElementById("weatherIcon");
let weatherBackground = document.getElementById("background");

//FUNCTION TO GET WEATHER DATA
async function getWeatherData(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    var data = await response.json();

    //DEFAULT FORMAT CHANGE

    //Home message display none
    document.getElementById("fetchMessage").style.display = "none";

    //Search bar adjust to top
    document.getElementById("background").style.display = "block";
    document.getElementById("searchBar").style.marginTop = "16px";

    //WEATHER INFORMATION
    document.getElementById("location").innerHTML = data.name; //LOCATION
    document.getElementById("temperature").innerHTML = data.main.temp + "°C"; //TEMPERATURE
    document.getElementById("humid").innerHTML = data.main.humidity + "%"; //HUMIDITY
    document.getElementById("pressure").innerHTML = data.main.pressure + " hPa"; //PRESSURE
    document.getElementById("seaLvl").innerHTML = data.main.sea_level + " hPa"; //SEA LEVEL

    //DATE LOGIC
    const today = new Date().toString().split(" ").splice(1, 3).join(" ");
    document.getElementById("currentDate").innerHTML = today;

    //LOGIC FOR WEATHER DATA BEING SHOWED IF YOU SEARCH AGAIN FROM AN ERROR MESSAGE

    //Hide error message
    document.getElementById("errorMessage").style.display = "none";

    //Show weather data
    document.querySelector(".header").style.display = "block";
    document.querySelector(".weather-status").style.display = "block";
    document.querySelector(".weather-details").style.display = "block";

    //WEATHER CONDITIONS
    document.getElementById("weatherType").innerHTML = data.weather[0].main;
    icon.style.display = "block";

    if (data.weather[0].main == "Clouds") {
      icon.src = "assets/weather_symbols/cloudy.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/cloudy.png')";
    } else if (data.weather[0].main == "Clear") {
      icon.src = "assets/weather_symbols/clear.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/sunny.png')";
    } else if (data.weather[0].main == "Rain") {
      icon.src = "assets/weather_symbols/rainy.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/rainy.png')";
    } else if (data.weather[0].main == "Thunderstorm") {
      icon.src = "assets/weather_symbols/thunder.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/thunderstorm.png')";
    } else if (data.weather[0].main == "Drizzle") {
      icon.src = "assets/weather_symbols/drizzle.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/drizzle.png')";
    } else {
      icon.src = "assets/weather_symbols/default.png";
      weatherBackground.style.backgroundImage =
        "url('assets/weather_image/default.png')";
    }

    //CONSOLE DEBUGGING
    console.log(data);
  } catch (error) {
    //ERROR MESSAGE

    //Hide weather data
    document.querySelector(".header").style.display = "none";
    document.querySelector(".weather-status").style.display = "none";
    document.querySelector(".weather-details").style.display = "none";

    //Right side message
    weatherBackground.style.backgroundImage =
      "url('assets/weather_image/default.png')"; //background image
    document.getElementById("fetchMessage").innerHTML = "ERROR 404 NOT FOUND";
    document.getElementById("fetchMessage").style.display = "block";
    weatherBackground.style.display = "flex"; //display at the center

    //Show error message
    document.getElementById("errorMessage").style.display = "block";
    console.log(error);
  }
}

//SHOW WEATHER DATA WHEN FETCHING

//FUNCTION FOR MOBILE
function mobileWidth() {
  document.querySelector(".right-container").style.display = "block";
  document.querySelector(".left-container").style.height = "30%";
}

//SEARCH
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");

//VARIABLES FOR WEATHER INFORMATION
const defaultPage = document.getElementById("defaultPage");
const dataPage = document.getElementById("weatherData");

//SEARCH FUNCTIONS
searchBar.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    defaultPage.style.display = "none";
    dataPage.style.display = "block";
    mobileWidth();
    getWeatherData(searchBar.value);
  }
});
searchBtn.addEventListener("click", () => {
  defaultPage.style.display = "none";
  dataPage.style.display = "block";
  mobileWidth();
  getWeatherData(searchBar.value);
});
