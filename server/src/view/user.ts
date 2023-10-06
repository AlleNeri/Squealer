import { Router, Request, Response } from 'express';

import UserSchema, { User } from '../model/User';
import Auth from "../controller/Auth";

import { authenticationRoute } from './authentication';

export const userRoute: Router=Router();

//get a specific user
userRoute.get('/:id', (req: Request, res: Response) => {
	UserSchema.findById(req.params.id)
		.then((user: User | null) => res.status(200).json(user))
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//update a user
userRoute.put('/:id', Auth.authorize, (req: Request, res: Response) => {
	const id: string = req.params.id || req.user?.id;
	if(id !== req.user?.id) return res.status(401).json({ msg: 'Unauthorized' });
	UserSchema.findByIdAndUpdate(req.params.id, req.body.user)
		.then((user: User | null) => {
			if(!user) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ msg: 'User updated' });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//delete a user
userRoute.delete('/:id', Auth.authorize, (req: Request, res: Response) => {
	const id: string = req.params.id || req.user?.id;
	if(id !== req.user?.id) return res.status(401).json({ msg: 'Unauthorized' });
	UserSchema.findByIdAndDelete(req.params.id).
		then((result: User | null) => {
			if(!result) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ msg: 'User deleted' });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//get char availability
//only a social media manager can do this
//TODO: check if the social media manager has the user as a client
userRoute.get('/:id/char', Auth.authorize, Auth.isSMM, (req: Request, res: Response) => {
	UserSchema.findById(req.params.id)
		.then((user: User | null) => {
			if(!user) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ msg: 'Char availability', char_availablity: user.char_availablity });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//authentication routes
userRoute.use('/', authenticationRoute);
