import mongoose from 'mongoose';

import { HashSalt } from '../controller/Auth';

if(!process.env.DBCOLLECTION_CREDENTIALS) throw new Error("DBCOLLECTION_CREDENTIALS is not defined in the config.env file.");

const CredentialsSchema: mongoose.Schema=new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: process.env.DBCOLLECTION_USER,
		immutable: true,
		required: true,
		unqiue: true,
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

CredentialsSchema.methods.setHashSalt=function(hashSalt: HashSalt): void {
	this.hash=hashSalt.hash;
	this.salt=hashSalt.salt;
};

export default mongoose.model(process.env.DBCOLLECTION_CREDENTIALS, CredentialsSchema);

export type Credentials=mongoose.InferSchemaType<typeof CredentialsSchema>;
