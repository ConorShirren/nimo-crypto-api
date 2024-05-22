const { handler } = require('../handler');
const { searchHistory } = require('../searchHistoryService');

// Mocking searchHistory function
jest.mock('../searchHistoryService', () => ({
  searchHistory: jest.fn(),
}));

describe('handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call searchHistory without event', async () => {
    const event = {};
    await handler(event);

    expect(searchHistory).toHaveBeenCalled();
  });

  it('should return result from searchHistory', async () => {
    const mockResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
    searchHistory.mockResolvedValueOnce(mockResult);

    const result = await handler({});

    expect(result).toEqual(mockResult);
  });

  it('should throw error if searchHistory throws error', async () => {
    const errorMessage = 'Error fetching search history';
    searchHistory.mockRejectedValueOnce(new Error(errorMessage));

    await expect(handler({})).rejects.toThrow(errorMessage);
  });
});
