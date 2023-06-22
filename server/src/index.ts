import express, { Express, Request, Response } from "express";

import { PORT } from "./env/general.js";
import { router } from "./view/routers.js";

const app: Express = express();

app.use("/router", router);

app.get('/', (req: Request, res: Response)=>{
	console.log(`\tRequest detected: /`);
	res.send(`The server seams to run correctly.`);
});

app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`))
