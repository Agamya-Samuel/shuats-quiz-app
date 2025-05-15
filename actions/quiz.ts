// actions/question.ts
'use server';

import { connectToDB } from '@/db';
import {
	questions,
	correctAnswers,
	userSubmissions,
	quizSettings,
} from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from '@/db/schema';
import { IOption, IQuestion, IQuestionWithAnswers } from '@/types/question';
import { verifyAuth } from '@/lib/dal';
import { revalidatePath } from 'next/cache';

// Structure for user submission with question
interface SubmissionWithQuestion {
	id: number;
	option: string;
	userId: number | null;
	questionId: number | null;
	question: {
		id: number;
		createdAt: Date | null;
		updatedAt: Date | null;
		options: IOption[];
		question: string;
		subject: string;
	} | null;
}

// Structure for correct answer
interface CorrectAnswer {
	id: number;
	questionId: number | null;
	correctOption: string;
}

// Structure for user data
interface User {
	id: number;
	name: string;
	email: string;
	school: string;
}

// Structure for leaderboard entry
interface LeaderboardEntry {
	userId: number;
	name: string;
	email: string;
	school: string;
	totalAnswered: number;
	correctAnswers: number;
	accuracy: number;
	score: number;
	rank?: number;
}

// Add a question and its correct answer to the database
export async function addQuestion({
	question,
	options,
	correctOption,
	subject,
}: IQuestionWithAnswers) {
	// First verify that the requester is an admin or superadmin
	const user = await verifyAuth();

	if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
		return {
			success: false,
			message:
				'Unauthorized: You do not have permission to add questions',
		};
	}

	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

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
				message: 'All options must be unique.',
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
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

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
		const formattedQuestions = allQuestions.map((question: IQuestion) => {
			// Ensure options are properly formatted with sequential IDs
			const formattedOptions = (question.options || []).map(
				(option: { id: string; value: string }, index: number) => {
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
				text: question.question,
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
			message: `Failed to fetch questions: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

// Get a question by its ID
export async function getQuestionById(questionId: number) {
	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Find the question by its ID
		const question = await db.query.questions.findFirst({
			where: eq(questions.id, questionId),
		});

		// Check if the question exists
		if (!question) {
			return {
				success: false,
				message: 'Question not found',
			};
		}

		// Return the question data
		return { success: true, question };
	} catch (error) {
		// Handle any errors that occur during the query
		return {
			success: false,
			message: `An error occurred while retrieving the question: ${error}`,
		};
	}
}

export async function getAllQuestionsWithAnswers() {
	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get all questions
		const questionsList = await db.query.questions.findMany();

		// Get all correct answers
		const correctAnswersList = await db.query.correctAnswers.findMany();

		// Create a map of question IDs to correct answers
		const correctAnswersMap = new Map<number, string>();
		correctAnswersList.forEach(
			(answer: { questionId: number | null; correctOption: string }) => {
				if (answer.questionId !== null) {
					correctAnswersMap.set(
						answer.questionId,
						answer.correctOption
					);
				}
			}
		);

		// Format questions with their correct answers
		const formattedQuestions = questionsList.map((question: IQuestion) => {
			// Format options for client display
			const formattedOptions = (question.options || []).map(
				(option: IOption) => {
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
				}
			);

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
	newOptions: IOption[];
	newCorrectOptionId: string;
	newSubject?: string;
}) {
	// First verify that the requester is an admin or superadmin
	const user = await verifyAuth();

	if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
		return {
			success: false,
			message:
				'Unauthorized: You do not have permission to update questions',
		};
	}

	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Check if the question exists
		const existingQuestion = await db.query.questions.findFirst({
			where: eq(questions.id, questionId),
		});

		if (!existingQuestion) {
			return { success: false, message: 'Question not found' };
		}

		// Check if the new text already exists in another question
		const duplicateQuestion = await db.query.questions.findFirst({
			where: and(
				eq(questions.question, newText),
				sql`${questions.id} != ${questionId}`
			),
		});

		if (duplicateQuestion) {
			return {
				success: false,
				message: 'A question with this text already exists',
			};
		}

		// Validate unique option values
		const optionValues = newOptions.map((option: IOption) =>
			option.value.trim().toLowerCase()
		);
		const uniqueOptionValues = new Set(optionValues);
		if (uniqueOptionValues.size !== optionValues.length) {
			return {
				success: false,
				message: 'All options must be unique.',
			};
		}

		// Check if the correct option is valid
		const isValidOption = newOptions.some(
			(option: IOption) => option.id === newCorrectOptionId
		);
		if (!isValidOption) {
			return {
				success: false,
				message: 'Correct option ID is not valid.',
			};
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

		return { success: true, message: 'Question updated successfully' };
	} catch (error) {
		console.error('Error updating question:', error);
		return {
			success: false,
			message: `Failed to update question: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

// Delete a question
export async function deleteQuestion(questionId: number) {
	// First verify that the requester is an admin or superadmin
	const user = await verifyAuth();

	if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
		return {
			success: false,
			message:
				'Unauthorized: You do not have permission to delete questions',
		};
	}

	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Check if the question exists
		const question = await db.query.questions.findFirst({
			where: eq(questions.id, questionId),
		});

		if (!question) {
			return { success: false, message: 'Question not found' };
		}

		// Use a transaction to ensure atomicity (all operations succeed or fail together)
		await db.transaction(async (tx) => {
			// First delete associated correct answers
			await tx
				.delete(correctAnswers)
				.where(eq(correctAnswers.questionId, questionId));

			// Then delete the question
			await tx.delete(questions).where(eq(questions.id, questionId));
		});

		return { success: true, message: 'Question deleted successfully' };
	} catch (error) {
		console.error('Error deleting question:', error);
		return {
			success: false,
			message: `Failed to delete question: ${error}`,
		};
	}
}

export async function getQuizResults(userId: number) {
	// Verify authorization - users can only see their own results unless they're an admin/superadmin
	const authUser = await verifyAuth();

	if (!authUser) {
		return {
			success: false,
			message: 'Unauthorized: You must be logged in to view quiz results',
		};
	}

	// Users can only access their own results unless they are admins or superadmins
	if (authUser.role === 'user' && authUser.userId !== userId) {
		return {
			success: false,
			message: 'Unauthorized: You can only view your own quiz results',
		};
	}

	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get all submitted answers for the user
		const submissions = (await db.query.userSubmissions.findMany({
			where: eq(userSubmissions.userId, userId),
			with: {
				question: true,
			},
		})) as SubmissionWithQuestion[];

		// Get all correct answers
		const allCorrectAnswers =
			(await db.query.correctAnswers.findMany()) as CorrectAnswer[];

		// Map to store correct answers by question ID
		const correctAnswersMap = new Map<number, string>();
		allCorrectAnswers.forEach((answer) => {
			if (answer.questionId !== null) {
				correctAnswersMap.set(answer.questionId, answer.correctOption);
			}
		});

		// Process results
		let correctAnswersCount = 0;
		let attemptedQuestions = 0;

		// Format the individual question results
		const questionResults = submissions
			.map((submission) => {
				const questionId = submission.questionId;
				// Skip questions with null IDs
				if (questionId === null) {
					return null;
				}

				const correctOption = correctAnswersMap.get(questionId);

				// Check if the answer is correct
				const isCorrect = submission.option === correctOption;
				if (isCorrect) {
					correctAnswersCount++;
				}

				if (submission.option) {
					attemptedQuestions++;
				}

				// Return formatted result for this question
				return {
					questionId,
					question:
						submission.question?.question ?? 'Question not found',
					options: submission.question?.options ?? [],
					selectedOption: submission.option,
					correctOption,
					isCorrect,
				};
			})
			.filter(Boolean); // Remove null results

		// Prepare summary statistics
		const summary = {
			totalQuestions: questionResults.length,
			attemptedQuestions,
			correctAnswers: correctAnswersCount,
			score:
				questionResults.length > 0
					? (correctAnswersCount / questionResults.length) * 100
					: 0,
		};

		return {
			success: true,
			results: {
				summary,
				questions: questionResults,
			},
		};
	} catch (error) {
		console.error('Error retrieving quiz results:', error);
		return {
			success: false,
			message: `Failed to retrieve quiz results: ${error}`,
		};
	}
}

// Get leaderboard data with user scores and performance metrics
export async function getLeaderboard() {
	try {
		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get all users
		const allUsers = (await db.query.users.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				school: true,
			},
		})) as User[];

		// Get all submitted answers
		const allSubmissions = (await db.query.userSubmissions.findMany()) as {
			id: number;
			userId: number | null;
			questionId: number | null;
			option: string;
		}[];

		// Get all correct answers
		const allCorrectAnswers =
			(await db.query.correctAnswers.findMany()) as CorrectAnswer[];

		// Map to store correct answers by question ID
		const correctAnswersMap = new Map<number, string>();
		allCorrectAnswers.forEach((answer) => {
			if (answer.questionId !== null) {
				correctAnswersMap.set(answer.questionId, answer.correctOption);
			}
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
					if (submission.questionId === null) return;

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
				} as LeaderboardEntry;
			})
		);

		// Sort by score in descending order
		leaderboardData.sort((a, b) => b.score - a.score);

		// Add rankings
		const rankedData = leaderboardData.map((user, index: number) => ({
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
			message: `An error occurred while retrieving leaderboard: ${error}`,
		};
	}
}
// Get quiz settings
type QuizSettingsInput = {
	timeLimit: {
		perQuiz: number;
		perQuestion: number;
		enablePerQuestionTimer: boolean;
		showCountdown: boolean;
	};
	availability: {
		live: boolean;
		scheduled: boolean;
		scheduledDate: string | null;
	};
	behavior: {
		randomizeQuestions: boolean;
		showResults: string;
		allowRetake: boolean;
		maxAttempts: number;
		showCorrectAnswers: boolean;
		preventTabSwitching: boolean;
	};
};

