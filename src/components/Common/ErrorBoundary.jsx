import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="glass-panel" style={{ 
          padding: '40px', 
          textAlign: 'center', 
          margin: '20px',
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <h2 style={{ color: '#ef4444' }}>Component Error</h2>
          <p style={{ color: 'var(--text-secondary)' }}>This section failed to load. Please try refreshing.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '15px', padding: '8px 20px', borderRadius: '10px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
