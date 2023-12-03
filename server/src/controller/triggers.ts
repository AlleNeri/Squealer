import UserModel from '../model/User';

//adding a trigger to the User model
UserModel.watch().on('change', (data: any) => {
	if(data.operationType !== 'delete') {
		UserModel.findOne({ _id: data.documentKey._id })
			.then((user: any) => {
				if(user) {
					user.updateCharAvailability();
					user.save();
				}
			})
			.catch((err: any) => console.log(err));
		console.log('User updated');
	}
});
