const { handler } = require('../handler'); // Assuming the file containing the handler is named handler.js
const { getCryptoPrice } = require('../cryptoPriceService');

// Mocking getCryptoPrice function
jest.mock('../cryptoPriceService', () => ({
  getCryptoPrice: jest.fn(),
}));

describe('handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getCryptoPrice with event', async () => {
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'BTC' }),
    };
    await handler(event);

    expect(getCryptoPrice).toHaveBeenCalledWith(event);
  });

  it('should return result from getCryptoPrice', async () => {
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'BTC' }),
    };
    const mockResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
    getCryptoPrice.mockResolvedValueOnce(mockResult);

    const result = await handler(event);

    expect(result).toEqual(mockResult);
  });

  it('should throw error if getCryptoPrice throws error', async () => {
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'BTC' }),
    };
    const errorMessage = 'Error fetching cryptocurrency price';
    getCryptoPrice.mockRejectedValueOnce(new Error(errorMessage));

    await expect(handler(event)).rejects.toThrow(errorMessage);
  });
});
