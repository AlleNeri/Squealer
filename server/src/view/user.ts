import { Router, Request, Response } from 'express';

import UserSchema, { User } from '../model/User';

import { authenticationRoute } from './authentication';

export const userRoute: Router=Router();

//get a specific user
userRoute.get('/:id', (req: Request, res: Response) => {
	UserSchema.findById(req.params.id)
		.then((user: User | null) => res.status(200).json(user))
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//update a user
userRoute.put('/:id', (req: Request, res: Response) => {
	UserSchema.findByIdAndUpdate(req.params.id, req.body.user)
		.then((user: User | null) => {
			if(!user) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ msg: 'User updated' });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//delete a user
userRoute.delete('/:id', (req: Request, res: Response) => {
	UserSchema.findByIdAndDelete(req.params.id).
		then((result: User | null) => {
			if(!result) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ msg: 'User deleted' });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//authentication routes
userRoute.use('/', authenticationRoute);
