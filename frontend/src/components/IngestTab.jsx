import React, { useState } from 'react'
import axios from 'axios'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = 'http://localhost:3000/hybrid'

export default function IngestTab() {
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleIngest = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to ingest')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await axios.post(`${API_BASE}/ingest`, {
                data: { text: inputText }
            })
            setResult(response.data)
            setInputText('') // Clear input on success
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to ingest data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="card fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={24} />
                        Data Ingestion
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Paste raw text here (LinkedIn profile, documents, unstructured data, etc.).
                        The LLM will automatically extract entities and relationships.
                    </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                        Raw Input Text
                    </label>
                    <textarea
                        className="textarea"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste raw text here (LinkedIn profile, documents, unstructured data, etc.)..."
                        style={{ minHeight: '200px' }}
                    />
                </div>

                <button
                    onClick={handleIngest}
                    disabled={loading || !inputText.trim()}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    {loading && <span className="spinner" />}
                    {loading ? 'Processing...' : 'Submit & Process'}
                </button>

                {error && (
                    <div
                        className="fade-in"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <AlertCircle size={20} color="#ef4444" />
                        <span style={{ color: '#991b1b', fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}

                {result && (
                    <div
                        className="fade-in"
                        style={{
                            marginTop: '1.5rem',
                            padding: '1.5rem',
                            backgroundColor: '#d1fae5',
                            border: '1px solid #a7f3d0',
                            borderRadius: 'var(--radius-md)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <CheckCircle size={20} color="#059669" />
                            <h3 style={{ color: '#065f46', margin: 0 }}>Ingestion Successful</h3>
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem' }}>
                            <div>
                                <span style={{ fontWeight: 500, color: '#065f46' }}>Routed To: </span>
                                <span className="badge badge-success">{result.routed_to}</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: 500, color: '#065f46' }}>Cleaned Text Length: </span>
                                <span style={{ color: '#047857' }}>{result.cleaned_text_length} characters</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: 500, color: '#065f46' }}>Data Stored: </span>
                                <span style={{ color: '#047857' }}>{result.data_stored}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Example Section */}
            <div className="card fade-in" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>💡 Example Input</h3>
                <div style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.813rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-secondary)'
                }}>
                    LinkedIn profile: Sarah Chen is a Machine Learning Engineer at OpenAI specializing in LLMs
                    and natural language processing. Previously worked at Google on recommendation systems.
                    Graduated from Stanford with a degree in Computer Science.
                </div>
                <button
                    onClick={() => setInputText("LinkedIn profile: Sarah Chen is a Machine Learning Engineer at OpenAI specializing in LLMs and natural language processing. Previously worked at Google on recommendation systems. Graduated from Stanford with a degree in Computer Science.")}
                    className="btn btn-secondary"
                    style={{ marginTop: '0.75rem' }}
                >
                    Use Example
                </button>
            </div>
        </div>
    )
}
