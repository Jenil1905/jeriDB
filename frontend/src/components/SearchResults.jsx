import React from 'react'
import { TrendingUp, Link } from 'lucide-react'

export default function SearchResults({ results }) {
    if (!results || !results.results || results.results.length === 0) {
        return (
            <div className="card fade-in" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                <p>No results found</p>
            </div>
        )
    }

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} />
                    Search Results
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {results.vector_hits !== undefined && (
                        <span>
                            <strong>{results.vector_hits}</strong> vector hits
                        </span>
                    )}
                    {results.graph_boosts !== undefined && results.graph_boosts > 0 && (
                        <span className="badge badge-primary">
                            <Link size={12} /> {results.graph_boosts} graph boosts
                        </span>
                    )}
                </div>
            </div>

            {results.type && (
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        <span>
                            <strong>Type:</strong> {results.type}
                        </span>
                        {results.vector_weight !== undefined && (
                            <span>
                                <strong>Vector:</strong> {(results.vector_weight * 100).toFixed(0)}%
                            </span>
                        )}
                        {results.graph_weight !== undefined && (
                            <span>
                                <strong>Graph:</strong> {(results.graph_weight * 100).toFixed(0)}%
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {results.results.map((result, idx) => (
                    <div
                        key={idx}
                        className="fade-in"
                        style={{
                            padding: '1rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)'
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {result.rank || idx + 1}
                                </span>
                                <code style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    {result.docId}
                                </code>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {result.hybrid_score !== undefined && (
                                    <span className={`badge ${result.hybrid_score > 0.7 ? 'badge-success' :
                                            result.hybrid_score > 0.4 ? 'badge-warning' :
                                                'badge-error'
                                        }`}>
                                        Hybrid: {result.hybrid_score.toFixed(3)}
                                    </span>
                                )}
                                {result.similarity !== undefined && result.hybrid_score === undefined && (
                                    <span className={`badge ${result.similarity > 0.7 ? 'badge-success' :
                                            result.similarity > 0.4 ? 'badge-warning' :
                                                'badge-error'
                                        }`}>
                                        Similarity: {result.similarity.toFixed(3)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {result.text && (
                            <p style={{
                                margin: 0,
                                fontSize: '0.875rem',
                                color: 'var(--color-text-primary)',
                                lineHeight: 1.6
                            }}>
                                {result.text}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {results.total_pages && results.total_pages > 1 && (
                <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                }}>
                    Page {results.page} of {results.total_pages}
                </div>
            )}
        </div>
    )
}
