// db/models/correct-answer.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the CorrectAnswer interface
interface CorrectAnswer extends Document {
	questionId: Schema.Types.ObjectId;
	correctOptionId: number;
}

// Create the CorrectAnswer schema
const CorrectAnswerSchema = new Schema<CorrectAnswer>(
	{
		questionId: {
			type: Schema.Types.ObjectId,
			ref: 'Question',
			required: true,
			index: true,
			unique: true,
		},
		correctOptionId: { type: Number, required: true },
	},
	{
		versionKey: false,
	}
);

// Create the CorrectAnswer model
const CorrectAnswer: Model<CorrectAnswer> =
	mongoose.models.CorrectAnswer ||
	mongoose.model<CorrectAnswer>('CorrectAnswer', CorrectAnswerSchema);

export default CorrectAnswer;
