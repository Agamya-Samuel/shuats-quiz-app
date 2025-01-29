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


// Create the Question model
const Question: Model<IQuestion> =
	mongoose.models.Question ||
	mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
