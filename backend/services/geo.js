const GEOAPI_HOST = process.env.QWEATHER_GEO_HOST || 'https://geoapi.qweather.com/v2'
const API_KEY = process.env.QWEATHER_API_KEY || '64fbd9897cb342ec9f787fb054c68936'

// Reverse geocode: coordinates to city info using Qweather Geo API
export async function fetchCityByCoords(longitude, latitude) {
  const location = `${longitude},${latitude}`
  const res = await fetch(`${GEOAPI_HOST}/city/lookup?location=${location}&key=${API_KEY}&number=1`)

  if (!res.ok) {
    throw new Error('地理编码服务请求失败')
  }

  const data = await res.json()

  if (data.code !== '200' || !data.location || data.location.length === 0) {
    throw new Error(data.msg || '未找到对应城市')
  }

  const city = data.location[0]
  return {
    id: city.id,
    name: city.name,
    adm2: city.adm2,
    adm1: city.adm1,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }
}

// IP-based geolocation using ipinfo.io
export async function fetchCityByIP(ip) {
  const cleanIp = ip.replace(/^::ffff:/, '')
  const res = await fetch(`https://ipinfo.io/${cleanIp}?fields=city,region,country,loc`)

  if (!res.ok) {
    throw new Error('IP定位服务请求失败')
  }

  const data = await res.json()

  if (!data.city || !data.loc) {
    throw new Error('IP定位失败，请手动选择城市')
  }

  const [lat, lon] = data.loc.split(',')

  return {
    name: data.city,
    adm2: data.city,
    adm1: data.region,
    country: data.country,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  }
}