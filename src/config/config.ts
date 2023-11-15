import dotenv from "dotenv"
dotenv.config()

export default {
    jwtSecret: process.env.JWT_SECRET || 'alguntokensecreto',
    DB: {
        URI: process.env.MONGODB_URI || '',
        USER: process.env.MONGODB_USER || '',
        PASS: process.env.MONGODB_PASS || ''
    },
    CLOUD:{
        ID:process.env.ID_CLOUD||'',
        TOKEN:process.env.TOKEN_CLOUD||'',
        URL:process.env.URL_CLOUD||'',
        URL_DEV:process.env.URL_DEV_CLOUD||'',
        BUCKET:process.env.BUCKET_CLOUD||'',
    },
    MAIL:{
        CORREO:process.env.MAIL||'',
        PASS:process.env.MAIL_PASS||'',
    }

}
