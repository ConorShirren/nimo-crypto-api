const { searchHistory } = require('../searchHistoryService'); // Assuming the file containing the function is named searchHistory.js
const {
  saveSearchHistory,
  getSearchHistory,
} = require('../../utils/dynamoDBClient'); // Assuming the file containing the functions is named dynamoDBClient.js

// Mocking dependencies
jest.mock('../../utils/dynamoDBClient', () => ({
  getSearchHistory: jest.fn(),
}));

describe('searchHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success response with search history items', async () => {
    // Mocking DynamoDB response
    const mockItems = [
      { id: '1', query: 'Bitcoin' },
      { id: '2', query: 'Ethereum' },
    ];
    getSearchHistory.mockResolvedValueOnce({
      Items: mockItems,
    });

    const response = await searchHistory();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockItems));
    expect(getSearchHistory).toHaveBeenCalled();
  });

  it('should return error response when fetching search history fails', async () => {
    // Mocking DynamoDB error
    const errorMessage = 'Failed to fetch search history';
    getSearchHistory.mockRejectedValueOnce(new Error(errorMessage));

    const response = await searchHistory();

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(JSON.stringify({ message: errorMessage }));
    expect(getSearchHistory).toHaveBeenCalled();
  });
});
