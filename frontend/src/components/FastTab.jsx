import React, { useState } from 'react'
import axios from 'axios'
import { Zap, Search } from 'lucide-react'
import SearchResults from './SearchResults'

const API_BASE = 'http://localhost:3000/hybrid'

export default function FastTab() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        if (!query.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(`${API_BASE}/search`, {
                query,
                type: 'hybrid',
                vector_weight: 0.7,
                graph_weight: 0.3,
                top_k: 5
            })
            setResults(response.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    const runDemo = async () => {
        setLoading(true)
        setError(null)

        try {
            // Create demo nodes
            await axios.post(`${API_BASE}/nodes`, {
                id: 'ai_healthcare',
                text: 'AI revolutionizing healthcare diagnostics ML cancer detection',
                metadata: { type: 'healthcare_ai', tags: ['AI', 'healthcare'] }
            })

            await axios.post(`${API_BASE}/nodes`, {
                id: 'cancer_ml',
                text: 'Cancer detection using machine learning algorithms',
                metadata: { type: 'medical_ml', tags: ['ML', 'cancer'] }
            })

            // Create edge
            await axios.post(`${API_BASE}/edges`, {
                source: 'ai_healthcare',
                target: 'cancer_ml',
                type: 'USES',
                weight: 0.9
            })

            // Search
            const response = await axios.post(`${API_BASE}/search`, {
                query: 'AI healthcare cancer diagnostics',
                type: 'hybrid'
            })

            setResults(response.data)
            setQuery('AI healthcare cancer diagnostics')
        } catch (err) {
            setError(err.response?.data?.error || 'Demo failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Quick Demo */}
                <div className="card fade-in">
                    <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={20} />
                        Quick Demo
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Run a demo that creates sample nodes, edges, and performs a hybrid search.
                    </p>
                    <button
                        onClick={runDemo}
                        disabled={loading}
                        className="btn btn-success"
                        style={{ width: '100%' }}
                    >
                        {loading && <span className="spinner" />}
                        Run Hackathon Demo
                    </button>
                </div>

                {/* Search */}
                <div className="card fade-in">
                    <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={20} />
                        Hybrid Search
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Quick search using hybrid mode (70% vector + 30% graph).
                    </p>

                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search for AI, healthcare, machine learning..."
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading && <span className="spinner" />}
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ maxWidth: '800px', margin: '1.5rem auto 0' }}>
                    <div
                        className="card fade-in"
                        style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#991b1b'
                        }}
                    >
                        {error}
                    </div>
                </div>
            )}

            {results && (
                <div style={{ maxWidth: '800px', margin: '1.5rem auto 0' }}>
                    <SearchResults results={results} />
                </div>
            )}
        </div>
    )
}
