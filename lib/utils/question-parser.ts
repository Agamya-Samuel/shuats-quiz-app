export interface Option {
	id: number;
	text: string;
}

export interface ParsedQuestion {
	text: string;
	options: Option[];
	correctOptionId: number;
	subject: string;
}

const OPTION_MAP = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
};

export function parseMarkdownQuestions(markdown: string): ParsedQuestion[] {
	const questions: ParsedQuestion[] = [];
	const sections = markdown.split('---');

	let currentSubject = '';

	for (const section of sections) {
		// Extract subject from section headers
		const subjectMatch = section.match(/Quiz: ([^(]+)/);
		if (subjectMatch) {
			currentSubject = subjectMatch[1].trim();
			continue;
		}

		// Look for question patterns
		const questionMatch = section.match(/###\s*\*\*(\d+)\.\s*([^*]+)\*\*/);
		if (!questionMatch) continue;

		const questionText = questionMatch[2].trim();
		const options: Option[] = [];
		let correctOptionId = 1;

		// Extract options and correct answer
		const lines = section.split('\n');
		for (const line of lines) {
			// Match option pattern: A) text or B) text etc.
			const optionMatch = line.match(/([A-D])\)\s*(.+)/);
			if (optionMatch) {
				const [, letter, text] = optionMatch;
				options.push({
					id: OPTION_MAP[letter as keyof typeof OPTION_MAP],
					text: text.trim(),
				});
			}

			// Match answer pattern: **Answer:** X) text
			const answerMatch = line.match(/\*\*Answer:\*\*\s*([A-D])\)/);
			if (answerMatch) {
				correctOptionId =
					OPTION_MAP[answerMatch[1] as keyof typeof OPTION_MAP];
			}
		}

		if (options.length === 4 && questionText) {
			questions.push({
				text: questionText,
				options,
				correctOptionId,
				subject: currentSubject.toLowerCase().replace(/[^a-z]/g, '-'),
			});
		}
	}

	return questions;
}
