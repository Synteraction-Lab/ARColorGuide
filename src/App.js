import React, { useState } from 'react';
import ColorPerformanceAnalysis from './components/ColorPerformanceAnalysis';
import ColorSelectionGuide from './components/ColorSelectionGuide';

function App() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>AR Color Guide</h1>
              <p>Optimal Color Selection Guidelines for (Optical See-through) AR Smart Glasses and Heads-up Computing</p>
            </div>
            <nav className="nav">
              <button 
                className={`nav-btn ${activeTab === 'performance' ? 'active' : ''}`}
                onClick={() => setActiveTab('performance')}
              >
                Color Performance Analysis
              </button>
              <button 
                className={`nav-btn ${activeTab === 'guide' ? 'active' : ''}`}
                onClick={() => setActiveTab('guide')}
              >
                Color Selection Guide
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {activeTab === 'performance' ? (
            <ColorPerformanceAnalysis />
          ) : (
            <ColorSelectionGuide />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>AR Color Selection Guidelines Research - Interactive Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 