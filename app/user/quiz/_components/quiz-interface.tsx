// app/user/quiz/_components/quiz-interface.tsx
'use client';

import { Facebook, Instagram, Linkedin, Smile, Twitter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { getAllQuestions, getPublicQuizSettings } from '@/actions/quiz';
import { getQuizResults } from '@/actions/quiz';
import {
  recordQuizStartTime,
  submitAnswer,
  submitQuiz,
} from '@/actions/submit-answers';
import {
  batchUpdateQuestionTimes,
  updateQuestionTime,
} from '@/actions/update-question-time';
import GlobalLoading from '@/components/global-loading';
import ImageCarousel from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCookies as useAuthCookies } from '@/contexts/cookie-context';
import { safeExitFullscreen, useAntiCheat } from '@/hooks/use-anti-cheat';
import { useCookies } from '@/hooks/use-cookies';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { useQuestionTimeTracker } from '../_hooks/useQuestionTimeTracker';
import CountdownTimer from './countdown-timer';
import Legend from './legend';
import PreQuizPrompt from './pre-quiz-prompt';
import QuizQuestionView from './quiz-question-view';

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// app/user/quiz/_components/quiz-interface.tsx

// Types
export interface Option {
  id: string; // Using string to match database schema
  text: string;
}

export interface Question {
  id: number; // Use ID from database schema
  _id?: string; // Keep for backward compatibility with components
  text: string;
  question?: string; // Add this for compatibility with API responses
  options: Option[];
  subject: string;
  status:
    | 'not-visited'
    | 'not-answered'
    | 'answered'
    | 'marked-review'
    | 'answered-marked';
  userAnswer?: string;
}

// Interface for stored answers - keep string keys for compatibility with child components
export interface StoredAnswer {
  questionId: string;
  selectedOptionId: string;
  answerText: string; // Keep text for UI display
}

// Define mapping from option IDs to display letters
export const OptionsMapping: Record<string, string> = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
};

