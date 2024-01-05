/*** Imports ***/
import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import "./env"; //do not move this line and be careful to not import anything or write any code before this line

import { router } from "./view/routers";
import { postRoute } from "./view/post";
import { userRoute } from "./view/user";
import { channelRoute } from "./view/channel";
import { mediaRoute } from "./view/media";

/*** Configs ***/
const PORT: number = Number(process.env.PORT) || 8080;

/*** Mongoose initialization ***/
mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`)
	.then(()=>console.log(`Connected to database: ${process.env.DBNAME}`))
	.catch(err=>console.log(`Error connecting to database: ${err}`));

/*** Creating Squealer bot ***/
import "./nasaBot";	//TODO: test the frequency of the nasa bot posts
import "./cemetery";

/*** Activating the triggers ***/
import "./controller/triggers";

/*** Express initialization ***/
const app: Express = express();

/*** Middleware ***/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//TODO: add checkLogin to all protected routes
app.use("/router", router);	// This is for testing purposes only. TODO: Remove this line.
app.use("/posts", postRoute);
app.use("/users", userRoute);
app.use("/channels", channelRoute);
app.use("/media", mediaRoute);

//TODO: remove this route, it's only for testing purposes
app.get('/', (_: Request, res: Response)=>{
	res.status(200).send(`The server seams to run correctly.`);
});

/*** Server start ***/
app.listen(PORT, ()=>console.log(`The server responds at: http://localhost:${PORT}`));
