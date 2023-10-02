/*** Imports ***/
import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import { router } from "./view/routers";
import { postRoute } from "./view/post";
import "./env";

/*** Configs ***/
const PORT: number = Number(process.env.PORT) || 8080;

/*** Mongoose initialization ***/
mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`)
	.then(()=>console.log(`Connected to database: ${process.env.DBNAME}`))
	.catch(err=>console.log(`Error connecting to database: ${err}`));

/*** Express initialization ***/
const app: Express = express();

/*** Middleware ***/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/router", router);
app.use("/post", postRoute);

app.get('/', (_: Request, res: Response)=>{
	console.log(`\tRequest detected: /`);
	res.send(`The server seams to run correctly.`);
});

/*** Server start ***/
app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`))