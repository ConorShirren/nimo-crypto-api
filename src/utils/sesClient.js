const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

const sendEmail = async (email, crypto, price) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `   
           <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    background-color: #F0962C;
                    color: white;
                    padding: 10px 0;
                    text-align: center;
                  }
                  .content {
                    margin: 20px 0;
                  }
                  .footer {
                    background-color: #f1f1f1;
                    text-align: center;
                    padding: 10px 0;
                    font-size: 12px;
                    color: #777;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Nimo Crypto API Newsletter</h1>
                  </div>
                  <div class="content">
                    <p>Dear Reader,</p>
                    <p>We are excited to bring you the latest price of ${crypto} from the Gecko API.</p>
                    <ul>
                      <li><strong>Current Price:</strong> AU$${price}</li>
                    </ul>
                    <p>We hope you enjoy using our service. Stay tuned for more updates!</p>                  
                  </div>
                  <div class="footer">
                    <p>&copy; 2024 - Conor Shirren</p>
                    <p>Melbourne, VIC</p>
                  </div>
                </div>
              </body>
            </html>
            `
      },
      Subject: { Data: 'Cryptocurrency Price Alert' },
    },
    Source: email,
  };

  return ses.sendEmail(params).promise();
};

module.exports = { sendEmail };
