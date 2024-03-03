import mongoose from 'mongoose';

if(!process.env.DBCOLLECTION_USER) throw new Error("DBCOLLECTION_USER is not defined in the config.env file.");
if(!process.env.DBCOLLECTION_IMAGE) throw new Error("DBCOLLECTION_IMAGE is not defined in the config.env file.");
if(!process.env.START_D_QUOTE) throw new Error("START_D_QUOTE is not defined in the config.env file.");
if(!process.env.START_W_QUOTE) throw new Error("START_W_QUOTE is not defined in the config.env file.");
if(!process.env.START_M_QUOTE) throw new Error("START_M_QUOTE is not defined in the config.env file.");
if(!process.env.POPULAR_POSTS_LIMIT_POS) throw new Error("POPULAR_POSTS_LIMIT_POS is not defined in the config.env file.");
if(!process.env.POPULAR_POSTS_LIMIT_NEG) throw new Error("POPULAR_POSTS_LIMIT_NEG is not defined in the config.env file.");

export enum UserType {
	VIP='vip',
	MOD='mod',
	NORMAL='normal',
	SMM='smm',
	BOT='bot',
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
	email: {type: String, required: true, unique: true},
	type: {type: String, required: true, enum: Object.values(UserType), default: UserType.NORMAL},
	quote: {
		dayly: { type: Number, min: 0, default: process.env.START_D_QUOTE },
		weekly: { type: Number, min: 0, default: process.env.START_W_QUOTE },
		monthly: { type: Number, min: 0, default: process.env.START_M_QUOTE },
	},
	char_availability: {
		dayly: { type: Number, min: 0, default: process.env.START_D_QUOTE },
		weekly: { type: Number, min: 0, default: process.env.START_W_QUOTE },
		monthly: { type: Number, min: 0, default: process.env.START_M_QUOTE },
	},
	img: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_IMAGE, required: false},
	b_date: Date,
	creation_date: {type: Date, immutable: true, default: Date.now},
	appartenence: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_CHANNEL}],
	client: [{type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER}],
	smm: {type: mongoose.Schema.Types.ObjectId, ref: process.env.DBCOLLECTION_USER, required: false},
	messagePopularity: {
		type: {
			positive: Number,
			negative: Number,
		},
		default: { positive: 0, negative: 0 },
	},
	block: {type: Boolean, default: false},
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

UserSchema.virtual('isBot').get(function() {
	return this.type===UserType.BOT;
});

UserSchema.methods.isClient=function(user_id: string): boolean {
	if(!this.isSMM) return false;
	else return this.client.reduce((accumulatior: boolean, currVal: mongoose.Types.ObjectId)=> {
		if(accumulatior) return true;
		else return currVal.toString()==user_id;
	}, false);
};

UserSchema.methods.addClient=function(user_id: string): void {
	if(this.isSMM && !this.isClient(user_id)) this.client.push(user_id);
};

UserSchema.methods.removeClient=function(user_id: string): void {
	if(this.isSMM) this.client = this.client.filter((client: string)=> client != user_id);
};

UserSchema.methods.isMySMM = function(user_id: string): boolean {
	if(!this.isVip || !this.smm) return false;
	return this.smm?.toString()===user_id;
}

UserSchema.methods.setMySMM = function(user_id: string): void {
	if(this.isVip) this.smm = user_id;
}

UserSchema.methods.removeMySMM = function(): void {
	if(this.isVip) this.smm = undefined;
}

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

UserSchema.methods.addQuote=function(percent: number=1): void {
	this.quote.dayly+=Math.round(this.quote.dayly*percent);
	this.quote.weekly+=Math.round(this.quote.weekly*percent);
	this.quote.monthly+=Math.round(this.quote.monthly*percent);
};

UserSchema.methods.removeQuote=function(percent: number=1): void {
	this.quote.dayly-=Math.round(this.quote.dayly*percent);
	this.quote.weekly-=Math.round(this.quote.weekly*percent);
	this.quote.monthly-=Math.round(this.quote.monthly*percent);
};

UserSchema.methods.addPopular=function(): void {
	this.messagePopularity.positive++;
	if(this.messagePopularity.positive >= process.env.POPULAR_POSTS_LIMIT_POS!) {
		this.messagePopularity.positive=0;
		this.addQuote();
	}
};

UserSchema.methods.removePopular=function(): void {
	this.messagePopularity.positive--;
}

UserSchema.methods.addUnpopular=function(): void {
	this.messagePopularity.negative++;
	if(this.messagePopularity.negative >= process.env.POPULAR_POSTS_LIMIT_NEG!) {
		this.messagePopularity.negative=0;
		this.removeQuote();
	}
};

UserSchema.methods.removeUnpopular=function(): void {
	this.messagePopularity.negative--;
};

export default mongoose.model(process.env.DBCOLLECTION_USER, UserSchema);

export type User=mongoose.InferSchemaType<typeof UserSchema>;
