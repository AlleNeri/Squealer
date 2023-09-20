import { Router, Request, Response } from "express";

import Post from "../model/Post";

export const postRoute: Router=Router();

//get all posts
postRoute.get("/", (_: Request, res: Response) => {
	Post.find().then(posts=> res.status(200).json(posts));
});

//get a specific post
postRoute.get("/:id", (req: Request, res: Response) => {
	Post.findById(req.params.id)
		.then(post=> res.status(200).json(post))
		.catch(err=> res.status(404).json({ msg: "Post not found", err: err }));
});

//create a post
postRoute.post("/", (req: Request, res: Response) => {
	if(!req.body.title || !req.body.content)
		return res.status(400).json({ msg: "Please send all required fields" });
	const newPost=new Post(req.body.post);
	newPost.save()
		.then(post=> res.status(200).json(post))
		.catch(err=> res.status(500).json({ msg: "Error creating post", err: err }));
});

//update a post
postRoute.put("/:id", (req: Request, res: Response) => {
	const result=Post.findByIdAndUpdate(req.params.id, req.body.post);
	if(!result) res.status(404).json({ msg: "Post not found" });
	else res.status(200).json({ msg: "Post updated" });
});

//delete a post
postRoute.delete("/:id", (req: Request, res: Response) => {
	const result=Post.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: "Post not found" });
	else res.status(200).json({ msg: "Post deleted" });
});
