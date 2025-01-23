import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the User interface
interface IUser extends Document {
	email: string;
	mobile: string;
	schoolName: string;
	address: string;
	password: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema({
	email: { type: String, required: true, unique: true, index: true },
	mobile: { type: String, required: true },
	schoolName: { type: String, required: true },
	address: { type: String, required: true },
	password: { type: String, required: true },
});

// Create the User model
const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
