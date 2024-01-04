/*** Imports ***/
import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "./env"; //do not move this line and be careful to not import anything or write any code before this line
import multer from 'multer';
import { router } from "./view/routers";
import { postRoute } from "./view/post";
import { userRoute } from "./view/user";
import { channelRoute } from "./view/channel";

/*** Configs ***/
const PORT: number = Number(process.env.PORT) || 8080;

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

//TODO: remove this route, it's only for testing purposes
app.get('/', (_: Request, res: Response)=>{
	res.status(200).send(`The server seams to run correctly.`);
});

/*** Server start ***/
app.listen(PORT, ()=>console.log(`The server responds at: http://localhost:${PORT}`));
 
const upload = multer({ storage:multer.memoryStorage() });

const ImageSchema = new mongoose.Schema({
	id: String,
	data: String,
	contentType: String
});

const Image = mongoose.model('Image', ImageSchema);
  app.post('/upload', upload.single('image'), async (req, res) => {
	try {
		const img = Buffer.from(req.file?.buffer || '').toString('base64');

		const image = new Image({
			id: req.body.id,
			data: img,
			contentType: 'image/png'
		});

		await image.save();

		res.json({ file: req.file });
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
  });

app.get('/media/:id', async (req, res) => {
	const image = await Image.findOne({ id: req.params.id });

	if (!image) {
		return res.status(404).json({ message: 'Image not found' });
	}

	if (!image.data) {
		return res.status(500).json({ message: 'Image data is missing' });
	}

	const imgBuffer = Buffer.from(image.data, 'base64');

	res.set('Content-Type', image.contentType);
	res.send(imgBuffer);
});