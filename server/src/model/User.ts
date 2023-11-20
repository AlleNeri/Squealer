import mongoose from 'mongoose';

if(!process.env.DBCOLLECTION_USER) throw new Error("DBCOLLECTION_USER is not defined in the config.env file.");
if(!process.env.START_D_QUOTE) throw new Error("START_D_QUOTE is not defined in the config.env file.");
if(!process.env.START_W_QUOTE) throw new Error("START_W_QUOTE is not defined in the config.env file.");
if(!process.env.START_M_QUOTE) throw new Error("START_M_QUOTE is not defined in the config.env file.");

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
	quote: {
		dayly: { type: Number, min: 0, default: process.env.START_D_QUOTE },
		weekly: { type: Number, min: 0, default: process.env.START_W_QUOTE },
		monthly: { type: Number, min: 0, default: process.env.START_M_QUOTE },
	},
	char_availability: {
		last_update: Date,
		dayly: { type: Number, min: 0 },
		weekly: { type: Number, min: 0 },
		monthly: { type: Number, min: 0 },
	},
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

UserSchema.virtual('publicInfo').get(function() {
	return {
		u_name: this.u_name,
		name: this.name,
		img: this.img,
	};
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

UserSchema.methods.isAMidnightPassed=function(): boolean | undefined {
	const now: Date=new Date();
	if(this.char_availability.last_update) {
		if(this.char_availability.last_update.getFullYear()!==now.getFullYear()) return true;
		else if(this.char_availability.last_update.getMonth()!==now.getMonth()) return true;
		else if(this.char_availability.last_update.getDate()!==now.getDate()) return true;
		else return false;
	}
	this.char_availability.last_update=now;
};

UserSchema.methods.isAMondayPassed=function(): boolean | undefined {
	const now: Date=new Date();
	if(this.char_availability.last_update) {
		if(this.char_availability.last_update.getFullYear()!==now.getFullYear()) return true;
		else if(this.char_availability.last_update.getMonth()!==now.getMonth()) return true;
		else if(this.char_availability.last_update.getDate()<(now.getDate()-now.getDay())) return true;	//check if the last update was before the last monday
		else return false;
	}
	this.char_availability.last_update=now;
};

UserSchema.methods.isAMonthPassed=function(): boolean | undefined {
	const now: Date=new Date();
	if(this.char_availability.last_update) {
		if(this.char_availability.last_update.getFullYear()!==now.getFullYear()) return true;
		else if(this.char_availability.last_update.getMonth()!==now.getMonth()) return true;
		else return false;
	}
	this.char_availability.last_update=now;
};

UserSchema.methods.updateCharAvailability=function(): void {
	if(this.isAMidnightPassed()) this.char_availability.dayly=this.quote.dayly;
	if(this.isAMondayPassed()) this.char_availability.weekly=this.quote.weekly;
	if(this.isAMonthPassed()) this.char_availability.monthly=this.quote.monthly;
};

UserSchema.methods.canPost=function(amount: number): boolean {
	if(this.char_availability.dayly < amount) return false;
	else if(this.char_availability.weekly < amount) return false;
	else if(this.char_availability.monthly < amount) return false;
	else {
		this.char_availability.dayly-=amount;
		this.char_availability.weekly-=amount;
		this.char_availability.monthly-=amount;
		return true;
	}
};

UserSchema.pre('save', function(next) {
	this.updateCharAvailability();
	next();
});

UserSchema.post(/find/, function(docs: any[] | any, next) {
	if(Array.isArray(docs)) docs.forEach((doc: any) => doc.updateCharAvailability() );
	else docs.updateCharAvailability();
	next();
});

export default mongoose.model(process.env.DBCOLLECTION_USER, UserSchema);

export type User=mongoose.InferSchemaType<typeof UserSchema>;
