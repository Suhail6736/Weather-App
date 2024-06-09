const searchBtn = document.querySelector('.searchBtn');
const cityNameInput = document.querySelector('.citySearch');
const apiKey = 'b8e6343adb114d2c88af0939f6b1a6c4';
const WeatherDegree = document.querySelector('.weatherInput');
const locationData = document.querySelector('.location-data');
const weatherPallete = document.querySelector('.weather-pallete');
const weatherUL = document.querySelector('.weather-ul');



// Function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  return `${day} ${month}`;
}

// Toggle dark theme
const icon = document.getElementById('icon');
icon.onclick = function () {
  document.body.classList.toggle('dark-theme');
  icon.src = document.body.classList.contains('dark-theme') ? 'icon/sun.png' : 'icon/moon.png';
};

// Show weather container
const gettingStartedBtn = document.querySelector('.getting-started-btn');
gettingStartedBtn.addEventListener('click', function () {
  document.querySelector('.frontpage').classList.add('active');
  document.querySelector('.weather-container').classList.add('active');
});

// Function to create a weather card
function createWeatherCard(cityName, weatherItem, index) {
  const temp = (weatherItem.main.temp - 273.15).toFixed(2);
  const date = formatDate(weatherItem.dt_txt);
  const iconUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png`;
  const iconOverlayUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;

  if (index === 0) {
    return `
      <div class="location-data">
        <div class="location-content">
          <i class='bx bxs-map'></i>
          <h3>${cityName}</h3>
        </div>
        <p>${date}</p>
      </div>
      <div class="weather-Degree">
        <h1>${temp}°</h1>
        <img src="${iconUrl}" alt="weather-Degree-image" class="weather-Degree-img">
        <h2>${weatherItem.weather[0].description}</h2>
      </div>
      <div class="weather-pallete">
        <div class="pallete-data">
          <i class='bx bx-water'></i>
          <small>${weatherItem.main.pressure} M/B</small>
          <span>Pressure</span>
        </div>
        <div class="pallete-data">
          <i class='bx bxs-droplet-half'></i>
          <small>${weatherItem.main.humidity}%</small>
          <span>Humidity</span>
        </div>
        <div class="pallete-data">
          <i class='bx bx-wind'></i>
          <small>${weatherItem.wind.speed} M/S</small>
          <span>Wind Speed</span>
        </div>
      </div>
    `;
  } else {
    return `
      <li class="swiper-slide weather-data">
        <span>${date}</span>
        <img src="${iconOverlayUrl}" alt="forecast-image" class="forecast-img">
        <div class="icon-overlay"></div>
        <small>${temp}°</small>
      </li>
    `;
  }
}

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
