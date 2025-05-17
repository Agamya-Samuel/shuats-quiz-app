'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { updateQuestion } from '@/actions/quiz';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { subjects } from '@/lib/constants';

const formSchema = z.object({
	question: z.string().min(1, 'Question is required'),
	subject: z.string().min(1, 'Subject is required'),
	optionA: z.string().min(1, 'Option A is required'),
	optionB: z.string().min(1, 'Option B is required'),
	optionC: z.string().min(1, 'Option C is required'),
	optionD: z.string().min(1, 'Option D is required'),
	correctAnswer: z.enum(['A', 'B', 'C', 'D'], {
		required_error: 'Please select the correct answer',
	}),
});

interface EditQuestionFormProps {
	questionId: string;
	defaultValues: z.infer<typeof formSchema>;
	onSuccess?: () => void;
}

export function EditQuestionForm({
	questionId,
	defaultValues,
	onSuccess,
}: EditQuestionFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const options = [
			{ id: '1', value: values.optionA },
			{ id: '2', value: values.optionB },
			{ id: '3', value: values.optionC },
			{ id: '4', value: values.optionD },
		];

		const correctOptionId = {
			A: '1',
			B: '2',
			C: '3',
			D: '4',
		}[values.correctAnswer];

		const response = await updateQuestion({
			questionId: Number(questionId),
			newText: values.question,
			newOptions: options,
			newCorrectOptionId: correctOptionId,
			newSubject: values.subject,
		});

		if (response.success) {
			toast({
				title: 'Success',
				description: response.message,
				variant: 'success',
			});
			onSuccess?.();
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to update question',
				variant: 'destructive',
			});
		}
	};

	return (
		<Card>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8"
						method="post"
					>
						<FormField
							control={form.control}
							name="question"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your question"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subject</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a subject" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{subjects.map((subject) => (
													<SelectItem
														key={subject.key}
														value={subject.key}
													>
														{subject.value}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="optionA"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Option A</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter option A"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="optionB"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Option B</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter option B"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="optionC"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Option C</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter option C"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="optionD"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Option D</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter option D"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="correctAnswer"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormLabel>Correct Answer</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex space-x-4"
										>
											<FormItem className="flex items-center space-x-2">
												<FormControl>
													<RadioGroupItem value="A" />
												</FormControl>
												<FormLabel className="font-normal">
													A
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-2">
												<FormControl>
													<RadioGroupItem value="B" />
												</FormControl>
												<FormLabel className="font-normal">
													B
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-2">
												<FormControl>
													<RadioGroupItem value="C" />
												</FormControl>
												<FormLabel className="font-normal">
													C
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-2">
												<FormControl>
													<RadioGroupItem value="D" />
												</FormControl>
												<FormLabel className="font-normal">
													D
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex space-x-4">
							<Button type="submit">Update Question</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
							>
								Reset Changes
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