// Get global quiz settings
export async function getQuizSettings() {
	// Verify that the user is authenticated as admin
	const user = await verifyAuth();
	if (!user || user.role !== 'admin') {
		return {
			success: false,
			message: 'Unauthorized: Only admins can access quiz settings',
		};
	}

	try {
		// Connect to db
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get the global quiz settings (first record)
		const settings = await db.query.quizSettings.findFirst();

		if (!settings) {
			// Return default settings if none exist yet
			return getDefaultQuizSettings();
		}

		// Transform DB format to application format
		const formattedSettings = {
			timeLimit: {
				perQuiz: settings.perQuizTimeLimit,
				perQuestion: settings.perQuestionTimeLimit,
				enablePerQuestionTimer: settings.enablePerQuestionTimer,
				showCountdown: settings.showCountdown,
			},
			availability: {
				live: settings.isLive,
				scheduled: settings.isScheduled,
				scheduledDate: settings.scheduledDate
					? settings.scheduledDate.toISOString()
					: null,
			},
			behavior: {
				randomizeQuestions: settings.randomizeQuestions,
				showResults: settings.showResultsMode,
				allowRetake: settings.allowRetake,
				maxAttempts: settings.maxAttempts,
				showCorrectAnswers: settings.showCorrectAnswers,
				preventTabSwitching: settings.preventTabSwitching,
			},
		};

		return { success: true, settings: formattedSettings };
	} catch (error) {
		console.error('Error fetching quiz settings:', error);
		return {
			success: false,
			message: `Error fetching quiz settings: ${error}`,
		};
	}
}

