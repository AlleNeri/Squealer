import { Router, Request, Response } from "express";
import multer from 'multer';

import ImageSchema, { Image }  from "../model/Image";
import PostSchema, { Post } from "../model/Post";
import Auth from "../controller/Auth";
import {UserType} from "../model/User";

/*** Multer initialization ***/
const upload = multer({ storage: multer.memoryStorage() });

export const mediaRoute: Router = Router();

//create a new image
mediaRoute.put("/image", upload.single("image"), Auth.authorize, async (req: Request, res: Response) => {
	if(!req.file) return res.status(400).json({ msg: "No file provided." });
	if(!req.file.mimetype.startsWith("image/")) return res.status(400).json({ msg: `File is not an image. Mime type detected: ${req.file.mimetype}` });
	console.log(req);
	if(!req.body.postId) return res.status(400).json({ msg: "No post id provided." });

	const post: Post | null = await PostSchema.findById(req.body.postId);
	if(!post) return res.status(404).json({ msg: "Post not found." });

	if(req.user?.type === UserType.SMM && !req.user?.isClient(post._id))
		return res.status(403).json({ msg: "You are not allowed to edit the post." });
	else if(req.user?.type !== UserType.VIP || req.user?.type !== UserType.NORMAL)
		return res.status(403).json({ msg: "You are not allowed to edit the post." });
	else if(req.user?._id !== post.posted_by)
		return res.status(403).json({ msg: "You are not allowed to edit the post." });

	//delete the old image
	if(post.content.img) {
		ImageSchema.findByIdAndDelete(post.content.img)
			.catch((err: Error) => res.status(500).json(err));
	}

	const imgToBase64 = req.file.buffer.toString("base64");
	const image: Image = new ImageSchema({
		data: imgToBase64,
		contentType: req.file.mimetype
	});

	image.save()
		.then((image: Image) => res.status(200).json({ imgId: image._id }))
		.catch((err: Error) => res.status(500).json(err));

	post.content.img = image._id;
	post.save();
});

//get an image
mediaRoute.get("/image/:id", async (req: Request, res: Response) => {
	if(!req.params.id) return res.status(400).json({ msg: "No image id provided." });

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

mediaRoute.delete("/image", Auth.authorize, async (req: Request, res: Response) => {
	if(!req.body.postId) return res.status(400).json({ msg: "No post id provided." });

	const post: Post | null = await PostSchema.findById(req.body.postId);
	if(!post) return res.status(404).json({ msg: "Post not found." });

	if(req.user?.type === UserType.SMM && !req.user?.isClient(post._id))
		return res.status(403).json({ msg: "You are not allowed to edit the post." });
	else if(req.user?.type !== UserType.VIP || req.user?.type !== UserType.NORMAL)
		return res.status(403).json({ msg: "You are not allowed to edit the post." });
	else if(req.user?._id !== post.posted_by)
		return res.status(403).json({ msg: "You are not allowed to edit the post." });

	const imgageId: string | undefined = post.content.img;
	if(!imgageId) return res.status(404).json({ msg: "The post has no image." });

	ImageSchema.findByIdAndDelete(imgageId)
		.then((_: Image | null) => {
			post.content.img = undefined;
			post.save();

			res.status(200).json({ msg: "Image deleted succesfully." });
		})
		.catch((err: Error) => res.status(500).json(err));
});
