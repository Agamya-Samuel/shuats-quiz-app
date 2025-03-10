// app/admin/quiz/_components/question-form.tsx

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addQuestion } from '@/actions/question';
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

export function QuestionForm({
	defaultValues,
	onSubmit: onSubmitProp,
}: {
	defaultValues?: z.infer<typeof formSchema>;
	onSubmit?: (values: z.infer<typeof formSchema>) => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			question: '',
			subject: '',
			optionA: '',
			optionB: '',
			optionC: '',
			optionD: '',
			correctAnswer: undefined,
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const options = [
			{ id: 1, text: values.optionA },
			{ id: 2, text: values.optionB },
			{ id: 3, text: values.optionC },
			{ id: 4, text: values.optionD },
		];

		const correctOptionId = {
			A: 1,
			B: 2,
			C: 3,
			D: 4,
		}[values.correctAnswer];

		const response = await addQuestion({
			text: values.question,
			options,
			correctOptionId,
			subject: values.subject,
		});

		if (response.success) {
			toast({
				title: 'Success',
				description: response.success,
				variant: 'success',
			});
			form.reset();
		} else {
			toast({
				title: 'Error',
				description: response.error,
				variant: 'destructive',
			});
		}

		// Call the onSubmitProp if it exists
		if (onSubmitProp) {
			onSubmitProp(values);
		}

		// reload page
		window.location.reload();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold mb-4">
					Add New Question
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8"
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
								// dropdown
								<FormItem>
									<FormLabel>Subject</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormItem>
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
											</FormItem>
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
							<Button type="submit">Submit Question</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
							>
								Clear Form
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
