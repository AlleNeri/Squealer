import fs from "fs";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import UserSchema, { User } from "../model/User";
import CredentialsSchema, { Credentials } from "../model/Credentials";

//add user field to the express request object
declare global {
	namespace Express {
		export interface Request {
			user?: User;
		}
	}
}

//reading the private key from the file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
	  privKey : string | undefined = process.env.PRIV_KEY_NAME,
	  pubKey : string | undefined = process.env.PUB_KEY_NAME,
	  iter : string | undefined = process.env.ITERATIONS,
	  keyLen : string | undefined = process.env.KEYLEN,
	  dig : string | undefined = process.env.DIGEST,
	  expiresIn : string | undefined = process.env.JWT_EXPIRES_IN;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
if(privKey === undefined) throw new Error("PRIV_KEY_NAME is not defined in the config.env file.");
const PRIV_KEY=fs.readFileSync(`${keyLocation}/${privKey}`, 'utf8');

if(pubKey === undefined) throw new Error("PUB_KEY_NAME is not defined in the config.env file.");
const PUB_KEY=fs.readFileSync(`${keyLocation}/${pubKey}`, 'utf8');

if(iter === undefined) throw new Error("ITERATIONS is not defined in the config.env file.");
const iterations: number=parseInt(iter);

if(keyLen === undefined) throw new Error("KEYLEN is not defined in the config.env file.");
const keyLength: number=parseInt(keyLen);

if(dig === undefined) throw new Error("DIGEST is not defined in the config.env file.");
const digest: string=dig;

if(expiresIn === undefined) throw new Error("JWT_EXPIRES_IN is not defined in the config.env file.");

interface IHashSalt {
	salt: string;
	hash: string;
}

abstract class Auth {
	//validate the password
	private static validatePassword(password: string, hash: string, salt: string): boolean {
		const hashVerify=crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');
		return hash === hashVerify;
	}

	//generate a hash and salt for the password
	private static generateHashSalt=(password: string): IHashSalt => {
		let hashSalt: IHashSalt={ salt: '', hash: '' };
		hashSalt.salt=crypto.randomBytes(32).toString('hex'),
		hashSalt.hash=crypto.pbkdf2Sync(password, hashSalt.salt, iterations, keyLength, digest).toString('hex');
		return hashSalt;
	}

	//generate a Json Web Token
	private static generateJwt(user: User): object {
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

	//verify a Json Web Token
	private static async verifyJwt(bearerToken: string): Promise<string | jsonwebtoken.JwtPayload | null> {
		if((!bearerToken.startsWith('Bearer ') && !bearerToken.startsWith('bearer ')) || bearerToken.split(' ').length !== 2) return null;
		const token: string=bearerToken.split(' ')[1];
		return jsonwebtoken.verify(token, PUB_KEY, { algorithms: ['RS256'] });
	}

	public static async signUp(userObj: object, password: string): Promise<User | null> {
		const newUser: User = new UserSchema(userObj);
		return newUser.save()
			.then((user: User)=> {
				const hashSalt: IHashSalt=Auth.generateHashSalt(password);
				const c: Credentials=new CredentialsSchema({ user_id: user._id });
				c.setHashSalt(hashSalt);
				const newCredentials: Credentials=new CredentialsSchema(c);
				return newCredentials.save()
					.then((credentials: Credentials) => {
						if(credentials) return user;
						else {
							//the user is saved but the credentials are not
							//delete the user
							return UserSchema.findByIdAndDelete(user._id)
								.then((_: User | null) => { return null; })
								.catch((_: any) => { return null; });//this must create an inconsistency in the database: user created but no credentials
						}
					})
					.catch((_: any) => { return null; });
			})
			.catch((_: any) => { return null; });
	}

	public static async signInWithUser(user: User, password: string): Promise<object | null> {
		return CredentialsSchema.findOne({ user_id: user._id })
			.then((credentials: Credentials | null) => {
				if(!credentials) return null;
				if(!Auth.validatePassword(password, credentials.hash, credentials.salt)) return null;
				return Auth.generateJwt(user);
			})
			.catch((_: any) => { return null; });
	}

	public static async signIn(u_name: string, password: string): Promise<object | null> {
		return UserSchema.findOne({ u_name: u_name })
			.then((user: User | null) => {
				if(!user) return null;
				return Auth.signInWithUser(user, password);
			})
			.catch((_: any) => { return null; });
	}

	public static async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
		return CredentialsSchema.findOne({ user_id: id })
			.then((credentials: Credentials | null) => {
				if(!credentials) return false;
				if(!Auth.validatePassword(oldPassword, credentials.hash, credentials.salt)) return false;
				const hashSalt: IHashSalt=Auth.generateHashSalt(newPassword);
				credentials.setHashSalt(hashSalt);
				return credentials.save()
					.then((_: Credentials) => { return true; })
					.catch((_: any) => { return false; });
			})
			.catch((_: any) => { return false; });
	}

	public static async deleteUser(user_id: string): Promise<boolean> {
		return CredentialsSchema.findOneAndDelete({ user_id: user_id })
			.then((credentials: Credentials | null) => {
				if(!credentials) return false;
				return UserSchema.findByIdAndDelete(user_id)
					.then((_: User | null) => { return true; })
					.catch((_: any) => { return false; });	//this must create an inconsistency in the database: user deleted but not the credentials
			})
			.catch((_: any) => { return false; });
	}

	public static authorize(req: Request, res: Response, next: NextFunction): Response | void {
		if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });
		const bearerToken: string=req.headers.authorization;
		Auth.verifyJwt(bearerToken)
			.then((payload: string | jsonwebtoken.JwtPayload | null) => {
				if(!payload) return res.status(401).json({ message: 'Invalid token.' });
				if(typeof payload === 'string' || !payload.sub || !payload.exp) return res.status(401).json({ message: 'Invalid token.' });
				if(payload.exp < (new Date()).getTime()) return res.status(401).json({ message: 'Token expired.' });
				const user_id: string=payload.sub as string;
				UserSchema.findById(user_id)
					.then((user: User | null) => {
						if(!user) return res.status(401).json({ message: 'Invalid token.' });
						req.user=user;
						return next();
					})
					.catch((_: any) => { return res.status(401).json({ message: 'Invalid token.' }); });
			})
			.catch((_: any) => { return res.status(401).json({ message: 'Invalid token.' }); });
	}

	public static isSMM(req: Request, res: Response, next: NextFunction): Response | void {
		if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if(!req.user.isSMM) return res.status(401).json({ message: 'Unauthorized' });
		return next();
	}

	public static isVip(req: Request, res: Response, next: NextFunction): Response | void {
		if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if(!req.user.isVip) return res.status(401).json({ message: 'Unauthorized' });
		return next();
	}

	public static isMod(req: Request, res: Response, next: NextFunction): Response | void {
		if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if(!req.user.isMod) return res.status(401).json({ message: 'Unauthorized' });
		return next();
	}
}

export { IHashSalt as HashSalt };
export default Auth;
