import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { config } from 'dotenv'
import VectorDB from './src/databases/vectordb.js'
import { setupVectorRoutes } from './src/routes/vector.js'

config()

const app = express()
const PORT = process.env.PORT || 3000
const DB_PATH = process.env.DB_PATH || '/tmp/hackathon.lancedb'

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

let vectorDB

async function initializeServer() {
  try {
    console.log('🚀 Initializing server...')
    vectorDB = new VectorDB(DB_PATH)
    await vectorDB.initialize()
    await vectorDB.ensureTable('documents')
    
    setupVectorRoutes(app, vectorDB)
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
      console.log(`📊 Vector DB path: ${DB_PATH}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

initializeServer()
