// High-Fidelity Network Configuration for Elite School Portal
const getApiUrl = () => {
  // If we're on localhost, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }
  // Otherwise, use the server's network IP (same as the one serving the frontend)
  return `http://${window.location.hostname}:5001`;
};

export const API_URL = getApiUrl();
