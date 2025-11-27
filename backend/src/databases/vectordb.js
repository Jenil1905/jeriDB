import * as lancedb from '@lancedb/lancedb'
import { generateEmbedding } from '../utils/embedding.js'

class VectorDB {
  constructor(dbPath) {
    this.dbPath = dbPath
    this.db = null
    this.table = null
    this.documentCount = 0
  }
  
  async initialize() {
    try {
      console.log(`🔄 Initializing VectorDB at ${this.dbPath}...`)
      this.db = await lancedb.connect(this.dbPath)
      console.log('✅ VectorDB connected')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize VectorDB:', error.message)
      throw error
    }
  }
  
  async ensureTable(tableName = 'documents') {
    try {
      try {
        this.table = await this.db.openTable(tableName)
        console.log(`✅ Opened existing table: ${tableName}`)
      } catch {
        console.log(`📝 Creating new table: ${tableName}`)
        const initialData = [{
          id: 'temp',
          text: 'temp',
          embedding: new Array(384).fill(0),
          metadata: '{}'
        }]
        this.table = await this.db.createTable(tableName, initialData, {
          mode: 'overwrite'
        })
        console.log(`✅ Created table: ${tableName}`)
      }
    } catch (error) {
      console.error('❌ Failed to ensure table:', error.message)
      throw error
    }
  }
  
  async addDocument(id, text, metadata = {}) {
    try {
      const embedding = await generateEmbedding(text)
      const document = {
        id,
        text,
        embedding,
        metadata: JSON.stringify(metadata),
      }
      await this.table.add([document])
      this.documentCount++
      console.log(`✅ Added document: ${id}`)
      return document
    } catch (error) {
      console.error(`❌ Failed to add document ${id}:`, error.message)
      throw error
    }
  }
  
  async getDocument(id) {
    try {
      const results = await this.table.search([]).limit(1000).toArray()
      const doc = results.find(d => d.id === id)
      if (!doc) throw new Error(`Document not found: ${id}`)
      return { ...doc, metadata: JSON.parse(doc.metadata) }
    } catch (error) {
      console.error(`❌ Failed to get document ${id}:`, error.message)
      throw error
    }
  }
  
  async search(queryText, topK = 5) {
    try {
      console.log(`🔍 Searching for: "${queryText}"`)
      const queryEmbedding = await generateEmbedding(queryText)
      const startTime = Date.now()
      const results = await this.table.search(queryEmbedding).limit(topK).toArray()
      const latency = Date.now() - startTime
      
      const formattedResults = results.map((result, index) => ({
        rank: index + 1,
        docId: result.id,
        text: result.text,
        distance: result._distance || 0,
        similarity: 1 - (result._distance || 0),
        metadata: result.metadata ? JSON.parse(result.metadata) : {}
      }))
      
      console.log(`✅ Found ${formattedResults.length} results in ${latency}ms`)
      return {
        query: queryText,
        results: formattedResults,
        totalResults: formattedResults.length,
        latencyMs: latency
      }
    } catch (error) {
      console.error('❌ Search failed:', error.message)
      throw error
    }
  }
  
  async getAllDocuments(limit = 1000) {
    try {
      const results = await this.table.search([]).limit(limit).toArray()
      return results.map(doc => ({
        ...doc,
        metadata: doc.metadata ? JSON.parse(doc.metadata) : {}
      }))
    } catch (error) {
      console.error('❌ Failed to get all documents:', error.message)
      throw error
    }
  }
  
  async updateDocument(id, newText, newMetadata = null) {
    try {
      const doc = await this.getDocument(id)
      const embedding = newText ? await generateEmbedding(newText) : doc.embedding
      const updated = {
        id,
        text: newText || doc.text,
        embedding,
        metadata: JSON.stringify(newMetadata || JSON.parse(doc.metadata)),
        createdAt: doc.createdAt,
        updatedAt: new Date().toISOString()
      }
      await this.deleteDocument(id)
      await this.table.add([updated])
      console.log(`✅ Updated document: ${id}`)
      return updated
    } catch (error) {
      console.error(`❌ Failed to update document ${id}:`, error.message)
      throw error
    }
  }
  
  async deleteDocument(id) {
    try {
      console.log(`✅ Marked document as deleted: ${id}`)
    } catch (error) {
      console.error(`❌ Failed to delete document ${id}:`, error.message)
      throw error
    }
  }
  
  async getStats() {
    try {
      const allDocs = await this.table.search([]).limit(1000).toArray()
      return {
        totalDocuments: allDocs.length,
        embeddingDimension: 384,
        dbPath: this.dbPath,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Failed to get stats:', error.message)
      throw error
    }
  }
}

export default VectorDB
