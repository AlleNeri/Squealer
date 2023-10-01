import { Router, Request, Response } from "express";

import Auth from "../controller/Auth";

import UserSchema, { User } from "../model/User";
import { Credentials } from "../model/Credentials";

export const authenticationRoute: Router = Router();

//create a user
//2 elements are required in the body:
//{ user: { ...all the user data... }; password: string }
//in case of success, return the user data and a JWT token: { user: { ...all the user data... }, token: string, ...others... }
authenticationRoute.post("/register", (req: Request, res: Response) => {
	//user has to provide username and password
	//if not, send error
	if(!req.body.password) res.status(400).json({ success: false, msg: "Please pass password." });
	if(!req.body.user) res.status(400).json({ success: false, msg: "Please pass user data." });
	//if yes, create new user
	else {
		//create and save a new user
		const newUser: User = new UserSchema(req.body.user);
		newUser.save()
			.then((user: User)=> {
				//create and save credentials of the new user
				const newCredentials: Credentials = Auth.signUp(user._id, req.body.password);
				newCredentials.save()
					.then((_: Credentials)=> {
						//get JWT token and send it to the user
						Auth.signInWithUser(user, req.body.password)
							.then((token: object | null)=> {
								if(!token) res.status(500).json({ success: false, msg: "Error accessing user. It's probably a server error." });
								else res.status(201).json({ success: true, msg: "Successful created new user.", user: user, token: token });
							})
							.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error creating user.", err: err }));
					})
					.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error accessing user.", err: err }));
			})
			.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error creating user.", err: err }));
	}
});

//login a user
//2 elements are required in the body:
//{ username: string; password: string }
authenticationRoute.post("/login", (req: Request, res: Response) => {
	//user has to provide username and password
	//if not, send error
	if(!req.body.password) res.status(400).json({ success: false, msg: "Please pass password." });
	if(!req.body.username) res.status(400).json({ success: false, msg: "Please pass username." });
	//if yes, find the user
	else {
		//find the user in the database
		Auth.signIn(req.body.username, req.body.password)
			.then((token: object | null)=> {
				if(!token) res.status(500).json({ success: false, msg: "Error accessing user. It's probably a server error." });
				else res.status(200).json({ success: true, msg: "Successful login.", token: token });
			})
			.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error accessing user.", err: err }));
	}
});
