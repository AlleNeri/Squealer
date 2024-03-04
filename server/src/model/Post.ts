import mongoose from 'mongoose';

import ChannelSchema, { Channel } from "./Channel";
import UserSchema, { User } from "./User";

let CM_COEFFICIENT: any | undefined=process.env.CM_COEFFICIENT;
const {CONTROVERSIAL_CHANNEL, POPULAR_CHANNEL}=process.env;

if(CM_COEFFICIENT === undefined) throw new Error("CM_COEFFICIENT is not defined in the config.env file.");
if(CONTROVERSIAL_CHANNEL === undefined) throw new Error("CONTROVERSIAL_CHANNEL is not defined in the config.env file.");
if(POPULAR_CHANNEL === undefined) throw new Error("POPULAR_CHANNEL is not defined in the config.env file.");
if(!process.env.DBCOLLECTION_POST) throw new Error("DBCOLLECTION_POST is not defined in the config.env file.");

//TODO: test if the post ar added to the corret channels
let controversialChannel: Channel=ChannelSchema.where({ name: CONTROVERSIAL_CHANNEL }).then((channel: Channel)=> channel);
let popularChannel: Channel=ChannelSchema.where({ name: POPULAR_CHANNEL }).then((channel: Channel)=> channel);

CM_COEFFICIENT=parseFloat(CM_COEFFICIENT);

const PostSchema: mongoose.Schema=new mongoose.Schema({
	title: {type: String, required: true},
	content: {
		required: true,
		type: {
			text: String,
			img: mongoose.Schema.Types.ObjectId,
			position: {
				latitude: Number,
				longitude: Number
			}
		}
	},
	timed: Boolean,
	keywords: [String],
	date: {type: Date, default: Date.now, required: true, immutable: true},
	reactions: {
		type: [
			{
				user_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: process.env.DBCOLLECTION_USER,
					required: true
				},
				value: {
					type: Number,
					min: -2,
					max: 2,
					required: true
				}
			}
		],
		required: true
	},	// the reactions have the double meaning of opinion and visualisation; this is the reason why the reactions contain the 0 value witch means that the user has seen the post but has no opinion about it
	popular: Boolean,	// If the post is popular and also unpopular
	unpopular: Boolean,	// it means that the post is controversial
	posted_by: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER, required: true},
	posted_on: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL, required: true, immutable: true},
	appartains_to: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL}],	//the user posts it on the channel he wants, but squealer can make it to be seen bay all in the popular or controversial channels for example(only if the post is posted on an open channel)
	tagged: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

PostSchema.methods.isControversial = async function(): Promise<boolean> {
	const channel: Channel | null = await ChannelSchema.findById(this.posted_on);
	if(!channel) return false;
	if(channel.private) return false;
	return this.popular && this.unpopular;
};

PostSchema.methods.addControversial=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.removePopular();
			user.removeUnpopular();
			user.save();
		});
	this.appartains_to.push(controversialChannel._id);
};

PostSchema.methods.removeControversial=function(): void {
	let index: number=this.appartains_to.indexOf(controversialChannel._id);
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.addPopular();
			user.addUnpopular();
			user.save();
		});
	if(index != -1) this.appartains_to.splice(index, 1);
};

PostSchema.methods.addPopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.addPopular();
			user.save();
		});
	this.popular=true;
	this.appartains_to.push(popularChannel._id);
};

PostSchema.methods.removePopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.removePopular();
			user.save();
		});
	this.popular=false;
	let index: number=this.appartains_to.indexOf(popularChannel._id);
	if(index != -1) this.appartains_to.splice(index, 1);
};

PostSchema.methods.addUnpopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.addUnpopular();
			user.save();
		});
	this.unpopular=true;
};

PostSchema.methods.removeUnpopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.removeUnpopular();
			user.save();
		});
	this.unpopular=false;
};

PostSchema.virtual("posReaction").get(function(): number {
	return this.reactions.reduce((accumulator: number, reaction: any)=> accumulator + (reaction.value > 0 ? reaction.value : 0), 0);
});

PostSchema.virtual("negReaction").get(function(): number {
	return this.reactions.reduce((accumulator: number, reaction: any)=> accumulator + (reaction.value < 0 ? reaction.value : 0), 0);
});

PostSchema.virtual("views").get(function(): number {
	return this.reactions.length;
});

PostSchema.methods.addView = async function(user_id: string): Promise<void> {
	//check if the user has already react the post and if he has, remove the reaction
	const index: number = this.reactions.findIndex((reaction: any)=> reaction.user_id.toString() == user_id);
	if(index != -1) this.reactions[index].value=0;
	//add the user to the reactions array if he is not already there
	else this.addReaction(user_id, 0);
	//check only if the popular and unpopular values decrease because a view can't increase them
	if(this.posReaction < (this.views * CM_COEFFICIENT)) this.removePopular();
	if(this.negReaction < (this.views * CM_COEFFICIENT)) this.removeUnpopular();
	if(!(await this.isControversial())) this.removeControversial();
};

PostSchema.methods.addReaction = async function(user_id: string, reaction: number): Promise<boolean> {
	if(Math.abs(reaction) > 2) return false;
	//check if the user has already reacted to the post
	let index: number=this.reactions.findIndex((reaction: any)=> reaction.user_id.toString() == user_id);
	if(index != -1) this.reactions[index].value=reaction;
	else this.reactions.push({user_id: user_id, value: reaction});
	//check only if the popular and unpopular values increase because a reaction can't decrease them
	if(this.posReaction > (this.views * CM_COEFFICIENT)) this.addPopular();
	if(this.negReaction > (this.views * CM_COEFFICIENT)) this.addUnpopular();
	if(await this.isControversial()) this.addControversial();
	return true;
};

PostSchema.methods.moveOwnership=function(user_id: mongoose.Schema.Types.ObjectId): void {
	this.posted_by=user_id;
};

export default mongoose.model(process.env.DBCOLLECTION_POST, PostSchema);

export type Post=mongoose.InferSchemaType<typeof PostSchema>;
