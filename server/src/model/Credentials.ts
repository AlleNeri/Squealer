import mongoose from 'mongoose';

import { HashSalt } from '../controller/pwdUtils';
import '../env';

const CredentialsSchema: mongoose.Schema=new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: process.env.DBCOLLECTION_USER,
		immutable: true,
		required: true,
	},
	hash: {
		type: String,
		required: true,
	},
	salt: { 
		type: String,
		required: true,
	},
});

CredentialsSchema.virtual("hashSalt").get(function(): HashSalt {
	return {
		hash: this.hash,
		salt: this.salt,
	};
});

if(!process.env.DBCOLLECTION_CREDENTIALS) throw new Error("DBCOLLECTION_CREDENTIALS is not defined in the config.env file.");

export default mongoose.model(process.env.DBCOLLECTION_CREDENTIALS, CredentialsSchema);

export type Credentials=mongoose.InferSchemaType<typeof CredentialsSchema>;
