/**
 * Utility function to load markdown content from imports
 * Used to handle both local development and production on Vercel
 */
export function loadMarkdownContent(content: unknown): string {
	// Handle cases where the content might be imported with different formats
	if (typeof content === 'string') {
		return content;
	}

	// Handle default export objects
	if (content && typeof content === 'object' && 'default' in content) {
		// Type assertion to ensure 'default' is a string
		const contentWithDefault = content as { default: unknown };
		if (typeof contentWithDefault.default === 'string') {
			return contentWithDefault.default;
		}
	}

	console.error('Unable to parse markdown content:', content);
	return 'Error loading content. Please try again later.';
}
