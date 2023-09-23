import { Strategy as JwtStrategy, ExtractJwt, JwtFromRequestFunction, VerifyCallback, VerifyCallbackWithRequest } from 'passport-jwt';
import fs from 'fs';

import UserCredentials, { Credentials } from "../model/Credentials";

import "../env";

//get the key location from the config.env file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
	  pubKey : string | undefined = process.env.PUB_KEY_NAME;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
if(pubKey === undefined) throw new Error("PUB_KEY_NAME is not defined in the config.env file.");
const PUB_KEY=fs.readFileSync(`${keyLocation}/${pubKey}`, 'utf8');

/*** Options for the JWT Strategy ***/
interface Options {
	jwtFromRequest: JwtFromRequestFunction;
	secretOrKey: string;
	algorithms: string[];
}

const options: Options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256'],
};

/*** JWT Strategy ***/
const strategy: JwtStrategy = new JwtStrategy(options, (payload, done) => {
	//find the user in db
	UserCredentials.findOne({ _id: payload.sub })
		.then((credentials: Credentials | null) => {
			if(credentials) return done(null, credentials);	//if the credentials are found, return them without an error
			else return done(null, false);	//if the credentials are not found, return false without an error
		})
		.catch((err: Error) => done(err, false));	//if there is an error, return the error without the credentials
});

/*** Serialization and Deserialization ***/
function userSerializer(user: Credentials, done: (err: Error | null, id?: string) => void): void {
	done(null, user._id);
};

function userDeserializer(id: string, done: (err: Error | null, user?: Credentials) => void): void {
	//find the user in db
	UserCredentials.findOne({ _id: id })
		.then((user: Credentials | null) => {
			if(user) return done(null, user);	//if the user is found, return them without an error
			else return done(null);	//if the user is not found, return false without an error
		})
		.catch((err: Error) => done(err));	//if there is an error, return the error without the user
};

export { strategy, userSerializer, userDeserializer };
