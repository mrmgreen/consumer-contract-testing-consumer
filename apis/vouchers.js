const axios = require('axios');

function getVouchers(voucherId) {
  let url = "http://localhost"; // the mock server host and port.
  const port = 8992;
  
  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: `/vouchers/${voucherId}`,
    headers: { 'Accept': 'application/json' }
  });
}

function addVoucher(voucherDetails) {
  console.log('2 =', JSON.stringify(voucherDetails));
  let url = "http://localhost"; // the mock server host and port.
  const port = 8992;
  
  return axios.request({
    method: 'POST',
    baseURL: `${url}:${port}`,
    url: `/vouchers`,
    headers: { 
      'Accept': 'application/json',
      "x-skyott-platform": "PC",
      "x-skyott-territory": "JC",
      "x-skyott-provider": "MOCK",
      "x-skyott-proposition": "MOCK",
      "x-SkyId-Token": "01-valid_user" 
    },
    data: JSON.stringify(voucherDetails)
  });
}

module.exports = { getVouchers, addVoucher };