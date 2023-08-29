import app from "./app";
import './database'
import setup from "./libs/setup";

setup.setUserTypes()
setup.setAdmin()
setup.setTables()

app.listen(app.get('port'));
console.log('Server on port:', app.get('port'));