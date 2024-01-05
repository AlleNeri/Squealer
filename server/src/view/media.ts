import { Router, Request, Response } from "express";
import multer from 'multer';

import ImageSchema, { Image }  from "../model/Image";
import Auth from "../controller/Auth";

/*** Multer initialization ***/
const upload = multer({ storage: multer.memoryStorage() });

export const mediaRoute: Router = Router();

//create a new image
mediaRoute.post("/image", upload.single("image"), Auth.authorize, async (req: Request, res: Response) => {
	if(!req.file) return res.status(400).json({ msg: "No file provided." });
	if(!req.file.mimetype.startsWith("image/")) return res.status(400).json({ msg: `File is not an image. Mime type detected: ${req.file.mimetype}` });

	const imgToBase64 = req.file.buffer.toString("base64");
	console.log(imgToBase64);
	const image: Image = new ImageSchema({
		data: imgToBase64,
		contentType: req.file.mimetype
	});

	image.save()
		.then((image: Image) => res.status(200).json({ imgId: image._id }))
		.catch((err: Error) => res.status(500).json(err));
});

//get an image
mediaRoute.get("/image/:id", async (req: Request, res: Response) => {
	ImageSchema.findById(req.params.id)
		.then((image: Image | null) => {
			if(!image) return res.status(404).json({ msg: "Image not found." });
			if(!image.data) return res.status(500).json({ msg: "Image data is missing." });

			const imgBuffer = Buffer.from(image.data, "base64");

			res.writeHead(200, {
				"Content-Type": image.contentType,
				"Content-Length": imgBuffer.length
			});

			res.end(imgBuffer);
		})
		.catch((err: Error) => res.status(500).json(err));
});
