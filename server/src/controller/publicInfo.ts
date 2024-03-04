import { User } from '../model/User';

function getUserPublicInfo(user: User | null) {
	if(!user) return { msg: 'User not found' };
	else return {
		id: user.id,
		u_name: user.u_name,
		name: user.name,
		img: user.img,
		creation_date: user.creation_date,
		b_date: user.b_date,
		block: user.block,
	};
}

export { getUserPublicInfo };
