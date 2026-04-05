import { useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { CITIES } from './utils/constants'
import WeatherIcon from './components/WeatherIcon'
import CurrentWeather from './components/CurrentWeather'
import HourlyChart from './components/HourlyChart'
import DailyForecast from './components/DailyForecast'
import './App.css'
import './components/CurrentWeather.css'
import './components/HourlyChart.css'
import './components/DailyForecast.css'

function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0])
  const { weatherData, loading, error, retry } = useWeather(selectedCity.id)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">正在获取天气数据...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={retry}>
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="city-selector">
        {CITIES.map(city => (
          <button
            key={city.id}
            className={`city-button ${selectedCity.id === city.id ? 'active' : ''}`}
            onClick={() => setSelectedCity(city)}
          >
            {selectedCity.id === city.id && weatherData?.now && (
              <span className="city-weather-icon">
                <WeatherIcon code={weatherData.now.icon} size={16} />
              </span>
            )}
            <span className="city-name">{city.name}</span>
          </button>
        ))}
      </div>
      <div className="cards-container">
        <CurrentWeather data={weatherData.now} location={selectedCity} />
        <HourlyChart data={weatherData.hourly} />
        <DailyForecast data={weatherData.daily} />
      </div>
    </div>
  )
}

export default App
