const axios = require('axios');
const port = 8992;
const url = "http://localhost";

function getVouchers(voucherId) {  
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/vouchers/${voucherId}`,
    headers: { 'Accept': 'application/json' }
  });
}

function addVoucher(voucherDetails) {
  return axios.request({
    method: 'POST',
    baseURL: `${url}:${port}`,
    url: `/vouchers`,
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "x-skyott-platform": "PC",
      "x-skyott-territory": "JC",
      "x-skyott-provider": "MOCK",
      "x-skyott-proposition": "MOCK",
      "x-SkyId-Token": "01-valid_user" 
    },
    data: voucherDetails
  });
}

module.exports = { getVouchers, addVoucher };