'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
	Clock,
	Timer,
	Shuffle,
	Eye,
	AlertTriangle,
	Save,
	RotateCcw,
	Loader2,
} from 'lucide-react';
import {
	getQuizSettings,
	saveQuizSettings,
	resetQuizSettings,
} from '@/actions/quiz';

// Server response type
type ServerSettingsResponse = {
	success: boolean;
	message?: string;
	settings?: {
		timeLimit: {
			perQuiz: number | null;
			perQuestion: number | null;
			enablePerQuestionTimer: boolean | null;
			showCountdown: boolean | null;
		};
		availability: {
			live: boolean | null;
			scheduled: boolean | null;
			scheduledDate: string | null;
		};
		behavior: {
			randomizeQuestions: boolean | null;
			showResults: string | null;
			allowRetake: boolean | null;
			maxAttempts: number | null;
			showCorrectAnswers: boolean | null;
			preventTabSwitching: boolean | null;
		};
	};
};

// Type definitions for component state
type TimeLimitSettings = {
	perQuiz: number;
	perQuestion: number;
	enablePerQuestionTimer: boolean;
	showCountdown: boolean;
};

type AvailabilitySettings = {
	live: boolean;
	scheduled: boolean;
	scheduledDate: string | null;
};

type BehaviorSettings = {
	randomizeQuestions: boolean;
	showResults: string;
	allowRetake: boolean;
	maxAttempts: number;
	showCorrectAnswers: boolean;
	preventTabSwitching: boolean;
};

type QuizSettingsType = {
	timeLimit: TimeLimitSettings;
	availability: AvailabilitySettings;
	behavior: BehaviorSettings;
};

// Helper function to safely process server response
function processServerSettings(
	serverSettings: ServerSettingsResponse['settings']
): QuizSettingsType {
	if (!serverSettings) {
		// Return default settings if none provided
		return {
			timeLimit: {
				perQuiz: 30,
				perQuestion: 0,
				enablePerQuestionTimer: false,
				showCountdown: true,
			},
			availability: {
				live: true,
				scheduled: false,
				scheduledDate: null,
			},
			behavior: {
				randomizeQuestions: true,
				showResults: 'manual',
				allowRetake: false,
				maxAttempts: 1,
				showCorrectAnswers: false,
				preventTabSwitching: true,
			},
		};
	}

	return {
		timeLimit: {
			perQuiz: serverSettings.timeLimit.perQuiz ?? 30,
			perQuestion: serverSettings.timeLimit.perQuestion ?? 0,
			enablePerQuestionTimer:
				serverSettings.timeLimit.enablePerQuestionTimer ?? false,
			showCountdown: serverSettings.timeLimit.showCountdown ?? true,
		},
		availability: {
			live: serverSettings.availability.live ?? true,
			scheduled: serverSettings.availability.scheduled ?? false,
			scheduledDate: serverSettings.availability.scheduledDate,
		},
		behavior: {
			randomizeQuestions:
				serverSettings.behavior.randomizeQuestions ?? true,
			showResults: serverSettings.behavior.showResults ?? 'manual',
			allowRetake: serverSettings.behavior.allowRetake ?? false,
			maxAttempts: serverSettings.behavior.maxAttempts ?? 1,
			showCorrectAnswers:
				serverSettings.behavior.showCorrectAnswers ?? false,
			preventTabSwitching:
				serverSettings.behavior.preventTabSwitching ?? true,
		},
	};
}

type QuizSettingsProps = {
	showResetOnly?: boolean;
};

