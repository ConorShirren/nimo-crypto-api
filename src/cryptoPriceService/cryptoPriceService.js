const { sendEmail } = require('../utils/sesClient');
const { saveSearchHistory } = require('../utils/dynamoDBClient');

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

const getCryptoPrice = async (event) => {
  const { email, crypto } = JSON.parse(event.body);
  if (!email || !crypto) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Email and cryptocurrency are required.',
      }),
    };
  }

  try {
    const url = `${COIN_GECKO_API_URL}?ids=${crypto}&vs_currencies=aud`;
    const response = await fetch(url);
    const data = await response.json();

    const price = data[crypto]?.aud;
    if (price === undefined) {
      throw new Error('Invalid cryptocurrency');
    }

    await sendEmail(email, crypto, price);
    await saveSearchHistory(email, crypto);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent to ${email} with the current price of ${crypto}: ${price}.`,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { getCryptoPrice };
