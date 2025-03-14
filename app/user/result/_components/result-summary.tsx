import { Card, CardContent } from '@/components/ui/card';
import { subjects } from '@/lib/constants';
import { QuizResult } from '../page';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from 'recharts';

export interface ResultSummaryProps {
	summary: {
		totalQuestions: number;
		attemptedQuestions: number;
		correctAnswers: number;
		score: number;
		submittedAt: string;
		timeTaken: number | null;
		attemptedSubjects?: string[]; // Add attempted subjects
	};
	results?: QuizResult[]; // Add results prop to calculate subject stats
}

// Helper function to get subject name from key
const getSubjectName = (subjectKey: string): string => {
	const subject = subjects.find((s) => s.key === subjectKey);
	return subject ? subject.value : subjectKey;
};

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number | null): string => {
	if (seconds === null) return 'Not available';

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	if (minutes === 0) {
		return `${remainingSeconds} seconds`;
	}

	return `${minutes} min ${remainingSeconds} sec`;
};

// Colors for the pie chart
const COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#8884d8',
	'#82ca9d',
	'#ffc658',
	'#8dd1e1',
];

export default function ResultSummary({
	summary,
	results = [],
}: ResultSummaryProps) {
	const {
		totalQuestions,
		attemptedQuestions,
		correctAnswers,
		score,
		submittedAt,
		timeTaken,
		attemptedSubjects = [],
	} = summary;
	const attemptedPercentage = (attemptedQuestions / totalQuestions) * 100;
	const accuracy = (correctAnswers / attemptedQuestions) * 100;

	// Calculate subject statistics if results are provided
	const subjectStats =
		results.length > 0 ? calculateSubjectStats(results) : [];

	return (
		<Card className="mb-8">
			<CardContent className="p-6">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Quiz Results Summary
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Total Questions
						</h3>
						<p className="text-3xl font-bold">{totalQuestions}</p>
						{attemptedSubjects.length > 0 && (
							<p className="text-sm text-gray-600 mt-1">
								From {attemptedSubjects.length} subject
								{attemptedSubjects.length !== 1 ? 's' : ''}
							</p>
						)}
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Attempted
						</h3>
						<p className="text-3xl font-bold">
							{attemptedQuestions}
						</p>
						<p className="text-sm text-gray-600">
							({attemptedPercentage.toFixed(1)}%)
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Correct Answers
						</h3>
						<p className="text-3xl font-bold">{correctAnswers}</p>
						<p className="text-sm text-gray-600">
							{attemptedQuestions > 0
								? `(${accuracy.toFixed(1)}% accuracy)`
								: '(0% accuracy)'}
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Final Score
						</h3>
						<p className="text-3xl font-bold">{score}%</p>
						<p className="text-sm text-gray-600">
							Based on attempted subjects only
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Submission Time
						</h3>
						<p className="text-lg font-medium">
							{new Date(submittedAt).toLocaleString()}
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Time Taken
						</h3>
						<p className="text-lg font-medium">
							{formatTime(timeTaken)}
						</p>
					</div>
				</div>

				{/* Attempted Subjects */}
				{attemptedSubjects.length > 0 && (
					<div className="mt-8">
						<h3 className="text-lg font-semibold mb-4 text-center">
							Attempted Subjects
						</h3>
						<div className="flex flex-wrap justify-center gap-2">
							{attemptedSubjects.map((subject, index) => (
								<div
									key={subject}
									className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
								>
									{getSubjectName(subject)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Subject Performance Chart */}
				{subjectStats.length > 0 && (
					<div className="mt-8">
						<h3 className="text-lg font-semibold mb-4 text-center">
							Performance by Subject
						</h3>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={subjectStats}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={80}
										fill="#8884d8"
										dataKey="count"
										nameKey="name"
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(
												0
											)}%`
										}
									>
										{subjectStats.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													COLORS[
														index % COLORS.length
													]
												}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value, name) => [
											`${value} questions`,
											name,
										]}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Function to calculate subject statistics
function calculateSubjectStats(results: QuizResult[]) {
	// Count questions by subject
	const subjectCounts: Record<string, number> = {};

	results.forEach((result) => {
		if (result.subject) {
			const subjectName = getSubjectName(result.subject);
			subjectCounts[subjectName] = (subjectCounts[subjectName] || 0) + 1;
		} else {
			subjectCounts['Unknown'] = (subjectCounts['Unknown'] || 0) + 1;
		}
	});

	// Convert to array format for the chart
	return Object.entries(subjectCounts).map(([name, count]) => ({
		name,
		count,
	}));
}
