const { sendEmail } = require('../utils/sesClient');
const { saveSearchHistory } = require('../utils/dynamoDBClient');

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

const getCryptoPrice = async (event) => {
  try {
    // Parsing incoming event data
    const { email, crypto } = JSON.parse(event.body);

    // Input validation
    if (!email || !crypto) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Email and cryptocurrency are required.',
        }),
      };
    }

    // Constructing URL for CoinGecko API
    const url = `${COIN_GECKO_API_URL}?ids=${crypto}&vs_currencies=aud`;

    // Fetching cryptocurrency price from CoinGecko
    const response = await fetch(url);

    // Handling fetch errors
    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrency price');
    }

    // Parsing response data
    const data = await response.json();

    // Validating cryptocurrency price
    const price = data[crypto]?.aud;
    if (price === undefined) {
      throw new Error('Invalid cryptocurrency');
    }

    // Sending email with cryptocurrency price
    await sendEmail(email, crypto, price);

    // Saving search history to DynamDB Table
    await saveSearchHistory(email, crypto);

    // Returning success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent to ${email} with the current price of ${crypto}: ${price}.`,
      }),
    };
  } catch (error) {
    // Logging and returning error response
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { getCryptoPrice };
