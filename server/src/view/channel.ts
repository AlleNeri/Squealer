import { Router, Request, Response } from "express";

import ChannelSchema, { Channel } from "../model/Channel";
import PostSchema, { Post } from "../model/Post";
import { UserType } from "../model/User";
import Auth from "../controller/Auth";

export const channelRoute: Router=Router();

//get all my channels, private and public
channelRoute.get("/my", Auth.authorize, (req: Request, res: Response) => {
	//get only the channels where the logged user is in the owner array
	ChannelSchema.find({ owners: { $in: [req.user!._id] } })
		.then((channels: Channel[]) => res.status(200).json(channels))
		.catch((err: Error) => res.status(400).json(err));
});

//get all private channels, only for admins also get public channels
channelRoute.get("/all", Auth.softAuthorize, (req: Request, res: Response) => {
	//if the user is a mod, get all channels, otherwise only the public ones
	ChannelSchema.find(req.user?.type == UserType.MOD ? {} : { private: false })
		.then((channels: Channel[]) => res.status(200).json(channels))
		.catch((err: Error) => res.status(400).json(err));
});

//get all posts of a channel
//if the channel is private, the user has to be logged in and has to appertain to the channel
//the channel has to be specified in the query: http[...]/channels/{channelId}/posts
channelRoute.get("/:id/posts", Auth.softAuthorize, async (req: Request, res: Response) => {
	const channelId: string=req.params.id;
	const channel: Channel | null = await ChannelSchema.findById(channelId);

	if(!channel) return res.status(404).json({ msg: "Channel not found" });
	else if(channel.private && !req.user) return res.status(401).json({ msg: "You are not logged in" });
	else if(channel.private && !req.user?.appartenence.contains(channelId)) return res.status(401).json({ msg: "You do not have access to this channel" });

	PostSchema.find({
		$or: [
			{ posted_on: channelId },
			{ appartains_to: channelId }
		]
	})
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(400).json({err: err, channel: channel}));
});

//get the info of a specific channel
channelRoute.get("/:id", (req: Request, res: Response) => {
	ChannelSchema.findById(req.params.id)
		.then((channel: Channel | null) => res.status(200).json(channel))
		.catch((err: Error)=> res.status(404).json({ msg: "Channel not found", err: err }));
});

//create a channel
//do not specify the logged user as an owner
channelRoute.post("/", Auth.authorize, (req: Request, res: Response) => {
	req.body.channel.owners=[req.user!._id.toString()];
	const newChannel: Channel=new ChannelSchema(req.body.channel);
	newChannel.save()
		.then((channel: Channel) => res.status(200).json(channel))
		.catch((err: Error) => {
			console.log(err);
			res.status(500).json({ msg: "Error creating channel", err: err })
		});
});

//update a channel
channelRoute.put("/:id", Auth.authorize, async (req: Request, res: Response) => {
	const channelId: string=req.params.id;
	const channel: Channel | null = await ChannelSchema.findById(channelId);

	if(!channel) return res.status(404).json({ msg: "Channel not found" });
	else if(!channel.owners.includes(req.user!._id)) return res.status(401).json({ msg: "You are not an owner of this channel" });

	ChannelSchema.findByIdAndUpdate(channelId, req.body.channel)
		.then((_: Channel | null) => res.status(200).json({ msg: "Channel updated" }))
		.catch((err: Error) => res.status(500).json({ msg: "Error updating channel", err: err }));
});

//modify the importance of a channel
channelRoute.patch("/:id/importance", Auth.authorize, Auth.isMod, (req: Request, res: Response) => {
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
channelRoute.delete("/:id", Auth.authorize, (req: Request, res: Response) => {
	ChannelSchema.findByIdAndDelete(req.params.id)
		.then((channel: Channel | null) => {
			if(!channel) res.status(404).json({ msg: "Channel not found" });
			else if(!channel.owners.includes(req.user!._id)) res.status(401).json({ msg: "You are not an owner of this channel" });
			else res.status(200).json({ msg: "Channel deleted" });
		})
		.catch((err: Error) => res.status(500).json({ msg: "Error deleting channel", err: err }));
});
