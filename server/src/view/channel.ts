import { Router, Request, Response } from "express";

import ChannelSchema, { Channel } from "../model/Channel";
import PostSchema, { Post } from "../model/Post";
import Auth from "../controller/Auth";

export const channelRoute: Router=Router();

//get all my channels
//TODO: test this
//TODO: find out if the passport middleware helps and put the id in the req
//		otherwise, ask for the id in the body
channelRoute.get("/my", Auth.authorize, (req: Request, res: Response) => {
	console.log(req.user);
	ChannelSchema.find({ author: req.user!._id })
		.then((posts: Channel[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json(err));
});

//get all posts of a channel
//the channel has to be specified in the query: http ... /channels/{channelId}/posts
channelRoute.get("/:id/posts", (req: Request, res: Response) => {
	const channel: string=req.params.id;
	PostSchema.find({
		$or: [
			{ posted_on: channel },
			{ appartains_to: channel }
		]
	})
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json({err: err, channel: channel}));
});

//get a specific channel
channelRoute.get("/:id", async (req: Request, res: Response) => {
	ChannelSchema.findById(req.params.id)
		.then((channel: Channel | null) => res.status(200).json(channel))
		.catch((err: Error)=> res.status(404).json({ msg: "Channel not found", err: err }));
});

//create a channel
channelRoute.post("/", async (req: Request, res: Response) => {
	const newChannel: Channel=new ChannelSchema(req.body.channel);
	newChannel.save()
		.then((channel: Channel) => res.status(200).json(channel))
		.catch((err: Error) => res.status(500).json({ msg: "Error creating channel", err: err }));
});

//update a channel
channelRoute.put("/:id", async (req: Request, res: Response) => {
	ChannelSchema.findByIdAndUpdate(req.params.id, req.body.channel)
		.then((channel: Channel | null) => {
			if(!channel) res.status(404).json({ msg: "Channel not found" });
			else res.status(200).json({ msg: "Channel updated" });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error updating channel", err: err }));
});

//modify the importance of a channel
channelRoute.patch("/:id/importance", async (req: Request, res: Response) => {
	ChannelSchema.findById(req.params.id)
		.then((channel: Channel | null) => {
			if(!channel) res.status(404).json({ msg: "Channel not found" });
			else {
				channel.modifyImportance(req.body.importance);
				const result=channel.save();
				res.status(200).json(result);
			}
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error modifying channel importance", err: err }));
});

//delete a channel
channelRoute.delete("/:id", async (req: Request, res: Response) => {
	ChannelSchema.findByIdAndDelete(req.params.id)
		.then((channel: Channel | null) => {
			if(!channel) res.status(404).json({ msg: "Channel not found" });
			else res.status(200).json({ msg: "Channel deleted" });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error deleting channel", err: err }));
});
