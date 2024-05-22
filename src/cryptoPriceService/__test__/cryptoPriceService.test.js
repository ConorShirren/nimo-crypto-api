const { getCryptoPrice } = require('../cryptoPriceService');
const { sendEmail } = require('../../utils/sesClient');
const { saveSearchHistory } = require('../../utils/dynamoDBClient');

// Mocking dependencies
jest.mock('../../utils/sesClient', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('../../utils/dynamoDBClient', () => ({
  saveSearchHistory: jest.fn(),
}));

// Mocking fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        bitcoin: {
          aud: 104968,
        },
      }),
  })
);

describe('getCryptoPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success response with correct email and crypto', async () => {
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'bitcoin' }),
    };
    const response = await getCryptoPrice(event);
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(
      'Email sent to test@example.com with the current price of bitcoin: 104968.'
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud'
    );
    expect(sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'bitcoin',
      104968
    );
    expect(saveSearchHistory).toHaveBeenCalledWith(
      'test@example.com',
      'bitcoin'
    );
  });

  it('should return error response when email or crypto is missing', async () => {
    const event = { body: JSON.stringify({}) };
    const response = await getCryptoPrice(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('Email and cryptocurrency are required.');
    expect(fetch).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(saveSearchHistory).not.toHaveBeenCalled();
  });

  it('should return error response when fetching cryptocurrency price fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'bitcoin' }),
    };

    const response = await getCryptoPrice(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Failed to fetch cryptocurrency price');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(saveSearchHistory).not.toHaveBeenCalled();
  });

  it('should return error response when cryptocurrency is invalid', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    const event = {
      body: JSON.stringify({ email: 'test@example.com', crypto: 'bitcoin' }),
    };
    const response = await getCryptoPrice(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Invalid cryptocurrency');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(saveSearchHistory).not.toHaveBeenCalled();
  });
});
