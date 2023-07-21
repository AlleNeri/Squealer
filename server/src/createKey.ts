/**
 * Generating RSA keys for JWT authentication.
 */
import dotenv from "dotenv";
import crypto from 'crypto';
import fs from 'fs';

dotenv.config({path: __dirname + "/../config.env"});

//get the key location from the config.env file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");

//check if the key location exists, if not create it
if(!fs.existsSync(keyLocation)) fs.mkdirSync(keyLocation);

//creating the key pair
function createKey(): void {
	const keyPairs : crypto.KeyPairSyncResult<string | Buffer, string | Buffer>=crypto.generateKeyPairSync('rsa', {
		modulusLength: 4096,
		publicKeyEncoding: {
			type: 'pkcs1',
			format: 'pem',
		},
		privateKeyEncoding: {
			type: 'pkcs1',
			format: 'pem',
		}
	});
	fs.writeFileSync(keyLocation + '/rsa-pub.pem', keyPairs.publicKey);
	fs.writeFileSync(keyLocation + '/rsa-priv.pem', keyPairs.privateKey);
}

createKey();
