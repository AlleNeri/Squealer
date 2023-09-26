import { Router, Request, Response } from "express";

import PostSchema, { Post } from "../model/Post";

if(process.env.CM_COEFFICIENT === undefined) throw new Error("CM_COEFFICIENT not set in config.env file");

export const postRoute: Router=Router();

//get all my posts
postRoute.get("/my", (req: Request, res: Response) => {
	PostSchema.find({ author: req.body.user._id })
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json(err));
});

//get a specific post
postRoute.get("/:id", (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => res.status(200).json(post))
		.catch((err: Error) => res.status(404).json({ msg: "Post not found", err: err }));
});

//create a post
postRoute.post("/", (req: Request, res: Response) => {
	const newPost: Post=new PostSchema(req.body.post);
	newPost.save()
		.then((post: Post) => res.status(200).json(post))
		.catch((err: Error) => res.status(500).json({ msg: "Error creating post", err: err }));
});

//update a post
postRoute.put("/:id", (req: Request, res: Response) => {
	const result: Post=PostSchema.findByIdAndUpdate(req.params.id, req.body.post);
	if(!result) res.status(404).json({ msg: "Post not found" });
	else res.status(200).json({ msg: "Post updated" });
});

//delete a post
postRoute.delete("/:id", (req: Request, res: Response) => {
	const result: Post=PostSchema.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: "Post not found" });
	else res.status(200).json({ msg: "Post deleted" });
});

//visualize a post
//automatically add a view to a post
postRoute.patch("/:id/visualize", (req: Request, res: Response) => {
	const post: Post=PostSchema.findById(req.params.id);
	if(!post) res.status(404).json({ msg: "Post not found" });
	else {
		post.addView();
		const result=post.save();
		if(!result) res.status(404).json({ msg: "Post not saved" });
		else res.status(200).json({ msg: "Post updated" });
	}
});

//react to a post
//a body is neaded with the reaction field: { reaction: -2 | -1 | 1 | 2 }
postRoute.patch("/:id/react", (req: Request, res: Response) => {
	const post: Post=PostSchema.findById(req.params.id);
	if(!post) res.status(404).json({ msg: "Post not found" });
	else if(post.addReaction(req.body.reaction)) res.status(400).json({ msg: "Reaction not valid" });
	else {
		const result=post.save();
		if(!result) res.status(404).json({ msg: "Post not saved" });
		else res.status(200).json({ msg: "Post updated" });
	}
});
