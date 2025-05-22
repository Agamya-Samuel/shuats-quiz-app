'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subjects } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import {
	BookOpen,
	ChevronRight,
	Info,
	AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { getPublicQuizSettings } from '@/actions/quiz';
import { useRouter } from 'next/navigation';
import GlobalLoading from '@/components/global-loading';

interface SubjectSelectorProps {
	onSubjectSelect: (subjects: string[]) => void;
}

export default function SubjectSelector({
	onSubjectSelect,
}: SubjectSelectorProps) {
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [isQuizLive, setIsQuizLive] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	// Load quiz settings to check if quiz is live
	useEffect(() => {
		const checkQuizAvailability = async () => {
			try {
				setIsLoading(true);
				const response = await getPublicQuizSettings();

				if (response.success && response.settings) {
					// Ensure we handle nullable isLive value
					setIsQuizLive(
						typeof response.settings.isLive === 'boolean'
							? response.settings.isLive
							: false
					);
				} else {
					// Default to not live if we can't determine status
					setIsQuizLive(false);
				}
			} catch (error) {
				console.error('Error checking quiz availability:', error);
				setIsQuizLive(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkQuizAvailability();
	}, []);

	const handleSubjectToggle = (value: string) => {
		setSelectedSubjects((prev) => {
			if (prev.includes(value)) {
				return prev.filter((s) => s !== value);
			}
			return [...prev, value];
		});
	};

	const handleStartQuiz = () => {
		if (selectedSubjects.length > 0) {
			onSubjectSelect(selectedSubjects);
		}
	};

	// Loading state
	if (isLoading) {
		return <GlobalLoading />;
	}

	// Quiz not live state
	if (isQuizLive === false) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center p-4">
				<Card className="w-full max-w-md shadow-lg">
					<CardContent className="p-6">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-4">
								Quiz Not Available
							</h3>
							<p className="text-muted-foreground mb-6">
								The quiz is currently not available. Please
								check back later when it has been activated by
								the administrator.
							</p>
							<Button
								onClick={() => router.push('/user')}
								variant="outline"
							>
								Return to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] flex items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="bg-primary/5 border-b">
					<CardTitle className="text-center flex items-center justify-center gap-2">
						<BookOpen className="h-5 w-5" />
						<span>SHUATS Quiz - Subject Selection</span>
					</CardTitle>
					<CardDescription className="text-center">
						Choose your preferred subjects to begin the quiz
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<Alert className="mb-6 bg-blue-50 border-blue-200">
						<Info className="h-4 w-4 text-blue-500" />
						<AlertDescription className="text-sm text-blue-700">
							Only questions from your selected subjects will be
							shown in the quiz. Questions will be ordered based
							on the subjects you select.
						</AlertDescription>
					</Alert>

					{/* <Alert className="mb-6 bg-amber-50 border-amber-200">
						<ShieldAlert className="h-4 w-4 text-amber-500" />
						<AlertDescription className="text-sm text-amber-700">
							<strong>Anti-Cheating Measures:</strong> Copy and
							paste functionality and text selection will be
							disabled during the quiz to maintain academic
							integrity.
						</AlertDescription>
					</Alert> */}

					{/* <Alert className="mb-6 bg-amber-50 border-amber-200">
						<Code className="h-4 w-4 text-amber-500" />
						<AlertDescription className="text-sm text-amber-700">
							<strong>Developer Tools Restriction:</strong> Browser developer tools, 
							inspect element, and right-click menu will be disabled during the quiz 
							to prevent unauthorized access to quiz content.
						</AlertDescription>
					</Alert> */}

					{/* <Alert className="mb-6 bg-amber-50 border-amber-200">
						<Maximize className="h-4 w-4 text-amber-500" />
						<AlertDescription className="text-sm text-amber-700">
							<strong>Full-Screen Mode:</strong> The quiz will run
							in full-screen mode. You must remain in full-screen
							until the quiz is completed.
						</AlertDescription>
					</Alert> */}

					{/* <Alert className="mb-6 bg-blue-50 border-blue-200">
						<Info className="h-4 w-4 text-blue-500" />
						<AlertDescription className="text-sm text-blue-700">
							<strong>Browser Note:</strong> Some browsers may
							require you to click the "Start Quiz" button
							directly to enable full-screen mode. If full-screen
							is denied, you can still take the quiz, but you'll
							receive warnings about staying in the quiz window.
						</AlertDescription>
					</Alert> */}

					<div className="space-y-3">
						{subjects.map((subject) => (
							<div
								key={subject.key}
								className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
							>
								<Checkbox
									id={subject.key}
									checked={selectedSubjects.includes(
										subject.key
									)}
									onCheckedChange={() =>
										handleSubjectToggle(subject.key)
									}
								/>
								<Label
									htmlFor={subject.key}
									className="flex-1 cursor-pointer font-medium"
								>
									{subject.value}
								</Label>
							</div>
						))}
					</div>

					<div className="mt-8 flex justify-end">
						<Button
							onClick={handleStartQuiz}
							disabled={selectedSubjects.length === 0}
							className="w-full sm:w-auto"
						>
							Start Quiz
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					<p className="mt-6 text-xs text-center text-muted-foreground">
						You can only attempt this quiz once. Your results will
						be available immediately after submission.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
