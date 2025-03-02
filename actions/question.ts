// actions/question.ts
'use server';

import { connectToDB } from '@/db';
import Question from '@/db/models/question';
import CorrectAnswer from '@/db/models/correct-answer';
import SubmittedAnswer from '@/db/models/submitted-answer';
import User from '@/db/models/user';

// Type for MongoDB ObjectId-like objects
interface ObjectIdLike {
	_bsontype: 'ObjectID';
	toString(): string;
}

// Safely convert MongoDB ObjectIds to strings
const safeToString = (obj: unknown): string | null => {
	if (!obj) return null;
	if (
		typeof obj === 'object' &&
		obj !== null &&
		'toString' in obj &&
		typeof (obj as ObjectIdLike).toString === 'function' &&
		(obj as ObjectIdLike)._bsontype === 'ObjectID'
	) {
		return (obj as ObjectIdLike).toString();
	}
	return String(obj);
};

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
			.select('text options subject')
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
				subject: question.subject || 'unknown', // Include subject in the returned data
				// Status will be initialized in the client component
			};
		});

		// Randomize the order of questions using Fisher-Yates (Knuth) shuffle algorithm
		// This ensures an unbiased, random permutation of the questions array
		for (let i = formattedQuestions.length - 1; i > 0; i--) {
			// Generate a random index between 0 and i (inclusive)
			const j = Math.floor(Math.random() * (i + 1));
			// Swap elements at indices i and j
			[formattedQuestions[i], formattedQuestions[j]] = [
				formattedQuestions[j],
				formattedQuestions[i],
			];
		}

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

export async function getQuizResults(userId: string) {
	await connectToDB();

	try {
		// Get user's submitted answers with lean()
		const submittedAnswers = await SubmittedAnswer.find({ userId })
			.select('questionId selectedOptionId submittedAt')
			.lean()
			.exec();

		// If user hasn't submitted any answers, return empty results
		if (!submittedAnswers || submittedAnswers.length === 0) {
			return {
				success: true,
				data: {
					results: [],
					summary: {
						totalQuestions: 0,
						attemptedQuestions: 0,
						correctAnswers: 0,
						score: 0,
						submittedAt: new Date().toISOString(),
					},
				},
			};
		}

		// Get all questions with lean() to get plain objects - include subject field
		const questions = await Question.find({})
			.select('_id text options subject')
			.lean()
			.exec();

		// Get correct answers from database with lean()
		const correctAnswersData = await CorrectAnswer.find({})
			.select('questionId correctOptionId')
			.lean()
			.exec();

		// Create a map of correct answers for quick lookup
		const correctAnswersMap = new Map(
			correctAnswersData.map((answer) => [
				safeToString(answer.questionId),
				answer.correctOptionId,
			])
		);

		// Calculate results with safe object creation
		const results = questions.map((question) => {
			const questionId = safeToString(question._id);
			const userAnswer = submittedAnswers.find(
				(answer) => safeToString(answer.questionId) === questionId
			);

			const correctOptionId = correctAnswersMap.get(questionId);

			// Create a clean object with only primitive values
			return {
				questionId,
				question: String(question.text || ''),
				options: Array.isArray(question.options)
					? question.options.map((opt) => ({
							id: Number(opt.id),
							text: String(opt.text || ''),
					  }))
					: [],
				correctOptionId:
					correctOptionId != null ? Number(correctOptionId) : null,
				userSelectedOptionId:
					userAnswer?.selectedOptionId != null
						? Number(userAnswer.selectedOptionId)
						: null,
				isCorrect: userAnswer?.selectedOptionId === correctOptionId,
				subject: question.subject
					? String(question.subject)
					: undefined, // Include subject information
			};
		});

		// Calculate overall score with safe number operations
		const totalQuestions = questions.length;
		const attemptedQuestions = submittedAnswers.length;
		const numberOfCorrectAnswers = results.filter(
			(r) => r.isCorrect
		).length;
		const score =
			Math.round((numberOfCorrectAnswers / totalQuestions) * 100 * 100) /
			100;

		// Create a clean response object with primitive values
		const cleanResponse = {
			success: true,
			data: {
				results,
				summary: {
					totalQuestions: Number(totalQuestions),
					attemptedQuestions: Number(attemptedQuestions),
					correctAnswers: Number(numberOfCorrectAnswers),
					score: Number(score),
					submittedAt: submittedAnswers[0]?.submittedAt
						? new Date(
								submittedAnswers[0].submittedAt
						  ).toISOString()
						: new Date().toISOString(),
				},
			},
		};

		// Final safety check: convert to and from JSON to remove any remaining circular references
		return JSON.parse(JSON.stringify(cleanResponse));
	} catch (error) {
		console.error('Error fetching quiz results:', error);
		return {
			success: false,
			error: 'Failed to fetch quiz results',
		};
	}
}

// Get leaderboard data with user scores and performance metrics
export async function getLeaderboard() {
	await connectToDB();

	try {
		// Get all users who have submitted answers
		const userSubmissions = await SubmittedAnswer.aggregate([
			{
				$group: {
					_id: '$userId',
					submittedAt: { $max: '$submittedAt' },
					answersCount: { $sum: 1 },
				},
			},
		]).exec();

		if (!userSubmissions || userSubmissions.length === 0) {
			return {
				success: true,
				data: [],
			};
		}

		// Get all questions
		const questions = await Question.find({}).select('_id').lean().exec();

		const totalQuestions = questions.length;

		// Get correct answers
		const correctAnswersData = await CorrectAnswer.find({})
			.select('questionId correctOptionId')
			.lean()
			.exec();

		// Create a map of correct answers for quick lookup
		const correctAnswersMap = new Map(
			correctAnswersData.map((answer) => [
				safeToString(answer.questionId),
				answer.correctOptionId,
			])
		);

		// Calculate scores for each user
		const leaderboardData = await Promise.all(
			userSubmissions.map(async (submission) => {
				const userId = submission._id;

				// Get user details
				const user = await User.findById(userId)
					.select('name email')
					.lean()
					.exec();

				// Get user's submitted answers
				const userAnswers = await SubmittedAnswer.find({ userId })
					.select('questionId selectedOptionId')
					.lean()
					.exec();

				// Calculate correct answers
				const correctAnswers = userAnswers.filter((answer) => {
					const questionId = safeToString(answer.questionId);
					const correctOptionId = correctAnswersMap.get(questionId);
					return answer.selectedOptionId === correctOptionId;
				}).length;

				// Calculate score and other metrics
				const attemptedQuestions = userAnswers.length;
				const score =
					Math.round((correctAnswers / totalQuestions) * 100 * 100) /
					100;
				const accuracy =
					attemptedQuestions > 0
						? Math.round(
								(correctAnswers / attemptedQuestions) *
									100 *
									100
						  ) / 100
						: 0;

				return {
					userId: safeToString(userId),
					name: user?.name || 'Anonymous User',
					email: user?.email || 'unknown',
					score,
					totalQuestions,
					attemptedQuestions,
					correctAnswers,
					accuracy,
					submittedAt: submission.submittedAt,
				};
			})
		);

		// Sort by score (highest first)
		const sortedLeaderboard = leaderboardData.sort(
			(a, b) => b.score - a.score
		);

		// Add rank to each entry
		const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
			...entry,
			rank: index + 1,
		}));

		return {
			success: true,
			data: rankedLeaderboard,
		};
	} catch (error) {
		console.error('Error fetching leaderboard data:', error);
		return {
			success: false,
			error: 'Failed to fetch leaderboard data',
		};
	}
}
