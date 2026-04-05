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

    let city

    if (lat && lon) {
      // Primary: use GPS coordinates
      try {
        city = await fetchCityByCoords(lon, lat)
      } catch (err) {
        // Fallback to IP if coordinates fail
        console.warn('[Geo] 坐标定位失败，尝试IP定位:', err.message)
        city = await fetchCityByIP(clientIp)
      }
    } else {
      // No coordinates provided, use IP
      city = await fetchCityByIP(clientIp)
    }

    res.json(city)
  } catch (error) {
    console.error('[Geo API Error]', error.message)
    res.status(500).json({ error: error.message || '获取位置信息失败' })
  }
})

export default router