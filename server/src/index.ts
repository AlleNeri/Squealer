import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import { router } from "./view/routers.js";

dotenv.config({path: __dirname + "/../config.env"});

const PORT: number = Number(process.env.PORT) || 8080;

const app: Express = express();

app.use("/router", router);

app.get('/', (req: Request, res: Response)=>{
	console.log(`\tRequest detected: /`);
	res.send(`The server seams to run correctly.`);
});

app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`))
