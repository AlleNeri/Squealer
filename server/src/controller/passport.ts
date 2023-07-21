import { Strategy as JwtStrategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import fs from 'fs';

import "../env";

//get the key location from the config.env file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
	pubKey : string | undefined = process.env.PUB_KEY_NAME;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
if(pubKey === undefined) throw new Error("PUB_KEY_NAME is not defined in the config.env file.");

/*** Options for the JWT Strategy ***/
interface Options {
	jwtFromRequest: JwtFromRequestFunction;
	secretOrKey: string;
	algorithms: string[];
}

const options: Options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: fs.readFileSync(keyLocation + '/' + pubKey, 'utf8'),
	algorithms: ['RS256'],
};

/*** JWT Strategy ***/
const strategy = new JwtStrategy(options, (payload, done) => {
	//check if the user exists in the database
	// TODO: database
	// payload.sub contains the user id; so use it to look up in the database
	// using a mongoose model is easy to use the promise syntax; so put the next code into the promise callback
	// like this:
	// User.findById(payload.sub)
	// 	.then((user) => {
	// 		if(user) return done(null, user);
	// 		else return done(null, false);
	// 	}
	// 	.catch((err) => done(err, false));
});

export default strategy;
