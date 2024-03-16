function toggleAboutContent() {
  var aboutContent = document.getElementById("aboutContent");
  if (aboutContent.style.display === "none") {
    aboutContent.style.display = "block";
  } else {
    aboutContent.style.display = "none";
  }
}

async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const countriesList = document.getElementById("countriesList");
    const errorMessage = document.getElementById("errorMessage");

    function createCountryCard(country) {
      const countryCard = document.createElement("div");
      countryCard.classList.add("country-card");

      const img = document.createElement("img");
      img.src = `https://source.unsplash.com/300x150/?${country.name.common}`;
      img.alt = country.name.common;
      countryCard.appendChild(img);

      const countryInfo = document.createElement("div");
      countryInfo.innerHTML = `
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${
          country.capital ? country.capital[0] : "N/A"
        }</p>
        <p><strong>Population:</strong> ${
          country.population ? country.population.toLocaleString() : "N/A"
        }</p>
        <p><strong>Region:</strong> ${
          country.region ? country.region : "N/A"
        }</p>
      `;

      const moreInfoButton = document.createElement("button");
      moreInfoButton.textContent = "More Information";
      moreInfoButton.addEventListener("click", () => openModal(country));
      countryInfo.appendChild(moreInfoButton);

      countryCard.appendChild(countryInfo);

      return countryCard;
    }

    function displayAllCountries() {
      const countriesList = document.getElementById("countriesList");
      const closeAllBtn = document.getElementById("closeAllCountriesBtn");

      countriesList.innerHTML = "";

      data.forEach((country) => {
        const countryCard = createCountryCard(country);
        countriesList.appendChild(countryCard);
      });

      document.getElementById("showAllCountriesBtn").style.display = "none";
      closeAllBtn.style.display = "block";
    }

    function closeAllCountries() {
      const countriesList = document.getElementById("countriesList");
      countriesList.innerHTML = "";
      document.getElementById("closeAllCountriesBtn").style.display = "none";
      document.getElementById("showAllCountriesBtn").style.display = "block";
    }

    function searchCountry() {
      const searchInput = document
        .getElementById("countrySearchInput")
        .value.trim();

      if (searchInput === "") {
        errorMessage.textContent = "Please insert a country";
        return;
      }

      errorMessage.textContent = "";

      const filteredCountries = data.filter((country) =>
        country.name.common.toLowerCase().includes(searchInput.toLowerCase())
      );

      countriesList.innerHTML = "";

      if (filteredCountries.length > 0) {
        filteredCountries.forEach((country) => {
          const countryCard = createCountryCard(country);
          countriesList.appendChild(countryCard);
        });
      } else {
        const noResults = document.createElement("p");
        noResults.textContent = "No results found for your search.";
        countriesList.appendChild(noResults);
      }
    }

    document
      .getElementById("showAllCountriesBtn")
      .addEventListener("click", displayAllCountries);

    window.searchCountry = searchCountry;
  } catch (error) {
    console.error("An error occurred:", error);
  }
  window.closeAllCountries = closeAllCountries;
}

document
  .getElementById("countrySearchInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchCountry();
    }
  });

document
  .getElementById("searchInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });

window.onload = getCountries;

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
}).addTo(map);

function openModal(country) {
  const modal = document.getElementById("myModal");
  const modalCountryName = document.getElementById("modalCountryName");
  const modalCountryInfo = document.getElementById("modalCountryInfo");
  const modalFlagImage = document.getElementById("modalFlagImage");
  const modalOtherImages = document.getElementById("modalOtherImages");

  modal.style.display = "block";

  map.invalidateSize();

  modalCountryName.textContent = country.name.common;

  modalCountryInfo.innerHTML = `
      <p><strong>Capital:</strong> ${
        country.capital ? country.capital[0] : "N/A"
      }</p>
      <p><strong>Population:</strong> ${
        country.population ? country.population.toLocaleString() : "N/A"
      }</p>
      <p><strong>Region:</strong> ${country.region ? country.region : "N/A"}</p>
      <p><strong>Area:</strong> ${
        country.area ? country.area.toLocaleString() : "N/A"
      }</p>
      <p><strong>Currency:</strong> ${
        country.currencies ? Object.values(country.currencies)[0].name : "N/A"
      }</p>
      <p><strong>Languages:</strong> ${
        country.languages ? Object.values(country.languages).join(", ") : "N/A"
      }</p>
      <p><strong>Timezones:</strong> ${
        country.timezones ? country.timezones.join(", ") : "N/A"
      }</p>
      <p><strong>Wikipedia:</strong> <a href="https://en.wikipedia.org/wiki/${
        country.name.common
      }" target="_blank">Link to Wikipedia</a></p>
      <p><strong>Videos:</strong> <a href="https://www.youtube.com/results?search_query=${
        country.name.common
      }" target="_blank">Link to videos</a></p>
  `;

  const flagUrl = country.flags.svg;
  modalFlagImage.innerHTML = `<img src="${flagUrl}" alt="${country.name.common} Flag" style="width: 150px; height: 100px; object-fit: cover;">`;

  modalOtherImages.innerHTML = "";

  modalOtherImages.innerHTML = `
      <h3>Other Images</h3>
      <div>
          <img src="https://source.unsplash.com/300x150/?${country.name.common} 1" alt="Image 1">
          <img src="https://source.unsplash.com/300x150/?${country.name.common} 2" alt="Image 2">
          <img src="https://source.unsplash.com/300x150/?${country.name.common} 3" alt="Image 3">
      </div>
  `;

  const latitude = country.latlng[0];
  const longitude = country.latlng[1];

  const latDMS = convertToDMS(latitude);
  const lngDMS = convertToDMS(longitude);

  const marker = L.marker([latitude, longitude]).addTo(map);
  marker
    .bindPopup(
      `<b>${country.name.common}</b><br>Latitude: ${latDMS}<br>Longitude: ${lngDMS}`
    )
    .openPopup();

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
    map.removeLayer(marker);
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      map.removeLayer(marker);
    }
  };
}

