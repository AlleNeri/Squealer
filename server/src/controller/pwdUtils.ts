import fs from 'fs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import "../env";
import { User } from '../model/User';

//reading the private key from the file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
	  privKey : string | undefined = process.env.PRIV_KEY_NAME,
	  iter : string | undefined = process.env.ITERATIONS,
	  keyLen : string | undefined = process.env.KEYLEN,
	  dig : string | undefined = process.env.DIGEST;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
if(privKey === undefined) throw new Error("PRIV_KEY_NAME is not defined in the config.env file.");
export const PRIV_KEY=fs.readFileSync(`${keyLocation}/${privKey}`, 'utf8');

if(iter === undefined) throw new Error("ITERATIONS is not defined in the config.env file.");
const iterations: number=parseInt(iter);

if(keyLen === undefined) throw new Error("KEYLEN is not defined in the config.env file.");
const keyLength: number=parseInt(keyLen);

if(dig === undefined) throw new Error("DIGEST is not defined in the config.env file.");
const digest: string=dig;

interface IHashSalt {
	salt: string;
	hash: string;
}

//generate a hash and salt for the password
function generateHashSalt(password: string): IHashSalt {
	let hashSalt: IHashSalt={ salt: '', hash: '' };
	hashSalt.salt=crypto.randomBytes(32).toString('hex'),
	hashSalt.hash=crypto.pbkdf2Sync(password, hashSalt.salt, iterations, keyLength, digest).toString('hex');
	return hashSalt;
}

//validate the password
function validatePassword(password: string, hash: string, salt: string): boolean {
	const hashVerify=crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');
	return hash === hashVerify;
}

//issue a Json Web Token
function issueJwt(user: User): object {
	const expiresIn: string='1d';
	const payload: object={
		sub: user._id,
		iat: Date.now(),
	};

	const signedToken: string=jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

	return {
		token: `Bearer ${signedToken}`,
		expires: expiresIn,
	}
}

export { IHashSalt as HashSalt, generateHashSalt, issueJwt, validatePassword };
