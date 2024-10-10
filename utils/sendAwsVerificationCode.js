import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

dotenv.config();

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
}


//Create SES service object
const sesClient = new SESClient(SES_CONFIG);

const sendEmail = async (email, verificationToken) => {
  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Your verification code is ${verificationToken}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Verification Code'
      }
    },
    Source: process.env.AWS_SES_EMAIL_SENDER,
    replyToAddresses: []
  };

  try{
    const sendEmailCommand = new SendEmailCommand(params);
    const data = await sesClient.send(sendEmailCommand);
    console.log("Email sent", data);
  } catch(err){
    console.log("Error while sending email", err);
  }
}

export {sendEmail};