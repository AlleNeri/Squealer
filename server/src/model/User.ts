import mongoose from 'mongoose';

import "../env";

const UserSchema: mongoose.Schema=new mongoose.Schema({
	u_name: {type: String, required: true},
	name: {
		required: true,
		type: {
			first: String,
			last: String,
		}
	},
	email: {type: String, required: true},
	type: {type: String, required: true, enum: ['vip', 'mod', 'normal', 'smm'], default: 'normal'},
	char_availablity: {type: Number, min: 0},
	img: String,
	b_date: Date,
	creation_date: {type: Date, immutable: true, default: Date.now},
	appartenence: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL},
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

if(!process.env.DBCOLLECTION_USER) throw new Error("DBCOLLECTION_USER is not defined in the config.env file.");

export default mongoose.model(process.env.DBCOLLECTION_USER, UserSchema);

export type User=mongoose.InferSchemaType<typeof UserSchema>;
