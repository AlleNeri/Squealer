import { Router, Request, Response } from "express";

import { HashSalt, generateHashSalt, issueJwt, validatePassword } from "../controller/pwdUtils";

import UserSchema, { User } from "../model/User";
import UserCredentials, { Credentials } from "../model/Credentials";

export const registerRouter: Router = Router();

//create a user
//2 elements are required in the body:
//{ user: { ...all the user data... }; password: string }
//in case of success, return the user data and a JWT token: { user: { ...all the user data... }, token: string, ...others... }
registerRouter.post("/", (req: Request, res: Response) => {
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
				const hashSalt: HashSalt=generateHashSalt(req.body.password);
				const newCredentials: Credentials=new UserCredentials({ hash: hashSalt.hash, salt: hashSalt.salt, user_id: user._id});
				newCredentials.save()
					.then((_: Credentials)=> {
						//get JWT token and send it to the user
						const token: object=issueJwt(user);
						req.login(user, (err: Error)=> {
							if(err) res.status(500).json({ success: false, msg: "Error creating user.", err: err });
						});
						res.status(201).json({ success: true, msg: "Successful created new user.", user: user, token: token })
					})
					.catch((err: Error)=> { throw err; });
			})
			.catch((err: Error)=> res.status(500).json({ success: false, msg: "Error creating user.", err: err }));
	}
});

export const loginRouter: Router = Router();

//login a user
//2 elements are required in the body:
//{ username: string; password: string }
loginRouter.post("/", (req: Request, res: Response) => {
	//user has to provide username and password
	//if not, send error
	if(!req.body.password) res.status(400).json({ success: false, msg: "Please pass password." });
	if(!req.body.username) res.status(400).json({ success: false, msg: "Please pass username." });
	//if yes, find the user
	else {
		//find the user in the database
		UserSchema.findOne({ username: req.body.username })
			.then((user: User | null)=> {
				//if user not found, send error
				if(!user) res.status(401).json({ success: false, msg: "Authentication failed. User not found." });
				//if user found, find the credentials
				else {
					//find the credentials in the database
					UserCredentials.findOne({ user_id: user._id })
						.then((credentials: Credentials | null)=> {
							//if credentials not found, send error. Generally, this should not happen; if it does, it's probably a server error
							if(!credentials) res.status(500).json({ success: false, msg: "Authentication failed. Credentials not found. It's probably a server error." });
							//if credentials found, check the password
							else {
								//check the password
								if(validatePassword(req.body.password, credentials.hash, credentials.salt)) {
									//if password is correct, get JWT token and send it to the user
									const token: object = issueJwt(user);
									res.status(200).json({ success: true, msg: "Successful authentication.", user: user, token: token });
								}
								//if password is incorrect, send error
								else res.status(401).json({ success: false, msg: "Authentication failed. Wrong password." });
							}
						})
						.catch((err: Error)=> { throw err; });
				}
			})
			.catch((err: Error)=> { throw err; });
	}
});
