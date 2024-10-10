/*

    Literally to create a template on AWS.

    use using node from terminal
*/
import {SESClient, CreateTemplateCommand} from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

dotenv.config();

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
}

// Create SES service object
const sesClient = new SESClient(SES_CONFIG);

const createSesTemplate = async ({verificationToken}) => {
  let params = {
    Template: {
      TemplateName: process.env.AWS_SES_TEMPLATE_NAME,
      HtmlPart: `Your verification code is {{verificationToken}}`,
      SubjectPart: 'Verification Code for Luxpackers'
    }
  };

  try{
    const createTemplateCommand = new CreateTemplateCommand(params);
    const data = await sesClient.send(createTemplateCommand);
    console.log("Template created", data);
  } catch(err){
    console.log("Error while creating template", err);
  }
}

createSesTemplate(109283)