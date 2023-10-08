import mongoose from 'mongoose';

if(!process.env.DBCOLLECTION_USER) throw new Error("DBCOLLECTION_USER is not defined in the config.env file.");

enum UserType {
	VIP='vip',
	MOD='mod',
	NORMAL='normal',
	SMM='smm',
};

const UserSchema: mongoose.Schema=new mongoose.Schema({
	u_name: {type: String, required: true, unique: true},
	name: {
		required: true,
		type: {
			first: String,
			last: String,
		}
	},
	email: {type: String, required: true},
	type: {type: String, required: true, enum: Object.values(UserType), default: UserType.NORMAL},
	char_availability: {type: Number, min: 0},
	img: String,
	b_date: Date,
	creation_date: {type: Date, immutable: true, default: Date.now},
	appartenence: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL}],
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],	//the smm uses the friends list as clients list
});

UserSchema.virtual('isSMM').get(function() {
	return this.type===UserType.SMM;
});

UserSchema.virtual('isVip').get(function() {
	return this.type===UserType.VIP;
});

UserSchema.virtual('isMod').get(function() {
	return this.type===UserType.MOD;
});

UserSchema.virtual('isNormal').get(function() {
	return this.type===UserType.NORMAL;
});

UserSchema.methods.isFriend=function(user_id: string): boolean {
	return this.friends.reduce((accumulator: boolean, currVal: mongoose.Types.ObjectId)=> {
		if(accumulator) return true;
		else return currVal.toString()==user_id;
	}, false);
};

UserSchema.methods.addFriend=function(user_id: string): void {
	if(!this.isFriend(user_id)) this.friends.push(user_id);
};

UserSchema.methods.isClient=function(user_id: string): boolean {
	return (this.isSMM && this.isFriend(user_id));
};

UserSchema.methods.addClient=function(user_id: string): void {
	if(this.isSMM && !this.isFriend(user_id)) this.friends.push(user_id);
};

export default mongoose.model(process.env.DBCOLLECTION_USER, UserSchema);

export type User=mongoose.InferSchemaType<typeof UserSchema>;
