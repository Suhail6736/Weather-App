// Function to get weather details
function gettingWeatherDetails(cityWeather, lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(weatherApiUrl)
    .then(res => res.json())
    .then(data => {
      const forecastDays = [];
      const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!forecastDays.includes(forecastDate)) {
          return forecastDays.push(forecastDate);
        }
      });

      // Clear previous data
      cityNameInput.value = "";
      WeatherDegree.innerHTML = "";
      locationData.innerHTML = "";
      weatherPallete.innerHTML = "";
      weatherUL.innerHTML = "";

      // Insert new data
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          WeatherDegree.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
        } else {
          weatherUL.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
        }
      });
    })
    .catch(() => {
      alert('Error occurred while fetching the coordinates of weather');
    });
}

// Search button functionality
searchBtn.addEventListener('click', function () {
  const cityName = cityNameInput.value.trim();
  if (cityName === "") {
    alert("Please enter the city name");
    return;
  }

  const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(geocodingApiUrl)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        return alert(`${cityName} isn't a valid city name`);
      }

      const { name, lat, lon } = data[0];
      gettingWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("Error occurred while fetching the coordinates");
    });
});
