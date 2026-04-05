const API_BASE = 'http://localhost:3001/api'

export async function fetchWeatherData(locationId) {
  const res = await fetch(`${API_BASE}/weather/${locationId}`)
  if (!res.ok) throw new Error('获取天气数据失败')
  return res.json()
}
