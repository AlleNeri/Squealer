import mongoose from 'mongoose';

import ChannelSchema, { Channel } from "../model/Channel";

let CM_COEFFICIENT: any | undefined=process.env.CM_COEFFICIENT;
const CONTROVERSIAL_CHANNEL: string | undefined=process.env.CONTROVERSIAL_CHANNEL;
const POPULAR_CHANNEL: string | undefined=process.env.POPULAR_CHANNEL;

if(CM_COEFFICIENT === undefined) throw new Error("CM_COEFFICIENT is not defined in the config.env file.");
if(CONTROVERSIAL_CHANNEL === undefined) throw new Error("CONTROVERSIAL_CHANNEL is not defined in the config.env file.");
if(POPULAR_CHANNEL === undefined) throw new Error("POPULAR_CHANNEL is not defined in the config.env file.");
if(!process.env.DBCOLLECTION_POST) throw new Error("DBCOLLECTION_POST is not defined in the config.env file.");

CM_COEFFICIENT=parseFloat(CM_COEFFICIENT);

const PostSchema: mongoose.Schema=new mongoose.Schema({
	title: {type: String, required: true},
	content: {
		required: true,
		type: {
			text: String,
			img: String,
			video: String,
			position: String,
		}
	},
	views: {type: Number, default: 0},
	keywords: [String],
	date: {type: Date, default: Date.now, required: true, immutable: true},
	reactions: {
		type: {
			pos: {type: Number, default: 0},
			neg: {type: Number, default: 0},
		}
	},
	popular: Boolean,	// If the post is popular and also unpopular
	unpopular: Boolean,	// it means that the post is controversial
	posted_by: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER, required: true},
	posted_on: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL, required: true},
	appartains_to: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL}],	//the user posts it on the channel he wants, but squealer can make it to be seen bay all in the popular or controversial channels for example(only if the post is posted on an open channel)
	tagged: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

PostSchema.methods.isControversial=function(): boolean {
	return this.popular && this.unpopular;
};

PostSchema.methods.addControversial=function(): void {
	this.appartains_to.push(CONTROVERSIAL_CHANNEL);
};

PostSchema.methods.removeControversial=function(): void {
	let index: number=this.appartains_to.indexOf(CONTROVERSIAL_CHANNEL);
	if(index != -1) this.appartains_to.splice(index, 1);
};

PostSchema.methods.addPopular=function(): void {
	this.popular=true;
	this.appartains_to.push(POPULAR_CHANNEL);
};

PostSchema.methods.removePopular=function(): void {
	this.popular=false;
	let index: number=this.appartains_to.indexOf(POPULAR_CHANNEL);
	if(index != -1) this.appartains_to.splice(index, 1);
};

PostSchema.methods.addUnpopular=function(): void {
	this.unpopular=true;
};

PostSchema.methods.removeUnpopular=function(): void {
	this.unpopular=false;
};

PostSchema.methods.addView=function(): void {
	this.views++;
	//check only if the popular and unpopular values decrease because a view can't increase them
	if(this.reactions.pos < (this.views * CM_COEFFICIENT)) this.removePopular();
	if(this.reactions.neg < (this.views * CM_COEFFICIENT)) this.removeUnpopular();
	if(!this.isControversial()) this.removeControversial();
};

PostSchema.methods.addReaction=function(reaction: number): boolean {
	if(Math.abs(reaction) > 2 || reaction==0) return false;
	if(reaction < 0) this.reactions.neg+=Math.abs(reaction);
	else if(reaction > 0) this.reactions.pos+=reaction;
	//check only if the popular and unpopular values increase because a reaction can't decrease them
	if(this.reactions.pos > (this.views * CM_COEFFICIENT)) this.addPopular();
	if(this.reactions.neg > (this.views * CM_COEFFICIENT)) this.removePopular();
	const channel: Channel=ChannelSchema.findById(this.posted_on);
	if(!channel.private && this.isControversial()) this.addControversial();
	return true;
};

export default mongoose.model(process.env.DBCOLLECTION_POST, PostSchema);

export type Post=mongoose.InferSchemaType<typeof PostSchema>;
