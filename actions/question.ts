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
	subject,
}: {
	text: string;
	options: { id: number; text: string }[];
	correctOptionId: number;
	subject: string;
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
		subject,
	});

	// Save the question to the database
	await newQuestion.save();

	const newCorrectAnswer = new CorrectAnswer({
		questionId: newQuestion._id,
		correctOptionId,
	});

	// Save the correct answer to the database
	await newCorrectAnswer.save();

	return { success: 'Question added successfully' };
}

// Get all questions with their options
// export async function getAllQuestions() {
// 	// Connect to the database
// 	await connectToDB();

// 	try {
// 		// Fetch all questions with their options
// 		const questions = await Question.find().select('text options').exec();

// 		// Return the questions data
// 		return { success: true, questions };
// 	} catch (error) {
// 		// Handle any errors that occur during the query
// 		return {
// 			error: `An error occurred while retrieving questions: ${error}`,
// 		};
// 	}
// }

export async function getAllQuestions() {
	try {
		// First establish database connection
		await connectToDB();

		// Use .lean() to get plain JavaScript objects and select only needed fields
		const questions = await Question.find()
			.select('text options')
			.lean()
			.exec();

		// Transform the questions into the desired format with proper serialization
		const formattedQuestions = questions.map((question) => {
			// Ensure options are properly formatted with sequential IDs
			const formattedOptions = (question.options || []).map(
				(option, index) => {
					// If option is already in {id, text} format, return as is
					// Otherwise, create the proper structure
					return typeof option === 'object' &&
						option !== null &&
						'id' in option
						? option
						: {
								id: index + 1,
								text: String(option), // Ensure option text is a string
						  };
				}
			);

			// Return a clean question object with proper types
			return {
				_id: question._id.toString(), // Convert MongoDB ObjectId to string
				text: question.text || '', // Ensure text exists
				options: formattedOptions,
				// Status will be initialized in the client component
			};
		});

		return {
			success: true,
			questions: formattedQuestions,
		};
	} catch (error) {
		// Provide detailed error information for debugging
		console.error('Error in getAllQuestions:', error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'An unknown error occurred while retrieving questions',
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
// export async function getAllQuestionsWithAnswers() {
// 	// Connect to the database
// 	await connectToDB();

// 	try {
// 		// Fetch all questions
// 		const questions = await Question.find();

// 		// Fetch correct answer for each question
// 		const correctAnswers = await CorrectAnswer.find();

// 		// Transform the questions into the desired format
// 		// We map each question to a new object with only the required fields
// 		const formattedQuestions = questions.map((question) => {
// 			// Find the corresponding correct answer for this question
// 			const correctAnswer = correctAnswers.find(
// 				(ca) => ca.questionId.toString() === question._id.toString()
// 			);

// 			// Format options to ensure they have id and text properties
// 			const formattedOptions = question.options.map((option, index) => {
// 				// If option is already in {id, text} format, return as is
// 				// Otherwise, create the proper structure
// 				return typeof option === 'object' && option.id
// 					? option
// 					: {
// 							id: index + 1, // Create sequential IDs starting from 1
// 							text: option, // Use the option value as text
// 					  };
// 			});

// 			// Return the question in the exact format requested
// 			return {
// 				_id: question._id,
// 				text: question.text,
// 				options: formattedOptions,
// 				correctOptionId: correctAnswer?.correctOptionId,
// 			};
// 		});

// 		return { success: true, questions: formattedQuestions };
// 	} catch (error) {
// 		// Throw the error to be handled by the calling function
// 		return {
// 			error: `An error occurred: ${error}`,
// 		};
// 	}
// }

// export async function getAllQuestionsWithAnswers() {
//   console.log('Server: Starting getAllQuestionsWithAnswers function');

//   try {
//     // First establish database connection
//     console.log('Server: Attempting to connect to database');
//     await connectToDB();
//     console.log('Server: Successfully connected to database');

//     // Fetch the questions
//     console.log('Server: Fetching questions from database');
//     const questions = await Question.find();
//     console.log(`Server: Found ${questions.length} questions`);

//     // Fetch correct answers
//     const correctAnswers = await CorrectAnswer.find();
//     console.log(`Server: Found ${correctAnswers.length} correct answers`);

//     // Transform the data
//     const formattedQuestions = questions.map((question) => {
//       const correctAnswer = correctAnswers.find(
//         (ca) => ca.questionId.toString() === question._id.toString()
//       );

//       const formattedOptions = question.options.map((option, index) => {
//         return typeof option === 'object' && option.id
//           ? option
//           : {
//               id: index + 1,
//               text: option,
//             };
//       });

//       return {
//         _id: question._id.toString(), // Convert ObjectId to string
//         text: question.text,
//         options: formattedOptions,
//         correctOptionId: correctAnswer?.correctOptionId,
//       };
//     });

//     console.log('Server: Successfully formatted questions');
//     return { success: true, questions: formattedQuestions };
//   } catch (error) {
//     console.error('Server Error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'An unknown error occurred',
//     };
//   }
// }

export async function getAllQuestionsWithAnswers() {
	try {
		// Connect to the database
		await connectToDB();

		// Use lean() to get plain JavaScript objects and select only needed fields
		const questions = await Question.find(
			{},
			{
				_id: 1,
				text: 1,
				options: 1,
				subject: 1, // Add subject field to the query
			}
		).lean();

		const correctAnswers = await CorrectAnswer.find(
			{},
			{
				questionId: 1,
				correctOptionId: 1,
			}
		).lean();

		// Create a safe serialization function
		const safeSerialize = (obj: unknown) => {
			const seen = new WeakSet();
			return JSON.parse(
				JSON.stringify(obj, (key, value) => {
					if (typeof value === 'object' && value !== null) {
						if (seen.has(value)) {
							return '[Circular]';
						}
						seen.add(value);
					}
					// Convert MongoDB ObjectIds to strings
					if (
						value &&
						value.toString &&
						typeof value.toString === 'function' &&
						value._bsontype === 'ObjectID'
					) {
						return value.toString();
					}
					return value;
				})
			);
		};

		// Safely transform the data
		const formattedQuestions = questions.map((question) => {
			// Find the corresponding correct answer
			const correctAnswer = correctAnswers.find(
				(ca) => ca.questionId?.toString() === question._id?.toString()
			);

			// Format options safely
			const formattedOptions = Array.isArray(question.options)
				? question.options.map((option, index) => ({
						id:
							typeof option === 'object' && option?.id
								? option.id
								: index + 1,
						text:
							typeof option === 'object'
								? option.text
								: String(option),
				  }))
				: [];

			// Create a plain object with only the needed data
			return {
				_id: question._id?.toString() || '',
				text: question.text || '',
				options: formattedOptions,
				correctOptionId: correctAnswer?.correctOptionId || null,
				subject: question.subject || '', // Include subject in the returned data
			};
		});

		// Safely serialize the final result
		const serializedResult = safeSerialize({
			success: true,
			questions: formattedQuestions,
		});

		return serializedResult;
	} catch (error) {
		console.error('Server Error:', error);
		// Return a safely serialized error response
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'An unknown error occurred',
		};
	}
}

// Update a question
export async function updateQuestion({
	questionId,
	newText,
	newOptions,
	newCorrectOptionId,
	newSubject,
}: {
	questionId: string;
	newText: string;
	newOptions: { id: number; text: string }[];
	newCorrectOptionId: number;
	newSubject: string;
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

	// Check if the new correct option ID is valid
	const isValidOptionId = newOptions.some(
		(option) => option.id === newCorrectOptionId
	);
	if (!isValidOptionId) {
		return { error: 'Correct option ID is not valid.' };
	}

	// Update the question's text, options, and subject
	question.text = newText;
	question.options = newOptions;
	question.subject = newSubject;

	// Save the updated question to the database
	await question.save();

	// Update the correct answer
	await CorrectAnswer.findOneAndUpdate(
		{ questionId },
		{ correctOptionId: newCorrectOptionId },
		{ upsert: true }
	);

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
