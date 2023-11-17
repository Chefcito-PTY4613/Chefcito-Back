import { config } from "dotenv";
config()
export const checkupMail = (mailUser: string, code: string) => `
<html>
  <head>
    <style>
      body { font-family: sans-serif; text-align: center; margin-top: 50px; }
      .message { color: #333; }
      .logo { height: 150px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="message">
      <h1>Buen día ${mailUser}</h1>
      <p>Verifica tu correo con el siguiente link:</p>
      <a href="https://chefcito-back-production.up.railway.app/auth/checkup/${code}" target="_blank">Link de verificación</a>
      ${!process.env.PORT ? `</br><a href="http://localhost:4000/auth/checkup/${code}" target="_blank" >Link de verificación test</a>` : ''}
    </div>
  </body>
</html>
`;
