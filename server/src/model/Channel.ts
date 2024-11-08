import mongoose from 'mongoose';

const {DBCOLLECTION_CHANNEL}=process.env;

if(!DBCOLLECTION_CHANNEL) throw new Error("DBCOLLECTION_CHANNEL is not defined in the config.env file.");
if(!process.env.DBCOLLECTION_USER) throw new Error("DBCOLLECTION_USER is not defined in the config.env file.");

const ChannelSchema: mongoose.Schema=new mongoose.Schema({
	//if the name of the channel starts with "__direct__", the channel is a direct message channel between two users and ends with the two usernames
	name: {type: String, required: true, unique: true},
	description: String,
	img: String,
	//the importance is an integer from 0 to 4:
	//	0: the channel is created by a user and it's not so important
	//	1: the channel is created by a user and an admin approved it as a popular channel
	//	2: the channel is created by an admin for a specific topic(events, news, actuality, etc.)
	//	3: the channel is predefined by the app
	//	4: the channel is a level 2 or 3 but requires a high level attention(covid news during the pandemic, war news in an hyped moment, elections, etc.)
	importance: {type: Number, default: 0, min: 0, max: 4},
	//the private channels works like individual chats and groups in whatsapp. They aren't subject to the roles of popularity and controversiality
	private: {type: Boolean, default: false},
	owners: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
});

//prevent to change the name of a direct message channel
ChannelSchema.pre('save', function(next) {
	if(!this.isNew && this.name.startsWith("__direct__") && this.isModified('name')) return next(new Error("Can't change the name of a direct message channel"));
	next();
});

//prevent to change the value of private
ChannelSchema.pre('save', function(next) {
	if(!this.isNew && this.isModified('private')) return next(new Error("Can't change the value of private"));
	next();
});

ChannelSchema.methods.modifyImportance=function(importance: number): void {
	//an admin can't modify the importance of a channel
	//	- 0 <=> 1
	//	- 2|3 <=> 4
	if(this.private) return;
	if(this.importance==0 && importance==1) this.importance=importance;
	if(this.importance==1 && importance==0) this.importance=importance;
	if((this.importance==2 || this.importance==3) && importance==4) this.importance=importance;
	if(this.importance==4 && (importance==2 || importance==3)) this.importance=importance;
}

ChannelSchema.methods.addOwner=function(owner: mongoose.Schema.Types.ObjectId): void {
	if(this.owners.includes(owner)) return;
	this.owners.push(owner);
}

ChannelSchema.methods.removeOwner=function(owner: mongoose.Schema.Types.ObjectId): void {
	if(!this.owners.includes(owner)) return;
	this.owners.splice(this.owners.indexOf(owner), 1);
}

export default mongoose.model(DBCOLLECTION_CHANNEL, ChannelSchema);

export type Channel=mongoose.InferSchemaType<typeof ChannelSchema>;
