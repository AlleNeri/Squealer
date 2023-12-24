import { Router, Request, Response } from 'express';

import UserSchema, { User } from '../model/User';
import Auth from "../controller/Auth";
import { getUserPublicInfo } from '../controller/publicInfo';

import { authenticationRoute } from './authentication';

export const userRoute: Router=Router();

//get all users
userRoute.get('/', Auth.softAuthorize, Auth.isMod, (_: Request, res: Response) => {
	UserSchema.find()
		.then((users: User[]) => res.status(200).json(users))
		.catch(err=> res.status(404).json({ msg: 'Users not found', err: err }));
});

//get a specific user
userRoute.get('/:id', Auth.softAuthorize, (req: Request, res: Response) => {
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

//buy char availability
//body: { period: 'day' | 'week' | 'month', quantity: number }
userRoute.patch('/:id/char', Auth.authorize, (req: Request, res: Response) => {
	if(req.body.period !== 'day' && req.body.period !== 'week' && req.body.period !== 'month' && !req.body.quantity) return res.status(400).json({ msg: 'Bad request' });
	if(req.params.id !== req.user?.id && !req.user?.isClient(req.params.id)) return res.status(401).json({ msg: 'Unauthorized' });
	UserSchema.findById(req.params.id)
		.then((user: User | null) => {
			if(!user) res.status(404).json({ msg: 'User not found' });
			else {
				switch(req.body.period) {
					case 'day':
						if(!user.char_availability.dayly)
							user.char_availability.dayly=user.quote.dayly;
						user.char_availability.dayly+=req.body.quantity;
						break;
					case 'week':
						if(!user.char_availability.weekly)
							user.char_availability.weekly=user.quote.weekly;
						user.char_availability.weekly+=req.body.quantity;
						break;
					case 'month':
						if(!user.char_availability.monthly)
							user.char_availability.monthly=user.quote.monthly;
						user.char_availability.monthly+=req.body.quantity;
						break;
				}
				user.save()
					.then((_: User) => res.status(200).json({ msg: 'Char availability added' }))
					.catch((err: any) => res.status(400).json({ msg: 'Bad request', err: err }));
			}
		})
		.catch(err=> res.status(404).json({ msg: 'User not found', err: err }));
});

//authentication routes
userRoute.use('/', authenticationRoute);
