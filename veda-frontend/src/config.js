const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
let API_BASE_URL = process.env.REACT_APP_API_URL || `${SERVER_URL}/api`;

// Ensure API_BASE_URL ends with /api
if (!API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = `${API_BASE_URL}/api`;
}

const config = {
    SERVER_URL,
    API_BASE_URL
};

export default config;
