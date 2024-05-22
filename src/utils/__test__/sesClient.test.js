const { sendEmail } = require('../sesClient');
const AWS = require('aws-sdk');

// Mocking AWS SES
jest.mock('aws-sdk', () => {
  const mockSendEmail = jest.fn();
  return {
    SES: jest.fn(() => ({
      sendEmail: mockSendEmail,
    })),
  };
});

describe('sendEmail', () => {
  beforeEach(() => {
    const SES = new AWS.SES();
    mockSendEmail = SES.sendEmail;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email using SES', async () => {
    const email = 'test@example.com';
    const crypto = 'BTC';
    const price = 50000;
    const expectedParams = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Html: {
            Data: expect.stringContaining(`<html>`),
          },
        },
        Subject: { Data: 'Cryptocurrency Price Alert' },
      },
      Source: email,
    };

    mockSendEmail.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(),
    });

    await sendEmail(email, crypto, price);

    expect(mockSendEmail).toHaveBeenCalledWith(expectedParams);
  });

  it('should throw error if sending email fails', async () => {
    const errorMessage = 'Error sending email';
    mockSendEmail.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(sendEmail('test@example.com', 'BTC', 50000)).rejects.toThrow(
      errorMessage
    );
  });
});
