import { Router, Request, Response } from "express";

import Auth from "../controller/Auth";

import { User } from "../model/User";

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
		//create a new user
		Auth.signUp(req.body.user, req.body.password)
			.then((user: User | null)=> {
				if(!user) res.status(500).json({ success: false, msg: "Error creating user. It's probably a server error." });
				else {
					//get JWT token and send it to the user
					Auth.signInWithUser(user, req.body.password)
						.then((token: any | null)=> {
							if(!token) res.status(500).json({ success: false, msg: "Error accessing user. It's probably a server error." });
							else res.status(201).json({ success: true, msg: "Successful created new user.", user: token.userId, jwt: token.authToken });
						})
						.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error creating user.", err: err }));
				}
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
			.then((token: any | null)=> {
				if(!token) res.status(500).json({ success: false, msg: "Error accessing user. It's probably a server error." });
				else res.status(200).json({ success: true, msg: "Successful login.", jwt: token.authToken, id: token.userId });
			})
			.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error accessing user.", err: err }));
	}
});

//delete a user
//the request has to contain the user id in the params
authenticationRoute.delete("/:id/delete", Auth.authorize, (req: Request, res: Response) => {
	//check if the user is the same as the one in the params
	if(req.params.id !== req.user?._id.toString()) return res.status(401).json({ success: false, msg: "Unauthorized." });
	//delete the user
	Auth.deleteUser(req.user?._id.toString())
		.then((result: boolean)=> {
			if(!result) res.status(500).json({ success: false, msg: "Error deleting user. It's probably a server error." });
			else res.status(200).json({ success: true, msg: "Successful deleted user." });
		})
		.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error deleting user.", err: err }));
});

//change password
//the request has to contain the user id in the params
//and the old and new password in the body with the new password
//the format is: { oldPassword: string; newPassword: string }
//this route isn't authenticated because the user has to insert the old password to change it
authenticationRoute.put("/:id/changePassword", (req: Request, res: Response) => {
	Auth.changePassword(req.params.id, req.body.oldPassword, req.body.newPassword)
		.then((result: boolean)=> {
			if(!result) res.status(500).json({ success: false, msg: "Error changing password." });
			else res.status(200).json({ success: true, msg: "Successful changed password." });
		})
		.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error changing password.", err: err }));
});
