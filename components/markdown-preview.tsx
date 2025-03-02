'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
	content: string;
	className?: string;
}

// Function to preprocess math content
function preprocessMathContent(content: string): string {
	// Replace [math] with proper LaTeX delimiters
	content = content.replace(/\[(.*?)\]/g, '$$$$1$$');
	// Replace (math) with proper inline LaTeX delimiters
	content = content.replace(/\((.*?)\)/g, '$$$1$$');
	return content;
}

export function MarkdownPreview({
	content,
	className = '',
}: MarkdownPreviewProps) {
	const processedContent = preprocessMathContent(content);

	return (
		<ReactMarkdown
			className={className}
			remarkPlugins={[remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			components={{
				// Override the default paragraph renderer to preserve line breaks
				p: ({ children }) => <p className="mb-4">{children}</p>,
			}}
		>
			{processedContent}
		</ReactMarkdown>
	);
}