// Error Component
const ErrorState = ({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) => (
  <div className="w-full h-full flex items-center justify-center">
    <Card className="max-w-lg w-full">
      <CardContent className="p-6">
        <div className="text-center text-red-500">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={retry}>
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Format time function
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

export default function QuizInterface() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({}); // Keep string keys for compatibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAlreadyAttempted, setHasAlreadyAttempted] = useState(false);
  const [isCheckingAttemptStatus, setIsCheckingAttemptStatus] = useState(true);
  const { user: currentUser } = useAuthCookies();
  const { setCookie } = useCookies();
  const router = useRouter();
  const [allQuestionsAttempted, setAllQuestionsAttempted] = useState(false);
  const [showPreQuizPrompt, setShowPreQuizPrompt] = useState(true);

  // Quiz settings state
  const [quizSettings, setQuizSettings] = useState<{
    isLive: boolean;
    perQuizTimeLimit: number;
  } | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Quiz start time state
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);

  // Anti-cheat state
  const [quizStarted, setQuizStarted] = useState(false);

  // Enable anti-cheat measures when quiz is active
  const antiCheat = useAntiCheat(quizStarted);

  // Question time tracking
  const timeTracker = useQuestionTimeTracker(
    currentUser?.userId ? Number(currentUser.userId) : null,
  );

  // Calculate remaining time based on start time and quiz duration
  const calculateRemainingTime = useCallback(
    (startTime: Date | null, quizDurationMinutes: number): number => {
      console.log('calculateRemainingTime called with:', {
        startTime,
        quizDurationMinutes,
        hasStartTime: !!startTime,
      });

      if (!startTime) {
        // No start time means quiz hasn't started yet, return full duration
        console.log(
          'No start time, returning full duration:',
          quizDurationMinutes * 60,
        );
        return quizDurationMinutes * 60;
      }

      try {
        const now = new Date();
        const elapsedSeconds = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000,
        );
        const totalQuizSeconds = quizDurationMinutes * 60;
        const remainingSeconds = Math.max(0, totalQuizSeconds - elapsedSeconds);

        console.log('Timer calculation details:', {
          now: now.toISOString(),
          startTime: startTime.toISOString(),
          elapsedSeconds,
          elapsedMinutes: Math.floor(elapsedSeconds / 60),
          totalQuizSeconds,
          remainingSeconds,
          remainingMinutes: Math.floor(remainingSeconds / 60),
        });

        return remainingSeconds;
      } catch (error) {
        console.error('Error calculating remaining time:', error);
        // Return full duration as fallback
        return quizDurationMinutes * 60;
      }
    },
    [],
  );

  // Load quiz settings
  useEffect(() => {
    const loadQuizSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const response = await getPublicQuizSettings();

        if (response.success && response.settings) {
          // Use nullish coalescing to ensure we have valid boolean value
          const { isLive, perQuizTimeLimit } = response.settings;

          setQuizSettings({
            isLive: typeof isLive === 'boolean' ? isLive : true,
            perQuizTimeLimit: perQuizTimeLimit || 60,
          });

          if (!isLive) {
            setIsLoadingSettings(false);
          }
        } else {
          setQuizSettings({ isLive: true, perQuizTimeLimit: 60 });
        }
      } catch (error) {
        console.error('Error loading quiz settings:', error);
        setQuizSettings({ isLive: true, perQuizTimeLimit: 60 });
      } finally {
        // Only set loading to false here if it hasn't been set already
        // This prevents overriding the early completion for not-live quizzes
        setIsLoadingSettings((current) => current);
      }
    };

    loadQuizSettings();
  }, []);

  // Track question viewing time - only when question index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        console.log('Starting time tracking for question:', currentQuestion.id);
        timeTracker.startQuestionTimer(currentQuestion.id);
      }
    }

    // Cleanup: stop tracking when question changes
    return () => {
      if (timeTracker.isTracking) {
        const elapsedTime = timeTracker.stopQuestionTimer();
        console.log('Stopped time tracking, elapsed:', elapsedTime);

        // Update server with total time for this question (async, don't wait)
        if (
          currentUser?.userId &&
          timeTracker.currentQuestionId &&
          elapsedTime > 0
        ) {
          // Get total time spent on this question (including previous sessions)
          const totalTimeForQuestion = timeTracker.getQuestionTime(
            timeTracker.currentQuestionId,
          );

          console.log('Updating server with question time:', {
            questionId: timeTracker.currentQuestionId,
            elapsedThisSession: elapsedTime,
            totalTimeForQuestion,
          });

          updateQuestionTime(
            Number(currentUser.userId),
            timeTracker.currentQuestionId,
            totalTimeForQuestion, // Send total time, not just elapsed
          ).catch((error) => {
            console.error('Failed to update question time:', error);
          });
        }
      }
    };
  }, [currentQuestionIndex]); // Only depend on question index change

  // Check if user has already attempted the quiz
  useEffect(() => {
    const checkAttemptStatus = async () => {
      // Skip everything if no user ID, still loading settings, or if we've already determined the quiz isn't live
      if (!currentUser?.userId || isLoadingSettings) return;
      if (quizSettings && !quizSettings.isLive) return; // Skip API call if quiz is not live

      setIsCheckingAttemptStatus(true);

      try {
        // Add a flag to localStorage to reduce redundant API calls
        const checkedRecently = localStorage.getItem('quiz_attempt_checked');
        const parsedCheck = checkedRecently
          ? JSON.parse(checkedRecently)
          : null;
        const now = new Date().getTime();

        // If we've checked in the last 5 minutes and user hasn't attempted, skip the API call
        if (
          parsedCheck &&
          parsedCheck.userId === currentUser.userId &&
          parsedCheck.hasAttempted === false &&
          now - parsedCheck.timestamp < 5 * 60 * 1000
        ) {
          setHasAlreadyAttempted(false);
          setIsCheckingAttemptStatus(false);
          return;
        }

        const response = await getQuizResults(Number(currentUser.userId));

        const hasAttempted =
          response.success && response.data && response.data.results.length > 0;

        if (hasAttempted) {
          setHasAlreadyAttempted(true);
        } else {
          // User hasn't attempted the quiz, show the prompt
          setHasAlreadyAttempted(false);
        }

        // Store the check in localStorage to avoid redundant API calls
        localStorage.setItem(
          'quiz_attempt_checked',
          JSON.stringify({
            userId: currentUser.userId,
            hasAttempted,
            timestamp: now,
          }),
        );
      } catch (err) {
        console.error('Error checking attempt status:', err);
        setError('Failed to check quiz attempt status. Please try again.');
      } finally {
        setIsCheckingAttemptStatus(false);
      }
    };

    if (!isLoadingSettings && quizSettings?.isLive) {
      checkAttemptStatus();
    } else {
      // If quiz is not live, we don't need to check attempt status
      setIsCheckingAttemptStatus(false);
    }
  }, [currentUser?.userId, isLoadingSettings, quizSettings]);

  // Initial timer calculation effect (separate from countdown effect)
  useEffect(() => {
    if (quizStartTime && quizSettings && !isLoading) {
      const remainingTime = calculateRemainingTime(
        quizStartTime,
        quizSettings.perQuizTimeLimit,
      );

      console.log('Timer calculated:', {
        quizStartTime,
        perQuizTimeLimit: quizSettings.perQuizTimeLimit,
        remainingTime,
        remainingMinutes: Math.floor(remainingTime / 60),
      });

      setTimeRemaining(remainingTime);

      // If time has already expired, mark as time up
      if (remainingTime <= 0) {
        setIsTimeUp(true);
      }
    }
  }, [quizStartTime, quizSettings, isLoading, calculateRemainingTime]);

  // Timer effect with proper dependencies and sync
  useEffect(() => {
    // Only start the timer if the quiz is loaded and not already attempted
    if (
      isLoading ||
      hasAlreadyAttempted ||
      isTimeUp ||
      !quizStartTime ||
      !quizSettings
    )
      return;

    console.log('Starting timer with:', {
      timeRemaining,
      quizStartTime,
      quizSettings,
    });

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Periodic sync every 30 seconds to prevent drift and handle clock changes
    const syncTimerId = setInterval(() => {
      if (quizStartTime && quizSettings) {
        const actualRemainingTime = calculateRemainingTime(
          quizStartTime,
          quizSettings.perQuizTimeLimit,
        );

        setTimeRemaining((currentRemaining) => {
          // Only sync if there's a significant difference (more than 2 seconds)
          const diff = Math.abs(actualRemainingTime - currentRemaining);
          if (diff > 2) {
            console.log('Timer sync: correcting drift', {
              current: currentRemaining,
              actual: actualRemainingTime,
              diff,
            });
            return actualRemainingTime;
          }
          return currentRemaining;
        });

        // Check if time has expired during sync
        if (actualRemainingTime <= 0) {
          setIsTimeUp(true);
        }
      }
    }, 30000); // Sync every 30 seconds

    return () => {
      clearInterval(timerId);
      clearInterval(syncTimerId);
    };
  }, [
    isLoading,
    hasAlreadyAttempted,
    isTimeUp,
    quizStartTime,
    quizSettings,
    calculateRemainingTime,
  ]); // Remove timeRemaining to prevent infinite loop

  // Handle time up
  useEffect(() => {
    if (isTimeUp && !isSubmitting && !showTimeUpDialog) {
      handleTimeUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp, isSubmitting, showTimeUpDialog]);

  // Handle time up function
  const handleTimeUp = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setShowTimeUpDialog(true);

      // Format answers for submission using stored optionIds
      const formattedAnswers = Object.values(answers)
        .map(({ questionId, selectedOptionId }) => ({
          questionId: Number(questionId), // Convert to number for API
          selectedOption: selectedOptionId,
        }))
        .filter((a) => a.selectedOption);

      if (!currentUser?.userId) {
        throw new Error('You must be logged in to submit the quiz');
      }

      const result = await submitQuiz(
        Number(currentUser.userId),
        formattedAnswers,
      );

      if (result.success) {
        // Clear local storage after successful submission
        localStorage.removeItem('quiz_answers');
        localStorage.removeItem('quiz_start_time');
        setAnswers({});

        // IMPORTANT: First mark that we're intentionally exiting fullscreen
        if (antiCheat.setIntentionallyExiting) {
          antiCheat.setIntentionallyExiting(true);
        }

        // Then disable anti-cheat measures
        setQuizStarted(false);

        // Wait a moment for the anti-cheat to fully disable before exiting fullscreen
        setTimeout(() => {
          safeExitFullscreen();
          // Redirect to completion page after a short delay
          setTimeout(() => {
            router.push('/user/quiz/completion');
          }, 100);
        }, 100);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      toast({
        title: 'Submission Failed',
        description: `There was an error submitting your quiz: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load answers from localStorage on mount ONLY
  useEffect(() => {
    const savedAnswers = localStorage.getItem('quiz_answers');
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
      } catch (err) {
        console.error('Error parsing saved answers:', err);
      }
    }

    // Load quiz start time from localStorage if it exists
    const savedStartTime = localStorage.getItem('quiz_start_time');
    if (savedStartTime) {
      try {
        const startTime = new Date(JSON.parse(savedStartTime));
        setQuizStartTime(startTime);
      } catch (err) {
        console.error('Error parsing saved start time:', err);
      }
    }
  }, []); // Empty dependency array - run only on mount

  // Update questions when answers change
  useEffect(() => {
    if (questions.length > 0 && Object.keys(answers).length > 0) {
      const updatedQuestions = questions.map((q) => {
        // Use _id for compatibility with how answers are stored
        const savedAnswer = answers[String(q.id)];
        if (savedAnswer) {
          return {
            ...q,
            status: 'answered' as const,
            userAnswer: savedAnswer.answerText,
          };
        }
        return q;
      });
      setQuestions(updatedQuestions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]); // Only run when answers change

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('quiz_answers', JSON.stringify(answers));
    }

    if (questions.length > 0) {
      const allAttempted = questions.every((q) => answers[String(q.id)]);
      setAllQuestionsAttempted(allAttempted);
    }
  }, [answers, questions]);

  const handleStartQuiz = () => {
    setShowPreQuizPrompt(false);
    fetchQuestions();
  };

  // Fetch all questions
  const fetchQuestions = useCallback(async () => {
    // Set quiz as started to enable anti-cheat
    setQuizStarted(true);

    // Record quiz start time - but only record on the server if we have a user ID
    const startTime = new Date();
    setQuizStartTime(startTime);
    localStorage.setItem('quiz_start_time', JSON.stringify(startTime));

    if (currentUser?.userId) {
      await recordQuizStartTime(currentUser.userId, startTime);
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllQuestions();

      if (response.success && Array.isArray(response.questions)) {
        const allQuestions = [...response.questions];

        if (allQuestions.length === 0) {
          setError('No questions available.');
          setIsLoading(false);
          return;
        }

        // Initialize question status and properly format data for our UI
        const initializedQuestions = allQuestions.map((q, index) => {
          // Type assertion to handle the possibility that q might have either text or question property
          const questionData = q as {
            id: number;
            text?: string;
            question?: string;
            options: Array<{
              id?: string | number;
              text?: string;
              value?: string;
            }>;
            subject: string;
          };

          // Extract question from API response and format as needed
          const formattedQuestion: Question = {
            id: questionData.id,
            _id: String(questionData.id), // Add _id for compatibility with components
            text: questionData.text || questionData.question || '',
            question: questionData.question,
            options: Array.isArray(questionData.options)
              ? questionData.options.map(
                  (opt: {
                    id?: string | number;
                    text?: string;
                    value?: string;
                  }) => ({
                    id: String(opt.id || opt.value || ''),
                    text: opt.text || opt.value || '',
                  }),
                )
              : [],
            subject: questionData.subject || '',
            status: index === 0 ? 'not-answered' : 'not-visited',
          };
          return formattedQuestion;
        });

        setQuestions(initializedQuestions);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(
        'Failed to load questions. Please refresh the page and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle answer selection
  const handleAnswerSelect = async (optionId: string, optionText: string) => {
    if (isSubmitting) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Store the answer using ID as string
    const updatedAnswers = {
      ...answers,
      [String(currentQuestion.id)]: {
        questionId: String(currentQuestion.id), // Keep as string for UI
        selectedOptionId: optionId,
        answerText: optionText,
      },
    };
    setAnswers(updatedAnswers);

    // Update the current question's status
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      status: 'answered',
      userAnswer: optionText,
    };
    setQuestions(updatedQuestions);

    // Auto-save the answer to the server
    if (currentUser?.userId) {
      try {
        await submitAnswer(
          Number(currentUser.userId),
          currentQuestion.id,
          optionId,
        );
      } catch (err) {
        console.error('Error auto-saving answer:', err);
      }
    }
  };

  // Adapter function to match the expected onAutoSave signature in QuizQuestionView
  const handleAutoSave = async (questionId: string, answerText: string) => {
    // Find the question using string ID (backward compatibility)
    const question = questions.find((q) => String(q.id) === questionId);
    if (!question) return;

    // Find the option that matches the answer text
    const option = question.options.find((opt) => opt.text === answerText);
    if (!option) return;

    // Call handleAnswerSelect with the correct parameters
    await handleAnswerSelect(option.id, answerText);
  };

  // Handle final quiz submission
  const handleSubmit = async () => {
    if (!currentUser?.userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit the quiz',
        variant: 'destructive',
      });
      return;
    }

    const unansweredCount = questions.filter(
      (q) => q.status === 'not-visited' || q.status === 'not-answered',
    ).length;

    if (unansweredCount > 0) {
      const confirm = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`,
      );
      if (!confirm) return;
    }

    try {
      setIsSubmitting(true);

      // Stop current question timer and get final time data
      let finalQuestionTime = 0;
      if (timeTracker.isTracking) {
        finalQuestionTime = timeTracker.stopQuestionTimer();
        console.log(
          'Final question time before submission:',
          finalQuestionTime,
        );
      }

      // Get all question times for batch update
      const allQuestionTimes = timeTracker.getAllQuestionTimes();
      console.log('All question times:', allQuestionTimes);

      // Format answers for submission using stored optionIds
      const formattedAnswers = Object.values(answers)
        .map(({ questionId, selectedOptionId }) => ({
          questionId: Number(questionId), // Convert to number for API
          selectedOption: selectedOptionId,
        }))
        .filter((a) => a.selectedOption);

      const result = await submitQuiz(
        Number(currentUser.userId),
        formattedAnswers,
      );

      if (result.success) {
        // Send final batch update of all question times
        if (allQuestionTimes.size > 0) {
          const questionTimeArray = Array.from(allQuestionTimes.entries()).map(
            ([questionId, timeSpent]) => ({
              questionId,
              timeSpent,
            }),
          );

          batchUpdateQuestionTimes(
            Number(currentUser.userId),
            questionTimeArray,
          ).catch((error) => {
            console.error('Failed to batch update question times:', error);
          });
        }

        toast({
          title: 'Quiz Submitted',
          description: 'Your answers have been recorded successfully.',
          variant: 'success',
        });

        // Clear local storage after successful submission
        localStorage.removeItem('quiz_answers');
        localStorage.removeItem('quiz_start_time');
        setAnswers({});

        // Clear question time tracking data
        timeTracker.clearAllTimes();

        // IMPORTANT: First mark that we're intentionally exiting fullscreen
        if (antiCheat.setIntentionallyExiting) {
          antiCheat.setIntentionallyExiting(true);
        }

        // Then disable anti-cheat measures
        setQuizStarted(false);

        // Wait a moment for the anti-cheat to fully disable before exiting fullscreen
        setTimeout(() => {
          safeExitFullscreen();
          // Redirect to completion page after a short delay
          setTimeout(() => {
            router.push('/user/quiz/completion');
          }, 100);
        }, 100);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      toast({
        title: 'Submission Failed',
        description: `There was an error submitting your quiz: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle time up dialog close
  const handleTimeUpDialogClose = () => {
    router.push('/user/quiz/completion');
  };

  // Custom renderer for quiz not live
  const renderQuizNotLive = () => (
    <div className="flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-111px)]">
      <Card className="w-full max-w-lg shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header with pattern background */}
          <div className="bg-primary/10 p-6 border-b relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {/* Pattern overlay */}
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="pattern"
                    patternUnits="userSpaceOnUse"
                    width="20"
                    height="20"
                    patternTransform="rotate(45)">
                    <rect
                      width="2"
                      height="2"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#pattern)"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-primary relative z-10">
              Exam Status
            </h2>
          </div>

          {/* Main content */}
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center rounded-full bg-red-100 p-3 text-center text-red-800">
              <span className="relative mr-3 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
              <p className="text-lg font-semibold">The Exam is not Live!</p>
            </div>
            <div className="flex flex-col items-center text-center">
              {/* Status icon */}
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Smile />
              </div>

              <p className="text-muted-foreground mb-6">
                The exam is currently not available. Please check back during
                the scheduled time when it will be activated by the
                administrator.
              </p>
            </div>

            {/* Exam information - highlight box */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-md mx-auto mb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-primary">
                  Mark Your Calendar
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4 justify-center mb-4">
                {/* Date */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/10 flex-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">
                      Exam Date
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {/* Changed date to 12th August, 2025 */}
                    12th August, 2025
                  </p>
                </div>

                {/* Time */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/10 flex-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">
                      Exam Time
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">10:30 AM</p>
                </div>
              </div>

              <div className="text-center py-2 px-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  Please be ready 15 minutes before the scheduled time
                </p>
              </div>
              <div className="mt-6">
                <CountdownTimer targetDate="2025-08-12T10:30:00" />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 border-t pt-6">
              <h4 className="text-center text-sm font-medium text-gray-500 mb-3">
                Connect with us
              </h4>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.facebook.com/DCSITshuats/"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/shuats_edu"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/school/shuats-edu/posts/?feedView=all"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/dcsit_shuats/"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Loading state - Add timeout to prevent infinite loading
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading || isCheckingAttemptStatus || isLoadingSettings) {
        console.warn(
          'Loading timeout reached, forcing state update to prevent infinite loading',
        );
        setIsLoading(false);
        setIsCheckingAttemptStatus(false);
        setIsLoadingSettings(false);
      }
    }, 5000); // Reduced from 10s to 5s for faster fallback

    return () => clearTimeout(timeoutId);
  }, [isLoading, isCheckingAttemptStatus, isLoadingSettings]);

  // Add debug logs to track loading states
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Loading states:', {
        isLoading,
        isCheckingAttemptStatus,
        isLoadingSettings,
        currentUserId: currentUser?.userId,
        quizSettings,
      });
    }
  }, [
    isLoading,
    isCheckingAttemptStatus,
    isLoadingSettings,
    currentUser?.userId,
    quizSettings,
  ]);

  // Modified condition order to prioritize showing "Quiz Not Available" message
  // Quiz not live - check this first
  if (quizSettings && !quizSettings.isLive) {
    return renderQuizNotLive();
  }

  // Loading state
  if (isLoading || isCheckingAttemptStatus || isLoadingSettings) {
    return <GlobalLoading />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        message={error}
        retry={() => window.location.reload()}
      />
    );
  }

  // Already attempted
  if (hasAlreadyAttempted) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Quiz Already Attempted
              </h3>
              <p className="text-muted-foreground mb-6">
                You have already completed this quiz. You can view your results
                in the results section.
              </p>
              <Button
                onClick={() => router.push('/user/result')}
                variant="outline">
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPreQuizPrompt) {
    return (
      <PreQuizPrompt
        onStartQuiz={handleStartQuiz}
        isLive={quizSettings?.isLive ?? false}
      />
    );
  }

  // Show loading state while fetching questions
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <GlobalLoading
          message={
            isSubmitting
              ? 'Submitting your answers...'
              : 'Loading quiz questions...'
          }
        />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 py-16 flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardContent className="p-6">
            <div className="text-center">No questions available.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* SHUATS Image Carousel */}
        <div>
          {/* <h2 className="text-xl font-semibold mb-4">
						SHUATS Campus Highlights
					</h2> */}
          <ImageCarousel
            category={['env', 'hostel', 'sports', 'cultural']}
            className="shadow-md"
            autoSlideInterval={4000}
          />
        </div>
        {/* Quiz Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 my-6">
          <h2 className="text-2xl font-bold text-primary">
            SHUATS Online Quiz
          </h2>
          <div className="mt-4 md:mt-0 flex items-center">
            <div
              className={cn(
                'text-lg font-semibold px-4 py-2 rounded-md',
                timeRemaining < 300
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700',
              )}>
              Time: {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            {/* Question Palette */}
            <div className="w-full lg:w-64">
              <Card className="h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  <h3 className="font-semibold mb-4">Question Palette</h3>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {questions.map((question, index) => (
                      <Button
                        key={question.id}
                        variant="outline"
                        className={cn('h-8 w-8 p-0', {
                          'bg-green-100': question.status === 'answered',
                          'bg-red-100': question.status === 'not-answered',
                        })}
                        onClick={() => setCurrentQuestionIndex(index)}>
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <Legend questions={questions} />
                </CardContent>
              </Card>
            </div>

            {/* Quiz Question View */}
            <div className="flex-grow">
              <QuizQuestionView
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                setQuestions={setQuestions}
                setAnswers={setAnswers}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                answers={answers}
                onAutoSave={handleAutoSave}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                allQuestionsAttempted={allQuestionsAttempted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Up Dialog */}
      <Dialog
        open={showTimeUpDialog}
        onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time&apos;s Up!</DialogTitle>
            <DialogDescription>
              Your time has expired and your quiz has been automatically
              submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleTimeUpDialogClose}>View Results</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
