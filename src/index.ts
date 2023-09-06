import app from "./app";
import './database'
import setup from "./libs/setup";

setup.setUserTypes()
setup.setAdmin()
setup.setTables()
setup.setSaleStatus()
setup.setFoodType()
setup.setMovementType()
setup.setProcess()

app.listen(app.get('port'))