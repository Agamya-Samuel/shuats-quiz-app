'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subjects } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BookOpen, ChevronRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubjectSelectorProps {
	onSubjectSelect: (subject: string) => void;
}

export default function SubjectSelector({
	onSubjectSelect,
}: SubjectSelectorProps) {
	const [selectedSubject, setSelectedSubject] = useState<string>('');

	const handleSubjectChange = (value: string) => {
		setSelectedSubject(value);
	};

	const handleStartQuiz = () => {
		if (selectedSubject) {
			onSubjectSelect(selectedSubject);
		}
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="bg-primary/5 border-b">
					<CardTitle className="text-center flex items-center justify-center gap-2">
						<BookOpen className="h-5 w-5" />
						<span>SHUATS Quiz - Subject Selection</span>
					</CardTitle>
					<CardDescription className="text-center">
						Choose your preferred subject to begin the quiz
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<Alert className="mb-6 bg-blue-50 border-blue-200">
						<Info className="h-4 w-4 text-blue-500" />
						<AlertDescription className="text-sm text-blue-700">
							Questions from your selected subject will appear
							first, followed by questions from other subjects.
						</AlertDescription>
					</Alert>

					<RadioGroup
						value={selectedSubject}
						onValueChange={handleSubjectChange}
						className="space-y-3"
					>
						{subjects.map((subject) => (
							<div
								key={subject.key}
								className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
							>
								<RadioGroupItem
									value={subject.key}
									id={subject.key}
								/>
								<Label
									htmlFor={subject.key}
									className="flex-1 cursor-pointer font-medium"
								>
									{subject.value}
								</Label>
							</div>
						))}
					</RadioGroup>

					<div className="mt-8 flex justify-end">
						<Button
							onClick={handleStartQuiz}
							disabled={!selectedSubject}
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
