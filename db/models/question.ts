// db/models/question.ts
// import { subjects } from '@/lib/constants';
import mongoose, { Document, Model, Schema } from 'mongoose';
import CorrectAnswer from '@/db/models/correct-answer';
// import { subjectKeys } from '@/lib/constants';

// Define the IQuestion interface
interface IQuestion extends Document {
	_id: string;
	text: string;
	options: { id: number; text: string }[];
	subject: string;
}

// Define the option schema
const optionSchema = new Schema(
	{
		id: Number,
		text: String,
	},
	{ _id: false }
);

// Create the Question schema
const QuestionSchema: Schema<IQuestion> = new Schema(
	{
		text: { type: String, required: true, unique: true },
		options: [optionSchema],
		subject: { type: String, required: true },
	},
	{
		versionKey: false,
	}
);

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

	console.log('Saving question with subject:', this.subject);
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
