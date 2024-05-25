const axios = require('axios');

const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

module.exports = apiClient;
