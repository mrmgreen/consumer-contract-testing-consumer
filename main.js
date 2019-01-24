const axios = require('axios');

function getMeDogs() {
  let url = "http://localhost"; // the mock server host and port.
  const port = 8991;
  
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: '/dogs',
    headers: { 'Accept': 'application/json' }
  });
}

module.exports = { getMeDogs };
