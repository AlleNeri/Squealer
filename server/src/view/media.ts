import { Router, Request, Response } from "express";
import multer from 'multer';

import ImageSchema, { Image }  from "../model/Image";
import PostSchema, { Post } from "../model/Post";
import Auth from "../controller/Auth";
import UserSchema, { User, UserType } from "../model/User";

if(!process.env.CHAR_FOR_SPECIAL_POSTS) throw new Error("CHAR_FOR_SPECIAL_POSTS is not defined in the .env file");
const numCharForSpecialPosts: number=parseInt(process.env.CHAR_FOR_SPECIAL_POSTS);

/*** Multer initialization ***/
const upload = multer({ storage: multer.memoryStorage() });

export const mediaRoute: Router = Router();

//create a new image
//requires a file with the name "image" and the "postId" field; if not provided the profile image of the logged user will be edit
mediaRoute.put("/image", upload.single("image"), Auth.authorize, async (req: Request, res: Response) => {
	if(!req.file) return res.status(400).json({ msg: "No file provided." });
	if(!req.file.mimetype.startsWith("image/")) return res.status(400).json({ msg: `File is not an image. Mime type detected: ${req.file.mimetype}` });
	
	const imgToBase64 = req.file.buffer.toString("base64");
	const image: Image = new ImageSchema({
		data: imgToBase64,
		contentType: req.file.mimetype,
	});

	if(req.body.postId) {
		const post: Post | null = await PostSchema.findById(req.body.postId);
		if(!post) return res.status(404).json({ msg: "Post not found." });
		
		if(req.user?.type === UserType.SMM && !req.user?.isClient(post._id))
			return res.status(403).json({ msg: "You are not allowed to edit the post." });
		else if(req.user?.type !== UserType.VIP && req.user?.type !== UserType.NORMAL)
			return res.status(403).json({ msg: "You are not allowed to edit the post." });

		//check if the post was posted today
		const today: Date = new Date();
		const postDate: Date = new Date(post.date);
		if(today.getDate() !== postDate.getDate() || today.getMonth() !== postDate.getMonth() || today.getFullYear() !== postDate.getFullYear())
			return res.status(406).json({ msg: "You can't edit a post that was not posted today." });

		if(!req.user.canPost(numCharForSpecialPosts)) {
			await PostSchema.findByIdAndDelete(post._id);
			return res.status(500).json({ msg: "User can't post. The post has been deleted." });
		}
		req.user.save();

		//delete the old image
		if(post.content.img) {
			ImageSchema.findByIdAndDelete(post.content.img)
				.catch((err: Error) => res.status(500).json(err));
		}

		image.save()
			.then((image: Image) => res.status(200).json({ imgId: image._id, user_char_availability: req.user!.char_availability }))
			.catch((err: Error) => res.status(500).json(err));

		post.content.img = image._id;
		post.save();
	}
	else {
		const user: User | null = await UserSchema.findById(req.user?._id);
		if(!user) return res.status(404).json({ msg: "User not found." });

		//delete the old image
		if(user.profile_img) {
			ImageSchema.findByIdAndDelete(user.profile_img)
				.catch((err: Error) => res.status(500).json(err));
		}

		image.save()
			.then((image: Image) => res.status(200).json({ imgId: image._id }))
			.catch((err: Error) => res.status(500).json(err));

		user.img = image._id;
		user.save();
	}
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

//delete an image
//requires in the body a postId, if not provided the profile image is deleted
mediaRoute.delete("/image", Auth.authorize, async (req: Request, res: Response) => {
	if(req.body.postId) {
		const post: Post | null = await PostSchema.findById(req.body.postId);
		if(!post) return res.status(404).json({ msg: "Post not found." });

		if(req.user?.type === UserType.SMM && !req.user?.isClient(post._id))
			return res.status(403).json({ msg: "You are not allowed to edit the post." });
		else if(req.user?.type !== UserType.VIP || req.user?.type !== UserType.NORMAL)
			return res.status(403).json({ msg: "You are not allowed to edit the post." });
		else if(req.user?._id !== post.posted_by)
			return res.status(403).json({ msg: "You are not allowed to edit the post." });

		const imageId: string | undefined = post.content.img;
		if(!imageId) return res.status(404).json({ msg: "The post has no image." });

		ImageSchema.findByIdAndDelete(imageId)
			.then((_: Image | null) => {
				post.content.img = undefined;
				post.save();

				res.status(200).json({ msg: "Image deleted succesfully." });
			})
			.catch((err: Error) => res.status(500).json(err));
	}
	else {
		const user: User = req.user!;

		const imageId: string | undefined = user.img;
		if(!imageId) return res.status(404).json({ msg: "The user has no image." });

		ImageSchema.findByIdAndDelete(imageId)
			.then((_: Image | null) => {
				user.img = undefined;
				user.save();

				res.status(200).json({ msg: "Image deleted succesfully." });
			})
			.catch((err: Error) => res.status(500).json(err));
	}
});
