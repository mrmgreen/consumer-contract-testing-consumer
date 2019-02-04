const axios = require('axios');
const port = 8993;

function getProducts() {
  let url = "http://localhost"; // the mock server host and port.
  
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/products`,
    headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
  });
}

function getProduct(productId) {
  let url = "http://localhost"; // the mock server host and port.
  
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/product/${productId}`,
    headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
  });
}

module.exports = { getProducts, getProduct };