// db/models/question.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import CorrectAnswer from '@/db/models/correct-answer';

// Define the IQuestion interface
interface IQuestion extends Document {
	text: string;
	options: { id: number; text: string }[];
	correctAnswer?: {
		correctOptionId: number;
	};
}

// Create the Question schema
const QuestionSchema: Schema<IQuestion> = new Schema({
	text: { type: String, required: true, unique: true },
	options: [{ id: Number, text: String }],
});

// Custom validation to ensure unique option texts
QuestionSchema.pre('save', function (next) {
	const optionTexts = this.options.map((option) =>
		option.text.trim().toLowerCase()
	);
	const uniqueOptionTexts = new Set(optionTexts);

	if (uniqueOptionTexts.size !== optionTexts.length) {
		return next(
			new Error('Option texts must be unique for each question.')
		);
	}

	next();
});

// Middleware to delete associated correct answer when a question is removed
QuestionSchema.pre<IQuestion>(
	'deleteOne',
	{ document: true, query: false },
	async function (next: (err?: Error) => void) {
		try {
			await CorrectAnswer.deleteOne({ questionId: this._id });
			next();
		} catch (error) {
			next(error as Error);
		}
	}
);

// Add a virtual field for correctAnswer
QuestionSchema.virtual('correctAnswer', {
	ref: 'CorrectAnswer',
	localField: '_id',
	foreignField: 'questionId',
	justOne: true, // Only one correct answer per question
});

// Ensure virtual fields are included in JSON output
QuestionSchema.set('toJSON', { virtuals: true });
QuestionSchema.set('toObject', { virtuals: true });

// Create the Question model
const Question: Model<IQuestion> =
	mongoose.models.Question ||
	mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
