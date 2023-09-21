import mongoose from 'mongoose';
import {type} from 'os';

const PostSchema: mongoose.Schema=new mongoose.Schema({
	title: {type: String, required: true},
	content: {
		required: true,
		text: String,
		img: String,
		video: String,
		position: String,
	},
	keywords: [String],
	date: {type: Date, default: Date.now, required: true, immutable: true},
	reactions: Number,
	popularity: Number,
	posted_by: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER, required: true},
	posted_on: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL, required: true},
	tagged: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

if(!process.env.DBCOLLECTION_POST) throw new Error("DBCOLLECTION_POST is not defined in the config.env file.");

export default mongoose.model(process.env.DBCOLLECTION_POST, PostSchema);

export type Post=mongoose.InferSchemaType<typeof PostSchema>;
