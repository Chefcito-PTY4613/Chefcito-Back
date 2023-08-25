import mongoose from "mongoose";
import config from "./config/config"

mongoose.connect(config.DB.URI)

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('MongoDB Conected')
})

connection.once('error' ,err =>{
    console.log('MongoDB Bad Connection:')
    console.log(err)
    process.exit(0)
})