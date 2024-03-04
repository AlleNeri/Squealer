import { Router, Request, Response } from "express";

export const router: Router = Router();

router.get(`/`, (req: Request, res: Response)=>{
	res.send(`The router seams to work fine!`);
});
