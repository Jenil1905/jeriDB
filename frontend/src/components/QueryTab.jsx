import React, { useState } from 'react'
import axios from 'axios'
import { Search, Settings } from 'lucide-react'
import SearchResults from './SearchResults'

const API_BASE = 'http://localhost:3000/hybrid'

export default function QueryTab() {
    const [query, setQuery] = useState('')
    const [searchType, setSearchType] = useState('hybrid')
    const [vectorWeight, setVectorWeight] = useState(0.7)
    const [graphWeight, setGraphWeight] = useState(0.3)
    const [topK, setTopK] = useState(5)
    const [startId, setStartId] = useState('')
    const [hops, setHops] = useState(2)
    const [relationshipTypes, setRelationshipTypes] = useState('USES,MENTIONS,RELATED')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        if (!query.trim() && searchType !== 'multi-hop') return
        if (searchType === 'multi-hop' && !startId.trim()) {
            setError('start_id is required for multi-hop search')
            return
        }

        setLoading(true)
        setError(null)

        try {
            let response

            if (searchType === 'hybrid') {
                response = await axios.post(`${API_BASE}/search`, {
                    query,
                    type: 'hybrid',
                    vector_weight: vectorWeight,
                    graph_weight: graphWeight,
                    top_k: topK
                })
            } else if (searchType === 'vector_only') {
                response = await axios.post(`${API_BASE}/search/vector`, {
                    query,
                    top_k: topK
                })
            } else if (searchType === 'graph_only') {
                response = await axios.get(`${API_BASE}/search/graph`, {
                    params: { start_id: startId, depth: hops }
                })
            } else if (searchType === 'multi-hop') {
                response = await axios.get(`${API_BASE}/search/multi-hop`, {
                    params: {
                        start_id: startId,
                        hops,
                        relationship_types: relationshipTypes
                    }
                })
            }

            setResults(response.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
                {/* Settings Panel */}
                <div className="card fade-in" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={20} />
                        Parameters
                    </h3>

                    {/* Search Type */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                            Search Type
                        </label>
                        <select
                            className="select"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="hybrid">Hybrid (Vector + Graph)</option>
                            <option value="vector_only">Vector Only</option>
                            <option value="graph_only">Graph Only</option>
                            <option value="multi-hop">Multi-hop Reasoning</option>
                        </select>
                    </div>

                    {/* Hybrid/Vector Parameters */}
                    {(searchType === 'hybrid' || searchType === 'vector_only') && (
                        <>
                            {searchType === 'hybrid' && (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                            Vector Weight: {vectorWeight}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={vectorWeight}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                setVectorWeight(val)
                                                setGraphWeight(1 - val)
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                            Graph Weight: {graphWeight}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={graphWeight}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                setGraphWeight(val)
                                                setVectorWeight(1 - val)
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </>
                            )}

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                    Top K Results
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={topK}
                                    onChange={(e) => setTopK(parseInt(e.target.value) || 5)}
                                    min="1"
                                    max="20"
                                />
                            </div>
                        </>
                    )}

                    {/* Graph/Multi-hop Parameters */}
                    {(searchType === 'graph_only' || searchType === 'multi-hop') && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                    Start Node ID *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    value={startId}
                                    onChange={(e) => setStartId(e.target.value)}
                                    placeholder="e.g., ai_healthcare"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                    Hops / Depth
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={hops}
                                    onChange={(e) => setHops(parseInt(e.target.value) || 2)}
                                    min="1"
                                    max="5"
                                />
                            </div>

                            {searchType === 'multi-hop' && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                        Relationship Types
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={relationshipTypes}
                                        onChange={(e) => setRelationshipTypes(e.target.value)}
                                        placeholder="USES,MENTIONS,RELATED"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                        Comma-separated list
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Search Panel */}
                <div>
                    <div className="card fade-in">
                        <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={20} />
                            Advanced Query
                        </h3>

                        {(searchType === 'hybrid' || searchType === 'vector_only') && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                                    Search Query
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Enter your search query..."
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSearch}
                            disabled={loading || (!query.trim() && searchType !== 'graph_only' && searchType !== 'multi-hop')}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {loading && <span className="spinner" />}
                            {loading ? 'Searching...' : 'Execute Query'}
                        </button>

                        {error && (
                            <div
                                className="fade-in"
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#991b1b',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </div>

                    {results && (
                        <div style={{ marginTop: '1.5rem' }}>
                            {searchType === 'multi-hop' ? (
                                <MultiHopResults data={results} />
                            ) : searchType === 'graph_only' ? (
                                <GraphResults data={results} />
                            ) : (
                                <SearchResults results={results} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Multi-hop results component
function MultiHopResults({ data }) {
    const paths = data?.paths || []
    const totalPaths = data?.total_paths || 0

    return (
        <div className="card fade-in">
            <h3 style={{ marginBottom: '1rem' }}>
                Multi-hop Paths ({totalPaths} found)
            </h3>
            {paths.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {paths.map((path, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>Path {idx + 1}</span>
                                <span className="badge badge-primary">{path.hop_count} hops</span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <div><strong>Start:</strong> {path.start?.id || 'N/A'}</div>
                                <div><strong>Related:</strong> {path.related?.id || 'N/A'}</div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <strong>Relationships:</strong>
                                    {path.relationships?.map((rel, i) => (
                                        <span key={i} className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>
                                            {rel.type} ({rel.weight})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                    No paths found. Try creating some nodes and edges first, or use a different start_id.
                </p>
            )}
        </div>
    )
}

// Graph-only results component
function GraphResults({ data }) {
    const nodes = data?.nodes || []

    return (
        <div className="card fade-in">
            <h3 style={{ marginBottom: '1rem' }}>
                Graph Traversal Results ({nodes.length} nodes)
            </h3>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <strong>Start ID:</strong> {data.start_id}
                </div>
                <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    <strong>Depth:</strong> {data.depth}
                </div>
                <div>
                    <strong style={{ fontSize: '0.875rem' }}>Reachable Nodes:</strong>
                    {nodes.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {nodes.map((node, idx) => (
                                <span key={idx} className="badge badge-primary">
                                    {typeof node === 'object' ? node.id : node}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                            No reachable nodes found
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
