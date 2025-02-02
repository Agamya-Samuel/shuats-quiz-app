'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

// Sample data - replace with actual data from your quiz system
const quizData = {
	physics: { attempted: 10, correct: 7, time_spent: 300 },
	chemistry: { attempted: 12, correct: 9, time_spent: 360 },
	math: { attempted: 15, correct: 12, time_spent: 450 },
	biology: { attempted: 8, correct: 6, time_spent: 240 },
	socialScience: { attempted: 10, correct: 8, time_spent: 300 },
	englishLanguage: { attempted: 20, correct: 18, time_spent: 600 },
	generalKnowledge: { attempted: 15, correct: 11, time_spent: 450 },
	computerScience: { attempted: 10, correct: 9, time_spent: 300 },
};

const COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#8884D8',
	'#82CA9D',
	'#FFC658',
	'#8DD1E1',
];

export function QuizResults() {
	const [activeTab, setActiveTab] = useState('summary');

	const totalQuestions = Object.values(quizData).reduce(
		(sum, subject) => sum + subject.attempted,
		0
	);
	const totalCorrect = Object.values(quizData).reduce(
		(sum, subject) => sum + subject.correct,
		0
	);
	const totalTime = Object.values(quizData).reduce(
		(sum, subject) => sum + subject.time_spent,
		0
	);

	const subjectData = Object.entries(quizData).map(([subject, data]) => ({
		subject,
		attempted: data.attempted,
		correct: data.correct,
		accuracy: (data.correct / data.attempted) * 100,
		averageTime: data.time_spent / data.attempted,
	}));

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Quiz Results</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="summary">Summary</TabsTrigger>
					<TabsTrigger value="performance">Performance</TabsTrigger>
					<TabsTrigger value="visualizations">
						Visualizations
					</TabsTrigger>
					<TabsTrigger value="analysis">Analysis</TabsTrigger>
				</TabsList>

				<TabsContent value="summary">
					<Card>
						<CardHeader>
							<CardTitle>Summary Statistics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center">
									<h3 className="text-lg font-semibold">
										Total Questions
									</h3>
									<p className="text-3xl font-bold">
										{totalQuestions}
									</p>
								</div>
								<div className="text-center">
									<h3 className="text-lg font-semibold">
										Total Correct
									</h3>
									<p className="text-3xl font-bold">
										{totalCorrect}
									</p>
								</div>
								<div className="text-center">
									<h3 className="text-lg font-semibold">
										Total Time
									</h3>
									<p className="text-3xl font-bold">
										{formatTime(totalTime)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="performance">
					<Card>
						<CardHeader>
							<CardTitle>Performance by Subject</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr>
											<th className="text-left p-2">
												Subject
											</th>
											<th className="text-left p-2">
												Attempted
											</th>
											<th className="text-left p-2">
												Correct
											</th>
											<th className="text-left p-2">
												Accuracy
											</th>
											<th className="text-left p-2">
												Avg. Time
											</th>
										</tr>
									</thead>
									<tbody>
										{subjectData.map((subject) => (
											<tr key={subject.subject}>
												<td className="p-2">
													{subject.subject}
												</td>
												<td className="p-2">
													{subject.attempted}
												</td>
												<td className="p-2">
													{subject.correct}
												</td>
												<td className="p-2">
													{subject.accuracy.toFixed(
														2
													)}
													%
												</td>
												<td className="p-2">
													{formatTime(
														subject.averageTime
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="visualizations">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>
									Questions Attempted by Subject
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={subjectData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="subject" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey="attempted"
											fill="#8884d8"
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Accuracy by Subject</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={subjectData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="subject" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey="accuracy"
											fill="#82ca9d"
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Time Distribution</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={subjectData}
											dataKey="averageTime"
											nameKey="subject"
											cx="50%"
											cy="50%"
											outerRadius={80}
											fill="#8884d8"
											label
										>
											{subjectData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS[
															index %
																COLORS.length
														]
													}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="analysis">
					<Card>
						<CardHeader>
							<CardTitle>
								Strengths and Areas for Improvement
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold">
										Strengths:
									</h3>
									<ul className="list-disc list-inside">
										{subjectData
											.filter(
												(subject) =>
													subject.accuracy > 80
											)
											.map((subject) => (
												<li key={subject.subject}>
													{subject.subject} (
													{subject.accuracy.toFixed(
														2
													)}
													% accuracy)
												</li>
											))}
									</ul>
								</div>
								<div>
									<h3 className="font-semibold">
										Areas for Improvement:
									</h3>
									<ul className="list-disc list-inside">
										{subjectData
											.filter(
												(subject) =>
													subject.accuracy < 60
											)
											.map((subject) => (
												<li key={subject.subject}>
													{subject.subject} (
													{subject.accuracy.toFixed(
														2
													)}
													% accuracy)
												</li>
											))}
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
