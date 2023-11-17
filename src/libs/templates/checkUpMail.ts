import { config } from "dotenv";
config()
export const checkupMail = (mailUser: string, code: string) =>`<html><body><h1>Buen dia ${mailUser} </h1></br><p>Verifica tu correo con el siguiente link:</p></br><a href="https://chefcito-back-production.up.railway.app/auth/checkup/${code}" target="_blank" >Link de verificación</a> 
${
  process.env.PORT ?? `</br><a href="http://localhost:4000/auth/checkup/${code}" target="_blank" >Link de verificación test</a>`
}
</body></html>`;
