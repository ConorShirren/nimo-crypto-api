const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

const sendEmail = async (email, crypto, price) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: `The current price of ${crypto} is $${price}.` },
      },
      Subject: { Data: 'Cryptocurrency Price Alert' },
    },
    Source: email,
  };

  return ses.sendEmail(params).promise();
};

module.exports = { sendEmail };
