import corn from 'node-cron';
import axios from 'axios';

import UserSchema, { User } from './model/User';
import ChannelSchema, { Channel } from './model/Channel';
import PostSchema, { Post } from './model/Post';
import ImgaeSchema, { Image } from './model/Image';

(async () =>{
	//utils
	const urlImgProfile: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1200px-NASA_logo.svg.png';

	const possibleKeywords: string[]= ['space', 'universe', 'astronomy', 'cosmos', 'galaxy', 'planet', 'star', 'earth', 'moon', 'sun', 'solar', 'system', 'milky', 'black hole', 'nebula', 'supernova', 'asteroid', 'comet', 'meteor', 'meteorite', 'satellite', 'telescope', 'astronaut', 'rocket', 'spacecraft', 'space', 'station', 'shuttle', 'exploration', 'research', 'science', 'technology', 'engineering', 'physics', 'chemistry', 'biology', 'geology', 'geography', 'medicine', 'mathematics', 'computer', 'astrophysics', 'astrochemistry', 'astrogeology', 'astromathematics', 'astromedicine', 'astroengineering', 'university'];

	const listOfTags = (text: string): string[] => {
		const tags: string[] = [];
		possibleKeywords.forEach((keyword: string) => (text.toLowerCase().includes(keyword.toLowerCase()) ? tags.push(keyword) : null));
		return tags;
	};

	//get or create a nasabot profile
	const nasabotProfileSchema: User={
		u_name: 'NASA dayly squeal',
		name: { 
			first: 'NASA',
			last: 'Narional Aeronautics and Space Administration'
		},
		email: 'fake@nasa.us',
		type: 'bot',
	};
	//if the user already exists, get it
	let nasabotProfile: User | null = await UserSchema.findOne({ u_name: nasabotProfileSchema.u_name });
	//if the user doesn't exist, create it
	if(!nasabotProfile) {
		const img: string=await axios.get(urlImgProfile, { responseType: 'arraybuffer' })
			.then((response) => Buffer.from(response.data, 'binary').toString('base64'))
			.catch((error) => {
				console.log("Error occurred while creating nasa bot.\n", error)
				return '';
			});

		const image: Image = new ImgaeSchema({ data: img, contentType: 'image/png' });
		await image.save();
		nasabotProfileSchema.img = image._id;
		nasabotProfile=new UserSchema(nasabotProfileSchema);
		await nasabotProfile.save();
		console.log('NASA bot created. Id: ', nasabotProfile!._id);
	}
	else console.log('NASA bot already exists. Id: ', nasabotProfile._id);

	//get or create a nasabot channel
	const nasabotChannelSchema: Channel={
		name: 'NASA-ON-SQUEALER',
		description: 'NASA\'s daily squeal on squealer. Every day a new image from NASA\'s astronomy picture of the day.',
		importance: 3,
		owners: [ nasabotProfile._id ],
	};
	//if the channel already exists, get it
	const nasabotChannel: Channel | null = await ChannelSchema.findOne({ name: nasabotChannelSchema.name });
	//if the channel doesn't exist, create it
	if(!nasabotChannel) {
		const nasabotChannel: Channel = new ChannelSchema(nasabotChannelSchema);
		await nasabotChannel.save();
		console.log('NASA channel created. Id: ', nasabotChannel._id);
	}
	else console.log('NASA channel already exists. Id: ', nasabotChannel._id);

	//create a nasabot post every day at 00:05
	if(!process.env.NASA_API_KEY) throw new Error('NASA_API_KEY is not defined in the config.env file.');
	corn.schedule('05 00 * * *', async () => {
		const { NASA_API_KEY } = process.env;
		const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
		const daylyImage: String = await axios.get(response.data.url, { responseType: 'arraybuffer' })
			.then((response) => Buffer.from(response.data, 'binary').toString('base64'))
			.catch((error) => {
				console.log("Error occurred while creating nasa bot.\n", error)
				return '';
			});
		const savedDaylyImage: Image = new ImgaeSchema({ data: daylyImage, contentType: 'image/png' });
		await savedDaylyImage.save();
		const daylyPost: Post= new PostSchema({
			title: response.data.title,
			content: {
				text: response.data.explanation,
				img: savedDaylyImage._id,
			},
			keywords: listOfTags(response.data.explanation),
			posted_by: nasabotProfile!._id,
			posted_on: nasabotChannel!._id,
		});
		await daylyPost.save();
	}, {
		scheduled: true,
		timezone: 'Europe/Rome'
	});
})();
