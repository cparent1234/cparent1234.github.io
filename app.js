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
function getWeatherInfo(code) {
    const weatherCodes = {
        0: { icon: '☀️', description: 'Klar' },
        1: { icon: '🌤️', description: 'Überwiegend klar' },
        2: { icon: '⛅', description: 'Teilweise bewölkt' },
        3: { icon: '☁️', description: 'Bewölkt' },
        45: { icon: '🌫️', description: 'Neblig' },
        48: { icon: '🌫️', description: 'Nebel mit Reifbildung' },
        51: { icon: '🌧️', description: 'Leichter Nieselregen' },
        53: { icon: '🌧️', description: 'Nieselregen' },
        55: { icon: '🌧️', description: 'Starker Nieselregen' },
        61: { icon: '🌧️', description: 'Leichter Regen' },
        63: { icon: '🌧️', description: 'Regen' },
        65: { icon: '🌧️', description: 'Starker Regen' },
        71: { icon: '🌨️', description: 'Leichter Schneefall' },
        73: { icon: '🌨️', description: 'Schneefall' },
        75: { icon: '🌨️', description: 'Starker Schneefall' },
        77: { icon: '🌨️', description: 'Schneegriesel' },
        80: { icon: '🌦️', description: 'Leichte Regenschauer' },
        81: { icon: '🌦️', description: 'Regenschauer' },
        82: { icon: '🌦️', description: 'Starke Regenschauer' },
        95: { icon: '⛈️', description: 'Gewitter' }
    };
    return weatherCodes[code] || { icon: '❓', description: 'Unbekannt' };
        errorDiv.textContent = '';
    } catch (error) {
        errorDiv.textContent = error.message;
        weatherInfo.innerHTML = '';
    }
}
