import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data', 'weather.db')

let db
let SQL

export async function initDb() {
  SQL = await initSqlJs()

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
    console.log('[Database] SQLite 加载完成:', dbPath)
  } else {
    db = new SQL.Database()
    console.log('[Database] SQLite 创建完成:', dbPath)
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS weather_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id TEXT NOT NULL,
      weather_type TEXT NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(location_id, weather_type)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS visitor_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      total_visits INTEGER DEFAULT 0,
      last_visit TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Initialize stats row if not exists
  const stats = db.exec("SELECT * FROM visitor_stats WHERE id = 1")
  if (stats.length === 0 || stats[0].values.length === 0) {
    db.run("INSERT INTO visitor_stats (id, total_visits) VALUES (1, 0)")
  }

  saveDb()
  return db
}

export function saveDb() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  }
}

export function getDb() {
  return db
}

export function getCachedWeather(locationId, weatherType) {
  const stmt = db.prepare(`
    SELECT data, updated_at FROM weather_cache
    WHERE location_id = ? AND weather_type = ?
  `)
  stmt.bind([locationId, weatherType])

  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()

    // Check if cache is still valid (30 minutes)
    const updatedAt = new Date(row.updated_at)
    const now = new Date()
    const diffMinutes = (now - updatedAt) / (1000 * 60)

    if (diffMinutes > 30) {
      return null // Cache expired
    }

    return JSON.parse(row.data)
  }

  stmt.free()
  return null
}

export function setCachedWeather(locationId, weatherType, data) {
  db.run(`
    INSERT OR REPLACE INTO weather_cache (location_id, weather_type, data, updated_at)
    VALUES (?, ?, ?, datetime('now'))
  `, [locationId, weatherType, JSON.stringify(data)])
  saveDb()
}

export function closeDb() {
  if (db) {
    saveDb()
    db.close()
  }
}

export function incrementVisit() {
  db.run("UPDATE visitor_stats SET total_visits = total_visits + 1, last_visit = datetime('now') WHERE id = 1")
  saveDb()
}

export function getVisitStats() {
  const result = db.exec("SELECT total_visits, last_visit FROM visitor_stats WHERE id = 1")
  if (result.length > 0 && result[0].values.length > 0) {
    return {
      totalVisits: result[0].values[0][0],
      lastVisit: result[0].values[0][1]
    }
  }
  return { totalVisits: 0, lastVisit: null }
}
