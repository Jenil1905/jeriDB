import React, { useState } from 'react'
import axios from 'axios'
import { BarChart3, Database, RefreshCw } from 'lucide-react'

const API_BASE = 'http://localhost:3000/hybrid'

export default function HistoryTab() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(`${API_BASE}/stats`)
            setStats(response.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch stats')
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchStats()
    }, [])

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="card fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <BarChart3 size={24} />
                        Database Statistics
                    </h2>
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="btn btn-secondary"
                    >
                        <RefreshCw size={16} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div
                        className="fade-in"
                        style={{
                            padding: '1rem',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius-md)',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem'
                        }}
                    >
                        {error}
                    </div>
                )}

                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {/* Vector DB Stats */}
                        <div
                            className="fade-in"
                            style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'white',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Database size={28} />
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Vector DB</h3>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {stats.vector.totalDocuments}
                            </div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                Documents
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.8 }}>
                                LanceDB
                            </div>
                        </div>

                        {/* Graph DB - Nodes */}
                        <div
                            className="fade-in"
                            style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'white',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Database size={28} />
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Graph Nodes</h3>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {stats.graph.totalNodes}
                            </div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                Nodes
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.8 }}>
                                Neo4j
                            </div>
                        </div>

                        {/* Graph DB - Edges */}
                        <div
                            className="fade-in"
                            style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'white',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Database size={28} />
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Graph Edges</h3>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {stats.graph.totalEdges}
                            </div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                Relationships
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.8 }}>
                                Neo4j
                            </div>
                        </div>
                    </div>
                )}

                {!stats && !loading && !error && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                        <Database size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>Click refresh to load statistics</p>
                    </div>
                )}
            </div>

            {/* System Health */}
            {stats && (
                <div className="card fade-in" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>System Health</h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Status</span>
                            <span className="badge badge-success">Online</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Total Data Points</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                {stats.total_nodes + stats.total_documents} items
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Graph Density</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                {stats.total_nodes > 0
                                    ? (stats.total_edges / stats.total_nodes).toFixed(2)
                                    : 0} edges/node
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
