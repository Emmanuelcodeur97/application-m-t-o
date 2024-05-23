document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = `95cd1d722caaf2ebc328c51db1d1f7fb`;  // Remplacez par votre clé API OpenWeatherMap

    // Récupérer les données météo actuelles
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon, apiKey, data.sys.country);
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Impossible de récupérer les données météorologiques.');
        });
});

function displayCurrentWeather(data) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Température: ${data.main.temp}°C</p>
        <p>Météo: ${data.weather[0].description}</p>
    `;
}

function fetchForecast(lat, lon, apiKey, country) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
            displayChart(data, country);
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Impossible de récupérer les prévisions météorologiques.');
        });
}

function displayForecast(data) {
    const forecastResult = document.getElementById('forecast-result');
    const tomorrow = data.list.find(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        return forecastDate.getDate() === new Date().getDate() + 1;
    });

    if (tomorrow) {
        forecastResult.innerHTML = `
            <h3>Prévisions pour demain</h3>
            <p>Température: ${tomorrow.main.temp}°C</p>
            <p>Météo: ${tomorrow.weather[0].description}</p>
        `;
    } else {
        forecastResult.innerHTML = `<p>Aucune prévision disponible pour demain.</p>`;
    }
}

function displayChart(data, country) {
    const colors = {
        'FR': 'blue',
        'US': 'red',
        'JP': 'green',
        // Ajoutez plus de pays et leurs couleurs ici
    };

    const chartColor = colors[country] || 'gray';

    const labels = [];
    const temps = [];

    data.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        if (forecastDate.getDate() === new Date().getDate() + 1) {
            labels.push(`${forecastDate.getHours()}:00`);
            temps.push(forecast.main.temp);
        }
    });

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Température (°C)',
                data: temps,
                backgroundColor: chartColor,
                borderColor: chartColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
