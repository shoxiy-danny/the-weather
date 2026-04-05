import express from 'express'
import { fetchAllWeather } from '../services/qweather.js'
import { getCachedWeather, setCachedWeather, incrementVisit, getVisitStats } from '../database.js'

const router = express.Router()

// Get all weather data for a location
router.get('/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params

    // Increment visit counter
    incrementVisit()

    // Check cache first
    const cached = getCachedWeather(locationId, 'all')
    if (cached) {
      console.log(`[Weather] ${locationId} - 从缓存获取`)
      return res.json(cached)
    }

    // Fetch from API
    console.log(`[Weather] ${locationId} - 从 API 获取`)
    const data = await fetchAllWeather(locationId)

    // Save to cache
    setCachedWeather(locationId, 'all', data)

    res.json(data)
  } catch (error) {
    console.error('[Weather API Error]', error.message)
    res.status(500).json({ error: error.message || '获取天气数据失败' })
  }
})

// Get available cities (hardcoded for now)
router.get('/cities/list', (req, res) => {
  res.json([
    { id: '101020900', name: '上海' },
    { id: '101010100', name: '北京' },
    { id: '101280101', name: '广州' },
    { id: '101280601', name: '深圳' },
  ])
})

// Get visitor stats
router.get('/stats/visits', (req, res) => {
  const stats = getVisitStats()
  res.json({
    totalVisits: stats.totalVisits,
    lastVisit: stats.lastVisit
  })
})

export default router
