import { Router, Request, Response } from "express";

import ChannelSchema, { Channel } from "../model/Channel";

export const channelRouter: Router=Router();

//get all channels
channelRouter.get("/", async (_: Request, res: Response) => {
	ChannelSchema.find()
		.then((channels: Channel[]) => res.status(200).json(channels))
		.catch((err: Error) => res.status(400).json({ msg: "Channel not found", err: err }));
});

//get a specific channel
channelRouter.get("/:id", async (req: Request, res: Response) => {
	ChannelSchema.findById(req.params.id)
		.then((channel: Channel | null) => res.status(200).json(channel))
		.catch((err: Error)=> res.status(404).json({ msg: "Channel not found", err: err }));
});

//create a channel
channelRouter.post("/", async (req: Request, res: Response) => {
	if(!req.body.name)
		return res.status(400).json({ msg: "Please send all required fields" });
	const newChannel: Channel=new ChannelSchema(req.body.channel);
	newChannel.save()
		.then((channel: Channel) => res.status(200).json(channel))
		.catch((err: Error) => res.status(500).json({ msg: "Error creating channel", err: err }));
});

//update a channel
channelRouter.put("/:id", async (req: Request, res: Response) => {
	const result: Channel=ChannelSchema.findByIdAndUpdate(req.params.id, req.body.channel);
	if(!result) res.status(404).json({ msg: "Channel not found" });
	else res.status(200).json({ msg: "Channel updated" });
});

//delete a channel
channelRouter.delete("/:id", async (req: Request, res: Response) => {
	const result: Channel=ChannelSchema.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: "Channel not found" });
	else res.status(200).json({ msg: "Channel deleted" });
});
