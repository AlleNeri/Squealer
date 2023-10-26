import { User } from '../model/User';

function getUserPublicInfo(user: User | null) {
	if(!user) return { msg: 'User not found' };
	else return {
		id: user.id,
		u_name: user.u_name,
		name: user.name,
		img: user.img,
	};
}

export { getUserPublicInfo };
