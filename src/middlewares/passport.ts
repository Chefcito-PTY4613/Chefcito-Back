import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from "../config/config";
import { IUser, User } from "../models/user";

const opts: StrategyOptions ={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config.jwtSecret
}

export default new Strategy(opts, async (payload,done)=>{
    try {
        const user = await User.findById(payload.id).populate("userType") as IUser
        if(user) return done(null,user);
        return done(null, false, { message: 'No autorizado' });
    } 
    catch (err) {
        console.log('Error JWT: ',err)
    }
})