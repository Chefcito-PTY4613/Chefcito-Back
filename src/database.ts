import mongoose from "mongoose";
import config from "./config/config"
import {mongooseDocsJSON, mongooseDocsOutputHTML} from "mongoose-docs";


mongoose.connect(config.DB.URI, {
    autoIndex: true
})

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB Conected');
    // Configura mongoose-docs aquí
    const docsJSON = mongooseDocsJSON(connection);
    mongooseDocsOutputHTML(docsJSON, __dirname + "/MongoDocs");
   
});

connection.once('error' ,err =>{
    console.log('MongoDB Bad Connection:')
    console.log(err)
    process.exit(0)
})
