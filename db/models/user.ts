// db/models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the User interface
interface IUser extends Document {
	name: string;
	email: string;
	mobile: string;
	schoolName: string;
	rollNo: string;
	branch: string;
	// image: string | null;
	address: string;
	password: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema(
	{
		email: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true },
		mobile: { type: String, required: true },
		schoolName: { type: String, required: true },
		rollNo: { type: String, required: true },
		branch: { type: String, required: true },
		// image: { type: String },
		address: { type: String, required: true },
		password: { type: String, required: true },
	},
	{
		versionKey: false,
	}
);

// Create the User model
const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
