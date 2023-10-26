import { Router, Request, Response } from 'express';

import UserSchema, { User } from '../model/User';
import Auth from "../controller/Auth";
import { getUserPublicInfo } from '../controller/publicInfo';

import { authenticationRoute } from './authentication';

export const userRoute: Router=Router();

//get a specific user
userRoute.get('/:id', Auth.softAuthorize, (req: Request, res: Response) => {
	//TODO: check if the user is authorized to see this user
	//if it's not, return only the public info
	UserSchema.findById(req.params.id)
		.then((user: User | null) => {
			//check if the authenticated user is authorized to see this user
			if(req.user===undefined) return res.status(200).json(getUserPublicInfo(user));
			else if(req.user?.isClient(req.params.id)) return res.status(200).json(user);
			else if(req.user?.id === req.params.id) return res.status(200).json(user);
			else return res.status(200).json(getUserPublicInfo(user));
		})
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

//get char availability
//only a social media manager can do this
userRoute.get('/:id/char', Auth.authorize, Auth.isSMM, (req: Request, res: Response) => {
	if(!req.user?.isClient(req.params.id)) return res.status(401).json({ msg: 'Unauthorized' });
	UserSchema.findById(req.params.id)
		.then((user: User | null) => {
			if(!user) res.status(404).json({ msg: 'User not found' });
			else res.status(200).json({ char_availability: user.char_availability });
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//authentication routes
userRoute.use('/', authenticationRoute);
