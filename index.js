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
    var data = await response.json();

    //WEATHER LOCATION, TEMPERATURE AND TIME
    document.getElementById("location").innerHTML = data.name; //LOCATION
    document.getElementById("temperature").innerHTML = data.main.temp + "°C"; //TEMPERATURE
    document.getElementById("currentTime").innerHTML = data.timezone; //TIME
    //WEATHER ICON AND BACKGROUND
    let icon = document.getElementById("weatherIcon");
    let weatherBackground = document.getElementById("background");

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
      document.getElementById("fetchMessage").innerHTML = "City not found";
    }

    //WEATHER INFORMATION (HUMIDITY, PRESSURE, SEA LEVEL)
    document.getElementById("humid").innerHTML = data.main.humidity + "%";
    document.getElementById("pressure").innerHTML = data.main.pressure + " hPa";
    document.getElementById("seaLvl").innerHTML = data.main.sea_level + " hPa";

    console.log(data);
  } catch (error) {
    alert(error);
    console.log(`${data.weather[0].main}`);
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
