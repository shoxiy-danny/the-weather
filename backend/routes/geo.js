import express from 'express'
import { fetchCityByCoords, fetchCityByIP } from '../services/geo.js'

const router = express.Router()

// Get city info by coordinates (primary) or IP (fallback)
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query

    // Get client IP for fallback
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
                 || req.headers['x-real-ip']
                 || req.socket.remoteAddress
                 || '127.0.0.1'

    console.log(`[Geo] lat=${lat}, lon=${lon}, ip=${clientIp}`)

    let city

    if (lat && lon) {
      // Primary: use GPS coordinates
      try {
        console.log('[Geo] 使用GPS坐标定位...')
        city = await fetchCityByCoords(lon, lat)
        console.log('[Geo] GPS定位成功:', city)
      } catch (err) {
        // Fallback to IP if coordinates fail
        console.warn('[Geo] GPS定位失败，尝试IP定位:', err.message)
        try {
          city = await fetchCityByIP(clientIp)
          console.log('[Geo] IP定位成功:', city)
        } catch (ipErr) {
          console.error('[Geo] IP定位也失败:', ipErr.message)
          throw ipErr
        }
      }
    } else {
      // No coordinates provided, use IP
      console.log('[Geo] 无坐标，使用IP定位...')
      city = await fetchCityByIP(clientIp)
      console.log('[Geo] IP定位成功:', city)
    }

    res.json(city)
  } catch (error) {
    console.error('[Geo API Error]', error.message)
    res.status(500).json({ error: error.message || '获取位置信息失败' })
  }
})

export default router