// db/models/submitted-answer.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the SubmittedAnswer interface
interface SubmittedAnswer extends Document {
	questionId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
	selectedOptionId: number;
	startTime: Date;      // When the user started the quiz
	submittedAt: Date;    // When the user submitted the answer
	timeTakenSeconds: Number; // Time taken to complete the quiz in seconds
}

// Create the SubmittedAnswer schema
const SubmittedAnswerSchema = new Schema<SubmittedAnswer>(
	{
		questionId: {
			type: Schema.Types.ObjectId,
			ref: 'Question',
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		selectedOptionId: { type: Number, required: true },
		startTime: { type: Date, default: null },
		submittedAt: { type: Date, default: Date.now },
		timeTakenSeconds: { type: Number, default: null },
	},
	{
		versionKey: false,
	}
);

// Add a compound index to ensure unique combinations of userId and questionId
SubmittedAnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

// Create the SubmittedAnswer model
const SubmittedAnswer: Model<SubmittedAnswer> =
	mongoose.models.SubmittedAnswer ||
	mongoose.model<SubmittedAnswer>('SubmittedAnswer', SubmittedAnswerSchema);

export default SubmittedAnswer;
