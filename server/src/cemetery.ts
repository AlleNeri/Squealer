import axios from 'axios';

import UserSchema, { User } from './model/User';
import ImageSchema, { Image } from './model/Image';

(async ()=> {
	const imgUri: string = 'https://i.pinimg.com/originals/09/7e/e3/097ee3339dcb0cdc4eaf1cd2b9caa0e3.png';

	//get or create cemetery profile
	const cemeteryProfileSchema: User = {
		u_name: process.env.CEMETERY_NAME || 'Cemetery',
		name: {
			first: 'R.I.P.',
			last: 'Rest In Peace'
		},
		email: 'fake@email.rip',
		type: 'bot'
	};
	let cemeteryProfile: User | null = await UserSchema.findOne({ u_name: 'Cemetery' });
	if (!cemeteryProfile) {
		const tombstoneImg: string = await axios.get(imgUri, { responseType: 'arraybuffer' })
			.then((res) => Buffer.from(res.data, 'binary').toString('base64'))
			.catch((err) => {
				console.log("Error occurred while creating cemetery profile.\n", err)
				return '';
			});

		const image: Image = new ImageSchema({ data: tombstoneImg, contentType: 'image/png' });
		await image.save();
		cemeteryProfileSchema.img = image._id;
		cemeteryProfile=new UserSchema(cemeteryProfileSchema);
		await cemeteryProfile.save();
		console.log("Cemetery profile created. Id:", cemeteryProfile._id);
	}
	else console.log("Cemetery profile found. Id:", cemeteryProfile._id);
})();
