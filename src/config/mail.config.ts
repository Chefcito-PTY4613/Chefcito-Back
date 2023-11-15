import { createTransport } from "nodemailer";
import config from "./config";

export const sendMail = async (mailUser: string, subject: string, html: string) => {
  const configMail = {
    host: "smtp.office365.com",
    secure: false, // Cambiado a false para el puerto 587
    port: 587,
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

  try {
    const transport = createTransport(configMail);
    const info = await transport.sendMail(msg);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default {
  sendMail
};
