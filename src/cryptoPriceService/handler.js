const { getCryptoPrice } = require('./cryptoPriceService');

exports.handler = async (event) => {
  return await getCryptoPrice(event);
};
