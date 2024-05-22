const { getSearchHistory } = require('../utils/dynamoDBClient');

const searchHistory = async () => {
  try {
    // Fetching search history from DynamoDB
    const result = await getSearchHistory();

    // Returning success response with search history items
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
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

module.exports = { searchHistory };
