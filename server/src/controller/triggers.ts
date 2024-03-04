import cron from 'node-cron';

import UserModel, { User } from '../model/User';

//adding a trigger to the User model
//because of we are using mongo db(a project constraint) but triggers are not supported in mongo db
//we are using a workaround to simulate triggers
//the triggers we need to add are periodic triggers so we are using a cron job to simulate them

//this trigger updates the char_availability field of the user every day at 00:00
cron.schedule('0 0 * * *', async () => {
	UserModel.find()
		.then((users: User[]) => {
			users.forEach((user: User) => {
				user.char_availability.dayly = user.quote.dayly;
				user.save();
			})
		})
		.catch((error: Error) => console.error(error));
});

//this trigger updates the char_availability field of the user every week at 00:00 on sunday
//the day in the cron job string is intended to be the first day of the week, but I read it depends on the system configuration, so it may not work exactly as expected
cron.schedule('0 0 * * 0', async () => {
	UserModel.find()
		.then((users: User[]) => {
			users.forEach((user: User) => {
				user.char_availability.weekly = user.quote.weekly;
				user.save();
			})
		})
		.catch((error: Error) => console.error(error));
});

//this trigger updates the char_availability field of the user every month at 00:00 on the first day of the month
cron.schedule('0 0 1 * *', async () => {
	UserModel.find()
		.then((users: User[]) => {
			users.forEach((user: User) => {
				user.char_availability.monthly = user.quote.monthly;
				user.save();
			})
		})
		.catch((error: Error) => console.error(error));
});
