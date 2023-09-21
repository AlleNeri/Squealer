import { Router, Request, Response } from 'express';

import UserSchema, { User } from '../model/User';

import { registerRouter } from './authentication';

export const userRoute: Router=Router();

//get all users
userRoute.get('/', (_: Request, res: Response) => {
	UserSchema.find()
		.then((users: User[]) => res.status(200).json(users))
		.catch(err => res.status(400).json(err));
});

//get a specific user
userRoute.get('/:id', (req: Request, res: Response) => {
	UserSchema.findById(req.params.id)
		.then((user: User | null) => res.status(200).json(user))
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//update a user
userRoute.put('/:id', (req: Request, res: Response) => {
	const user: User=UserSchema.findByIdAndUpdate(req.params.id, req.body.user);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User updated' });
});

//delete a user
userRoute.delete('/:id', (req: Request, res: Response) => {
	const user: User=UserSchema.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User deleted' });
});

//register a user
userRoute.use('/register', registerRouter);
