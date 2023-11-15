export const checkupMail = (mailUser:string, code:string) => {
  const configMail = `
  <html>
  <body>
  <h1>Buen dia ${mailUser} </h1>
  </br>
  <p>Verifica tu correo con el siguiente link:</p>
  </br>
  <a href="https://chefcito-back-production.up.railway.app/auth/checkup/${code}" target="_blank" >
  Link de verificación
  </a>
  </body>
  </html>
  `;
  return configMail;
}; 