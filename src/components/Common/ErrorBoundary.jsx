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
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#0f172a', 
          color: 'white',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '4rem', margin: 0 }}>Oops!</h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', margin: '20px 0' }}>
            Something went wrong. Don't worry, even the best systems need a reboot.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              padding: '12px 30px', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Take Me Home
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
