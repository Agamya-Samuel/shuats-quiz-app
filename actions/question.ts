// actions/question.ts
'use server';

import { connectToDB } from '@/db';
import Question from '@/db/models/question';
import CorrectAnswer from '@/db/models/correct-answer';

// Add a question and its correct answer to the database
export async function addQuestion({
	text,
	options,
	correctOptionId,
}: {
	text: string;
	options: { id: number; text: string }[];
	correctOptionId: number;
}) {
	// Connect to the database
	await connectToDB();

	// Check if the question text already exists
	const existingQuestion = await Question.findOne({ text });
	if (existingQuestion) {
		return { error: 'This question already exists' };
	}

	// Validate unique option texts
	const optionTexts = options.map((option) =>
		option.text.trim().toLowerCase()
	);
	const uniqueOptionTexts = new Set(optionTexts);
	if (uniqueOptionTexts.size !== optionTexts.length) {
		return { error: 'All options must be unique for each question.' };
	}

	// Check if the correct option ID is valid
	const isValidOptionId = options.some(
		(option) => option.id === correctOptionId
	);
	if (!isValidOptionId) {
		return { error: 'Correct option ID is not valid.' };
	}

	// If all validations pass, proceed to create and save the question and correct answer
	const newQuestion = new Question({
		text,
		options,
	});

	// Save the question to the database
	await newQuestion.save();

	const newCorrectAnswer = new CorrectAnswer({
		questionId: newQuestion._id,
		correctOptionId,
	});

	// Save the correct answer to the database
	await newCorrectAnswer.save();

	return { success: 'Question and correct answer added successfully' };
}

// Get all questions with their options
export async function getAllQuestions() {
	// Connect to the database
	await connectToDB();

	try {
		// Fetch all questions with their options
		const questions = await Question.find().select('text options').exec();

		// Return the questions data
		return { success: true, questions };
	} catch (error) {
		// Handle any errors that occur during the query
		return {
			error: `An error occurred while retrieving questions: ${error}`,
		};
	}
}

// Get a question by its ID
export async function getQuestionById(questionId: string) {
	// Connect to the database
	await connectToDB();

	try {
		// Find the question by its ID
		const question = await Question.findById(questionId).exec();

		// Check if the question exists
		if (!question) {
			return { error: 'Question not found' };
		}

		// Return the question data
		return { success: true, question };
	} catch (error) {
		// Handle any errors that occur during the query
		return {
			error: `An error occurred while retrieving the question: ${error}`,
		};
	}
}

// Get all questions with their correct answers
export async function getAllQuestionsWithAnswers() {
	// Connect to the database
	await connectToDB();

	try {
		// Fetch all questions and populate their correct answers
		const questions = await Question.find()
			.populate({
				path: 'correctAnswer', // Use the virtual field
				select: 'correctOptionId',
			})
			.exec();

		// Format the response to include questions with their correct answers
		const formattedQuestions = questions.map((question) => ({
			text: question.text,
			options: question.options,
			correctOptionId: question.correctAnswer?.correctOptionId,
		}));

		return { success: true, questions: formattedQuestions };
	} catch (error) {
		// Handle any errors that occur during the query
		return {
			error: `An error occurred while retrieving questions with answers: ${error}`,
		};
	}
}

// Update a question
export async function updateQuestion({
	questionId,
	newText,
	newOptions,
}: {
	questionId: string;
	newText: string;
	newOptions: { id: number; text: string }[];
}) {
	// Connect to the database
	await connectToDB();

	// Find the question by its ID
	const question = await Question.findById(questionId);
	if (!question) {
		return { error: 'Question not found' };
	}

	// Validate unique option texts
	const optionTexts = newOptions.map((option) =>
		option.text.trim().toLowerCase()
	);
	const uniqueOptionTexts = new Set(optionTexts);
	if (uniqueOptionTexts.size !== optionTexts.length) {
		return { error: 'All options must be unique for each question.' };
	}

	// Update the question's text and options
	question.text = newText;
	question.options = newOptions;

	// Save the updated question to the database
	await question.save();

	return { success: 'Question updated successfully' };
}

// Delete a question
export async function deleteQuestion(questionId: string) {
	// Connect to the database
	await connectToDB();

	// Find the question by its ID
	const question = await Question.findById(questionId);
	if (!question) {
		return { error: 'Question not found' };
	}

	// Delete the question from the database
	await question.deleteOne();

	return { success: 'Question deleted successfully' };
}
