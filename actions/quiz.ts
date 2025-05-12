// actions/question.ts
'use server';

import { connectToDB, db } from '@/db';
import { questions, correctAnswers, userSubmissions } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

// Add a question and its correct answer to the database
export async function addQuestion({
	question,
	options,
	correctOption,
	subject,
}: {
	question: string;
	options: { id: string; value: string }[];
	correctOption: string; // Now expects "A", "B", "C", etc.
	subject: string;
}) {
	try {
		// Connect to the database
		await connectToDB();

		// Check if the question text already exists
		const existingQuestion = await db.query.questions.findFirst({
			where: eq(questions.question, question),
		});

		if (existingQuestion) {
			return {
				success: false,
				message: 'This question already exists',
			};
		}

		// Validate unique option values
		const optionValues = options.map((option) =>
			option.value.trim().toLowerCase()
		);
		const uniqueOptionValues = new Set(optionValues);
		if (uniqueOptionValues.size !== optionValues.length) {
			return {
				success: false,
				message: 'All options must be unique for each question.',
			};
		}

		// Check if the correct option is valid
		const isValidOption = options.some(
			(option) => option.id === correctOption
		);
		if (!isValidOption) {
			return {
				success: false,
				message: 'Correct option is not valid.',
			};
		}

		// Use a transaction to ensure both question and correct answer are saved
		await db.transaction(async (tx) => {
			// Create the question
			const [newQuestion] = await tx
				.insert(questions)
				.values({
					question,
					options,
					subject,
				})
				.returning({ id: questions.id });

			// Create the correct answer
			await tx.insert(correctAnswers).values({
				questionId: newQuestion.id,
				correctOption: correctOption, // Store the selected option ID (e.g., "A")
			});
		});

		return {
			success: true,
			message: 'Question added successfully',
		};
	} catch (error) {
		console.error('Error adding question:', error);
		return {
			success: false,
			message: `Failed to add question: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

// Get all questions
export async function getAllQuestions() {
	try {
		// First establish database connection
		await connectToDB();

		// Get all questions with their options
		const allQuestions = await db.query.questions.findMany({
			columns: {
				id: true,
				question: true,
				options: true,
				subject: true,
			},
		});

		// Transform the questions into the desired format with proper serialization
		const formattedQuestions = allQuestions.map((question) => {
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
				id: question.id,
				text: question.question || '', // Ensure text exists
				options: formattedOptions,
				subject: question.subject,
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
export async function getQuestionById(questionId: number) {
	// Connect to the database
	await connectToDB();

	try {
		// Find the question by its ID
		const question = await db.query.questions.findFirst({
			where: eq(questions.id, questionId),
		});

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

export async function getAllQuestionsWithAnswers() {
	try {
		// Connect to the database
		await connectToDB();

		// Get all questions
		const questionsList = await db.query.questions.findMany();

		// Get all correct answers
		const correctAnswersList = await db.query.correctAnswers.findMany();

		// Create a map of question IDs to correct answers
		const correctAnswersMap = new Map();
		correctAnswersList.forEach((answer) => {
			correctAnswersMap.set(answer.questionId, answer.correctOption);
		});

		// Format questions with their correct answers
		const formattedQuestions = questionsList.map((question) => {
			// Format options for client display
			const formattedOptions = (question.options || []).map((option) => {
				if (
					typeof option === 'object' &&
					option !== null &&
					'id' in option &&
					'value' in option
				) {
					return {
						id: option.id,
						text: option.value,
					};
				}
				return option;
			});

			return {
				id: question.id,
				text: question.question,
				options: formattedOptions,
				correctOptionId: correctAnswersMap.get(question.id) || null,
				subject: question.subject,
			};
		});

		return {
			success: true,
			questions: formattedQuestions,
		};
	} catch (error) {
		console.error('Server Error:', error);
		return {
			success: false,
			message: 'Failed to fetch questions with answers',
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
	questionId: number;
	newText: string;
	newOptions: { id: string; value: string }[];
	newCorrectOptionId: string;
	newSubject?: string;
}) {
	// Connect to the database
	await connectToDB();

	try {
		// Check if the question exists
		const existingQuestion = await db.query.questions.findFirst({
			where: eq(questions.id, questionId),
		});

		if (!existingQuestion) {
			return { error: 'Question not found' };
		}

		// Check if the new text already exists in another question
		const duplicateQuestion = await db.query.questions.findFirst({
			where: and(
				eq(questions.question, newText),
				sql`${questions.id} != ${questionId}`
			),
		});

		if (duplicateQuestion) {
			return { error: 'A question with this text already exists' };
		}

		// Validate unique option values
		const optionValues = newOptions.map((option) =>
			option.value.trim().toLowerCase()
		);
		const uniqueOptionValues = new Set(optionValues);
		if (uniqueOptionValues.size !== optionValues.length) {
			return { error: 'All options must be unique for each question.' };
		}

		// Check if the correct option is valid
		const isValidOption = newOptions.some(
			(option) => option.id === newCorrectOptionId
		);
		if (!isValidOption) {
			return { error: 'Correct option ID is not valid.' };
		}

		// Use a transaction to update both the question and correct answer
		await db.transaction(async (tx) => {
			// Update the question
			await tx
				.update(questions)
				.set({
					question: newText,
					options: newOptions,
					subject: newSubject,
				})
				.where(eq(questions.id, questionId));

			// Update the correct answer
			await tx
				.update(correctAnswers)
				.set({
					correctOption: newCorrectOptionId,
				})
				.where(eq(correctAnswers.questionId, questionId));
		});

		return { success: 'Question updated successfully' };
	} catch (error) {
		console.error('Error updating question:', error);
		return {
			error: `Failed to update question: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

// Delete a question
export async function deleteQuestion(questionId: number) {
	// Connect to the database
	await connectToDB();

	try {
		// Delete the question (cascading will take care of correct answers and submitted answers)
		await db.delete(questions).where(eq(questions.id, questionId));

		return { success: 'Question deleted successfully' };
	} catch (error) {
		console.error('Error deleting question:', error);
		return { error: `Failed to delete question: ${error}` };
	}
}

export async function getQuizResults(userId: number) {
	// Connect to the database
	await connectToDB();

	try {
		// Get all submitted answers for the user
		const submissions = await db.query.userSubmissions.findMany({
			where: eq(userSubmissions.userId, userId),
			with: {
				question: true,
			},
		});

		// Get all correct answers
		const allCorrectAnswers = await db.query.correctAnswers.findMany();

		// Map to store correct answers by question ID
		const correctAnswersMap = new Map();
		allCorrectAnswers.forEach((answer) => {
			correctAnswersMap.set(answer.questionId, answer.correctOption);
		});

		// Process results
		let totalQuestions = 0;
		let correctAnswersCount = 0;
		let attemptedQuestions = 0;

		// Format the individual question results
		const questionResults = submissions.map((submission) => {
			totalQuestions++;

			const questionId = submission.questionId;
			const correctOption = correctAnswersMap.get(questionId);

			// Check if the answer is correct
			const isCorrect = submission.option === correctOption;
			if (isCorrect) {
				correctAnswersCount++;
			}

			// Track attempted questions
			attemptedQuestions++;

			return {
				questionId: submission.questionId,
				questionText: submission.question?.question || '', // Safe access with optional chaining
				userAnswer: submission.option,
				correctAnswer: correctOption,
				isCorrect,
			};
		});

		// Calculate overall results
		const percentage =
			totalQuestions > 0
				? (correctAnswersCount / totalQuestions) * 100
				: 0;

		return {
			success: true,
			results: {
				userId,
				totalQuestions,
				attemptedQuestions,
				correctAnswers: correctAnswersCount,
				incorrectAnswers: attemptedQuestions - correctAnswersCount,
				percentage: parseFloat(percentage.toFixed(2)),
				questionResults,
			},
		};
	} catch (error) {
		console.error('Error getting quiz results:', error);
		return {
			success: false,
			error: `An error occurred while retrieving quiz results: ${error}`,
		};
	}
}

// Get leaderboard data with user scores and performance metrics
export async function getLeaderboard() {
	// Connect to the database
	await connectToDB();

	try {
		// Get all users
		const allUsers = await db.query.users.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				school: true, // Updated from schoolName to school
			},
		});

		// Get all submitted answers
		const allSubmissions = await db.query.userSubmissions.findMany();

		// Get all correct answers
		const allCorrectAnswers = await db.query.correctAnswers.findMany();

		// Map to store correct answers by question ID
		const correctAnswersMap = new Map();
		allCorrectAnswers.forEach((answer) => {
			correctAnswersMap.set(answer.questionId, answer.correctOption);
		});

		// Process user data for leaderboard
		const leaderboardData = await Promise.all(
			allUsers.map(async (user) => {
				// Filter submissions for this user
				const userSubmissions = allSubmissions.filter(
					(submission) => submission.userId === user.id
				);

				// Calculate results for this user
				const totalAnswered = userSubmissions.length;
				let correctCount = 0;

				userSubmissions.forEach((submission) => {
					const isCorrect =
						submission.option ===
						correctAnswersMap.get(submission.questionId);
					if (isCorrect) correctCount++;
				});

				const accuracy =
					totalAnswered > 0
						? (correctCount / totalAnswered) * 100
						: 0;

				return {
					userId: user.id,
					name: user.name,
					email: user.email,
					school: user.school,
					totalAnswered,
					correctAnswers: correctCount,
					accuracy: parseFloat(accuracy.toFixed(2)),
					// Simple scoring formula based on correct answers
					score: correctCount * 10,
				};
			})
		);

		// Sort by score in descending order
		leaderboardData.sort((a, b) => b.score - a.score);

		// Add rankings
		const rankedData = leaderboardData.map((user, index) => ({
			...user,
			rank: index + 1,
		}));

		return {
			success: true,
			leaderboard: rankedData,
		};
	} catch (error) {
		console.error('Error getting leaderboard:', error);
		return {
			success: false,
			error: `An error occurred while retrieving leaderboard: ${error}`,
		};
	}
}
