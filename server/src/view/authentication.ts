import { Router, Request, Response } from "express";

import { HashSalt, generateHashSalt } from "../controller/pwdUtils";
import { AuthUser as User } from "../model/types.d";

export const router: Router = Router();

router.post("/register", (req: Request, res: Response) => {
	//user has to provide username and password
	//if not, send error
	if (!req.body.username || !req.body.password) res.send({ success: false, msg: "Please pass username and password." });
	//if yes, create new user
	else {
		const newUserInfo: User = {
			username: req.body.username,
			hashSalt: generateHashSalt(req.body.password),
		}
		// TODO: save the new user in the databaase
		// something like this:
		// const newUser=new User(newUserInfo);
		// newUser.save()
		// 	.then((user) => {
		// 			const jwt=generateJWT(user);
		//			res.json({ success: true, msg: "Successful created new user.", user: user, token: jwt });
		//		})
		// 		.catch((err) => next(err));
	}
});
