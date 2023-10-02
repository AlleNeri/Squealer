import { Router, Request, Response } from "express";

import PostSchema, { Post } from "../model/Post";
import Auth from "../controller/Auth";

export const postRoute: Router=Router();

//get all my posts
//TODO: test this
//TODO: find out if the passport middleware helps and put the id in the req
//		otherwise, ask for the id in the body
postRoute.get("/my", Auth.authorize, (req: Request, res: Response) => {
	PostSchema.find({ author: req.user?._id })
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
postRoute.put("/:id", Auth.authorize, (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else if(post.author!=req.user?._id) res.status(401).json({ msg: "Unauthorized" });
			else {
				post=Object.assign(post, req.body.post);
				post!.save()
					.then((post: Post) => res.status(200).json({ msg: "Post updated", post: post }))
					.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
			}
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
//TODO: decide if the view should be added only from logged users or not(maybe check in the teacher's requirements)
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
postRoute.patch("/:id/react", Auth.authorize, (req: Request, res: Response) => {
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
