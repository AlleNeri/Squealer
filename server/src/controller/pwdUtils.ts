import fs from 'fs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import "../env";
import { User } from '../model/User';

interface IHashSalt {
	salt: string;
	hash: string;
}

function generateHashSalt(password: string): IHashSalt {
	let hashSalt: IHashSalt={ salt: '', hash: '' };
	hashSalt.salt=crypto.randomBytes(32).toString('hex'),
	hashSalt.hash=crypto.pbkdf2Sync(password, hashSalt.salt, 10000, 64, 'sha512').toString('hex')
	return hashSalt;
}

function issueJwt(user: User): object {
	const expiresIn: string='1d';
	const payload: object={
		sub: user._id,
		iat: Date.now(),
	};
	const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
		privKey : string | undefined = process.env.PRIV_KEY_NAME;
	if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
	if(privKey === undefined) throw new Error("PRIV_KEY_NAME is not defined in the config.env file.");
	const PRIV_KEY=fs.readFileSync(`${keyLocation}/${privKey}`, 'utf8');
	//TODO: if we have time we should find a way to read the file only once and store it in a variable(read the file is a very expensive operation)

	const signedToken: string=jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

	return {
		token: `Bearer ${signedToken}`,
		expires: expiresIn,
	}
}

export { IHashSalt as HashSalt, generateHashSalt, issueJwt };
