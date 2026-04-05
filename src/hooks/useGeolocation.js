import { useState, useCallback } from 'react'

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('您的浏览器不支持定位功能'))
        return
      }

      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords

            // Call backend to reverse geocode
            const res = await fetch(`/api/geo/reverse?lat=${latitude}&lon=${longitude}`)
            if (!res.ok) {
              const data = await res.json()
              throw new Error(data.error || '获取城市信息失败')
            }

            const city = await res.json()
            setLoading(false)
            resolve(city)
          } catch (err) {
            setLoading(false)
            setError(err.message)
            reject(err)
          }
        },
        (err) => {
          setLoading(false)
          let message = '定位失败'
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message = '请允许定位权限'
              break
            case err.POSITION_UNAVAILABLE:
              message = '无法获取位置信息'
              break
            case err.TIMEOUT:
              message = '定位请求超时'
              break
          }
          setError(message)
          reject(new Error(message))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache position for 5 minutes
        }
      )
    })
  }, [])

  return { getLocation, loading, error }
}