import { Request, Response } from 'express';

//the middleware called after the jwt strategy
export const checkLogin=() => {
	return (req: Request, res: Response, next: Function) => {
		if(req.isAuthenticated()) return next();
		else return res.status(401).json({ message: "Unauthorized" });
	};
};
