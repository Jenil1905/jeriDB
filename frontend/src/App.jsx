import React, { useState } from 'react'
import { Database } from 'lucide-react'
import TabNavigation from './components/TabNavigation'
import IngestTab from './components/IngestTab'
import QueryTab from './components/QueryTab'

function App() {
  const [activeTab, setActiveTab] = useState('ingest')

  const tabs = [
    { id: 'ingest', label: 'Ingest', icon: '📥' },
    { id: 'query', label: 'Query', icon: '🔍' }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div className="container" style={{ padding: '1.5rem var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Database size={28} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                jeriDB
              </h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Hybrid Vector + Graph Native Database
              </p>
            </div>
          </div>
        </div>

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />
      </header>

      {/* Main Content */}
      <main style={{ paddingBottom: '4rem' }}>
        {activeTab === 'ingest' && <IngestTab />}
        {activeTab === 'query' && <QueryTab />}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderTop: '1px solid var(--color-border)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.875rem'
        }}
      >
        <p style={{ margin: 0 }}>
          jeriDB - Hybrid Vector + Graph Database | LanceDB + Neo4j
        </p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem' }}>
          Built with ❤️ for intelligent data retrieval
        </p>
      </footer>
    </div>
  )
}

export default App
