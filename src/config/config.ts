import dotenv from "dotenv"
dotenv.config()

export default {
    jwtSecret: process.env.JWT_SECRET || 'alguntokensecreto',
    DB: {
        URI: process.env.MONGODB_URI || '',
        USER: process.env.MONGODB_USER || '',
        PASS: process.env.MONGODB_PASS || ''
    }
}
