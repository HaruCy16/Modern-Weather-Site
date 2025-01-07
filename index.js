//VARIABLES AND API KEY
const apiKey = "31888860aa735911d9686859f1bb463b";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

//FUNCTION TO GET WEATHER DATA
async function getWeatherData(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    document.getElementById("weatherLoc").innerHTML = data.name;
    document.getElementById("temp").innerHTML =
      Math.round(data.main.temp) + "°C";

    console.log(data);

    //Weather Conditions
    document.querySelector(".weather-status").innerHTML = data.weather[0].main;
    // document.getElementById("weatherIcon").style.display = "block";

    if (data.weather[0].main == "Clouds") {
      document.getElementById("weatherIcon").src =
        "assets/weather_symbols/Cloudy.png";
    } else if (data.weather[0].main == "Clear") {
      document.getElementById("weatherIcon").src =
        "assets/weather_symbols/Clear.png";
    } else if (data.weather[0].main == "Rain") {
      document.getElementById("weatherIcon").src =
        "assets/weather_symbols/Rainy.png";
    } else {
      document.getElementById("fetchMessage").innerHTML = "City not found";
    }
  } catch (error) {
    console.log(error);
  }
}

//SHOW WEATHER DATA WHEN FETCHING

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
    getWeatherData(searchBar.value);
  }
});
searchBtn.addEventListener("click", () => {
  defaultPage.style.display = "none";
  dataPage.style.display = "block";

  getWeatherData(searchBar.value);
});
