// db/models/Question.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the IQuestion interface
interface IQuestion extends Document {
	text: string;
	options: { id: number; text: string }[];
}

// Create the Question schema
const QuestionSchema: Schema<IQuestion> = new Schema({
	text: { type: String, required: true, unique: true },
	options: [{ id: Number, text: String }],
});

// Create the Question model
const Question: Model<IQuestion> =
	mongoose.models.Question ||
	mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
