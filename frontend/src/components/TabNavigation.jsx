import React from 'react'

export default function TabNavigation({ activeTab, setActiveTab, tabs }) {
    return (
        <div className="tab-nav">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    )
}
