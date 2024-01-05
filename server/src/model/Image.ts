import mongoose from 'mongoose';

if(!process.env.DBCOLLECTION_IMAGE) throw new Error("DBCOLLECTION_IMAGE is not defined in the .env file");

const ImageSchema: mongoose.Schema = new mongoose.Schema({
	data: {
		type: String,
		required: true,
	},
	contentType: String,
});

export default mongoose.model(process.env.DBCOLLECTION_IMAGE, ImageSchema);

export type Image = mongoose.InferSchemaType<typeof ImageSchema>;
