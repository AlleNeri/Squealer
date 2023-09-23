import { Router, Request, Response } from 'express';
import passport from 'passport';

import UserSchema, { User } from '../model/User';

import { registerRouter, loginRouter } from './authentication';

export const userRoute: Router=Router();

//get all users or filter by query params
userRoute.get('/', (req: Request, res: Response) => {
	UserSchema.find(req.query)
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
//TODO: understude if passport.authenticate("jwt", { session: false }) is correct
userRoute.put('/:id', passport.authenticate("jwt", { session: false }), (req: Request, res: Response) => {
	const result: User=UserSchema.findByIdAndUpdate(req.params.id, req.body.user);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User updated' });
});

//delete a user
userRoute.delete('/:id', (req: Request, res: Response) => {
	const result: User=UserSchema.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User deleted' });
});

//register a user
userRoute.use('/register', registerRouter);

//login a user
userRoute.use('/login', loginRouter);
