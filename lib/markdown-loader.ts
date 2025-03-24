/**
 * Utility function to load markdown content from imports
 * Used to handle both local development and production on Vercel
 */
export function loadMarkdownContent(content: any): string {
	// Handle cases where the content might be imported with different formats
	if (typeof content === 'string') {
		return content;
	}

	// Handle default export objects
	if (content && typeof content === 'object' && 'default' in content) {
		return content.default;
	}

	console.error('Unable to parse markdown content:', content);
	return 'Error loading content. Please try again later.';
}
