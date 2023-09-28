import { Router, Request, Response } from "express";

import PostSchema, { Post } from "../model/Post";

export const postRoute: Router=Router();

//get all my posts
//TODO: test this
//TODO: find out if the passport middleware helps and put the id in the req
//		otherwise, ask for the id in the body
postRoute.get("/my", (req: Request, res: Response) => {
	PostSchema.find({ author: req.body.user._id })
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json(err));
});

//get all posts of a channel
//the channel has to be specified in the query: http ... /post?channel={channelId}
postRoute.get("", (req: Request, res: Response) => {
	const { channel }=req.query;
	PostSchema.find({
		$or: [
			{ posted_on: channel },
			{ appartains_to: channel }
		]
	})
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json({err: err, channel: channel}));
});

//get all posts
//only for testing	TODO: remove this
postRoute.get("", (req: Request, res: Response) => {
	PostSchema.find()
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
	PostSchema.findByIdAndUpdate(req.params.id, req.body.post, { new: true })
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else res.status(200).json({ msg: "Post updated", post: post });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
});

//delete a post
postRoute.delete("/:id", (req: Request, res: Response) => {
	PostSchema.findByIdAndDelete(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else res.status(200).json({ msg: "Post deleted" });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error deleting post", err: err }));
});

//visualize a post
//automatically add a view to a post
postRoute.patch("/:id/visualize", (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else {
				post.addView();
				const result=post.save();
				if(!result) res.status(404).json({ msg: "Post not saved" });
				else res.status(200).json({ msg: "Post updated", post: post });
			}
		})
		.catch((err: Error) => {
			console.log(err);
			res.status(500).json({ msg: "Error updating post", err: err })
		});
});

//react to a post
//a body is neaded with the reaction field: { reaction: -2 | -1 | 1 | 2 }
postRoute.patch("/:id/react", (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else if(!post.addReaction(req.body.reaction)) res.status(400).json({ msg: "Reaction not valid" });
			else {
				const result=post.save();
				if(!result) res.status(404).json({ msg: "Post not saved" });
				else res.status(200).json({ msg: "Post updated", pwhereost: post });
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
});
