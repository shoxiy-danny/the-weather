import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb, closeDb } from './database.js'
import weatherRoutes from './routes/weather.js'
import geoRoutes from './routes/geo.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database and start server
async function start() {
  try {
    await initDb()

    // Routes
    app.use('/api/weather', weatherRoutes)
    app.use('/api/geo', geoRoutes)

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    // Error handling
    app.use((err, req, res, next) => {
      console.error('[Server Error]', err.message)
      res.status(500).json({ error: '服务器内部错误' })
    })

    app.listen(PORT, () => {
      console.log(`[Server] 后端服务运行在 http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('[Server] 启动失败:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] 关闭中...')
  closeDb()
  process.exit(0)
})

start()
