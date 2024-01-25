import { Router, Request, Response } from "express";

import PostSchema, { Post } from "../model/Post";
import UserSchema, { User, UserType } from '../model/User';
import ChannelSchema, { Channel } from "../model/Channel";
import Auth from "../controller/Auth";

export const postRoute: Router=Router();

//get all posts
postRoute.get("/", Auth.authorize, Auth.isMod, (_: Request, res: Response) => {
	PostSchema.find()
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json({ msg: 'Posts not found', err: err }));
});

//get all my posts
//a SMM can gat as a client, the client id is in a query parameter called 'as'
postRoute.get("/my", Auth.authorize, (req: Request, res: Response) => {
	let userId: string;

	if(req.user!.type === UserType.SMM && req.query.as && req.user?.isClient(req.query.as.toString())) userId=req.query.as.toString();
	else if(req.user!.type === UserType.VIP || req.user!.type === UserType.NORMAL) userId=req.user!._id;
	else return res.status(403).json({ msg: "Unauthorized" });

	PostSchema.find({ posted_by: userId })
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
//it isn't required the posted_by field in the request body
//a SMM can post as a client, the client id is in a query parameter called 'as'
postRoute.post("/", Auth.authorize, (req: Request, res: Response) => {
	//if it's a smm, the post must be posted by one of his clients; the client id is in a query parameter
	if(!req.body.post) return res.status(400).json({ msg: "Bad request, no post provided" });

	const post: Post=req.body.post;
	if(req.user?.type === UserType.SMM && req.query.as && req.user?.isClient(req.query.as.toString()))
		post.posted_by=req.query.as.toString();
	else if(req.user?.type !== UserType.VIP && req.user?.type !== UserType.NORMAL) 
		return res.status(403).json({ msg: "Unauthorized" });
	else post.posted_by=req.user?._id;

	if(!post.posted_on) return res.status(400).json({ msg: "Bad request, no posted_on provided" });
	ChannelSchema.findById(post.posted_on)
		.then((channel: Channel | null) => {
			if(!channel) return res.status(404).json({ msg: "Channel not found" });
			else if(!channel.private) {
				UserSchema.findById(post.posted_by)
					.then((user: User | null) => {
						if(!user) return res.status(404).json({ msg: "User not found" });
						const content=post.content;
						//TODO: non è attualmente previstio e gestito il poter postare contenuti di diverso tipo(testo/immagini/posizione)
						if(content.text && !user.canPost(content.text.length)) return res.status(500).json({ msg: "User can't post" });
						else if((content.img || content.position) && !user.canPost(100)) return res.status(500).json({ msg: "User can't post" });
						const newPost: Post=new PostSchema(req.body.post);
						newPost.save()
							.then((post: Post) => res.status(200).json(post))
							.catch((err: Error) => res.status(500).json({ msg: "Error creating post", err: err }));
					})
					.catch((err: Error) => res.status(500).json({ msg: "Error while find the user", err: err }));
			}
			else {
				const newPost: Post=new PostSchema(post);
				newPost.save()
					.then((post: Post) => res.status(200).json(post))
					.catch((err: Error) => res.status(500).json({ msg: "Error creating post", err: err }));
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error while find the channel", err: err }));
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
postRoute.patch("/:id/visualize", Auth.authorize, (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else {
				post.addView(req.user?._id);
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
			else if(!post.addReaction(req.user?._id, req.body.reaction)) res.status(400).json({ msg: "Reaction not valid" });
			else {
				const result=post.save();
				if(!result) res.status(404).json({ msg: "Post not saved" });
				else res.status(200).json({ msg: "Post updated", pwhereost: post });
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
});

//get post statistics
//only a social media manager can see the statistics
postRoute.get("/:id/statistics", Auth.authorize, Auth.isSMM, (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else if(!req.user?.isClient(post.posted_by.toString())) res.status(401).json({ msg: "Unauthorized, the owner of the post is not a client" });
			else {
				let tmp: object={
					views: post.views,
					posReactions: post.posReaction,
					negReactions: post.negReaction,
					isPopular: post.popular,
					isUnpopular: post.unpopular,
				};
				console.log(tmp);
				res.status(200).json(tmp);
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error getting post statistics", err: err }));
});
