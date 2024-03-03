/*** Imports ***/
import express, { Express, Router, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import "./env"; //do not move this line and be careful to not import anything or write any code before this line

import { router } from "./view/routers";
import { postRoute } from "./view/post";
import { userRoute } from "./view/user";
import { channelRoute } from "./view/channel";
import { mediaRoute } from "./view/media";

/*** Configs ***/
const PORT: number = Number(process.env.PORT) || 8000;

/*** Mongoose initialization ***/
const dbUri: string = process.env.PRODUCTION
	? `mongodb://${process.env.DBHOST}/${process.env.DBNAME}`
	: `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;
mongoose.connect(
	dbUri,
	process.env.PRODUCTION
		? { authSource: 'admin', user: process.env.DBUSER, pass: process.env.DBPASSWORD }
		: {}
)
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

/*** Api ***/
const apiRouter: Router = Router();
apiRouter.use("/router", router);	// This is for testing purposes only. TODO: Remove this line.
apiRouter.use("/posts", postRoute);
apiRouter.use("/users", userRoute);
apiRouter.use("/channels", channelRoute);
apiRouter.use("/media", mediaRoute);

app.use("/api", apiRouter);

<<<<<<< HEAD
//TODO: remove this route, it's only for testing purposes
/*
app.get('/', (_: Request, res: Response)=>{
	res.status(200).send(`The server seams to run correctly.`);
});
*/

=======
>>>>>>> 4f6abc96c8e4294c35aa92682e9546ff11260162
/*** Frontends ***/
const basePath: string = path.join(__dirname, '../');

app.use(express.static(path.join(basePath, 'social')));
app.use('/smm', express.static(path.join(basePath, 'smm')));

//redirects
app.get('/*', (_: Request, res: Response) => res.sendFile(path.join(basePath, 'social/index.html')));
app.get('/smm/*', (_: Request, res: Response) => res.sendFile(path.join(basePath, 'smm/index.html')));

/*** Server start ***/
app.listen(PORT, ()=>console.log(`The server responds at: ${process.env.PRODUCTION ? 'https://site222352.tw.cs.unibo.it' : `http://localhost:${PORT}`}`));
