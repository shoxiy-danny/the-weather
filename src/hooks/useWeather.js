import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWeatherData } from '../services/weatherApi'

export function useWeather(locationId) {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const loadWeather = useCallback(async () => {
    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeatherData(locationId)
      setWeatherData(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || '获取天气数据失败，请检查网络连接')
      }
    } finally {
      setLoading(false)
    }
  }, [locationId])

  useEffect(() => {
    loadWeather()
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [loadWeather])

  const retry = useCallback(() => {
    loadWeather()
  }, [loadWeather])

  return { weatherData, loading, error, retry }
}
