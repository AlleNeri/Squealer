import mongoose from 'mongoose';

import { HashSalt } from '../controller/pwdUtils';

const CredentialsSchema: mongoose.Schema=new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
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

export default mongoose.model('Credentials', CredentialsSchema);