function convertToDMS(coord) {
  const absCoord = Math.abs(coord);
  const degrees = Math.floor(absCoord);
  const minutes = Math.floor((absCoord - degrees) * 60);
  const seconds = ((absCoord - degrees - minutes / 60) * 3600).toFixed(2);

  const direction = coord >= 0 ? "N" : "S";

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}
function getWeather() {
  const openWeatherMapApiKey = "0f1beca9f37b4ce28fc226fda69d801c";
  const unsplashApiKey = "LFSMFmKfvrG2DnHbq-D8nFUToqEh_mzYlhUAmZKNIJc";
  const searchInput = document.getElementById("searchInput").value.trim();
  const weatherInfo = document.getElementById("weatherInfo");
  const imageContainer = document.getElementById("imageContainer");

  if (searchInput === "") {
    weatherInfo.innerHTML =
      '<p class="error-message">Please enter a city or country.</p>';
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${openWeatherMapApiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      weatherInfo.innerHTML = "";

      const cityName = weatherData.city.name;
      const dailyForecasts = {};

      fetch(
        `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashApiKey}`
      )
        .then((response) => response.json())
        .then((imageData) => {
          if (imageData.results.length > 0) {
            const imageUrl = imageData.results[0].urls.regular;

            const cityImage = document.createElement("img");
            cityImage.src = imageUrl;
            cityImage.alt = cityName;
            cityImage.classList.add("city-image");
            cityImage.style.width = "100%";
            cityImage.style.height = "auto";
            cityImage.style.marginTop = "20px";
            imageContainer.innerHTML = "";
            imageContainer.appendChild(cityImage);

            const cityNameElement = document.createElement("h2");
            cityNameElement.textContent = cityName;
            imageContainer.appendChild(cityNameElement);
          }
        })
        .catch((error) => {
          console.error("Error fetching image data:", error);
        });

      weatherData.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });

        if (!dailyForecasts[day]) {
          dailyForecasts[day] = [];
        }

        dailyForecasts[day].push({
          temperature: forecast.main.temp,
          weatherDescription: forecast.weather[0].description,
          weatherIcon: forecast.weather[0].icon,
        });
      });

      for (const day in dailyForecasts) {
        const forecastContainer = document.createElement("div");
        forecastContainer.classList.add("forecast-item");

        const forecastData = dailyForecasts[day];
        const averageTemperature =
          forecastData.reduce(
            (total, forecast) => total + forecast.temperature,
            0
          ) / forecastData.length;
        const averageTemperatureRounded = Math.round(averageTemperature); // Rotunjește temperatura
        const weatherDescription =
          getMostCommonWeatherDescription(forecastData);
        const weatherIcon = getMostCommonWeatherIcon(forecastData);

        forecastContainer.innerHTML = `
                  <h3>${day}</h3>
                  <p><h4>Average Temperature: ${averageTemperatureRounded.toFixed(
                    0
                  )}°C</h4></p>
                  <p><h4>Weather: ${weatherDescription}</h4></p>
                  <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}" style="max-width: 100%; max-height: 50px;">
              `;

        weatherInfo.appendChild(forecastContainer);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      weatherInfo.innerHTML = "<p>No results found for your search.</p>";
    });
}
function getMostCommonWeatherDescription(forecastData) {
  const counts = {};
  forecastData.forEach((forecast) => {
    counts[forecast.weatherDescription] =
      (counts[forecast.weatherDescription] || 0) + 1;
  });
  const mostCommonWeatherDescription = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );
  return mostCommonWeatherDescription;
}

function getMostCommonWeatherIcon(forecastData) {
  const counts = {};
  forecastData.forEach((forecast) => {
    counts[forecast.weatherIcon] = (counts[forecast.weatherIcon] || 0) + 1;
  });
  const mostCommonWeatherIcon = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );
  return mostCommonWeatherIcon;
}

const moveBackground = () => {
  gsap.to(".weather-container", {
    backgroundPositionX: "100%",
    duration: 30,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
};
moveBackground();

const img = new Image();

img.src =
  "https://upload.wikimedia.org/wikipedia/commons/8/83/Capitan_Meadows%2C_Yosemite_National_Park.jpg";
const canvasXSize = 1000;
const canvasYSize = 100;
const speed = 30;
const scale = 1.05;
const y = -4.5;

const dx = 0.75;
let imgW;
let imgH;
let x = 0;
let clearX;
let clearY;
let ctx;

img.onload = () => {
  imgW = img.width * scale;
  imgH = img.height * scale;

  if (imgW > canvasXSize) {
    x = canvasXSize - imgW;
  }

  clearX = Math.max(imgW, canvasXSize);
  clearY = Math.max(imgH, canvasYSize);

  ctx = document.getElementById("canvas").getContext("2d");

  return setInterval(draw, speed);
};

function draw() {
  ctx.clearRect(0, 0, clearX, clearY);

  if (imgW <= canvasXSize) {
    if (x > canvasXSize) {
      x = -imgW + x;
    }

    if (x > 0) {
      ctx.drawImage(img, -imgW + x, y, imgW, imgH);
    }

    if (x - imgW > 0) {
      ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
    }
  } else {
    if (x > canvasXSize) {
      x = canvasXSize - imgW;
    }

    if (x > canvasXSize - imgW) {
      ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
    }
  }

  ctx.drawImage(img, x, y, imgW, imgH);

  x += dx;
}
