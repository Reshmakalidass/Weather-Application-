let unit = "metric";

function setUnit(selectedUnit) {
  unit = selectedUnit;
}

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");

  weatherDiv.innerHTML = "Loading...";
  forecastDiv.innerHTML = "";

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      weatherDiv.innerHTML = "City not found!";
      return;
    }

    weatherDiv.innerHTML = `
      <h3>${currentData.name}</h3>
      <p>${currentData.weather[0].description}</p>
      <p>🌡️ ${currentData.main.temp}°</p>
    `;

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    const forecastData = await forecastRes.json();

    forecastData.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .forEach(day => {
        const date = new Date(day.dt_txt).toDateString();
        forecastDiv.innerHTML += `
          <div class="forecast-item">
            <strong>${date}</strong>
            <p>${day.weather[0].description}</p>
            <p>${day.main.temp}°</p>
          </div>
        `;
      });

  } catch (error) {
    weatherDiv.innerHTML = "Error fetching data";
  }
}
