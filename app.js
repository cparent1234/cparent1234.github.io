async function getWeather() {
    const locationInput = document.getElementById('locationInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const errorDiv = document.getElementById('error');
    
    try {
        // Erst Geocoding für die Koordinaten
        const geocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput.value}&language=de&count=1`
        );
        
        if (!geocodingResponse.ok) {
            throw new Error('Stadt nicht gefunden');
        }
        
        const geocodingData = await geocodingResponse.json();
        
        if (!geocodingData.results || geocodingData.results.length === 0) {
            throw new Error('Stadt nicht gefunden');
        }
        
        const location = geocodingData.results[0];
        
        // Dann Wetterdaten abrufen
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Wetterdaten konnten nicht abgerufen werden');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Wetter-Code in Icon und Beschreibung umwandeln
        const weatherInfo = getWeatherInfo(weatherData.current.weather_code);
        
        weatherInfo.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <div class="weather-icon">${weatherInfo.icon}</div>
            <div class="temperature">${Math.round(weatherData.current.temperature_2m)}°C</div>
            <div>${weatherInfo.description}</div>
            <div>Luftfeuchtigkeit: ${weatherData.current.relative_humidity_2m}%</div>
            <div>Windgeschwindigkeit: ${weatherData.current.wind_speed_10m} m/s</div>
        `;
    }
