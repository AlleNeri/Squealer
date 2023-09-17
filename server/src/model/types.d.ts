import mongoose from 'mongoose';

interface User extends AuthUser {
	_id: string;
};

export { ICredentials, User };
