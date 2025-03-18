import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [theme, setTheme] = useState('light'); // Light or Dark theme

  const apiKey = '378815204170cca227dca0d9ee8905d6';

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: apiKey,
          units: unit,
        },
      });
      setWeatherData(weatherResponse.data);

      // Fetch forecast (next 5 days)
      const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: city,
          appid: apiKey,
          units: unit,
        },
      });
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError('City not found or invalid API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className={`App ${theme}`}>
      <div className="overlay">
        <h1 className="title">Weather App</h1>

        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-btn">
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="search-input"
            required
          />
          <button type="submit" className="search-btn">Get Weather</button>
        </form>

        <div className="unit-toggle">
          <button onClick={toggleUnit} className="unit-btn">
            {unit === 'metric' ? '°C' : '°F'}
          </button>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <p className="description">{weatherData.weather[0].description}</p>
            <p className="temperature">
              {weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}
            </p>
            <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
            <p className="wind-speed">Wind Speed: {weatherData.wind.speed} m/s</p>
            <div className="weather-icon">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                alt="weather icon"
                className="icon-animation"
              />
            </div>
          </div>
        )}

        {forecastData && (
          <div className="forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-cards">
              {forecastData.list.slice(0, 5).map((forecast) => (
                <div key={forecast.dt} className="forecast-card">
                  <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                    alt="forecast icon"
                    className="icon-animation"
                  />
                  <p>{forecast.weather[0].description}</p>
                  <p>
                    {forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
