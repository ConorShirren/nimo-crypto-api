const { saveSearchHistory, getSearchHistory } = require('../dynamoDBClient'); // Assuming the file containing the functions is named dynamoDBClient.js
const AWS = require('aws-sdk');

// Mocking AWS DynamoDB DocumentClient
jest.mock('aws-sdk', () => {
  const mockPut = jest.fn();
  const mockScan = jest.fn();

  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: mockPut,
        scan: mockScan,
      })),
    },
  };
});

describe('saveSearchHistory', () => {
  beforeEach(() => {
    const DocumentClient = new AWS.DynamoDB.DocumentClient();
    mockPut = DocumentClient.put;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save search history to DynamoDB', async () => {
    const email = 'test@example.com';
    const crypto = 'bitcoin';
    const expectedParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        email,
        crypto,
        timestamp: expect.any(String),
      },
    };

    mockPut.mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce() });

    const result = await saveSearchHistory(email, crypto);

    expect(mockPut).toHaveBeenCalledWith(expectedParams);
    expect(result).toEqual({ success: true });
  });

  it('should throw error if saving search history fails', async () => {
    const errorMessage = 'Error saving search history';
    mockPut.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(
      saveSearchHistory('test@example.com', 'bitcoin')
    ).rejects.toThrow(errorMessage);
  });
});

describe('getSearchHistory', () => {
  beforeEach(() => {
    const DocumentClient = new AWS.DynamoDB.DocumentClient();
    mockScan = DocumentClient.scan;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch search history from DynamoDB', async () => {
    const expectedParams = {
      TableName: process.env.TABLE_NAME,
    };

    const mockItems = [{ email: 'test@example.com', crypto: 'bitcoin' }];
    const expectedResponse = { Items: mockItems };

    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(expectedResponse),
    });

    const result = await getSearchHistory();

    expect(mockScan).toHaveBeenCalledWith(expectedParams);
    expect(result).toEqual(expectedResponse);
  });

  it('should throw error if fetching search history fails', async () => {
    const errorMessage = 'Error fetching search history';
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(getSearchHistory()).rejects.toThrow(errorMessage);
  });
});
