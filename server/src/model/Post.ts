import mongoose from 'mongoose';

import ChannelSchema, { Channel } from "./Channel";
import UserSchema, { User } from "./User";

let CM_COEFFICIENT: any | undefined=process.env.CM_COEFFICIENT;
const {	DBCOLLECTION_IMAGE } = process.env;

if(CM_COEFFICIENT === undefined) throw new Error("CM_COEFFICIENT is not defined in the config.env file.");
if(DBCOLLECTION_IMAGE === undefined) throw new Error("DBCOLLECTION_IMAGE is not defined in the config.env file.");
if(!process.env.DBCOLLECTION_POST) throw new Error("DBCOLLECTION_POST is not defined in the config.env file.");

CM_COEFFICIENT = parseFloat(CM_COEFFICIENT);

const PostSchema: mongoose.Schema=new mongoose.Schema({
	title: {type: String, required: true},
	content: {
		required: true,
		type: {
			text: String,
			img: { type: mongoose.Schema.Types.ObjectId, ref: DBCOLLECTION_IMAGE },
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
	this.popular=true;
	this.unpopular=true;
};

PostSchema.methods.removeControversial=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.addPopular();
			user.addUnpopular();
			user.save();
		});
	if(this.posReaction > (this.views * CM_COEFFICIENT)) this.unpopular=false;
	else if(this.negReaction > (this.views * CM_COEFFICIENT)) this.popular=false;
};

PostSchema.methods.addPopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.addPopular();
			user.save();
		});
	this.popular=true;
};

PostSchema.methods.removePopular=function(): void {
	UserSchema.findById(this.posted_by)
		.then((user: User | null)=> {
			if(!user) return;
			user.removePopular();
			user.save();
		});
	this.popular=false;
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
	if(this.negReaction > (this.views * CM_COEFFICIENT)) this.removePopular();
	if(await this.isControversial()) this.addControversial();
	return true;
};

PostSchema.methods.moveOwnership=function(user_id: mongoose.Schema.Types.ObjectId): void {
	this.posted_by=user_id;
};

export default mongoose.model(process.env.DBCOLLECTION_POST, PostSchema);

export type Post=mongoose.InferSchemaType<typeof PostSchema>;
