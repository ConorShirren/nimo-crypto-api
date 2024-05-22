const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const saveSearchHistory = async (email, crypto) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      email,
      crypto,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return { success: true };
  } catch (error) {
    console.error('Error saving search history:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

const getSearchHistory = async () => {
  const params = {
    TableName: process.env.TABLE_NAME,
  };

  try {
    return dynamoDB.scan(params).promise();
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

module.exports = { saveSearchHistory, getSearchHistory };
