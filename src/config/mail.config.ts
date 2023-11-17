import { createTransport } from "nodemailer";
import config from "./config";

const user =  config.MAIL.CORREO;
const pass =  config.MAIL.PASS;

const configMail = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass
  }
};

const transport = createTransport(configMail);

export const sendMail = async (mailUser: string, subject: string, html: string) => {
  const msg = {
    from: user,
    to: mailUser,
    subject: subject,
    html: Buffer.from(html, "utf-8")//.toString(),
  };

  try {
    transport.verify(async function(error, success) {
      if (error) {
        console.log(error);
      } else {
        await transport.sendMail(msg);
      }
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default {
  sendMail
};
