import mongoose from 'mongoose';

const ChannelSchema: mongoose.Schema=new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	img: String,
	importance: Number,
	owners: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

if(!process.env.DBCOLLECTION_CHANNEL) throw new Error("DBCOLLECTION_CHANNEL is not defined in the config.env file.");

export default mongoose.model(process.env.DBCOLLECTION_CHANNEL, ChannelSchema);

export type Channel=mongoose.InferSchemaType<typeof ChannelSchema>;