// Save global quiz settings
export async function saveQuizSettings(settingsInput: QuizSettingsInput) {
	// Verify that the user is authenticated as admin
	const user = await verifyAuth();
	if (!user || user.role !== 'admin') {
		return {
			success: false,
			message: 'Unauthorized: Only admins can update quiz settings',
		};
	}

	try {
		// Connect to db
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Check if any settings already exist
		const existingSettings = await db.query.quizSettings.findFirst();

		// Map input to database format
		const dbSettings = {
			perQuizTimeLimit: settingsInput.timeLimit.perQuiz,
			perQuestionTimeLimit: settingsInput.timeLimit.perQuestion,
			enablePerQuestionTimer:
				settingsInput.timeLimit.enablePerQuestionTimer,
			showCountdown: settingsInput.timeLimit.showCountdown,
			isLive: settingsInput.availability.live,
			isScheduled: settingsInput.availability.scheduled,
			scheduledDate: settingsInput.availability.scheduledDate
				? new Date(settingsInput.availability.scheduledDate)
				: null,
			randomizeQuestions: settingsInput.behavior.randomizeQuestions,
			showResultsMode: settingsInput.behavior.showResults,
			allowRetake: settingsInput.behavior.allowRetake,
			maxAttempts: settingsInput.behavior.maxAttempts,
			showCorrectAnswers: settingsInput.behavior.showCorrectAnswers,
			preventTabSwitching: settingsInput.behavior.preventTabSwitching,
			updatedAt: new Date(),
		};

		if (existingSettings) {
			// Update existing settings - using ID to target the single record
			await db
				.update(quizSettings)
				.set(dbSettings)
				.where(eq(quizSettings.id, existingSettings.id));
		} else {
			// Create new settings if none exist
			await db.insert(quizSettings).values(dbSettings);
		}

		// Revalidate the settings page to reflect changes
		revalidatePath(`/admin?section=settings`);

		return { success: true, message: 'Quiz settings saved successfully' };
	} catch (error) {
		console.error('Error saving quiz settings:', error);
		return {
			success: false,
			message: `Error saving quiz settings: ${error}`,
		};
	}
}

