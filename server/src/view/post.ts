import { Router, Request, Response } from "express";

import PostSchema, { Post } from "../model/Post";
import UserSchema, { User, UserType } from '../model/User';
import ChannelSchema, { Channel } from "../model/Channel";
import Auth from "../controller/Auth";

if(!process.env.CHAR_FOR_SPECIAL_POSTS) throw new Error("CHAR_FOR_SPECIAL_POSTS is not defined in the .env file");
const numCharForSpecialPosts: number=parseInt(process.env.CHAR_FOR_SPECIAL_POSTS);

export const postRoute: Router=Router();

//get all posts or all the posts of a specific user if the id is provided in the 'of' query parameter
//it can be used to get all the posts of a specific keyword if a string is provided in the 'keyword' query parameter
postRoute.get("/", Auth.authorize, (req: Request, res: Response) => {
	if(req.query.of)
		PostSchema.find({ posted_by: req.query.of })
			.then((posts: Post[]) => {
				//check if the post is public or not
				const filteredPosts: Post[] = posts.filter(async (post: Post) => {
					return await ChannelSchema.findById(post.posted_on)
						.then((channel: Channel | null) => {
							if(!channel) return false;
							else if(!channel.private) return true;
							//if the channel is private, check if the user is subscribed to it
							else return req.user!.isSubscribed(channel._id);
						})
						.catch((_: Error) => false);
				});
				res.status(200).json(filteredPosts);
			})
			.catch((err: Error) => res.status(400).json({ msg: "Posts not found", err: err }));
	else if(req.query.keyword)
		PostSchema.find({ keywords: { $in: [req.query.keyword] } })
			.then((posts: Post[]) => {
				//check if the post is public or not
				const filteredPosts: Post[] = posts.filter(async (post: Post) => {
					return await ChannelSchema.findById(post.posted_on)
						.then((channel: Channel | null) => {
							if(!channel) return false;
							else if(!channel.private) return true;
							//if the channel is private, check if the user is subscribed to it
							else return req.user!.isSubscribed(channel._id);
						})
						.catch((_: Error) => false);
				});
				res.status(200).json(filteredPosts);
			})
			.catch((err: Error) => res.status(400).json({ msg: "Posts not found", err: err }));
	else if(req.user!.type === UserType.MOD)
		PostSchema.find()
			.then((posts: Post[]) => res.status(200).json(posts))
			.catch((err: Error) => res.status(400).json({ msg: 'Posts not found', err: err }));
	else res.status(403).json({ msg: "Unauthorized" });
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
					.then(async (user: User | null) => {
						if(!user) return res.status(404).json({ msg: "User not found" });
						//subtract the char count from the user's availability
						let charCount: number = post.title.length;
						if(post.content.text) charCount += post.content.text.length;
						if(post.content.position) charCount += numCharForSpecialPosts;
						if(post.keywords) charCount += post.keywords.reduce((acc: number, curr: string) => acc + curr.length, 0);
						if(!user.canPost(charCount)) return res.status(500).json({ msg: "User can't post" });
						await user.save();
						//save the post
						const newPost: Post=new PostSchema(req.body.post);
						newPost.save()
							.then((post: Post) => res.status(200).json({ post, user_char_availability: user.char_availability }))
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

//update the position of a post
//used for the timed position post
//the body must contain the 'position' field in that way: { latitude: Number, longitude: Number }
postRoute.put("/:id/position", Auth.authorize, (req: Request, res: Response) => {
	if(!req.body.position) res.status(400).json({ msg: "Bad request, no position provided" });
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else if(post.posted_by!=req.user?._id) res.status(401).json({ msg: "Unauthorized" });
			else if(!post.timed) res.status(400).json({ msg: "Bad request, the post is not a timed post" });
			else if(!post.content.position) res.status(400).json({ msg: "Bad request, no position in the post" });
			else {
				post.content.position=req.body.position;
				post.save()
					.then((post: Post) => res.status(200).json({ msg: "Post updated", post: post }))
					.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
});

//update a post
//only a mod can update a post
postRoute.put("/:id", Auth.authorize, Auth.isMod, (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then((post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else {
				const updatedPost: Post=new PostSchema(req.body.post);
				updatedPost.save()
					.then((post: Post) => res.status(200).json(post))
					.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating post", err: err }));
});

//delete a post
postRoute.delete("/:id", Auth.authorize, (req: Request, res: Response) => {
	PostSchema.findByIdAndDelete(req.params.id)
		.then((post: Post | null) => {
			if(!post) return res.status(404).json({ msg: "Post not found" });
			if(post.posted_by != req.user?._id) return res.status(401).json({ msg: "Unauthorized" });
			res.status(200).json({ msg: "Post deleted" });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error deleting post", err: err }));
});

//visualize a post
//automatically add a view to a post
//TODO: decide if the view should be added only from logged users or not(maybe check in the teacher's requirements)
postRoute.patch("/:id/visualize", Auth.authorize, (req: Request, res: Response) => {
	PostSchema.findById(req.params.id)
		.then(async (post: Post | null) => {
			if(!post) res.status(404).json({ msg: "Post not found" });
			else {
				await post.addView(req.user?._id);
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
	if(!req.body.reaction) res.status(400).json({ msg: "Bad request, no reaction provided" });
	else if(Math.abs(req.body.reaction) > 2 || req.body.reaction == 0) res.status(400).json({ msg: "Bad request, reaction not valid" });

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
