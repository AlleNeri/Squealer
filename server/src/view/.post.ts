//get all the post of a specific user
postRoute.get("/:user", (req: Request, res: Response) => {
	PostSchema.find({ user: req.params.user })
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(404).json({ msg: "Posts not found", err: err }));
});

//get all the post in a specific channel
postRoute.get("/:channel", (req: Request, res: Response) => {
	PostSchema.find({ channel: req.params.channel })
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(404).json({ msg: "Posts not found", err: err }));
});

//get all posts with a specific tag
postRoute.get("/:tag", (req: Request, res: Response) => {
	PostSchema.find({ tags: req.params.tag })
		.then((posts: Post[]) => res.status(200).json(posts))
		.catch((err: Error) => res.status(404).json({ msg: "Posts not found", err: err }));
});
