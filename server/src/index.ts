/*** Imports ***/
import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

import "./env"; //do not move this line and be careful to not import anything or write any code before this line

import { router } from "./view/routers";
import { postRoute } from "./view/post";
import { userRoute } from "./view/user";
import { channelRoute } from "./view/channel";
import { strategy, userSerializer, userDeserializer } from "./controller/passport-strategy";
import { checkLogin } from "./controller/userLogin";
import { PRIV_KEY } from "./controller/pwdUtils";

/*** Configs ***/
const PORT: number = Number(process.env.PORT) || 8080;

/*** MongoStore initialization ***/
const MongoStoreFactory = MongoStore.create({
	mongoUrl: `mongodb://${process.env.DBHOST}:${process.env.DBPORT}`,
	dbName: process.env.DBNAME,
	collectionName: process.env.DBCOLLECTION_SESSION,
	ttl: 60*60*24,	// 1 day
	touchAfter: 60*30,	// 30 minutes
});

/*** Mongoose initialization ***/
mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`)
	.then(()=>console.log(`Connected to database: ${process.env.DBNAME}`))
	.catch(err=>console.log(`Error connecting to database: ${err}`));

/*** Passport initialization ***/
passport.use("login", strategy);
passport.serializeUser(userSerializer);
passport.deserializeUser(userDeserializer);

/*** Express initialization ***/
const app: Express = express();

/*** Middleware ***/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
	secret: PRIV_KEY,
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//TODO: add checkLogin to all protected routes
app.use("/router", router);	// This is for testing purposes only. TODO: Remove this line.
app.use("/post", postRoute);
app.use("/user", userRoute);
app.use("/channel", channelRoute);

app.get('/', (_: Request, res: Response)=>{
	console.log(`\tRequest detected: /`);
	res.send(`The server seams to run correctly.`);
});

/*** Server start ***/
app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`))