export function QuizSettings({ showResetOnly = false }: QuizSettingsProps) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const [settings, setSettings] = useState<QuizSettingsType>({
		timeLimit: {
			perQuiz: 30,
			perQuestion: 0,
			enablePerQuestionTimer: false,
			showCountdown: true,
		},
		availability: {
			live: true,
			scheduled: false,
			scheduledDate: null,
		},
		behavior: {
			randomizeQuestions: true,
			showResults: 'manual', // "immediately", "after_completion", "scheduled_date", "manual"
			allowRetake: false,
			maxAttempts: 1,
			showCorrectAnswers: false,
			preventTabSwitching: true,
		},
	});

	// Load settings on component mount
	useEffect(() => {
		const loadSettings = async () => {
			try {
				setIsLoading(true);
				const response =
					(await getQuizSettings()) as ServerSettingsResponse;

				if (response.success && response.settings) {
					// Process the server response to ensure type safety
					setSettings(processServerSettings(response.settings));
				} else {
					toast({
						title: 'Warning',
						description:
							response.message ??
							'Could not load settings, using defaults.',
						variant: 'warning',
					});
				}
			} catch (error) {
				console.error('Failed to load settings:', error);
				toast({
					title: 'Error',
					description: 'Failed to load quiz settings.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadSettings();
	}, [toast]);

	const handleTimeLimitChange = (
		field: keyof TimeLimitSettings,
		value: number | boolean
	) => {
		setSettings({
			...settings,
			timeLimit: {
				...settings.timeLimit,
				[field]: value,
			},
		});
	};

	const handleAvailabilityChange = (
		field: keyof AvailabilitySettings,
		value: boolean | string | null
	) => {
		setSettings({
			...settings,
			availability: {
				...settings.availability,
				[field]: value,
			},
		});
	};

	const handleBehaviorChange = (
		field: keyof BehaviorSettings,
		value: boolean | string | number
	) => {
		setSettings({
			...settings,
			behavior: {
				...settings.behavior,
				[field]: value,
			},
		});
	};

	const saveSettingsHandler = async () => {
		try {
			setIsSaving(true);
			const response = (await saveQuizSettings(
				settings
			)) as ServerSettingsResponse;

			if (response.success) {
				toast({
					title: 'Settings Saved',
					description:
						'Quiz settings have been updated successfully.',
					variant: 'success',
				});
			} else {
				toast({
					title: 'Error',
					description: response.message ?? 'Failed to save settings.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to save settings:', error);
			toast({
				title: 'Error',
				description:
					'An unexpected error occurred while saving settings.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const resetSettingsHandler = async () => {
		try {
			setIsResetting(true);
			const response =
				(await resetQuizSettings()) as ServerSettingsResponse;

			if (response.success) {
				// Refresh the settings
				const updatedResponse =
					(await getQuizSettings()) as ServerSettingsResponse;
				if (updatedResponse.success && updatedResponse.settings) {
					setSettings(
						processServerSettings(updatedResponse.settings)
					);
				}

				toast({
					title: 'Settings Reset',
					description: 'Quiz settings have been reset to defaults.',
					variant: 'success',
				});
			} else {
				toast({
					title: 'Error',
					description:
						response.message ?? 'Failed to reset settings.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to reset settings:', error);
			toast({
				title: 'Error',
				description:
					'An unexpected error occurred while resetting settings.',
				variant: 'destructive',
			});
		} finally {
			setIsResetting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-48">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<span className="ml-2">Loading settings...</span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{showResetOnly ? (
				// Reset-only view
				<div className="space-y-6">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-medium">
									Reset All Settings
								</h3>
								<p className="text-sm text-muted-foreground">
									Reset all quiz settings to their default
									values
								</p>
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={isResetting}
										className="flex items-center gap-2"
									>
										<RotateCcw className="h-4 w-4" />
										Reset All Settings
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Reset Quiz Settings
										</AlertDialogTitle>
										<AlertDialogDescription>
											This will reset all quiz settings to
											their default values. This may
											affect ongoing quizzes and user
											experiences. This action cannot be
											undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={resetSettingsHandler}
											disabled={isResetting}
										>
											{isResetting ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													<span>Resetting...</span>
												</>
											) : (
												<>
													<RotateCcw className="mr-2 h-4 w-4" />
													<span>Confirm Reset</span>
												</>
											)}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
						<div className="rounded-md border p-4 bg-amber-50 dark:bg-amber-950">
							<div className="flex gap-3">
								<AlertTriangle className="h-5 w-5 text-amber-600" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-amber-600">
										Warning: This action cannot be undone
									</p>
									<p className="text-xs text-amber-600">
										Resetting will restore all quiz settings
										to their default values. This may affect
										ongoing quizzes and user experiences.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<>
					<Card>
						<CardHeader>
							<CardTitle>Quiz Time Limits</CardTitle>
							<CardDescription>
								Configure time limits for quizzes and individual
								questions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="per-quiz-time">
												Quiz Time Limit (minutes)
											</Label>
											<p className="text-sm text-muted-foreground">
												Set the total time allowed for
												the entire quiz
											</p>
										</div>
										<div className="flex items-center">
											<Clock className="h-4 w-4 mr-2 text-muted-foreground" />
											<Input
												id="per-quiz-time"
												type="number"
												value={
													settings.timeLimit.perQuiz
												}
												onChange={(e) =>
													handleTimeLimitChange(
														'perQuiz',
														Number.parseInt(
															e.target.value
														) || 0
													)
												}
												className="w-20"
											/>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="per-question-time">
												Time Per Question (seconds)
											</Label>
											<p className="text-sm text-muted-foreground">
												Set time limit for each
												individual question
											</p>
										</div>
										<div className="flex items-center">
											<Timer className="h-4 w-4 mr-2 text-muted-foreground" />
											<Input
												id="per-question-time"
												type="number"
												value={
													settings.timeLimit
														.perQuestion
												}
												onChange={(e) =>
													handleTimeLimitChange(
														'perQuestion',
														Number.parseInt(
															e.target.value
														) || 0
													)
												}
												className="w-20"
												disabled={
													!settings.timeLimit
														.enablePerQuestionTimer
												}
											/>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Switch
											id="enable-per-question"
											checked={
												settings.timeLimit
													.enablePerQuestionTimer
											}
											onCheckedChange={(checked) =>
												handleTimeLimitChange(
													'enablePerQuestionTimer',
													checked
												)
											}
										/>
										<Label htmlFor="enable-per-question">
											Enable per-question timer
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Switch
											id="show-countdown"
											checked={
												settings.timeLimit.showCountdown
											}
											onCheckedChange={(checked) =>
												handleTimeLimitChange(
													'showCountdown',
													checked
												)
											}
										/>
										<Label htmlFor="show-countdown">
											Show countdown timer to users
										</Label>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Quiz Availability</CardTitle>
							<CardDescription>
								Control who can access and take the quizzes
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<Switch
									id="quiz-live-status"
									checked={settings.availability.live}
									onCheckedChange={(checked) =>
										handleAvailabilityChange(
											'live',
											checked
										)
									}
								/>
								<div className="space-y-0.5">
									<Label htmlFor="quiz-live-status">
										Quiz is currently live
									</Label>
									<p className="text-sm text-muted-foreground">
										When enabled, users can access and
										attend this quiz
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Quiz Behavior</CardTitle>
							<CardDescription>
								Configure how quizzes behave and what users can
								see
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Switch
											id="randomize-questions"
											checked={
												settings.behavior
													.randomizeQuestions
											}
											onCheckedChange={(checked) =>
												handleBehaviorChange(
													'randomizeQuestions',
													checked
												)
											}
										/>
										<div className="space-y-0.5">
											<Label
												htmlFor="randomize-questions"
												className="flex items-center"
											>
												<Shuffle className="h-4 w-4 mr-2" />
												Randomize questions
											</Label>
											<p className="text-sm text-muted-foreground">
												Questions will appear in random
												order for each user
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="flex items-center">
											<Eye className="h-4 w-4 mr-2" />
											Show quiz results
										</Label>
										<RadioGroup
											value={
												settings.behavior.showResults
											}
											onValueChange={(value) =>
												handleBehaviorChange(
													'showResults',
													value
												)
											}
											className="pl-6"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="immediately"
													id="show-immediately"
												/>
												<Label htmlFor="show-immediately">
													Immediately after each
													question
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="after_completion"
													id="show-after"
												/>
												<Label htmlFor="show-after">
													After quiz completion
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="scheduled_date"
													id="show-scheduled"
												/>
												<Label htmlFor="show-scheduled">
													On a scheduled date
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="manual"
													id="show-manual"
												/>
												<Label htmlFor="show-manual">
													Manual result declaration
												</Label>
											</div>
										</RadioGroup>
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label
												htmlFor="max-attempts"
												className="flex items-center"
											>
												<AlertTriangle className="h-4 w-4 mr-2" />
												Maximum attempts allowed
											</Label>
											<p className="text-sm text-muted-foreground">
												How many times users can retake
												the quiz
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Switch
												id="allow-retake"
												checked={
													settings.behavior
														.allowRetake
												}
												onCheckedChange={(checked) =>
													handleBehaviorChange(
														'allowRetake',
														checked
													)
												}
											/>
											<Input
												id="max-attempts"
												type="number"
												value={
													settings.behavior
														.maxAttempts
												}
												onChange={(e) =>
													handleBehaviorChange(
														'maxAttempts',
														Number.parseInt(
															e.target.value
														) || 1
													)
												}
												className="w-16"
												disabled={
													!settings.behavior
														.allowRetake
												}
											/>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Switch
											id="show-correct-answers"
											checked={
												settings.behavior
													.showCorrectAnswers
											}
											onCheckedChange={(checked) =>
												handleBehaviorChange(
													'showCorrectAnswers',
													checked
												)
											}
										/>
										<Label htmlFor="show-correct-answers">
											Show correct answers after
											completion
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Switch
											id="prevent-tab-switching"
											checked={
												settings.behavior
													.preventTabSwitching
											}
											onCheckedChange={(checked) =>
												handleBehaviorChange(
													'preventTabSwitching',
													checked
												)
											}
										/>
										<div className="space-y-0.5">
											<Label htmlFor="prevent-tab-switching">
												Prevent tab switching
											</Label>
											<p className="text-sm text-muted-foreground">
												Discourage cheating by detecting
												when users leave the quiz
											</p>
										</div>
									</div>
								</div>
							</div>

							<Separator className="my-4" />

							<div className="flex justify-end space-x-2">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											disabled={isSaving || isResetting}
											className="flex items-center gap-2"
										>
											<RotateCcw className="h-4 w-4" />
											Reset to Defaults
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Reset Quiz Settings
											</AlertDialogTitle>
											<AlertDialogDescription>
												This will reset all quiz
												settings to their default
												values. This may affect ongoing
												quizzes and user experiences.
												This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={resetSettingsHandler}
												disabled={isResetting}
											>
												{isResetting ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														<span>
															Resetting...
														</span>
													</>
												) : (
													<>
														<RotateCcw className="mr-2 h-4 w-4" />
														<span>
															Reset Settings
														</span>
													</>
												)}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<Button
									onClick={saveSettingsHandler}
									disabled={isSaving || isResetting}
									className="flex items-center gap-2"
								>
									{isSaving ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									{isSaving ? 'Saving...' : 'Save Settings'}
								</Button>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
