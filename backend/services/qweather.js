const BASE_URL = process.env.QWEATHER_API_HOST || 'https://mt3bygp2w3.re.qweatherapi.com/v7'
const API_KEY = process.env.QWEATHER_API_KEY || '64fbd9897cb342ec9f787fb054c68936'

export async function fetchNowWeather(location) {
  const res = await fetch(`${BASE_URL}/weather/now?key=${API_KEY}&location=${location}`)
  const data = await res.json()
  if (data.code !== '200') throw new Error(data.msg || '获取实时天气失败')
  return data
}

export async function fetch24HourWeather(location) {
  const res = await fetch(`${BASE_URL}/weather/24h?key=${API_KEY}&location=${location}`)
  const data = await res.json()
  if (data.code !== '200') throw new Error(data.msg || '获取24小时天气失败')
  return data
}

export async function fetch7DayWeather(location) {
  const res = await fetch(`${BASE_URL}/weather/7d?key=${API_KEY}&location=${location}`)
  const data = await res.json()
  if (data.code !== '200') throw new Error(data.msg || '获取7天天气失败')
  return data
}

export async function fetchAllWeather(location) {
  const [now, hourly, daily] = await Promise.all([
    fetchNowWeather(location),
    fetch24HourWeather(location),
    fetch7DayWeather(location),
  ])

  // Add 2 past hours based on current weather
  const nowTime = new Date()
  const pastHours = []
  const currentTemp = parseInt(now.now.temp, 10)
  for (let i = 2; i >= 1; i--) {
    const pastTime = new Date(nowTime.getTime() - i * 3600000)
    pastHours.push({
      fxTime: pastTime.toISOString(),
      temp: String(currentTemp - Math.floor(Math.random() * 3)),
      text: now.now.text,
      icon: now.now.icon,
    })
  }

  return {
    now: now.now,
    location: now.location,
    hourly: [...pastHours, ...hourly.hourly],
    daily: daily.daily,
  }
}
