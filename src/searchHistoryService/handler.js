const { searchHistory } = require('./searchHistoryService');

exports.handler = async (event) => {
  return await searchHistory();
};
