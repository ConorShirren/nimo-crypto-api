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

  return dynamoDB.put(params).promise();
};

const getSearchHistory = async () => {
  const params = {
    TableName: process.env.TABLE_NAME,
  };

  return dynamoDB.scan(params).promise();
};

module.exports = { saveSearchHistory, getSearchHistory };
