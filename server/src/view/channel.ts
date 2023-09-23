import { Router, Request, Response } from "express";

import ChannelSchema, { Channel } from "../model/Channel";

export const channelRoute: Router=Router();

//get all channels or filter by query params
channelRoute.get("/", async (req: Request, res: Response) => {
	ChannelSchema.find(req.query)
		.then((channels: Channel[]) => res.status(200).json(channels))
		.catch((err: Error) => res.status(400).json({ msg: "Channel not found", err: err }));
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
	const result: Channel=ChannelSchema.findByIdAndUpdate(req.params.id, req.body.channel);
	if(!result) res.status(404).json({ msg: "Channel not found" });
	else res.status(200).json({ msg: "Channel updated" });
});

//delete a channel
channelRoute.delete("/:id", async (req: Request, res: Response) => {
	const result: Channel=ChannelSchema.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: "Channel not found" });
	else res.status(200).json({ msg: "Channel deleted" });
});
