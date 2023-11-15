import nodemailer from "nodemailer";
import config from "./config";

export const sendMail = async (mailUser:string, subject:string, html:string) => {
  const configMail = {
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: config.MAIL.CORREO,
      pass: config.MAIL.PASS,
    },
  };
  const msg = {
    from: config.MAIL.CORREO,
    to: mailUser,
    subject: subject,
    html: Buffer.from(html, "utf-8").toString(),
  };
  const transport = nodemailer.createTransport(configMail);
  const info = await transport.sendMail(msg);
  return info;
};

export default {
  sendMail
};
