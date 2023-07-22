import { HashSalt } from '../controller/pwdUtils';

interface AuthUser {
	username: string;
	hashSalt: HashSalt;
};

interface User extends AuthUser {
	_id: string;
};

export { AuthUser, User };
