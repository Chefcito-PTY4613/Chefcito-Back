import { Request, Response, Router } from "express";
import expressListEndpoints, { Endpoint } from "express-list-endpoints";
import { app } from "../app";

const mainRouter = Router();

function compareByName(a: Endpoint, b: Endpoint) {
  return a.path.localeCompare(b.path);
}

mainRouter.get("/", (req: Request, res: Response) => {
  const lines = expressListEndpoints(app)
    .sort(compareByName)
    .map(
      (route) => `Paths: 
  </br>
  <a href="https://chefcito-back-production.up.railway.app${route.path}" target="_blank"> 
    chefcito-back-production.up.railway.app${route.path}
  </a> 
  </br>
  <a href="http://localhost:4000${route.path}" target="_blank"> 
    localhost:4000${route.path}
  </a> 
  <br/>
  <br/>
  Methods:</br> 
    ${route.methods.join(", ")}
  <br/>
  <br/>
  Middlewares:
  </br> 
    ${route.middlewares}
  </br>
        `);

  res.send(`
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    *{
      font-family: Roboto
    }

  </style> ${lines.join("<hr/>")}`
  );
});

export default mainRouter;
