import { useState, useEffect, useCallback } from 'react'
import { fetchWeatherData } from '../services/weatherApi'

export function useWeather(locationId) {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadWeather = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeatherData(locationId)
      setWeatherData(data)
    } catch (err) {
      setError(err.message || '获取天气数据失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }, [locationId])

  useEffect(() => {
    loadWeather()
  }, [loadWeather])

  const retry = useCallback(() => {
    loadWeather()
  }, [loadWeather])

  return { weatherData, loading, error, retry }
}
