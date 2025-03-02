// db/models/admin.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the Maintainer interface
interface IMaintainer extends Document {
	username: string;
	password: string;
}

// Create the Maintainer schema
const MaintainerSchema: Schema<IMaintainer> = new Schema(
	{
		username: { type: String, required: true, unique: true, index: true },
		password: { type: String, required: true },
	},
	{
		versionKey: false,
	}
);

// Create the Maintainer model
const Maintainer: Model<IMaintainer> =
	mongoose.models.Maintainer ||
	mongoose.model<IMaintainer>('Maintainer', MaintainerSchema);

export default Maintainer;
