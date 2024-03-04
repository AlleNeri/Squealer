/**
 * Generating RSA keys for JWT authentication.
 */
import crypto from 'crypto';
import fs from 'fs';

import "./env";

//get the key location from the config.env file
const keyLocation : fs.PathLike | string | undefined = process.env.RSA_KEYS_LOCATION,
	pubKey : string | undefined = process.env.PUB_KEY_NAME,
	privKey : string | undefined = process.env.PRIV_KEY_NAME;
if(keyLocation === undefined) throw new Error("RSA_KEYS_LOCATION is not defined in the config.env file.");
if(pubKey === undefined) throw new Error("PUB_KEY_NAME is not defined in the config.env file.");
if(privKey === undefined) throw new Error("PRIV_KEY_NAME is not defined in the config.env file.");

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
	fs.writeFileSync(`${keyLocation}/${pubKey}`, keyPairs.publicKey);
	fs.writeFileSync(`${keyLocation}/${privKey}`, keyPairs.privateKey);
}

createKey();
