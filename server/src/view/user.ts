import { Router, Request, Response } from 'express';

import User from '../model/User';

export const userRoute: Router=Router();

//get all users
userRoute.get('/', (_: Request, res: Response) => {
	User.find()
		.then(users=> res.status(200).json(users))
		.catch(err => res.status(400).json(err));
});

//get a specific user
userRoute.get('/:id', (req: Request, res: Response) => {
	User.findById(req.params.id)
		.then(user=> res.status(200).json(user))
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//create a user
userRoute.post('/', (req: Request, res: Response) => {
	if(!req.body.username || !req.body.password)
		return res.status(400).json({ msg: 'Please send all required fields' });
	const newUser=new User(req.body.user);
	newUser.save()
		.then(user=> res.status(200).json(user))
		.catch(err=> res.status(500).json({ msg: 'Error creating user', err: err }));
});

//update a user
userRoute.put('/:id', (req: Request, res: Response) => {
	const result=User.findByIdAndUpdate(req.params.id, req.body.user);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User updated' });
});

//delete a user
userRoute.delete('/:id', (req: Request, res: Response) => {
	const result=User.findByIdAndDelete(req.params.id);
	if(!result) res.status(404).json({ msg: 'User not found' });
	else res.status(200).json({ msg: 'User deleted' });
});
