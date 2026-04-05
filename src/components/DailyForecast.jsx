import WeatherIcon from './WeatherIcon'

export default function DailyForecast({ data }) {
  if (!data || !Array.isArray(data)) return null

  const getDayName = (dateStr, index) => {
    if (index === 0) return '昨天'
    if (index === 1) return '今天'
    if (index === 2) return '明天'

    const date = new Date(dateStr)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekdays[date.getDay()]
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  return (
    <div className="card daily-forecast">
      <div className="card-title">下周预报</div>
      <div className="forecast-list">
        {data.map((day, index) => (
          <div key={day.fxDate} className="forecast-item">
            <div className="forecast-date">
              <span className="day-name">{getDayName(day.fxDate, index)}</span>
              <span className="date-str">{formatDate(day.fxDate)}</span>
            </div>
            <div className="forecast-icon">
              <WeatherIcon code={day.iconDay} size={32} />
              <span className="forecast-text">{day.textDay}</span>
            </div>
            <div className="forecast-temps">
              <span className={`temp-min ${Math.round(day.tempMin) < 10 ? 'cold' : ''}`}>{Math.round(day.tempMin)}°</span>
              <span className={`temp-max ${Math.round(day.tempMax) > 20 ? 'hot' : ''}`}>{Math.round(day.tempMax)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
