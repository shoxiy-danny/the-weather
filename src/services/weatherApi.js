export async function fetchWeatherData(locationId) {
  const res = await fetch(`/api/weather/${locationId}`)
  if (!res.ok) throw new Error('获取天气数据失败')
  return res.json()
}
