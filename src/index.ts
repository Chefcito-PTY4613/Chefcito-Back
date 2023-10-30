import {app} from "./app";
import './database'
import { runAll } from "./libs/fn.ratapan";
import setup from "./libs/setup";

runAll([...setup])


app.listen(app.get('port'))