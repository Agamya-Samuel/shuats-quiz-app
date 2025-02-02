import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	console.error('.env.local file not found');
	process.exit(1);
}

import { connectToDB } from '@/db';
import Question from '@/db/models/question';
import CorrectAnswer from '@/db/models/correct-answer';
import { parseMarkdownQuestions } from '@/lib/utils/question-parser';
import { Option } from '@/lib/utils/question-parser';

async function importQuestions() {
	try {
		// Verify required environment variables
		if (!process.env.MONGODB_URI) {
			throw new Error(
				'MONGODB_URI environment variable is not defined in .env.local'
			);
		}

		// Connect to database
		await connectToDB();

		// Read the markdown file
		const markdownPath = path.join(process.cwd(), 'question.md');
		const markdown = fs.readFileSync(markdownPath, 'utf-8');

		// Parse questions
		const questions = parseMarkdownQuestions(markdown);

		console.log(`Found ${questions.length} questions to import`);

		// Import questions to database
		for (const questionData of questions) {
			const { text, options, correctOptionId, subject } = questionData;

			// Check if question already exists
			const existingQuestion = await Question.findOne({ text });
			if (existingQuestion) {
				console.log(
					`Skipping duplicate question: ${text.substring(0, 50)}...`
				);
				continue;
			}

			// Validate unique option texts
			const optionTexts = options.map((option: Option) =>
				option.text.trim().toLowerCase()
			);
			const uniqueOptionTexts = new Set(optionTexts);
			if (uniqueOptionTexts.size !== optionTexts.length) {
				console.log(
					`Skipping question with duplicate options: ${text.substring(
						0,
						50
					)}...`
				);
				continue;
			}

			// Check if correct option ID is valid
			const isValidOptionId = options.some(
				(option: Option) => option.id === correctOptionId
			);
			if (!isValidOptionId) {
				console.log(
					`Skipping question with invalid correct option ID: ${text.substring(
						0,
						50
					)}...`
				);
				continue;
			}

			// Create and save the question
			const newQuestion = new Question({
				text,
				options,
				subject,
			});
			await newQuestion.save();

			// Create and save the correct answer
			const newCorrectAnswer = new CorrectAnswer({
				questionId: newQuestion._id,
				correctOptionId,
			});
			await newCorrectAnswer.save();

			console.log(`Imported question: ${text.substring(0, 50)}...`);
		}

		console.log('Successfully completed question import');
		process.exit(0);
	} catch (error) {
		console.error('Error importing questions:', error);
		process.exit(1);
	}
}

importQuestions();
