import { useState, useEffect, useCallback, useRef } from 'react';

interface QuestionTimeData {
  questionId: number;
  totalTimeSpent: number;
  lastStartTime?: string; // ISO string
}

interface QuestionTimeTracker {
  questionId: number;
  startTime: number; // performance.now() timestamp
}

const QUESTION_TIMES_KEY = 'quiz_question_times';
const CURRENT_QUESTION_KEY = 'quiz_current_question_tracker';

export function useQuestionTimeTracker(userId: number | null) {
  const [questionTimes, setQuestionTimes] = useState<Map<number, number>>(new Map());
  const [currentTracker, setCurrentTracker] = useState<QuestionTimeTracker | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Load saved question times from localStorage
  useEffect(() => {
    const savedTimes = localStorage.getItem(QUESTION_TIMES_KEY);
    if (savedTimes) {
      try {
        const parsed: QuestionTimeData[] = JSON.parse(savedTimes);
        const timeMap = new Map<number, number>();
        parsed.forEach(({ questionId, totalTimeSpent }) => {
          timeMap.set(questionId, totalTimeSpent);
        });
        setQuestionTimes(timeMap);
        console.log('Restored question times from localStorage:', timeMap);
      } catch (error) {
        console.error('Error parsing saved question times:', error);
        localStorage.removeItem(QUESTION_TIMES_KEY);
      }
    }

    // Check if user was viewing a question when page was refreshed
    const savedTracker = localStorage.getItem(CURRENT_QUESTION_KEY);
    if (savedTracker) {
      try {
        const parsed: QuestionTimeData = JSON.parse(savedTracker);
        if (parsed.lastStartTime) {
          const lastStart = new Date(parsed.lastStartTime).getTime();
          const now = performance.now();
          const pageLoadTime = Date.now() - performance.now();
          const elapsedSinceStart = Date.now() - lastStart;
          
          // If less than 10 minutes have passed, resume tracking
          if (elapsedSinceStart < 10 * 60 * 1000) {
            console.log('Resuming question tracking after page refresh:', {
              questionId: parsed.questionId,
              elapsedSinceStart: Math.round(elapsedSinceStart / 1000),
            });
            
            // Add elapsed time to existing total
            const currentTotal = questionTimes.get(parsed.questionId) || 0;
            const newTotal = currentTotal + Math.round(elapsedSinceStart / 1000);
            
            setQuestionTimes(prev => new Map(prev.set(parsed.questionId, newTotal)));
            setCurrentTracker({
              questionId: parsed.questionId,
              startTime: now,
            });
          } else {
            console.log('Question tracking expired, clearing saved tracker');
            localStorage.removeItem(CURRENT_QUESTION_KEY);
          }
        }
      } catch (error) {
        console.error('Error parsing saved question tracker:', error);
        localStorage.removeItem(CURRENT_QUESTION_KEY);
      }
    }
  }, []);

  // Save question times to localStorage whenever they change
  useEffect(() => {
    if (questionTimes.size > 0) {
      const timeData: QuestionTimeData[] = Array.from(questionTimes.entries()).map(
        ([questionId, totalTimeSpent]) => ({
          questionId,
          totalTimeSpent,
        })
      );
      localStorage.setItem(QUESTION_TIMES_KEY, JSON.stringify(timeData));
    }
  }, [questionTimes]);

  // Start tracking time for a question
  const startQuestionTimer = useCallback((questionId: number) => {
    console.log('Starting timer for question:', questionId);
    
    // Stop current tracker if exists
    if (currentTracker) {
      stopQuestionTimer();
    }

    const startTime = performance.now();
    const tracker: QuestionTimeTracker = {
      questionId,
      startTime,
    };

    setCurrentTracker(tracker);

    // Save current tracker to localStorage for page refresh recovery
    const trackerData: QuestionTimeData = {
      questionId,
      totalTimeSpent: questionTimes.get(questionId) || 0,
      lastStartTime: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_QUESTION_KEY, JSON.stringify(trackerData));
  }, [currentTracker, questionTimes]);

  // Stop tracking time for current question
  const stopQuestionTimer = useCallback(() => {
    if (!currentTracker) return 0;

    const endTime = performance.now();
    const elapsedMs = endTime - currentTracker.startTime;
    const elapsedSeconds = Math.round(elapsedMs / 1000);

    console.log('Stopping timer for question:', {
      questionId: currentTracker.questionId,
      elapsedSeconds,
    });

    // Update total time for this question
    setQuestionTimes(prev => {
      const currentTotal = prev.get(currentTracker.questionId) || 0;
      const newTotal = currentTotal + elapsedSeconds;
      return new Map(prev.set(currentTracker.questionId, newTotal));
    });

    // Clear current tracker
    setCurrentTracker(null);
    localStorage.removeItem(CURRENT_QUESTION_KEY);

    return elapsedSeconds;
  }, [currentTracker]);

  // Get total time spent on a specific question
  const getQuestionTime = useCallback((questionId: number): number => {
    let totalTime = questionTimes.get(questionId) || 0;
    
    // Add current session time if this question is being tracked
    if (currentTracker && currentTracker.questionId === questionId) {
      const currentElapsed = Math.round((performance.now() - currentTracker.startTime) / 1000);
      totalTime += currentElapsed;
    }
    
    return totalTime;
  }, [questionTimes, currentTracker]);

  // Get all question times
  const getAllQuestionTimes = useCallback((): Map<number, number> => {
    const allTimes = new Map(questionTimes);
    
    // Add current session time if tracking
    if (currentTracker) {
      const currentElapsed = Math.round((performance.now() - currentTracker.startTime) / 1000);
      const currentTotal = allTimes.get(currentTracker.questionId) || 0;
      allTimes.set(currentTracker.questionId, currentTotal + currentElapsed);
    }
    
    return allTimes;
  }, [questionTimes, currentTracker]);

  // Clear all tracking data
  const clearAllTimes = useCallback(() => {
    setQuestionTimes(new Map());
    setCurrentTracker(null);
    localStorage.removeItem(QUESTION_TIMES_KEY);
    localStorage.removeItem(CURRENT_QUESTION_KEY);
    console.log('Cleared all question time tracking data');
  }, []);

  // Handle page unload - save current progress
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTracker) {
        const elapsedMs = performance.now() - currentTracker.startTime;
        const elapsedSeconds = Math.round(elapsedMs / 1000);
        
        // Update localStorage with final time
        const currentTotal = questionTimes.get(currentTracker.questionId) || 0;
        const newTotal = currentTotal + elapsedSeconds;
        
        const timeData: QuestionTimeData[] = Array.from(questionTimes.entries()).map(
          ([questionId, totalTimeSpent]) => ({
            questionId,
            totalTimeSpent: questionId === currentTracker.questionId ? newTotal : totalTimeSpent,
          })
        );
        localStorage.setItem(QUESTION_TIMES_KEY, JSON.stringify(timeData));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentTracker, questionTimes]);

  return {
    startQuestionTimer,
    stopQuestionTimer,
    getQuestionTime,
    getAllQuestionTimes,
    clearAllTimes,
    currentQuestionId: currentTracker?.questionId || null,
    isTracking: !!currentTracker,
  };
}
