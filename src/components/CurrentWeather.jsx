import WeatherIcon from './WeatherIcon'
import { WEATHER_CODES } from '../utils/constants'

export default function CurrentWeather({ data, location }) {
  if (!data) return null

  const temp = Math.round(data.temp)
  const text = WEATHER_CODES[data.text] || data.text

  return (
    <div className="card current-weather">
      <div className="location-name">{location?.name || '未知位置'}</div>
      <div className="weather-main">
        <div className="temp-display">
          <span className="temp-value">{temp}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-info">
          <div className="weather-text">{text}</div>
          <div className="weather-icon">
            <WeatherIcon code={data.icon} size={64} />
          </div>
        </div>
      </div>
    </div>
  )
}
