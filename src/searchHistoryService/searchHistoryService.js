const { getSearchHistory } = require('../utils/dynamoDBClient');

const searchHistory = async () => {
  try {
    const result = await getSearchHistory();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { searchHistory };
