import express, { Express, Request, Response } from "express";

import { PORT } from "./env/general.js";

const app: Express = express();

app.get('/', (req: Request, res: Response)=>{
	console.log(`\tRequest detected: ${req.baseUrl}`);
	res.send(`The server seams to run correctly.`);
});

app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`))
