'use server';

import { cookies } from 'next/headers';
import { loadMarkdownContent } from '@/lib/markdown-loader';

// Import guidance content directly
import configJson from '@/result-analysis/config.json';

// Type definitions
type ConfigType = {
	single_subjects: Record<string, string>;
	combined_subjects: Record<string, string>;
	subject_display_names: Record<string, string>;
};

// Map subject keys from constants.ts to keys used in config.json
const subjectKeyMapping: Record<string, string> = {
	physics: 'physics',
	chemistry: 'chemistry',
	math: 'mathematics',
	biology: 'biology',
	social: 'social_science',
	english: 'english',
	gk: 'general_knowledge',
	computer: 'computer_science',
	commerce: 'commerce',
};

// Load markdown files using dynamic imports
async function loadMarkdownFile(filePath: string): Promise<string> {
	try {
		// Remove leading path parts to get the relative path from result-analysis
		const relativePath = filePath.replace(/^.*?result-analysis\//, '');

		// Use dynamic import for the markdown file
		const importedContent = await import(
			`@/result-analysis/${relativePath}`
		);
		return loadMarkdownContent(importedContent);
	} catch (error) {
		console.error(`Error loading markdown file ${filePath}:`, error);
		return `Error loading content for ${filePath}. Please try again later.`;
	}
}

/**
 * Gets the career guidance content based on user's selected subjects
 */
export async function getCareerGuidance(): Promise<string> {
	try {
		// Get user's selected subjects from cookies
		const cookieStore = await cookies();
		const selectedSubjectsCookie = cookieStore.get('selectedSubjects');

		if (!selectedSubjectsCookie?.value) {
			return 'No subjects selected. Please select subjects to get career guidance.';
		}

		const selectedSubjects = JSON.parse(
			decodeURIComponent(selectedSubjectsCookie.value)
		) as string[];

		if (!selectedSubjects.length) {
			return 'No subjects selected. Please select subjects to get career guidance.';
		}

		// Map the subject keys to the format used in config.json
		const mappedSubjects = selectedSubjects.map(
			(subject) => subjectKeyMapping[subject] || subject
		);

		// Use the imported config
		const config = configJson as ConfigType;

		// Sort subjects alphabetically to match the format in config.json
		const sortedSubjects = [...mappedSubjects].sort();
		const subjectsKey = sortedSubjects.join(',');

		let combinedContent = '';

		// Check if the exact combination exists in combined_subjects
		if (config.combined_subjects[subjectsKey]) {
			const filePath = config.combined_subjects[subjectsKey];
			const content = await loadMarkdownFile(filePath);
			return content;
		}
		// If not, use individual subject analysis
		else {
			// Get display names for the header
			const subjectDisplayNames = mappedSubjects.map(
				(subject) => config.subject_display_names[subject] || subject
			);

			// Add a header for multiple subjects
			if (mappedSubjects.length > 1) {
				combinedContent += `# Career Guidance for ${subjectDisplayNames.join(
					', '
				)}\n\n`;
				combinedContent += `*This guidance is based on your selection of multiple subjects: ${subjectDisplayNames.join(
					', '
				)}*\n\n`;
				combinedContent += `Since this specific combination doesn't have a dedicated analysis, we're providing individual analysis for each subject.\n\n`;
			}

			// Get content for each selected subject
			for (const subject of mappedSubjects) {
				if (config.single_subjects[subject]) {
					const filePath = config.single_subjects[subject];
					const content = await loadMarkdownFile(filePath);

					// Add a separator between subjects if there are multiple
					if (mappedSubjects.length > 1) {
						combinedContent += `\n\n---\n\n## ${config.subject_display_names[subject]}\n\n`;
					}

					combinedContent += content;
				}
			}

			return (
				combinedContent ||
				'No guidance content available for the selected subjects.'
			);
		}
	} catch (error) {
		console.error('Error fetching career guidance:', error);
		return 'An error occurred while fetching career guidance. Please try again later.';
	}
}
