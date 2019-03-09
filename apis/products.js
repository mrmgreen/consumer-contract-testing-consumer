import axios from 'axios';

const port = 8993;
const url = "http://localhost";

function getProducts() {
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/products`,
    headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
  });
}

function getProduct(productId) {
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/product/${productId}`,
    headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
  });
}

module.exports = { getProducts, getProduct };