// Get default quiz settings
export async function getDefaultQuizSettings() {
	// Verify that the user is authenticated as admin
	const user = await verifyAuth();
	if (!user || user.role !== 'admin') {
		return {
			success: false,
			message: 'Unauthorized: Only admins can access quiz settings',
		};
	}

	// Return default settings
	return {
		success: true,
		settings: {
			timeLimit: {
				perQuiz: 30,
				perQuestion: 0,
				enablePerQuestionTimer: false,
				showCountdown: true,
			},
			availability: {
				live: true,
				scheduled: false,
				scheduledDate: null,
			},
			behavior: {
				randomizeQuestions: true,
				showResults: 'manual',
				allowRetake: false,
				maxAttempts: 1,
				showCorrectAnswers: false,
				preventTabSwitching: true,
			},
		},
	};
}

// Reset quiz settings to defaults
export async function resetQuizSettings() {
	// Verify that the user is authenticated as admin
	const user = await verifyAuth();
	if (!user || user.role !== 'admin') {
		return {
			success: false,
			message: 'Unauthorized: Only admins can reset quiz settings',
		};
	}

	try {
		// Connect to db
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get the default settings
		const defaultResponse = await getDefaultQuizSettings();

		if (!defaultResponse.success) {
			return defaultResponse;
		}

		// Clear existing settings
		await db.delete(quizSettings);

		// Insert default settings
		const defaultSettings = defaultResponse.settings;
		await db.insert(quizSettings).values({
			perQuizTimeLimit: defaultSettings?.timeLimit?.perQuiz ?? 30,
			perQuestionTimeLimit: defaultSettings?.timeLimit?.perQuestion ?? 0,
			enablePerQuestionTimer:
				defaultSettings?.timeLimit?.enablePerQuestionTimer ?? false,
			showCountdown: defaultSettings?.timeLimit?.showCountdown ?? true,
			isLive: defaultSettings?.availability?.live ?? true,
			isScheduled: defaultSettings?.availability?.scheduled ?? false,
			scheduledDate: defaultSettings?.availability?.scheduledDate
				? new Date(defaultSettings?.availability?.scheduledDate)
				: null,
			randomizeQuestions:
				defaultSettings?.behavior?.randomizeQuestions ?? true,
			showResultsMode: defaultSettings?.behavior?.showResults ?? 'manual',
			allowRetake: defaultSettings?.behavior?.allowRetake ?? false,
			maxAttempts: defaultSettings?.behavior?.maxAttempts ?? 1,
			showCorrectAnswers:
				defaultSettings?.behavior?.showCorrectAnswers ?? false,
			preventTabSwitching:
				defaultSettings?.behavior?.preventTabSwitching ?? true,
		});

		revalidatePath(`/admin?section=settings`);

		return {
			success: true,
			message: 'Quiz settings have been reset to defaults',
		};
	} catch (error) {
		console.error('Error resetting quiz settings:', error);
		return {
			success: false,
			message: `Error resetting quiz settings: ${error}`,
		};
	}
}

// Get quiz settings for regular users (public endpoint)
export async function getPublicQuizSettings() {
	try {
		// Connect to db
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Get the global quiz settings (first record)
		const settings = await db.query.quizSettings.findFirst();

		if (!settings) {
			// Return default settings if none exist yet
			return {
				success: true,
				settings: {
					isLive: false,
				},
			};
		}

		// Return only the settings relevant to regular users
		return {
			success: true,
			settings: {
				isLive: settings.isLive,
			},
		};
	} catch (error) {
		console.error('Error fetching public quiz settings:', error);
		return {
			success: false,
			message: `Error fetching quiz settings: ${error}`,
		};
	}
}
